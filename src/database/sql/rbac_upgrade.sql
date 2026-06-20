-- rbac_upgrade.sql: Adds a secure RPC function to grant roles

-- This function bypasses RLS (SECURITY DEFINER) to allow an admin to update another user's role.
-- It first checks if the calling user is an 'admin' or 'hr'.
CREATE OR REPLACE FUNCTION grant_staff_role(target_email TEXT, new_role TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  caller_role TEXT;
  target_id UUID;
BEGIN
  -- 1. Get the role of the user making the request
  SELECT role INTO caller_role FROM public.profiles WHERE id = auth.uid();
  
  -- 2. Verify the caller is an admin or hr
  IF caller_role NOT IN ('admin', 'hr') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins or HR can grant roles.';
  END IF;

  -- 3. Verify the requested role is valid
  IF new_role NOT IN ('receptionist', 'admin', 'hr', 'patient') THEN
    RAISE EXCEPTION 'Invalid role specified.';
  END IF;

  -- 4. Find the target user's ID by their email
  -- Note: email is stored in auth.users, but profiles also has an email column?
  -- Wait, profiles doesn't have an email column in the schema! 
  -- We need to look up auth.users, but regular users cannot query auth.users.
  -- Since this is SECURITY DEFINER, it runs as postgres superuser, so we CAN query auth.users!
  SELECT id INTO target_id FROM auth.users WHERE email = target_email;

  IF target_id IS NULL THEN
    RAISE EXCEPTION 'User with this email not found.';
  END IF;

  -- 5. Update their role
  UPDATE public.profiles SET role = new_role WHERE id = target_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
