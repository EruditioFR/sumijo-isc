import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { GalleryCategory, UploadFile } from '@/types/gallery.types';

interface UseImageUploadOptions {
  onUploadComplete?: () => void;
}

export function useImageUpload({ onUploadComplete }: UseImageUploadOptions = {}) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = useCallback((newFiles: File[]) => {
    const uploadFiles: UploadFile[] = newFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'pending'
    }));
    setFiles(prev => [...prev, ...uploadFiles]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      // Revoke the object URL to free memory
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  }, []);

  const clearFiles = useCallback(() => {
    files.forEach(f => URL.revokeObjectURL(f.preview));
    setFiles([]);
  }, [files]);

  const uploadImages = async (
    category: GalleryCategory,
    metadata: {
      photographer?: string;
      tags?: string[];
    }
  ) => {
    if (files.length === 0) return;

    setIsUploading(true);

    // Get category ID
    const { data: categoryData } = await supabase
      .from('gallery_categories')
      .select('id')
      .eq('slug', category)
      .single();

    if (!categoryData) {
      throw new Error('Category not found');
    }

    const results: { success: string[]; failed: string[] } = {
      success: [],
      failed: []
    };

    for (let i = 0; i < files.length; i++) {
      const uploadFile = files[i];
      
      try {
        // Update status to uploading
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'uploading', progress: 10 } : f
        ));

        // Generate unique filename
        const fileExt = uploadFile.file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(fileName, uploadFile.file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, progress: 60 } : f
        ));

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('gallery')
          .getPublicUrl(fileName);

        // Get image dimensions (optional, can be done client-side)
        const dimensions = await getImageDimensions(uploadFile.file);

        // Get the next display order (use a simple incrementing counter)
        const { count } = await supabase
          .from('gallery_images')
          .select('*', { count: 'exact', head: true });
        
        const nextOrder = (count || 0) + i + 1;

        // Create database record
        const { error: dbError } = await supabase
          .from('gallery_images')
          .insert({
            url: urlData.publicUrl,
            thumbnail_url: urlData.publicUrl, // Same for now, could generate thumbnail
            title: uploadFile.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            category_id: categoryData.id,
            photographer: metadata.photographer || null,
            tags: metadata.tags || [],
            alt_text: uploadFile.file.name.replace(/\.[^/.]+$/, ''),
            width: dimensions.width,
            height: dimensions.height,
            file_size: uploadFile.file.size,
            is_published: false,
            display_order: nextOrder
          });

        if (dbError) throw dbError;

        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'success', progress: 100 } : f
        ));

        results.success.push(uploadFile.file.name);
      } catch (err) {
        console.error('Upload error:', err);
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'error', error: 'Upload failed' } : f
        ));
        results.failed.push(uploadFile.file.name);
      }
    }

    setIsUploading(false);

    if (results.success.length > 0 && onUploadComplete) {
      setTimeout(onUploadComplete, 1500);
    }

    return results;
  };

  return {
    files,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
    uploadImages
  };
}

// Helper to get image dimensions
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => {
      resolve({ width: 0, height: 0 });
    };
    img.src = URL.createObjectURL(file);
  });
}
