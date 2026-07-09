ALTER TABLE public.public_votes REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.public_votes;