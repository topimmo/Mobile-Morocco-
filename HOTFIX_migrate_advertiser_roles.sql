-- ============================================================================
-- HOTFIX: Migrate invalid 'advertiser' roles and fix constraint
-- ============================================================================
-- This script safely migrates existing 'advertiser' roles to valid application roles
-- and ensures the database constraint matches application expectations.
-- 
-- ISSUE: Existing profiles have role='advertiser' which is not a valid app role
-- VALID ROLES: 'user', 'agent', 'merchant', 'admin'
-- ============================================================================

-- ============================================================================
-- STEP 1: PRE-MIGRATION VALIDATION
-- ============================================================================
-- Check for invalid roles before migration
SELECT 
  'BEFORE MIGRATION - Invalid roles found:' as status,
  role,
  COUNT(*) as count,
  ARRAY_AGG(id ORDER BY created_at DESC LIMIT 5) as sample_user_ids
FROM profiles
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin')
GROUP BY role
ORDER BY count DESC;

-- Total count of affected users
SELECT 
  'Total users with invalid roles:' as status,
  COUNT(*) as total_affected_users
FROM profiles
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin');

-- ============================================================================
-- STEP 2: ROLE MIGRATION OPTIONS
-- ============================================================================
-- OPTION A: Migrate 'advertiser' → 'merchant' (RECOMMENDED)
-- Rationale: Advertisers are typically businesses/stores promoting products
--            which aligns with the 'merchant' role (store owner/importer)

-- OPTION B: Migrate 'advertiser' → 'user' (CONSERVATIVE)
-- Rationale: Safe default that gives least privileges
--            Users can later upgrade to merchant if needed

-- OPTION C: Migrate 'advertiser' → 'agent' (ALTERNATIVE)
-- Rationale: If advertisers are service providers
--            Only use if advertiser = technician/craftsman in your context

-- ============================================================================
-- STEP 3: EXECUTE MIGRATION (Choose ONE option below)
-- ============================================================================

-- UNCOMMENT THE OPTION YOU WANT TO USE:

-- OPTION A: Migrate advertiser → merchant (RECOMMENDED)
UPDATE profiles 
SET 
  role = 'merchant',
  updated_at = NOW()
WHERE role = 'advertiser';

-- OPTION B: Migrate advertiser → user (CONSERVATIVE - comment out Option A and uncomment this)
-- UPDATE profiles 
-- SET 
--   role = 'user',
--   updated_at = NOW()
-- WHERE role = 'advertiser';

-- OPTION C: Migrate advertiser → agent (ALTERNATIVE - comment out Option A and uncomment this)
-- UPDATE profiles 
-- SET 
--   role = 'agent',
--   updated_at = NOW()
-- WHERE role = 'advertiser';

-- Log the migration
SELECT 
  'MIGRATION EXECUTED - Rows updated:' as status,
  COUNT(*) as rows_updated
FROM profiles
WHERE role IN ('user', 'agent', 'merchant', 'admin')
  AND updated_at >= NOW() - INTERVAL '1 minute';

-- ============================================================================
-- STEP 4: MIGRATE ANY OTHER INVALID ROLES
-- ============================================================================
-- Handle any other unexpected role values by defaulting to 'user'
UPDATE profiles 
SET 
  role = 'user',
  updated_at = NOW()
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin');

-- ============================================================================
-- STEP 5: POST-MIGRATION VALIDATION
-- ============================================================================
-- Verify no invalid roles remain
SELECT 
  'AFTER MIGRATION - Invalid roles check:' as status,
  COUNT(*) as invalid_roles_remaining
FROM profiles
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin');
-- Expected: 0

-- Show current role distribution
SELECT 
  'Current role distribution:' as status,
  role,
  COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- ============================================================================
-- STEP 6: UPDATE DATABASE CONSTRAINT
-- ============================================================================
-- Drop the old constraint (if exists)
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the correct constraint
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'agent', 'merchant', 'admin'));

-- Ensure default role is 'user'
ALTER TABLE profiles 
  ALTER COLUMN role SET DEFAULT 'user';

-- Ensure role is NOT NULL
ALTER TABLE profiles 
  ALTER COLUMN role SET NOT NULL;

-- ============================================================================
-- STEP 7: UPDATE TRIGGER FUNCTION
-- ============================================================================
-- Ensure the trigger function validates roles correctly (idempotent)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from user metadata with guaranteed fallback to 'user'
  user_role := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'role'), ''),
    'user'
  );
  
  -- Validate and sanitize role - only allow valid roles
  IF user_role NOT IN ('user', 'agent', 'merchant', 'admin') THEN
    user_role := 'user';
  END IF;

  -- Insert profile with ON CONFLICT to handle race conditions
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

-- Ensure trigger is attached (idempotent)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STEP 8: ADD DOCUMENTATION
-- ============================================================================
COMMENT ON CONSTRAINT profiles_role_check ON profiles IS 
  'Ensures role matches application values: user (private seller), agent (technician), merchant (store owner), admin';

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Auto-creates profile on signup. Guarantees role is never NULL. Validates role against constraint. Handles conflicts gracefully.';

-- ============================================================================
-- STEP 9: FINAL VALIDATION
-- ============================================================================
-- Verify constraint is correct
SELECT 
  'CONSTRAINT VERIFICATION:' as status,
  conname as constraint_name,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conname = 'profiles_role_check';
-- Expected: CHECK ((role = ANY (ARRAY['user'::text, 'agent'::text, 'merchant'::text, 'admin'::text])))

-- Verify all profiles have valid roles
SELECT 
  'FINAL VALIDATION - All roles valid:' as status,
  CASE 
    WHEN COUNT(*) = 0 THEN 'PASS ✓'
    ELSE 'FAIL ✗ - ' || COUNT(*)::text || ' invalid roles found'
  END as result
FROM profiles
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin');

-- Show final role distribution
SELECT 
  'FINAL ROLE DISTRIBUTION:' as status,
  role,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================
SELECT 
  '✓ MIGRATION COMPLETE' as status,
  'All invalid roles have been migrated' as message,
  'Constraint updated to enforce only valid roles' as next_step,
  'Test signup for all role types: user, agent, merchant' as action_required;

-- ============================================================================
-- ROLLBACK INSTRUCTIONS (if needed)
-- ============================================================================
-- If you need to rollback the migration, run:
-- 
-- UPDATE profiles 
-- SET role = 'advertiser'
-- WHERE role = 'merchant' -- or 'user' or 'agent' depending on which option you chose
--   AND updated_at >= 'YYYY-MM-DD HH:MM:SS'; -- Replace with migration timestamp
--
-- Then drop and recreate the old constraint:
-- ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
-- ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
--   CHECK (role IN ('user', 'advertiser', 'admin'));
-- ============================================================================
