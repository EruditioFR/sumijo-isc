import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage, CategoryItem, GalleryCategory } from '@/types/gallery.types';

interface UseAdminImagesOptions {
  category?: GalleryCategory;
}

export function useAdminImages({ category = 'tous' }: UseAdminImagesOptions = {}) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('gallery_images')
        .select(`
          *,
          category:gallery_categories(*)
        `)
        .order('display_order', { ascending: true })
        .order('upload_date', { ascending: false });

      // Filter by category if not "tous"
      if (category !== 'tous') {
        const { data: categoryData } = await supabase
          .from('gallery_categories')
          .select('id')
          .eq('slug', category)
          .single();

        if (categoryData) {
          query = query.eq('category_id', categoryData.id);
        }
      }

      const { data, error: queryError } = await query;

      if (queryError) throw queryError;
      setImages((data || []) as unknown as GalleryImage[]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch images'));
    } finally {
      setIsLoading(false);
    }
  }, [category]);

  const deleteImage = async (imageId: string) => {
    try {
      // Get image to delete from storage
      const image = images.find(img => img.id === imageId);
      if (image) {
        // Delete from storage
        const urlParts = image.url.split('/');
        const fileName = urlParts[urlParts.length - 1];
        await supabase.storage.from('gallery').remove([fileName]);
        
        if (image.thumbnail_url) {
          const thumbParts = image.thumbnail_url.split('/');
          const thumbName = thumbParts[thumbParts.length - 1];
          await supabase.storage.from('gallery').remove([thumbName]);
        }
      }

      // Delete from database
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;
      
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (err) {
      throw err;
    }
  };

  const updateImage = async (imageId: string, updates: Partial<GalleryImage>) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update(updates)
        .eq('id', imageId);

      if (error) throw error;
      
      setImages(prev => prev.map(img => 
        img.id === imageId ? { ...img, ...updates } : img
      ));
    } catch (err) {
      throw err;
    }
  };

  const reorderImages = async (reorderedImages: GalleryImage[]) => {
    try {
      const updates = reorderedImages.map((img, index) => ({
        id: img.id,
        display_order: index
      }));

      for (const update of updates) {
        await supabase
          .from('gallery_images')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      setImages(reorderedImages);
    } catch (err) {
      throw err;
    }
  };

  return {
    images,
    isLoading,
    error,
    fetchImages,
    deleteImage,
    updateImage,
    reorderImages,
    refetch: fetchImages
  };
}

export function useAdminCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('gallery_categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories((data || []) as CategoryItem[]);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { categories, isLoading, fetchCategories };
}
