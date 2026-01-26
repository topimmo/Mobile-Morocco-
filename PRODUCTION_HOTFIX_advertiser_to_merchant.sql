-- ============================================================================
-- PRODUCTION HOTFIX: Migrate 'advertiser' to 'merchant' and fix constraint
-- ============================================================================
-- This script:
-- 1. Migrates all role='advertiser' to role='merchant' in public.profiles
-- 2. Updates the constraint to allow only: user, agent, merchant, admin
-- 3. Ensures the trigger prevents future invalid roles
-- 
-- Safe to run multiple times (idempotent)
-- ============================================================================

-- ============================================================================
-- STEP 1: PRE-MIGRATION VALIDATION
-- ============================================================================
-- Check current invalid roles
SELECT 
  'BEFORE MIGRATION:' as stage,
  role,
  COUNT(*) as count
FROM profiles
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin')
GROUP BY role;

-- ============================================================================
-- STEP 2: MIGRATE ADVERTISER TO MERCHANT
-- ============================================================================
-- Convert all 'advertiser' roles to 'merchant'
-- Leave all other roles untouched
UPDATE profiles 
SET 
  role = 'merchant',
  updated_at = NOW()
WHERE role = 'advertiser';

-- Show what was migrated
SELECT 
  'MIGRATION COMPLETE:' as stage,
  COUNT(*) as rows_migrated_to_merchant
FROM profiles
WHERE role = 'merchant' 
  AND updated_at >= NOW() - INTERVAL '1 minute';

-- ============================================================================
-- STEP 3: VERIFY NO INVALID ROLES REMAIN
-- ============================================================================
-- This should return 0 rows
SELECT 
  'POST-MIGRATION CHECK:' as stage,
  role,
  COUNT(*) as invalid_count
FROM profiles
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin')
GROUP BY role;

-- Expected result: 0 rows (all invalid roles migrated)

-- ============================================================================
-- STEP 4: UPDATE DATABASE CONSTRAINT
-- ============================================================================
-- Drop old constraint
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new constraint with correct roles
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'agent', 'merchant', 'admin'));

-- Ensure role has correct defaults and constraints
ALTER TABLE profiles 
  ALTER COLUMN role SET DEFAULT 'user';

ALTER TABLE profiles 
  ALTER COLUMN role SET NOT NULL;

-- ============================================================================
-- STEP 5: UPDATE TRIGGER FUNCTION
-- ============================================================================
-- Ensure trigger never inserts 'advertiser' or any invalid role
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
  
  -- Validate role - only accept: user, agent, merchant, admin
  -- Fall back to 'user' for any invalid or missing value
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

-- Ensure trigger is attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- STEP 6: FINAL VALIDATION
-- ============================================================================
-- Verify constraint is correct
SELECT 
  'CONSTRAINT CHECK:' as stage,
  conname as constraint_name,
  pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conname = 'profiles_role_check';

-- Verify all profiles have valid roles (should return 0 invalid)
SELECT 
  'FINAL VALIDATION:' as stage,
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ PASS - All roles valid'
    ELSE '✗ FAIL - ' || COUNT(*)::text || ' invalid roles found'
  END as result
FROM profiles
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin');

-- Show final role distribution
SELECT 
  'ROLE DISTRIBUTION:' as stage,
  role,
  COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;

-- ============================================================================
-- SUCCESS
-- ============================================================================
SELECT '✓ HOTFIX COMPLETE' as status,
       'All advertiser roles migrated to merchant' as result,
       'Constraint enforces: user, agent, merchant, admin' as constraint,
       'Trigger validated to prevent future invalid roles' as trigger_status;

-- ============================================================================
-- NOTES
-- ============================================================================
-- - This script is idempotent (safe to run multiple times)
-- - Only 'advertiser' roles are migrated to 'merchant'
-- - All other roles remain untouched
-- - Constraint now enforces: user, agent, merchant, admin
-- - Trigger prevents future insertion of invalid roles including 'advertiser'
-- - New signups will work for all valid role types
-- ============================================================================
