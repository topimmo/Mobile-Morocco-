-- Critical Fix: Align profiles role constraint with application roles
-- This migration fixes the mismatch between database constraints and application logic
-- 
-- PROBLEM: Previous migration set constraint to ('user', 'advertiser', 'admin')
-- SOLUTION: Update constraint to ('user', 'agent', 'merchant', 'admin')
-- 
-- This is a production-critical fix that resolves signup failures for agent/merchant roles

-- Step 1: Remove the incorrect constraint
-- The constraint may have been set by earlier migrations with wrong role values
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Step 2: Add the correct constraint that matches application role definitions
-- Application uses these roles:
--   - 'user': private seller (default)
--   - 'agent': technician/craftsman  
--   - 'merchant': store owner/importer
--   - 'admin': platform administrator
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'agent', 'merchant', 'admin'));

-- Step 3: Ensure the role column has the correct default value
ALTER TABLE profiles 
  ALTER COLUMN role SET DEFAULT 'user';

-- Step 4: Ensure the role column is NOT NULL
-- This should already be set by previous migrations, but we verify it here
ALTER TABLE profiles 
  ALTER COLUMN role SET NOT NULL;

-- Step 5: Update any existing invalid roles (if any exist)
-- This handles edge cases where old data might have 'advertiser' or other invalid roles
UPDATE profiles 
SET role = 'user' 
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin');

-- Step 6: Verify trigger function is up to date
-- This ensures the trigger uses the correct role values
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Extract role from metadata with guaranteed non-NULL fallback
  user_role := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'role'), ''),
    'user'
  );
  
  -- Validate role against allowed values - default to 'user' if invalid
  IF user_role NOT IN ('user', 'agent', 'merchant', 'admin') THEN
    user_role := 'user';
  END IF;

  -- Insert profile - ON CONFLICT prevents duplicate key errors
  INSERT INTO public.profiles (
    id, 
    email, 
    role, 
    full_name, 
    phone,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_role,
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''), NULL),
    COALESCE(NULLIF(TRIM(NEW.raw_user_meta_data->>'phone'), ''), NULL),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Ensure trigger is attached to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Add documentation
COMMENT ON CONSTRAINT profiles_role_check ON profiles IS 
  'Constraint matches application roles: user (private seller), agent (technician/craftsman), merchant (store/importer), admin (platform admin)';

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Auto-creates profile on user signup. Guarantees role is never NULL and always valid. Uses ON CONFLICT for race condition safety.';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- After applying this migration, verify with:
--
-- 1. Check constraint definition:
--    SELECT conname, pg_get_constraintdef(oid) 
--    FROM pg_constraint 
--    WHERE conname = 'profiles_role_check';
--
-- 2. Check for invalid roles:
--    SELECT id, email, role 
--    FROM profiles 
--    WHERE role NOT IN ('user', 'agent', 'merchant', 'admin');
--    (Should return 0 rows)
--
-- 3. Test signup (in application):
--    - Sign up as 'user' ✓
--    - Sign up as 'agent' ✓
--    - Sign up as 'merchant' ✓
-- ============================================================================
