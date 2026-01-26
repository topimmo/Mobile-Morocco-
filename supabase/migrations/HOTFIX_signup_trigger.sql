-- ============================================
-- IMMEDIATE FIX FOR "Database error saving new user"
-- Copy and paste this into Supabase SQL Editor
-- ============================================

-- This fixes the signup trigger to:
-- 1. Always set a default role when none is provided
-- 2. Handle conflicts gracefully with ON CONFLICT DO NOTHING
-- 3. Never insert NULL into profiles.role
-- 4. Ensure role is one of: 'user', 'agent', 'merchant', 'admin'

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from user metadata, default to 'user' if not provided or NULL
  -- The ->>'role' operator extracts the JSON string value
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  
  -- Ensure role is valid, default to 'user' if not
  IF user_role NOT IN ('user', 'agent', 'merchant', 'admin') THEN
    user_role := 'user';
  END IF;

  -- Insert profile with ON CONFLICT DO NOTHING to handle race conditions
  -- This ensures no duplicate key errors if profile somehow already exists
  INSERT INTO public.profiles (id, email, role, full_name, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_role,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the trigger is attached (should already exist)
-- If it doesn't exist, uncomment and run this:
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- 1. Check that the function exists
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- 2. Check that the trigger exists
SELECT trigger_name, event_manipulation, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 3. Check role constraint (should be: user, agent, merchant, admin)
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'profiles_role_check';

-- 4. Verify no NULL roles exist
SELECT COUNT(*) as null_role_count
FROM profiles
WHERE role IS NULL;
-- Should return 0

-- ============================================
-- TEST THE FIX
-- ============================================
-- After running the above, test by:
-- 1. Register a new user in your app
-- 2. Check if profile was created:
--    SELECT id, email, role, created_at FROM profiles ORDER BY created_at DESC LIMIT 5;
-- 3. Verify role is not NULL and is one of the valid values
