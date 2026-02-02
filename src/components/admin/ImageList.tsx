import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Trash2, Eye, EyeOff, GripVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GalleryImage, GalleryCategory, CategoryItem } from '@/types/gallery.types';
import { useAdminImages } from '@/hooks/useAdminImages';
import { ImageEditor } from './ImageEditor';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ImageListProps {
  categories: CategoryItem[];
  selectedCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
  refreshTrigger?: number;
}

export const ImageList = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  refreshTrigger 
}: ImageListProps) => {
  const { t } = useTranslation();
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { images, isLoading, fetchImages, deleteImage, updateImage } = useAdminImages({
    category: selectedCategory
  });

  useEffect(() => {
    fetchImages();
  }, [fetchImages, refreshTrigger]);

  const handleDelete = async () => {
    if (!deletingImage) return;
    
    setIsDeleting(true);
    try {
      await deleteImage(deletingImage.id);
    } catch (err) {
      console.error('Delete error:', err);
    } finally {
      setIsDeleting(false);
      setDeletingImage(null);
    }
  };

  const handleTogglePublish = async (image: GalleryImage) => {
    await updateImage(image.id, { is_published: !image.is_published });
  };

  const handleSaveEdit = async (updates: Partial<GalleryImage>) => {
    if (!editingImage) return;
    await updateImage(editingImage.id, updates);
    setEditingImage(null);
  };

  return (
    <div className="space-y-6">
      {/* Category filter tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.slug ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategoryChange(cat.slug)}
          >
            {t(`gallery.categoryNames.${cat.slug}`)}
          </Button>
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-lg" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('admin.noImages')}</p>
        </div>
      )}

      {/* Image grid */}
      {!isLoading && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {images.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-card rounded-lg overflow-hidden border shadow-sm"
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={image.thumbnail_url || image.url}
                    alt={image.alt_text}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Status badge */}
                  <Badge 
                    variant={image.is_published ? 'default' : 'secondary'}
                    className="absolute top-2 left-2"
                  >
                    {image.is_published ? t('admin.published') : t('admin.draft')}
                  </Badge>

                  {/* Drag handle */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="w-5 h-5 text-white drop-shadow-lg cursor-grab" />
                  </div>

                  {/* Actions overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => setEditingImage(image)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={() => handleTogglePublish(image)}
                    >
                      {image.is_published ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => setDeletingImage(image)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h4 className="font-medium text-sm truncate">{image.title}</h4>
                  {image.photographer && (
                    <p className="text-xs text-muted-foreground truncate">
                      📷 {image.photographer}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit modal */}
      {editingImage && (
        <ImageEditor
          image={editingImage}
          categories={categories}
          onSave={handleSaveEdit}
          onClose={() => setEditingImage(null)}
        />
      )}

      {/* Delete confirmation */}
      <AlertDialog open={!!deletingImage} onOpenChange={() => setDeletingImage(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.deleteImage')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('admin.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              {t('admin.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                t('admin.deleteImage')
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
