

# Animation "Wow" pour les chiffres de l'edition 2024

## Objectif
Transformer la section des statistiques en une experience visuelle impressionnante qui capte l'attention du visiteur et met en valeur l'envergure internationale du concours.

## Animations proposees

### 1. Compteur ameliore avec effet de "slot machine"
Le compteur actuel est fluide mais manque d'impact. Ameliorations :
- Ajout d'un effet de rebond (bounce) a la fin du comptage
- Acceleration progressive puis ralentissement (easing elastique)
- Les chiffres demarrent a 0 et "sautent" vers la valeur finale avec un leger depassement

### 2. Effets visuels sur les cartes

**Desktop :**
- Entree en cascade avec rotation 3D (les cartes "basculent" depuis l'arriere)
- Effet de lueur pulsante (glow) sur chaque carte quand le chiffre atteint sa valeur finale
- Particules/etincelles animees autour du chiffre principal
- Fond avec gradient anime qui pulse subtilement

**Mobile :**
- Entree par la gauche avec effet de glissement elastique
- Effet de flash lumineux quand le compteur termine

### 3. Mise en valeur du chiffre principal (80 000 euros)
- Taille plus grande que les autres chiffres
- Effet de brillance/shimmer qui traverse le texte
- Bordure doree animee

### 4. Particules decoratives
- Petites etoiles/etincelles qui apparaissent autour des chiffres pendant l'animation
- Effet de "confetti" subtil quand tous les compteurs ont termine

---

## Details techniques

### Fichier : `src/components/StatsSection.tsx`

**Modifications du composant AnimatedCounter :**
```tsx
// Configuration du spring avec effet elastique
const spring = useSpring(0, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001
});

// Ajout d'un etat "completed" pour declencher les effets finaux
const [isComplete, setIsComplete] = useState(false);
```

**Nouvelles animations Framer Motion pour les cartes :**
```tsx
// Animation 3D flip pour l'entree
initial={{ 
  opacity: 0, 
  rotateX: -90, 
  scale: 0.8,
  y: 60 
}}
animate={inView ? { 
  opacity: 1, 
  rotateX: 0, 
  scale: 1,
  y: 0 
} : {}}
transition={{ 
  type: "spring",
  stiffness: 100,
  damping: 15,
  delay: 0.2 + index * 0.15 
}}
```

**Effet de lueur pulsante (CSS-in-JS) :**
```tsx
// Animation de glow quand le compteur termine
animate={isComplete ? {
  boxShadow: [
    "0 0 0 rgba(205, 124, 139, 0)",
    "0 0 30px rgba(205, 124, 139, 0.6)",
    "0 0 10px rgba(205, 124, 139, 0.3)"
  ]
} : {}}
```

**Composant Sparkle pour les etincelles :**
```tsx
const Sparkle = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-primary rounded-full"
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1.5, 0],
      x: [0, Math.random() * 40 - 20],
      y: [0, Math.random() * -30 - 10]
    }}
    transition={{ 
      duration: 0.8,
      delay,
      ease: "easeOut"
    }}
  />
);
```

### Fichier : `tailwind.config.ts`

**Nouvelles keyframes pour les effets :**
```ts
keyframes: {
  shimmer: {
    "0%": { backgroundPosition: "-200% 0" },
    "100%": { backgroundPosition: "200% 0" }
  },
  glow: {
    "0%, 100%": { boxShadow: "0 0 5px hsl(var(--primary) / 0.3)" },
    "50%": { boxShadow: "0 0 25px hsl(var(--primary) / 0.6)" }
  },
  float: {
    "0%, 100%": { transform: "translateY(0)" },
    "50%": { transform: "translateY(-5px)" }
  }
},
animation: {
  shimmer: "shimmer 2s linear infinite",
  glow: "glow 2s ease-in-out infinite",
  float: "float 3s ease-in-out infinite"
}
```

### Fichier : `src/index.css`

**Classe utilitaire pour l'effet shimmer :**
```css
@layer utilities {
  .text-shimmer {
    background: linear-gradient(
      90deg,
      hsl(var(--foreground)) 0%,
      hsl(var(--primary)) 50%,
      hsl(var(--foreground)) 100%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 3s linear infinite;
  }
}
```

---

## Resume visuel de l'experience

1. **Scroll jusqu'a la section** - Les cartes sont invisibles
2. **Detection du viewport** - Les cartes apparaissent une par une avec rotation 3D
3. **Comptage des chiffres** - Les nombres montent de 0 a la valeur finale avec effet elastique
4. **Fin du comptage** - Flash lumineux + etincelles autour de chaque carte
5. **Etat final** - Leger effet de flottement sur les cartes + lueur pulsante subtile

Cette combinaison d'animations cree un effet "wow" memorable tout en restant elegant et en accord avec l'identite visuelle luxueuse du concours.

