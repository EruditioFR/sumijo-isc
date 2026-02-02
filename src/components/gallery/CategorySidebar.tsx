import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { GalleryCategory, CategoryItem } from '@/types/gallery.types';
import { Grid3X3, Music, Building, Users, Award, Camera } from 'lucide-react';

interface CategorySidebarProps {
  categories: CategoryItem[];
  selectedCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
  imageCounts?: Record<string, number>;
}

const iconMap: Record<string, React.ElementType> = {
  grid: Grid3X3,
  music: Music,
  building: Building,
  users: Users,
  award: Award,
  camera: Camera,
};

export const CategorySidebar = ({
  categories,
  selectedCategory,
  onCategoryChange,
  imageCounts = {}
}: CategorySidebarProps) => {
  const { t } = useTranslation();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 p-4">
        <h3 className="font-display text-lg text-foreground mb-4 px-2">
          {t('gallery.categories')}
        </h3>
        <nav className="space-y-1">
          {categories.map((category) => {
            const Icon = iconMap[category.icon || 'grid'] || Grid3X3;
            const isActive = selectedCategory === category.slug;
            const count = imageCounts[category.id] || 0;

            return (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.slug)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1 font-medium">
                  {t(`gallery.categoryNames.${category.slug}`)}
                </span>
                {category.slug !== 'tous' && count > 0 && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    isActive 
                      ? "bg-primary-foreground/20 text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
