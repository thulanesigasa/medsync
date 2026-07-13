-- pre_authorize_sigasa.sql
-- This script pre-authorizes sigasathulane584@gmail.com with receptionist/staff access and updates their profile if they already registered.

-- 1. Update trigger function to pre-authorize the email
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
DECLARE
  default_role VARCHAR(50) := 'patient';
BEGIN
  -- Check for pre-authorized admin/receptionist emails
  IF new.email IN ('nthabiseng06m@gmail.com', 'sigasathulane584@gmail.com') THEN
    default_role := 'receptionist';
  ELSIF new.raw_user_meta_data->>'role' IS NOT NULL THEN
    default_role := new.raw_user_meta_data->>'role';
  END IF;

  INSERT INTO public.profiles (id, role, full_name, avatar_url, phone_number)
  VALUES (
    new.id, 
    default_role, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone_number'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. If the user already registered, update their role to receptionist in both profiles and auth.users metadata
DO $$
DECLARE
  target_user_id UUID;
  target_email TEXT := 'sigasathulane584@gmail.com';
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;
  
  IF target_user_id IS NOT NULL THEN
    -- Update profiles
    UPDATE public.profiles
    SET role = 'receptionist'
    WHERE id = target_user_id;
    
    -- Update auth.users metadata
    UPDATE auth.users
    SET raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{role}',
      '"receptionist"'
    )
    WHERE id = target_user_id;
  END IF;
END $$;
