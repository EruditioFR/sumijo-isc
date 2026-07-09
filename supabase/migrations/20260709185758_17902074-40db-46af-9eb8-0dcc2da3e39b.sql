
ALTER TABLE public.vote_settings
  ADD COLUMN IF NOT EXISTS vote_round INTEGER NOT NULL DEFAULT 1;

DELETE FROM public.public_votes;

UPDATE public.vote_settings
  SET vote_round = vote_round + 1,
      updated_at = now();
