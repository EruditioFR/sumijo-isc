# Outil de vote public — Prix du public

## Objectif
Permettre au public de voter (via lien / QR code) pour son candidat préféré parmi les demi-finalistes non-finalistes. Une voix par personne, modifiable. Ouverture/fermeture et résultats gérés par l'admin.

## 1. Base de données (Lovable Cloud)

**Table `vote_settings`** (singleton, 1 ligne)
- `is_open` (bool) — bouton on/off
- `updated_at`

**Table `public_votes`**
- `id`, `voter_token` (UUID stocké côté navigateur en localStorage), `candidate_id` (string, ID Airtable), `created_at`, `updated_at`
- Unique sur `voter_token` (un vote par token, modifiable via UPDATE)

RLS :
- `vote_settings` : SELECT public, UPDATE admin uniquement
- `public_votes` : INSERT/UPDATE anonyme si `is_open = true`, SELECT admin uniquement (les résultats ne sont pas publics en direct)

## 2. Source des candidats
Edge function `list-vote-candidates` : liste depuis Airtable les candidats dont la case **Finaliste** n'est PAS cochée (les demi-finalistes non-finalistes), avec nom, prénom, photo, id.

## 3. Page publique `/vote`
- Accessible sans login
- Si `is_open = false` → message "Les votes sont fermés"
- Si `is_open = true` :
  - Grille de cartes candidats (photo + nom)
  - Sélection d'un candidat → confirmation
  - Token stocké en localStorage → upsert dans `public_votes`
  - Message "Merci, votre vote a été enregistré. Vous pouvez le modifier jusqu'à la clôture."
  - Bouton "Modifier mon vote" si un vote existe déjà pour ce token
- QR code affichable dans l'admin pour partager

## 4. Espace admin — nouvelle page `/admin/vote`
Réservée aux admins (déjà en place via `useAdminAuth` + `user_roles`).
- **Toggle on/off** pour `is_open`
- **Lien public + QR code** de `/vote` (copier / télécharger)
- **Tableau des résultats** en direct :
  - Photo | Prénom | Nom | Nb votes | Pourcentage
  - Trié par nombre de votes décroissant
  - Total des votes affiché
- Bouton "Rafraîchir" (ou realtime)

Ajout d'une entrée "Vote public" dans la navigation admin (`AdminLayout`).

## 5. i18n
Page publique traduite FR / EN / KR / ZH selon la politique i18n du projet.

## Détails techniques
- Edge functions : `list-vote-candidates` (Airtable), `cast-vote` (upsert sécurisé + vérification `is_open`), `get-vote-results` (admin, agrège votes + jointure avec candidats Airtable pour photo/nom)
- `voter_token` = `crypto.randomUUID()` stocké en `localStorage` sous `sumijo_vote_token`
- Nouvelle route dans `App.tsx` : `/vote` et `/admin/vote`
- Pas de captcha au premier jet (peut être ajouté plus tard si abus)

## Limites connues
Un même utilisateur peut voter plusieurs fois en effaçant son localStorage ou changeant de navigateur — c'est le compromis standard pour un vote public anonyme sans friction. Si vous voulez plus strict, on peut ajouter une vérification par email (code envoyé) plus tard.
