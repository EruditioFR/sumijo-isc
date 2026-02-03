// Gallery TypeScript types

export type GalleryCategory = 
  | 'tous'
  | 'performances'
  | 'chateau'
  | 'candidats'
  | 'jury'
  | 'backstage'
  | 'sponsors'
  | 'laureats';

export interface CategoryItem {
  id: string;
  name: string;
  slug: GalleryCategory;
  icon: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  thumbnail_url: string | null;
  title: string;
  description: string | null;
  category_id: string;
  category?: CategoryItem;
  tags: string[] | null;
  photographer: string | null;
  capture_date: string | null;
  upload_date: string;
  display_order: number;
  is_published: boolean;
  width: number | null;
  height: number | null;
  file_size: number | null;
  alt_text: string;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryFilters {
  category: GalleryCategory;
  searchQuery?: string;
  sortBy?: 'date' | 'title' | 'order';
  sortOrder?: 'asc' | 'desc';
}

export interface UploadFile {
  file: File;
  preview: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}
