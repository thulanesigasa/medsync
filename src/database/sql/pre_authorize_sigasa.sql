-- pre_authorize_sigasa.sql
-- This script adds the email column to profiles, pre-authorizes sigasathulane584@gmail.com, and updates existing records.

-- 1. Add email column to profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email VARCHAR(255);

-- 2. Populate email column for all existing users from auth.users table
UPDATE public.profiles
SET email = auth.users.email
FROM auth.users
WHERE public.profiles.id = auth.users.id
AND public.profiles.email IS NULL;

-- 3. Update handle_new_user trigger function to save user emails automatically on signup
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

  INSERT INTO public.profiles (id, role, full_name, avatar_url, phone_number, email)
  VALUES (
    new.id, 
    default_role, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'phone_number',
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Retroactively pre-authorize sigasathulane584@gmail.com if they already registered
DO $$
DECLARE
  target_user_id UUID;
  target_email TEXT := 'sigasathulane584@gmail.com';
BEGIN
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;
  
  IF target_user_id IS NOT NULL THEN
    -- Update profiles
    UPDATE public.profiles
    SET role = 'receptionist', email = target_email
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
