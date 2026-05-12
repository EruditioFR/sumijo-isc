DO $$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM auth.users WHERE email = 'sjisc@sumijo-isc.com';
  IF uid IS NOT NULL THEN
    UPDATE auth.users SET email = 'contact@sumijo-isc.com', updated_at = now() WHERE id = uid;
    UPDATE auth.identities
    SET identity_data = jsonb_build_object('sub', uid::text, 'email', 'contact@sumijo-isc.com'),
        provider_id = uid::text,
        updated_at = now()
    WHERE user_id = uid AND provider = 'email';
  END IF;
END $$;