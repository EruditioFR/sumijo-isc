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
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            <h1 className="text-xl font-display text-foreground">{t('admin.title')}</h1>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-2">
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
          </nav>

          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" />
            {t('admin.logout')}
          </Button>
        </div>

        {/* Mobile navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t p-4 flex flex-col gap-2">
            {navItems.map(item => (
              <Button
                key={item.id}
                variant={currentView === item.id ? 'default' : 'ghost'}
                className="justify-start"
                onClick={() => {
                  setCurrentView(item.id);
                  setIsMobileMenuOpen(false);
                }}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
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
