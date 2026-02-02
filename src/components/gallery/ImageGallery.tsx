import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { CategorySidebar } from './CategorySidebar';
import { CategoryChips } from './CategoryChips';
import { GalleryGrid } from './GalleryGrid';
import { ImageModal } from './ImageModal';
import { LoadMoreButton } from './LoadMoreButton';
import { EmptyState } from './EmptyState';
import { useGalleryImages, useCategories } from '@/hooks/useGalleryImages';
import { GalleryCategory, GalleryImage } from '@/types/gallery.types';
import { Skeleton } from '@/components/ui/skeleton';

export const ImageGallery = () => {
  const { t } = useTranslation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('tous');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { categories, isLoading: categoriesLoading } = useCategories();
  const {
    images,
    isLoading,
    error,
    hasMore,
    loadMore,
    totalCount
  } = useGalleryImages({
    category: selectedCategory,
    itemsPerPage: 12
  });

  const handleCategoryChange = useCallback((category: GalleryCategory) => {
    setSelectedCategory(category);
  }, []);

  const handleImageClick = useCallback((image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImage(null);
  }, []);

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  }, [currentIndex, images]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      setSelectedImage(images[newIndex]);
    }
  }, [currentIndex, images]);

  // Calculate image counts per category
  const imageCounts = categories.reduce((acc, cat) => {
    acc[cat.id] = 0; // Will be populated from backend later
    return acc;
  }, {} as Record<string, number>);

  return (
    <section id="gallery" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              {t('gallery.title')}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t('gallery.subtitle')}
            </p>
            <div className="h-1 w-24 bg-gradient-to-r from-primary to-primary/60 mx-auto mt-6" />
          </div>

          {/* Mobile chips */}
          {!categoriesLoading && categories.length > 0 && (
            <CategoryChips
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
          )}

          {/* Main content with sidebar */}
          <div className="flex gap-8">
            {/* Desktop sidebar */}
            {!categoriesLoading && categories.length > 0 && (
              <CategorySidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                imageCounts={imageCounts}
              />
            )}

            {/* Gallery content */}
            <div className="flex-1">
              {/* Counter */}
              {!isLoading && images.length > 0 && (
                <p className="text-sm text-muted-foreground mb-6">
                  {t('gallery.showing', { count: images.length, total: totalCount })}
                </p>
              )}

              {/* Loading state */}
              {isLoading && images.length === 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square rounded-xl" />
                  ))}
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="text-center py-12">
                  <p className="text-destructive">{t('gallery.error')}</p>
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && images.length === 0 && (
                <EmptyState />
              )}

              {/* Images grid */}
              {images.length > 0 && (
                <>
                  <GalleryGrid 
                    images={images} 
                    onImageClick={handleImageClick} 
                  />
                  <LoadMoreButton
                    onClick={loadMore}
                    isLoading={isLoading}
                    hasMore={hasMore}
                  />
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox modal */}
      <ImageModal
        isOpen={isModalOpen}
        image={selectedImage}
        images={images}
        currentIndex={currentIndex}
        onClose={handleCloseModal}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </section>
  );
};

export default ImageGallery;
