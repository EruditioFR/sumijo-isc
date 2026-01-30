
## Objectif
Remplacer l'image de fond sur smartphone par la nouvelle image fournie (Sumi Jo avec la silhouette du château rose).

## Modifications à effectuer

### 1. Copier l'image dans le projet
- Copier `user-uploads://hero_sumi_jo_isc_2026_smartphone.jpg` vers `src/assets/hero-sumi-mobile.jpg`

### 2. Modifier HeroSection.tsx
- Importer la nouvelle image mobile
- Restructurer les containers d'images pour afficher :
  - **Sur mobile** : uniquement la nouvelle image (avec le fond rose et le château intégré)
  - **Sur desktop** : le système actuel (château en arrière-plan + Sumi Jo au premier plan)

## Détails techniques

```text
Structure actuelle :
┌──────────────────────────────────────┐
│ Château layer (hidden on mobile)     │
│ + Sumi Jo layer (visible both)       │
└──────────────────────────────────────┘

Nouvelle structure :
┌──────────────────────────────────────┐
│ Mobile only: nouvelle image          │
│ Desktop only: Château + Sumi Jo      │
└──────────────────────────────────────┘
```

**Fichier : src/components/HeroSection.tsx**
- Ajouter import : `import heroMobileImage from '@/assets/hero-sumi-mobile.jpg';`
- Ajouter un nouveau container visible uniquement sur mobile (`md:hidden`) pour la nouvelle image
- Modifier le container Sumi Jo existant pour être visible uniquement sur desktop (`hidden md:block`)
- Ajuster le positionnement de l'image mobile (`object-cover object-center`) et l'overlay si nécessaire
