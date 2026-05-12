DO $$
DECLARE
  uid uuid := gen_random_uuid();
  existing uuid;
BEGIN
  SELECT id INTO existing FROM auth.users WHERE email = 'sjisc@sumijo-isc.com';
  IF existing IS NULL THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, aud, role,
      raw_app_meta_data, raw_user_meta_data
    ) VALUES (
      uid, '00000000-0000-0000-0000-000000000000', 'sjisc@sumijo-isc.com',
      crypt('sjisc', gen_salt('bf')), now(), now(), now(),
      'authenticated', 'authenticated',
      '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb
    );
    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      last_sign_in_at, created_at, updated_at
    ) VALUES (
      gen_random_uuid(), uid,
      jsonb_build_object('sub', uid::text, 'email', 'sjisc@sumijo-isc.com'),
      'email', uid::text, now(), now(), now()
    );
    INSERT INTO public.user_roles (user_id, role) VALUES (uid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (existing, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;