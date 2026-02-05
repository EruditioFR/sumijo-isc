
# Plan d'implémentation SEO & GEO

## Objectif
Améliorer le référencement du site pour les moteurs de recherche (SEO) et les moteurs génératifs (GEO) en implémentant des données structurées, un sitemap, des balises hreflang et des meta tags dynamiques.

---

## 1. Installation de react-helmet-async

Ajouter la dépendance `react-helmet-async` pour gérer les meta tags dynamiques par page.

---

## 2. Correction de l'attribut lang HTML

Modifier `index.html` pour passer de `lang="en"` à `lang="fr"` (langue par défaut du site).

---

## 3. Création du composant SEOHead

Créer un composant réutilisable `src/components/SEOHead.tsx` qui :
- Gère les meta tags dynamiques (title, description, keywords)
- Injecte les données structurées JSON-LD appropriées
- Ajoute les balises hreflang pour les 4 langues
- Configure les balises Open Graph et Twitter Cards

---

## 4. Données structurées JSON-LD

Créer `src/lib/structuredData.ts` avec les schémas suivants :

### Event (MusicEvent)
```text
┌─────────────────────────────────────┐
│ @type: MusicEvent                   │
├─────────────────────────────────────┤
│ name: SUMI JO International...      │
│ startDate: 2026-07-05               │
│ endDate: 2026-07-11                 │
│ location: Château de la Ferté...    │
│ organizer: Organization             │
│ performer: Sumi Jo                  │
└─────────────────────────────────────┘
```

### Organization
```text
┌─────────────────────────────────────┐
│ @type: Organization                 │
├─────────────────────────────────────┤
│ name: Association du château...     │
│ url: https://www.sumijo-isc.com     │
│ logo: /logo-sjisc.jpg               │
│ sameAs: [social links]              │
└─────────────────────────────────────┘
```

### FAQPage
```text
┌─────────────────────────────────────┐
│ @type: FAQPage                      │
├─────────────────────────────────────┤
│ mainEntity: [                       │
│   { @type: Question, ... },         │
│   { @type: Question, ... },         │
│   { @type: Question, ... }          │
│ ]                                   │
└─────────────────────────────────────┘
```

### Person (pour Sumi Jo)
```text
┌─────────────────────────────────────┐
│ @type: Person                       │
├─────────────────────────────────────┤
│ name: Sumi Jo                       │
│ jobTitle: Soprano, Jury President   │
│ award: Grammy Award                 │
│ nationality: South Korea            │
└─────────────────────────────────────┘
```

---

## 5. Génération du sitemap.xml

Créer `public/sitemap.xml` avec :
- Toutes les URLs principales (/, /sumi-jo, /jury, /chateau, /partenaires, /billetterie, /contact)
- Pages légales (/politique-confidentialite, /mentions-legales)
- Priorités et fréquences de mise à jour
- Références hreflang implicites

---

## 6. Mise à jour du fichier robots.txt

Ajouter la référence au sitemap dans `public/robots.txt`.

---

## 7. Configuration du HelmetProvider

Modifier `src/App.tsx` pour envelopper l'application avec `HelmetProvider`.

---

## 8. Intégration par page

| Page | Meta tags | JSON-LD |
|------|-----------|---------|
| Index (/) | Titre principal + Event | Event, Organization, FAQPage |
| /sumi-jo | Bio Sumi Jo | Person |
| /jury | Présentation jury | Organization |
| /chateau | Description château | Place |
| /partenaires | Partenaires | Organization |
| /billetterie | Billetterie | Event (tickets) |
| /contact | Contact | Organization |

---

## Fichiers à créer/modifier

| Fichier | Action |
|---------|--------|
| `package.json` | Ajout react-helmet-async |
| `index.html` | lang="fr" + script JSON-LD global |
| `src/App.tsx` | Wrapping HelmetProvider |
| `src/components/SEOHead.tsx` | Nouveau composant |
| `src/lib/structuredData.ts` | Fonctions JSON-LD |
| `public/sitemap.xml` | Nouveau fichier |
| `public/robots.txt` | Ajout référence sitemap |
| `src/pages/Index.tsx` | Intégration SEOHead |
| `src/pages/SumiJo.tsx` | Intégration SEOHead |
| `src/pages/Jury.tsx` | Intégration SEOHead |
| `src/pages/Chateau.tsx` | Intégration SEOHead |
| `src/pages/Partenaires.tsx` | Intégration SEOHead |
| `src/pages/Billetterie.tsx` | Intégration SEOHead |
| `src/pages/Contact.tsx` | Intégration SEOHead |

---

## Détails techniques

### Balises hreflang
Chaque page inclura les 4 variantes linguistiques :
```html
<link rel="alternate" hreflang="fr" href="https://www.sumijo-isc.com/" />
<link rel="alternate" hreflang="en" href="https://www.sumijo-isc.com/?lang=en" />
<link rel="alternate" hreflang="ko" href="https://www.sumijo-isc.com/?lang=kr" />
<link rel="alternate" hreflang="zh" href="https://www.sumijo-isc.com/?lang=zh" />
<link rel="alternate" hreflang="x-default" href="https://www.sumijo-isc.com/" />
```

### Structure JSON-LD dans le head
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", ... },
    { "@type": "MusicEvent", ... },
    { "@type": "FAQPage", ... }
  ]
}
</script>
```

---

## Impact attendu

- **Google Rich Results** : Affichage enrichi dans les résultats (FAQ, Event, Person)
- **GEO (Generative Engine Optimization)** : Les IA comme Google AI Overview pourront mieux comprendre le contexte
- **Multilingual SEO** : Meilleur ciblage par langue avec les hreflang
- **Indexation** : Crawl optimisé grâce au sitemap
