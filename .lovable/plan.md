

# Plan d'implémentation : Page Billetterie "Coming Soon"

## Objectif
Creer une nouvelle page `/billetterie` elegante et minimaliste annoncant l'ouverture de la billetterie le 1er mars 2026, avec un formulaire de notification par email.

---

## Structure de la page

La page suivra exactement le design du cahier des charges avec :

```text
+--------------------------------------------------+
|              [Header standard du site]            |
+--------------------------------------------------+
|                                                  |
|            ─────── BILLETTERIE ───────           |
|                                                  |
|                   1er Mars                       |
|                     2026                         |
|                                                  |
|      Ouverture de la billetterie en ligne        |
|                                                  |
|   [votre adresse email]  [NOTIFY ME →]          |
|                                                  |
|         Les places seront limitees               |
|                                                  |
+--------------------------------------------------+
|                    [Footer]                      |
+--------------------------------------------------+
```

---

## Fichiers a creer/modifier

### 1. Nouveau composant : `src/components/TicketingAnnouncement.tsx`
- Structure semantique accessible
- Animations d'entree echelonnees avec Framer Motion
- Formulaire de notification avec validation email (zod)
- Etats : loading, success, error
- Responsive : desktop, tablet, mobile
- Ligne decorative rose sous le label "BILLETTERIE"

### 2. Nouvelle page : `src/pages/Billetterie.tsx`
- Integration du Header, TicketingAnnouncement et Footer
- Style off-white (#F5F1ED) pour le fond
- Section pleine hauteur centree verticalement

### 3. Routing : `src/App.tsx`
- Ajout de la route `/billetterie`

### 4. Navigation : `src/components/Header.tsx`
- Ajout du lien "Billetterie" dans le menu desktop et mobile

### 5. Traductions : fichiers i18n (fr, en, kr, zh)
- Nouvelles cles pour la section billetterie :
  - `nav.ticketing` : "Billetterie"
  - `ticketing.label` : "BILLETTERIE"
  - `ticketing.date` : "1er Mars"
  - `ticketing.year` : "2026"
  - `ticketing.description` : "Ouverture de la billetterie en ligne"
  - `ticketing.emailPlaceholder` : "votre adresse email"
  - `ticketing.notify` : "NOTIFY ME"
  - `ticketing.smallPrint` : "Les places seront limitees"
  - `ticketing.success` : "Notification enregistree ! Vous serez alerte le 1er mars."
  - `ticketing.error` : "Veuillez entrer une adresse email valide"

---

## Specifications techniques

### Design System
| Element | Valeur |
|---------|--------|
| Fond | `#F5F1ED` (off-white) |
| Rose principal | `#C85A6B` |
| Texte charcoal | `#3A3A3A` |
| Texte gris clair | `#9E9E9E` |
| Police titres | Playfair Display (via Google Fonts) ou font-elegant existante |
| Police body | Montserrat (via Google Fonts) ou font-sans existante |

### Tailles typographiques
- Label "BILLETTERIE" : 13px, lettres espacees, avec ligne decorative rose
- Date "1er Mars" : 96px desktop, 64px mobile, 56px petit mobile
- Annee "2026" : 36px desktop, 24px mobile
- Description : 18px desktop, 15px mobile
- Bouton : 16px

### Formulaire
- Input email avec bordure grise `#E0E0E0`
- Focus : bordure rose `#C85A6B` + shadow subtile
- Bouton rose plein avec texte blanc
- Hover : rose plus fonce `#B04A5B` + legere elevation
- Disposition : inline sur desktop, vertical sur mobile

### Animations (Framer Motion)
- Apparition echelonnee des elements au scroll
- Transition douce sur les etats du formulaire
- Support `prefers-reduced-motion`

---

## Validation et accessibilite

- Validation email cote client avec zod
- Messages d'erreur/succes clairs
- ARIA labels sur les inputs
- Navigation clavier complete
- Focus visible sur tous les elements interactifs
- Contraste WCAG AA respecte

---

## Notes pour l'implementation future du backend

Le formulaire sera prepare pour une integration backend ulterieure :
- Interface `NotificationFormData` avec champ email
- Fonction `handleSubmit` prete a appeler une API
- Pour l'instant : simulation locale avec toast de succes

---

## Ordre d'implementation

1. Ajouter les polices Playfair Display et Montserrat (optionnel si font-elegant suffit)
2. Creer le composant `TicketingAnnouncement.tsx`
3. Creer la page `Billetterie.tsx`
4. Ajouter la route dans `App.tsx`
5. Ajouter les traductions dans les 4 fichiers de langue
6. Ajouter le lien dans le Header

