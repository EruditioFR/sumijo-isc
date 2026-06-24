
-- 1. Private schema for has_role
CREATE SCHEMA IF NOT EXISTS private;
GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

-- 2. Recreate RLS policies referencing private.has_role
-- user_roles
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- gallery_categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.gallery_categories;
CREATE POLICY "Admins can manage categories" ON public.gallery_categories
  FOR ALL TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

-- gallery_images
DROP POLICY IF EXISTS "Admins can delete images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can insert images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can view all images" ON public.gallery_images;

CREATE POLICY "Admins can delete images" ON public.gallery_images
  FOR DELETE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can insert images" ON public.gallery_images
  FOR INSERT TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update images" ON public.gallery_images
  FOR UPDATE TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can view all images" ON public.gallery_images
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

-- ticketing_notifications
DROP POLICY IF EXISTS "Admins can view all subscribers" ON public.ticketing_notifications;
DROP POLICY IF EXISTS "Users can check if email exists" ON public.ticketing_notifications;
DROP POLICY IF EXISTS "Anyone can subscribe to notifications" ON public.ticketing_notifications;

CREATE POLICY "Admins can view all subscribers" ON public.ticketing_notifications
  FOR SELECT TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Anyone can subscribe to notifications" ON public.ticketing_notifications
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND char_length(email) <= 254
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  );

-- 3. Storage gallery bucket: drop overly-broad SELECT policy
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;

-- Recreate admin storage policies using private.has_role
DROP POLICY IF EXISTS "Admins can delete gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update gallery images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload gallery images" ON storage.objects;

CREATE POLICY "Admins can delete gallery images" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'gallery' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update gallery images" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'gallery' AND private.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'gallery' AND private.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can upload gallery images" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'gallery' AND private.has_role(auth.uid(), 'admin'::public.app_role));

-- 4. Drop the public.has_role function (no longer needed)
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
