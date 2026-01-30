
# Correction du positionnement du header sur smartphone

## Probleme identifie

Sur les smartphones modernes (iPhone avec encoche/Dynamic Island, Android avec barre d'etat), le header fixe en `top-0` ne prend pas en compte la zone de securite systeme (safe-area). Le texte "Sumi Jo" se retrouve masque par la barre d'etat du telephone.

## Solution

Ajouter un padding superieur au header qui respecte la zone de securite (safe-area) des appareils mobiles en utilisant la propriete CSS `env(safe-area-inset-top)`.

## Modifications a effectuer

### 1. Fichier: `src/index.css`

Ajouter une classe utilitaire pour gerer les safe-areas sur mobile :

```css
@layer utilities {
  .safe-top {
    padding-top: max(0.5rem, env(safe-area-inset-top));
  }
}
```

### 2. Fichier: `src/components/Header.tsx`

Modifier le conteneur du header pour appliquer le padding safe-area :

**Avant (ligne 108):**
```tsx
<div className="container mx-auto px-4 py-2 md:py-[5px]">
```

**Apres:**
```tsx
<div className="container mx-auto px-4 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 md:py-[5px]">
```

Ou alternativement, ajouter directement sur le header lui-meme un style inline pour le `paddingTop`:

```tsx
style={{ 
  backgroundColor: 'hsl(var(--accent) / 0.95)',
  paddingTop: 'env(safe-area-inset-top, 0px)'
}}
```

### 3. Fichier: `index.html`

Verifier que le viewport inclut `viewport-fit=cover` pour activer les safe-areas :

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

---

## Details techniques

- `env(safe-area-inset-top)` est une variable CSS qui retourne la hauteur de la zone de securite superieure (encoche, barre d'etat, Dynamic Island)
- `viewport-fit=cover` permet au contenu de s'etendre sous les zones systeme, puis d'utiliser les safe-area-insets pour positionner correctement le contenu
- La fonction `max()` CSS permet de garantir un minimum de padding meme sur les appareils sans encoche

## Impact

- Le header sera toujours entierement visible sur tous les appareils mobiles
- Aucun impact sur l'affichage desktop
- La HeroSection devra potentiellement ajuster son padding-top pour compenser la nouvelle hauteur du header
