
-- Vote settings singleton
CREATE TABLE public.vote_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_open boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.vote_settings TO anon, authenticated;
GRANT ALL ON public.vote_settings TO service_role;
ALTER TABLE public.vote_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read vote settings"
  ON public.vote_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update vote settings"
  ON public.vote_settings FOR UPDATE
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert vote settings"
  ON public.vote_settings FOR INSERT
  TO authenticated
  WITH CHECK (private.has_role(auth.uid(), 'admin'::app_role));

INSERT INTO public.vote_settings (is_open) VALUES (false);

-- Public votes
CREATE TABLE public.public_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_token uuid NOT NULL UNIQUE,
  candidate_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.public_votes TO anon, authenticated;
GRANT ALL ON public.public_votes TO service_role;
ALTER TABLE public.public_votes ENABLE ROW LEVEL SECURITY;

-- Only admins can read all votes
CREATE POLICY "Admins can view all votes"
  ON public.public_votes FOR SELECT
  TO authenticated
  USING (private.has_role(auth.uid(), 'admin'::app_role));

-- Anyone can insert a vote when voting is open
CREATE POLICY "Anyone can insert vote when open"
  ON public.public_votes FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.vote_settings WHERE is_open = true)
  );

-- Anyone can update their own vote (by token) when voting is open
CREATE POLICY "Anyone can update vote when open"
  ON public.public_votes FOR UPDATE
  TO anon, authenticated
  USING (
    EXISTS (SELECT 1 FROM public.vote_settings WHERE is_open = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.vote_settings WHERE is_open = true)
  );

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_public_votes_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_public_votes_updated_at
BEFORE UPDATE ON public.public_votes
FOR EACH ROW EXECUTE FUNCTION public.update_public_votes_updated_at();

CREATE TRIGGER trg_vote_settings_updated_at
BEFORE UPDATE ON public.vote_settings
FOR EACH ROW EXECUTE FUNCTION public.update_public_votes_updated_at();

CREATE INDEX idx_public_votes_candidate_id ON public.public_votes(candidate_id);
