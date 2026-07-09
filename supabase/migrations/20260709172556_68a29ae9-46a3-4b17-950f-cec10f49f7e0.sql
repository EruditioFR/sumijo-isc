DROP POLICY IF EXISTS "Anyone can update vote when open" ON public.public_votes;

CREATE POLICY "Anyone can update vote when open"
ON public.public_votes
FOR UPDATE
TO anon, authenticated
USING (
  voter_token = ((auth.jwt() ->> 'voter_token')::uuid)
  OR EXISTS (
    SELECT 1
    FROM public.vote_settings
    WHERE vote_settings.is_open = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.vote_settings
    WHERE vote_settings.is_open = true
  )
);

-- Ensure vote timestamps update correctly when a user changes their vote.
DROP TRIGGER IF EXISTS update_public_votes_updated_at ON public.public_votes;
CREATE TRIGGER update_public_votes_updated_at
BEFORE UPDATE ON public.public_votes
FOR EACH ROW
EXECUTE FUNCTION public.update_public_votes_updated_at();