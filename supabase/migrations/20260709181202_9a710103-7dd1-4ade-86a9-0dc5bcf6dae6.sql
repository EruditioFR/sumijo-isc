CREATE OR REPLACE FUNCTION public.is_public_vote_open()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_open FROM public.vote_settings ORDER BY updated_at DESC LIMIT 1), false)
$$;

GRANT EXECUTE ON FUNCTION public.is_public_vote_open() TO anon, authenticated, service_role;

GRANT SELECT ON public.vote_settings TO anon, authenticated;
GRANT ALL ON public.vote_settings TO service_role;

GRANT INSERT, UPDATE ON public.public_votes TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.public_votes TO authenticated;
GRANT ALL ON public.public_votes TO service_role;

DROP POLICY IF EXISTS "Anyone can insert vote when open" ON public.public_votes;
DROP POLICY IF EXISTS "Anyone can update vote when open" ON public.public_votes;

CREATE POLICY "Anyone can insert vote when open"
ON public.public_votes
FOR INSERT
TO anon, authenticated
WITH CHECK (public.is_public_vote_open());

CREATE POLICY "Anyone can update vote when open"
ON public.public_votes
FOR UPDATE
TO anon, authenticated
USING (public.is_public_vote_open())
WITH CHECK (public.is_public_vote_open());