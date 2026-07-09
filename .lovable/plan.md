# Reset votes without breaking past voters

## Objectif
Vider la table `public_votes` et garantir que les personnes ayant déjà voté (token présent dans leur `localStorage`) puissent voter à nouveau sans rencontrer l'erreur 409 "Already voted" ni l'erreur RLS.

## Problème
- Le `voter_token` est stocké dans `localStorage` (clé `sumijo_vote_token`) et est **persistant**.
- Si on vide simplement la table, un ancien votant génère bien un INSERT côté edge function, mais son ancien token peut encore exister ailleurs. En pratique, après un TRUNCATE la contrainte UNIQUE ne pose plus problème — **mais** le client, lui, cache aussi `sumijo_vote_candidate` et affiche donc "Merci, votre vote a été enregistré" sans jamais permettre de revoter.
- Résultat perçu : "les anciens votants ne peuvent pas revoter".

## Solution : versionner le scrutin

Ajouter un identifiant de scrutin (`vote_round`) côté serveur. Chaque fois qu'on réinitialise les votes, on incrémente ce numéro. Le client compare le round local au round serveur : s'ils diffèrent, il **efface son token et son choix locaux**, ce qui le remet à zéro proprement.

### Étapes

**1. Migration SQL**
- Ajouter une colonne `vote_round INTEGER NOT NULL DEFAULT 1` à `vote_settings`.
- `DELETE FROM public_votes;`
- `UPDATE vote_settings SET vote_round = vote_round + 1;` (déclenche le reset côté clients).

**2. Edge function `list-vote-candidates`**
- Retourner aussi `vote_round` (et `is_open`) dans la réponse, pour éviter un round-trip supplémentaire.

**3. `src/pages/Vote.tsx`**
- Ajouter une clé `sumijo_vote_round` dans `localStorage`.
- Au chargement, comparer le round stocké au round serveur :
  - S'ils diffèrent (ou si aucun round n'est stocké) → supprimer `sumijo_vote_token` et `sumijo_vote_candidate`, écrire le nouveau round.
  - Puis (re)générer un token propre via `getVoterToken()`.
- Le reste du flux (sélection, `cast-vote`) reste identique.

**4. Bouton "Réinitialiser les votes" dans l'admin (optionnel mais recommandé)**
- Dans `src/components/admin/VoteAdmin.tsx`, un bouton qui appelle une nouvelle edge function `reset-votes` (service_role) faisant le DELETE + increment. Ainsi le client n'a plus besoin de repasser par une migration à chaque scrutin.
- Confirmation obligatoire (modal).

## Résultat
- Les anciens votants voient la grille de vote réapparaître automatiquement au prochain chargement.
- Aucun message d'erreur RLS ni 409, car ils utilisent un nouveau token.
- Les nouveaux votants ne sont pas impactés.

## Question rapide
Souhaitez-vous **le bouton "Réinitialiser" dans l'admin** (étape 4) ou seulement le reset ponctuel via migration cette fois-ci ?
