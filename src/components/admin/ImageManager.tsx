import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ImageIcon, Upload, Grid, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useAdminCategories } from '@/hooks/useAdminImages';
import { AdminLogin } from './AdminLogin';
import { ImageUploader } from './ImageUploader';
import { ImageList } from './ImageList';
import { GalleryCategory } from '@/types/gallery.types';
import { Skeleton } from '@/components/ui/skeleton';

type AdminView = 'images' | 'upload' | 'categories';

export const ImageManager = () => {
  const { t } = useTranslation();
  const { user, isAdmin, isLoading: authLoading, signOut } = useAdminAuth();
  const { categories, isLoading: categoriesLoading, fetchCategories } = useAdminCategories();
  
  const [currentView, setCurrentView] = useState<AdminView>('images');
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('tous');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchCategories();
    }
  }, [isAdmin, fetchCategories]);

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
    setCurrentView('images');
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Skeleton className="w-96 h-64 rounded-xl" />
      </div>
    );
  }

  // Not logged in or not admin
  if (!user || !isAdmin) {
    return <AdminLogin />;
  }

  const navItems = [
    { id: 'images' as const, icon: ImageIcon, label: t('admin.images') },
    { id: 'upload' as const, icon: Upload, label: t('admin.upload') },
  ];

  return (
    <div>
      {/* Gallery sub-navigation */}
      <div className="flex items-center gap-2 mb-6">
        {navItems.map(item => (
          <Button
            key={item.id}
            variant={currentView === item.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentView(item.id)}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </div>

      {categoriesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        ) : (
          <>
            {currentView === 'images' && (
              <ImageList
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                refreshTrigger={refreshTrigger}
              />
            )}

            {currentView === 'upload' && (
              <ImageUploader
                categories={categories}
                onUploadComplete={handleUploadComplete}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ImageManager;
