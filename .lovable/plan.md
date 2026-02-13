

# Audit SEO technique - Blocages d'indexation

## Probleme critique : Application SPA (Single Page Application)

Le site est construit avec React + Vite, ce qui signifie qu'il est rendu **entierement cote client (CSR)**. Quand un crawler (Googlebot, Bingbot, etc.) accede a une page, il recoit uniquement ceci :

```html
<html lang="fr">
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Aucun contenu HTML n'est present** dans la reponse initiale du serveur. Le contenu n'apparait qu'apres l'execution du JavaScript. C'est le probleme le plus impactant pour l'indexation.

**Impact** : Googlebot execute le JS mais avec un delai (jours/semaines). Bingbot, les crawlers de reseaux sociaux (Facebook, Twitter/X, LinkedIn), et les moteurs IA (ChatGPT, Perplexity) ne l'executent generalement pas du tout.

---

## Problemes identifies

### 1. Pas de pre-rendu (SSR/SSG) - CRITIQUE

Le contenu est invisible aux crawlers sans execution JavaScript. Les balises meta injectees par `react-helmet-async` ne sont presentes que cote client.

**Solution** : Ajouter `vite-plugin-prerender` ou un service de pre-rendu (prerender.io) pour generer des pages HTML statiques pour chaque route.

### 2. Doublons de meta-tags entre index.html et react-helmet - MOYEN

Le fichier `index.html` contient des meta-tags statiques (title, description, OG, Twitter) en anglais, tandis que `SEOHead` injecte des meta-tags dynamiques en francais via Helmet. Si le JS ne s'execute pas, les crawlers voient les meta anglaises generiques. Si le JS s'execute, il y a potentiellement un conflit/doublon.

**Solution** : Harmoniser les meta de `index.html` avec la langue par defaut (francais), car ce sont celles que les crawlers sans JS verront.

### 3. Pages sans SEOHead - MOYEN

Les pages `LegalNotice` et `PrivacyPolicy` n'utilisent pas le composant `SEOHead`. Elles n'ont donc ni title dynamique, ni canonical, ni OG tags specifiques.

### 4. Hreflang via query parameter `?lang=` - MOYEN

La strategie hreflang utilise `?lang=en`, `?lang=kr`, `?lang=zh` comme URLs alternatives. Or, le changement de langue est gere cote client par i18next (stockage en memoire) sans modifier l'URL. Les crawlers ne peuvent pas acceder aux versions traduites via ces URLs car le parametre `?lang=` n'est pas lu par l'application.

**Solution** : Implementer la lecture du parametre `lang` dans l'URL au chargement de l'app pour initialiser i18next, ou passer a un systeme de routes (`/en/`, `/kr/`, `/zh/`).

### 5. Page 404 ne renvoie pas de status HTTP 404 - FAIBLE

La page `NotFound` affiche un message 404 mais le serveur renvoie un status 200 (soft 404). Les crawlers ne detectent pas correctement les pages inexistantes.

### 6. Sitemap desynchronise avec les routes reelles - FAIBLE

Le sitemap reference `/chateau`, `/partenaires`, `/billetterie`, `/contact` qui existent, mais il manque la page `/admin/gallery` (ce qui est correct car elle devrait etre exclue). En revanche, les pages legales n'ont pas de hreflang dans le sitemap.

### 7. Canonical dans index.html sans slash final - FAIBLE

`index.html` a `<link rel="canonical" href="https://www.sumijo-isc.com" />` sans slash final, tandis que `SEOHead` genere `https://www.sumijo-isc.com/`. Incoherence mineure.

### 8. Video non indexable - FAIBLE

La video d'annonce (`sumi-jo-announcement-en.mp4`) n'a pas de schema `VideoObject` JSON-LD et n'a pas de sitemap video.

---

## Plan d'action propose

### Etape 1 - Pre-rendu des pages (impact maximal)
Installer et configurer `vite-plugin-prerender` pour pre-rendre les routes principales (`/`, `/sumi-jo`, `/jury`, `/chateau`, `/partenaires`, `/billetterie`, `/contact`, `/mentions-legales`, `/politique-confidentialite`) en HTML statique lors du build. Cela rend tout le contenu, les meta-tags et les donnees structurees visibles sans JavaScript.

### Etape 2 - Harmoniser index.html
Mettre les meta-tags de `index.html` en francais (langue par defaut) pour coherence avec le contenu pre-rendu.

### Etape 3 - Ajouter SEOHead aux pages legales
Ajouter `SEOHead` avec `noIndex={true}` sur `LegalNotice` et `PrivacyPolicy`.

### Etape 4 - Gestion du parametre lang dans l'URL
Ajouter dans `main.tsx` ou `App.tsx` la lecture du parametre `?lang=` pour initialiser i18next avec la bonne langue, rendant les URLs hreflang fonctionnelles.

### Etape 5 - Corriger le trailing slash du canonical
Uniformiser avec ou sans slash final partout.

---

## Section technique

### Pre-rendu avec vite-plugin-prerender
```text
npm install vite-plugin-prerender
```

Configuration dans `vite.config.ts` : ajouter le plugin avec la liste des routes a pre-rendre. Le plugin genere des fichiers HTML statiques dans le dossier `dist` lors du `vite build`.

### Lecture du parametre lang
Dans `src/i18n/config.ts`, avant `i18n.init()`, lire `window.location.search` pour extraire le parametre `lang` et l'utiliser comme `lng` initial.

### SEOHead sur les pages legales
Ajouter le composant `SEOHead` avec les props `title`, `description`, `path` et `noIndex={true}`.

