import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryImage, GalleryCategory, CategoryItem } from '@/types/gallery.types';

interface UseGalleryImagesOptions {
  category?: GalleryCategory;
  itemsPerPage?: number;
}

interface UseGalleryImagesReturn {
  images: GalleryImage[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  totalCount: number;
  refetch: () => void;
}

export function useGalleryImages({
  category = 'tous',
  itemsPerPage = 12
}: UseGalleryImagesOptions = {}): UseGalleryImagesReturn {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const fetchImages = useCallback(async (pageNum: number, reset: boolean = false) => {
    setIsLoading(true);
    setError(null);

    try {
      // Build the query
      let query = supabase
        .from('gallery_images')
        .select(`
          *,
          category:gallery_categories(*)
        `, { count: 'exact' })
        .eq('is_published', true)
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

      // Apply pagination
      const from = pageNum * itemsPerPage;
      const to = from + itemsPerPage - 1;
      query = query.range(from, to);

      const { data, error: queryError, count } = await query;

      if (queryError) throw queryError;

      const newImages = (data || []) as unknown as GalleryImage[];
      
      setImages(prev => reset ? newImages : [...prev, ...newImages]);
      setTotalCount(count || 0);
      setHasMore(newImages.length === itemsPerPage);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch images'));
    } finally {
      setIsLoading(false);
    }
  }, [category, itemsPerPage]);

  // Reset and fetch when category changes
  useEffect(() => {
    setPage(0);
    setImages([]);
    fetchImages(0, true);
  }, [category, fetchImages]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchImages(nextPage, false);
    }
  }, [isLoading, hasMore, page, fetchImages]);

  const refetch = useCallback(() => {
    setPage(0);
    setImages([]);
    fetchImages(0, true);
  }, [fetchImages]);

  return {
    images,
    isLoading,
    error,
    hasMore,
    loadMore,
    totalCount,
    refetch
  };
}

// Hook for categories
export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error: queryError } = await supabase
          .from('gallery_categories')
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (queryError) throw queryError;
        setCategories((data || []) as CategoryItem[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}
