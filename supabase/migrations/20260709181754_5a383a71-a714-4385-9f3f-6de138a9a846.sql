-- Ensure grants exist (idempotent)
GRANT SELECT, INSERT ON public.public_votes TO anon;
GRANT SELECT, INSERT ON public.public_votes TO authenticated;
GRANT ALL ON public.public_votes TO service_role;

GRANT SELECT ON public.vote_settings TO anon;
GRANT SELECT ON public.vote_settings TO authenticated;
GRANT ALL ON public.vote_settings TO service_role;

-- Remove the ability to update existing votes: a vote is final
DROP POLICY IF EXISTS "Anyone can update vote when open" ON public.public_votes;

-- Also revoke UPDATE / DELETE from anon & authenticated (admins go through service role or SELECT only)
REVOKE UPDATE, DELETE ON public.public_votes FROM anon;
REVOKE UPDATE, DELETE ON public.public_votes FROM authenticated;

-- Prevent duplicate votes per voter_token at DB level (safety net)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'public_votes_voter_token_key'
  ) THEN
    ALTER TABLE public.public_votes ADD CONSTRAINT public_votes_voter_token_key UNIQUE (voter_token);
  END IF;
END $$;

-- Ensure realtime publication includes public_votes (idempotent)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables WHERE pubname='supabase_realtime' AND schemaname='public' AND tablename='public_votes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.public_votes;
  END IF;
END $$;

ALTER TABLE public.public_votes REPLICA IDENTITY FULL;