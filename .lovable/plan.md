## Nouvelle page : Concert de gala — Salle Cortot, 10 juin 2026

Création d'une page dédiée au concert "Sumi Jo & Winners" qui aura lieu un mois avant le concours.

### Routing
- Nouvelle route `/concert-gala-paris` dans `src/App.tsx`
- Nouveau fichier `src/pages/ConcertGalaParis.tsx`

### Structure de la page

1. **Header** (réutilisé, sticky comme sur les autres sous-pages)

2. **Hero**
   - Eyebrow doré : "Concert exceptionnel — Paris"
   - Titre : "Sumi Jo & Winners"
   - Sous-titre : "Concert des Lauréats de la Sumi Jo International Singing Competition 2024"
   - Date / lieu : "Mercredi 10 juin 2026 — 20h00 · Salle Cortot, Paris"
   - CTA principal : "Réserver" (lien vers Salle Cortot, à confirmer — voir question)
   - CTA secondaire : "En savoir plus sur le concours" → `/`

3. **Présentation / texte d'introduction**
   - Paragraphe sur Sumi Jo (commandeure des Arts et des Lettres, Unesco Artist for Peace, Grammy Award, "Voice from Heaven")
   - Tournée des 40 ans de carrière (Asie, Cadogan Hall Londres, Carnegie Hall New York, Salle Cortot Paris)
   - Mise en valeur visuelle (citation Karajan en serif elegant)

4. **Programme du concert** (en deux colonnes responsive ou deux blocs empilés)
   - **Première partie** — liste des 8 pièces avec : interprète(s), titre de l'aria, opéra, compositeur
   - **Deuxième partie** — liste des 10 pièces (incluant les interventions de Sumi Jo et le tutti final)
   - Style : cartes élégantes avec accents dorés, séparateurs ornementaux, animations fade-in

5. **Réservations / Tarifs**
   - Grille de 4 cartes tarifaires :
     - Catégorie 1 : 55 €
     - Catégorie 2 : 35 €
     - Catégorie 3 : 20 €
     - Tarif réduit : 17 € (avec mention « Jeunes -26 ans, demandeurs d'emploi, Pass 17 »)
   - Bouton "Réserver" prominent
   - Bloc info billetterie : "01 48 24 40 63" et "billetterie@sallecortot.fr"

6. **Footer** (réutilisé)

### Design
- Cohérent avec le reste du site : palette rose/burgundy + gold + cream, fonts Arial/Helvetica
- Animations Framer Motion (fade/scale au scroll via `react-intersection-observer`)
- Responsive desktop / mobile
- SEO via `SEOHead` : title, description, keywords sur le concert

### Lien depuis le site
- Ajout d'un lien "Concert de Paris" dans le dropdown "Le concours" du `Header.tsx` (desktop + mobile), placé avant ou après "Le programme"
- Clé i18n `nav.galaParis` ajoutée dans `fr.json` (et placeholders identiques dans `en.json`, `kr.json`, `zh.json` — texte en français, pas de traduction demandée pour cette page à ce stade)

### Hors-scope (non inclus)
- Pas de traduction du contenu de la page (FR uniquement, comme la programmation est en français)
- Pas d'intégration billetterie embarquée (Billetweb) — lien externe vers la Salle Cortot

### Question avant implémentation
Une seule clarification utile : le lien de réservation. Le bouton "Réserver" doit-il pointer vers :
- (a) le site de la Salle Cortot (URL exacte à fournir), ou
- (b) un simple `mailto:billetterie@sallecortot.fr`, ou
- (c) rien pour l'instant (juste afficher le numéro / l'email) ?

Si tu confirmes (a) avec l'URL je l'intègre directement ; sinon je pars sur (b) par défaut.