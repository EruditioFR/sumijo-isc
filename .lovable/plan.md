
# Modification du bouton "Candidater"

## Objectif
Faire pointer le bouton "Candidater" vers le formulaire d'inscription externe : `https://applicationform.sumijo-isc.com`

## Modification à effectuer

**Fichier : `src/components/HeroSection.tsx`**

Transformer le bouton actuel (lignes 127-134) :
- Remplacer le `onClick` par un lien externe
- Utiliser `asChild` avec une balise `<a>` pour ouvrir dans un nouvel onglet
- Ajouter `target="_blank"` et `rel="noopener noreferrer"` pour la sécurité

### Code actuel
```tsx
<Button
  size="lg"
  onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
  className="group relative bg-gradient-to-r from-gold via-gold-light to-gold font-bold text-lg px-10 py-7 hover:shadow-[0_0_30px_rgba(162,148,124,0.6)] transition-all duration-300 hover:scale-105 overflow-hidden text-white"
>
  <span className="relative z-10">{t("hero.participate")}</span>
  <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</Button>
```

### Code modifié
```tsx
<Button
  asChild
  size="lg"
  className="group relative bg-gradient-to-r from-gold via-gold-light to-gold font-bold text-lg px-10 py-7 hover:shadow-[0_0_30px_rgba(162,148,124,0.6)] transition-all duration-300 hover:scale-105 overflow-hidden text-white"
>
  <a 
    href="https://applicationform.sumijo-isc.com" 
    target="_blank" 
    rel="noopener noreferrer"
  >
    <span className="relative z-10">{t("hero.participate")}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-gold-light to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </a>
</Button>
```

## Résultat
Le bouton "Candidater" ouvrira le formulaire d'inscription dans un nouvel onglet du navigateur.
