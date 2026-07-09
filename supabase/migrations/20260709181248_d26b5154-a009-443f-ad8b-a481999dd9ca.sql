CREATE OR REPLACE FUNCTION public.is_public_vote_open()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT is_open FROM public.vote_settings ORDER BY updated_at DESC LIMIT 1), false)
$$;

GRANT EXECUTE ON FUNCTION public.is_public_vote_open() TO anon, authenticated, service_role;