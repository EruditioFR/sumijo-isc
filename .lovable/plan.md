

# Ajouter un effet de zoom progressif sur l'image de Sumi Jo

## Objectif
Ajouter un effet de zoom elegant au chargement de la page, partant d'une echelle legere (1.0) vers un zoom subtil (1.08), creant une impression cinematographique et dynamique.

## Etat actuel
L'image desktop utilise deja une animation alternee infinie :
```
scale-105 animate-[scale-in_20s_ease-out_infinite_alternate]
```

Cette animation fait osciller l'image, mais n'est pas un zoom progressif au chargement.

## Solution proposee
Utiliser Framer Motion pour animer l'image avec un zoom progressif unique au chargement, plus elegant et controle.

## Modifications techniques

### Fichier : `src/components/HeroSection.tsx`

**1. Remplacer l'animation CSS par une animation Framer Motion**

Transformer les balises `<img>` en `<motion.img>` pour les images desktop et mobile, avec les proprietes suivantes :

```tsx
<motion.img
  src={heroImage}
  alt="Sumi Jo Performance"
  initial={{ scale: 1.0, opacity: 0 }}
  animate={{ scale: 1.08, opacity: 1 }}
  transition={{ duration: 3, ease: "easeOut" }}
  className="w-full h-full object-cover object-top"
/>
```

**2. Appliquer le meme effet sur mobile**

L'image mobile (`heroMobileImage`) recevra egalement l'effet de zoom progressif pour une coherence visuelle.

## Details de l'animation

| Propriete | Depart | Arrivee | Duree |
|-----------|--------|---------|-------|
| Scale | 1.0 | 1.08 | 3s |
| Opacity | 0 | 1 | 3s |
| Easing | - | easeOut | - |

## Resultat attendu
- Au chargement, l'image de Sumi Jo apparait avec un leger fondu et un zoom progressif subtil
- L'effet dure 3 secondes et s'arrete (pas de boucle infinie)
- L'effet s'applique sur desktop et mobile
- Cree une impression cinematographique et elegante

