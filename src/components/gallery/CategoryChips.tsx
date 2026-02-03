import { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
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
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Check if scrollable and update hint visibility
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const checkScroll = () => {
      const isScrollable = container.scrollWidth > container.clientWidth;
      const isScrolledToEnd = container.scrollLeft + container.clientWidth >= container.scrollWidth - 10;
      setShowScrollHint(isScrollable && !isScrolledToEnd);
    };

    checkScroll();
    container.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      container.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [categories]);

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
    <div className="lg:hidden mb-6 relative">
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
      
      {/* Scroll hint indicator */}
      <div 
        className={cn(
          "absolute right-0 top-0 bottom-2 w-12 pointer-events-none flex items-center justify-end pr-1 transition-opacity duration-300",
          "bg-gradient-to-l from-background via-background/80 to-transparent",
          showScrollHint ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="animate-pulse">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};
