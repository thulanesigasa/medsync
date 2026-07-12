-- bootstrap_hr.sql
-- This script safely bootstraps the first HR (Super Admin) account.
-- It bypasses standard security rules so you can grant yourself access.
-- 
-- INSTRUCTIONS:
-- 1. Sign up for an account in the MedSync app using your desired email.
-- 2. Open your Supabase Dashboard -> SQL Editor.
-- 3. Replace 'YOUR_EMAIL_HERE' below with the exact email you signed up with.
-- 4. Run the script!
-- 5. Log back into the app, and you will have full access.

DO $$
DECLARE
  target_user_id UUID;
  target_email TEXT := 'YOUR_EMAIL_HERE'; -- <--- CHANGE THIS
BEGIN
  -- Find the user in auth.users
  SELECT id INTO target_user_id FROM auth.users WHERE email = target_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Did you sign up in the app first?', target_email;
  END IF;

  -- Force update their profile role to hr
  UPDATE public.profiles
  SET role = 'hr'
  WHERE id = target_user_id;
  
  -- Also ensure their auth metadata reflects the change
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{role}',
    '"hr"'
  )
  WHERE id = target_user_id;

  RAISE NOTICE 'Success! % is now an HR administrator.', target_email;
END $$;
