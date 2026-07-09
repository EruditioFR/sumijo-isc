GRANT SELECT ON public.vote_settings TO anon, authenticated;
GRANT ALL ON public.vote_settings TO service_role;

GRANT INSERT, UPDATE ON public.public_votes TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.public_votes TO authenticated;
GRANT ALL ON public.public_votes TO service_role;

DROP POLICY IF EXISTS "Anyone can insert vote when open" ON public.public_votes;
CREATE POLICY "Anyone can insert vote when open"
ON public.public_votes
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.vote_settings
    WHERE is_open = true
  )
);

DROP POLICY IF EXISTS "Anyone can update vote when open" ON public.public_votes;
CREATE POLICY "Anyone can update vote when open"
ON public.public_votes
FOR UPDATE
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.vote_settings
    WHERE is_open = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.vote_settings
    WHERE is_open = true
  )
);