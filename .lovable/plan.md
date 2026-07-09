## Résultat de la vérification

La chaîne de vote pour les utilisateurs non identifiés est correctement configurée. Aucune modification de code ou de base de données n'est nécessaire.

### Ce qui a été vérifié

1. **Autorisations base de données**
   - `public_votes` : `anon` et `authenticated` ont `INSERT` + `SELECT`, `service_role` a `ALL`
   - `vote_settings` : `anon` et `authenticated` ont `SELECT`, `service_role` a `ALL`
   - Contrainte d'unicité sur `voter_token` en place (empêche les doublons)
   - RLS activée : SELECT réservé aux admins, INSERT autorisé si le vote est ouvert

2. **Edge function `cast-vote`**
   - Utilise la `service_role` côté serveur → contourne la RLS de toute façon, donc aucun risque d'erreur RLS remontée à l'utilisateur
   - Valide le format UUID du jeton et l'ID du candidat (400 si invalide)
   - Vérifie que le vote est ouvert (403 « Votes closed » sinon)
   - Insert simple, code 23505 attrapé et renvoyé en 409 « Already voted »

3. **Test réel effectué**
   - Appel POST anonyme sur `/cast-vote` avec charge utile valide → réponse `403 Votes closed` (attendu car `is_open = false` en ce moment)
   - Dès que l'admin bascule le switch, le même appel insérera la ligne sans erreur

4. **Front `src/pages/Vote.tsx`**
   - N'affiche la barre de confirmation que si `isOpen === true`
   - Message d'erreur traduit en français si vote déjà enregistré (« Vous avez déjà voté. »)
   - Un jeton anonyme est généré et persisté en `localStorage` — pas de dépendance à une session authentifiée

### État actuel du back-office

- `is_open = false` : le vote est fermé côté public. C'est un choix d'admin, pas un bug.
- Pour tester en conditions réelles : dans le back-office → onglet « Vote public » → activer « Ouverture des votes ». Un vote depuis un navigateur non connecté doit alors s'enregistrer immédiatement et apparaître en temps réel dans le tableau des résultats.

### Conclusion

Aucun code à modifier. Si vous constatez une erreur côté utilisateur une fois le vote ouvert, indiquez-moi le message exact affiché et je diagnostique le cas précis.
