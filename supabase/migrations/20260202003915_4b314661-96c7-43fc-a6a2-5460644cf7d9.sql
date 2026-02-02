-- ==========================================
-- GALLERY PHOTO SYSTEM - FULL SCHEMA
-- ==========================================

-- 1. Enum for image categories
CREATE TYPE public.gallery_category AS ENUM (
  'tous',
  'performances',
  'chateau',
  'candidats',
  'jury',
  'backstage'
);

-- 2. Enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 3. User roles table for admin access
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 4. Security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Gallery categories table
CREATE TABLE public.gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug public.gallery_category UNIQUE NOT NULL,
  icon VARCHAR(50),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on categories
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;

-- 6. Gallery images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category_id UUID NOT NULL REFERENCES public.gallery_categories(id) ON DELETE RESTRICT,
  tags TEXT[],
  photographer VARCHAR(255),
  capture_date TIMESTAMP WITH TIME ZONE,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  width INTEGER,
  height INTEGER,
  file_size INTEGER,
  alt_text TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- 7. Indexes for performance
CREATE INDEX idx_gallery_images_category ON public.gallery_images(category_id);
CREATE INDEX idx_gallery_images_published ON public.gallery_images(is_published);
CREATE INDEX idx_gallery_images_display_order ON public.gallery_images(display_order);
CREATE INDEX idx_gallery_images_upload_date ON public.gallery_images(upload_date DESC);
CREATE INDEX idx_gallery_categories_display_order ON public.gallery_categories(display_order);

-- 8. Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_gallery_images_updated_at
  BEFORE UPDATE ON public.gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_gallery_updated_at();

CREATE TRIGGER update_gallery_categories_updated_at
  BEFORE UPDATE ON public.gallery_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_gallery_updated_at();

-- ==========================================
-- RLS POLICIES
-- ==========================================

-- User roles: only admins can manage
CREATE POLICY "Admins can manage user roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Categories: public read, admin write
CREATE POLICY "Anyone can view active categories"
  ON public.gallery_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON public.gallery_categories
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Images: public read published, admin full access
CREATE POLICY "Anyone can view published images"
  ON public.gallery_images
  FOR SELECT
  USING (is_published = true);

CREATE POLICY "Admins can view all images"
  ON public.gallery_images
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert images"
  ON public.gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update images"
  ON public.gallery_images
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete images"
  ON public.gallery_images
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- STORAGE BUCKET
-- ==========================================

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery',
  'gallery',
  true,
  10485760, -- 10MB max
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Storage policies
CREATE POLICY "Gallery images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'gallery' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can update gallery images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'gallery' 
    AND public.has_role(auth.uid(), 'admin')
  )
  WITH CHECK (
    bucket_id = 'gallery' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete gallery images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'gallery' 
    AND public.has_role(auth.uid(), 'admin')
  );

-- ==========================================
-- SEED DATA: Default categories
-- ==========================================

INSERT INTO public.gallery_categories (name, slug, icon, display_order, is_active)
VALUES
  ('Tous', 'tous', 'grid', 1, true),
  ('Performances', 'performances', 'music', 2, true),
  ('Château', 'chateau', 'building', 3, true),
  ('Candidats', 'candidats', 'users', 4, true),
  ('Jury', 'jury', 'award', 5, true),
  ('Backstage', 'backstage', 'camera', 6, true);