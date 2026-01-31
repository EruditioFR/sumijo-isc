
# Supprimer l'image du château en arrière-plan du Hero

## Probleme identifie
Au chargement de la page, l'image du Chateau de La Ferte-Imbault (`hero-chateau.jpg`) apparait brievement en arriere-plan avant que l'image principale de Sumi Jo ne se charge. Cette couche d'arriere-plan a 40% d'opacite n'est plus souhaitee.

## Solution proposee
Supprimer completement la couche d'arriere-plan du chateau sur desktop, en conservant uniquement l'image principale de Sumi Jo.

## Modifications techniques

### Fichier : `src/components/HeroSection.tsx`

1. **Supprimer l'import de l'image du chateau** (ligne 7)
   - Retirer : `import chateauImage from "@/assets/hero-chateau.jpg";`

2. **Supprimer la variable de parallaxe du chateau** (ligne 20)
   - Retirer : `const chateauY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);`

3. **Supprimer le bloc JSX de la couche chateau** (lignes 48-55)
   - Retirer tout le bloc `motion.div` contenant l'image du chateau

## Resultat attendu
- Au chargement, seule l'image de Sumi Jo apparaitra en arriere-plan sur desktop
- L'effet de parallaxe sera simplifie (2 couches au lieu de 3)
- Le temps de chargement sera legerement ameliore (une image de moins a charger)
