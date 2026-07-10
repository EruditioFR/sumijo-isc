# Diaporama des finalistes — page d'accueil

Ajouter un carrousel automatique élégant présentant les 11 finalistes (candidats avec le champ Airtable « Finaliste ? » coché), avec un effet scintillant/étincelant, transition automatique toutes les 3 secondes.

## Contenu de chaque slide

- Photo du candidat (grand format, cadrage portrait)
- Prénom + Nom
- Type de voix
- Pays avec drapeau (via `countryNameToFlagUrl` déjà présent dans `src/lib/countryFlags.ts`)

## Design

Style luxe cohérent avec le reste du site (rose/burgundy + or + crème, Arial/Helvetica) :
- Fond sombre burgundy avec halo doré animé
- Photo dans un cadre avec bordure dorée et anneau lumineux qui « scintille » (particules dorées animées + shimmer/gradient qui traverse la bordure)
- Transition entre slides : fade + léger scale (Framer Motion)
- Indicateurs (dots) dorés en bas
- Titre de section : « Les 11 finalistes »
- Timer 3s, pause au hover, reprise automatique
- Responsive : layout vertical sur mobile (photo au-dessus, texte dessous), horizontal sur desktop

## Technique

1. **Nouvelle edge function `list-finalists`** (basée sur `list-semifinalists`) :
   - Filtre `Finaliste ? === true`
   - Renvoie `id, prenom, nom, pays, typeVoix, photoUrl`
   - Cache 5 min

2. **Nouveau composant `src/components/FinalistsShowcase.tsx`** :
   - Fetch via `supabase.functions.invoke('list-finalists')`
   - Framer Motion `AnimatePresence` pour les transitions
   - `useEffect` avec `setInterval` 3000 ms, cleanup propre, pause au hover
   - Effet scintillant : couche SVG/CSS avec particules dorées animées + shimmer gradient sur la bordure
   - Drapeau via `countryNameToFlagUrl`
   - i18n via `useTranslation` (titre section, label "Type de voix", "Pays")

3. **`src/pages/Index.tsx`** : insérer `<FinalistsShowcase />` après `<WinnersSection />` (ou avant, selon logique — proposition : juste après `<SemiFinalistsSection />` pour enchaîner narrativement demi-finalistes → finalistes → lauréats).

4. **i18n** : ajouter clés `finalists.title`, `finalists.voice`, `finalists.country` dans FR/EN/KR/ZH.

## Points ouverts

- Position exacte dans la homepage : après `SemiFinalistsSection` (recommandé) ou ailleurs ?
- Ce carrousel remplace-t-il ou complète-t-il la section demi-finalistes existante ?
