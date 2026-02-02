import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { GalleryCategory, CategoryItem } from '@/types/gallery.types';

interface CategoryChipsProps {
  categories: CategoryItem[];
  selectedCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
}

export const CategoryChips = ({
  categories,
  selectedCategory,
  onCategoryChange
}: CategoryChipsProps) => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const activeChipRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll to active chip
  useEffect(() => {
    if (activeChipRef.current && containerRef.current) {
      const container = containerRef.current;
      const chip = activeChipRef.current;
      const containerRect = container.getBoundingClientRect();
      const chipRect = chip.getBoundingClientRect();
      
      if (chipRect.left < containerRect.left || chipRect.right > containerRect.right) {
        chip.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [selectedCategory]);

  return (
    <div className="lg:hidden mb-6">
      <div 
        ref={containerRef}
        className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
      >
        {categories.map((category) => {
          const isActive = selectedCategory === category.slug;

          return (
            <button
              key={category.id}
              ref={isActive ? activeChipRef : null}
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                "shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {t(`gallery.categoryNames.${category.slug}`)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
