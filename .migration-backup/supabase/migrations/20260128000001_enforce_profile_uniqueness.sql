-- ============================================
-- MIGRATION: Add Unique Constraint on profiles.id
-- ============================================
-- This migration ensures that each user can only have ONE profile
-- 
-- PREREQUISITES:
-- - Run cleanup_duplicate_profiles.sql FIRST to remove any existing duplicates
-- 
-- CHANGES:
-- 1. Verify no duplicate profiles exist (safety check)
-- 2. Add UNIQUE constraint on profiles.id (if not already exists)
-- 3. Update database trigger to handle edge cases with ON CONFLICT
-- 4. Add index for better query performance (if needed)
-- ============================================

BEGIN;

-- ============================================
-- STEP 1: Safety Check - Verify No Duplicates
-- ============================================

DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  -- Count users with multiple profiles
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT id
    FROM profiles
    GROUP BY id
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF duplicate_count > 0 THEN
    RAISE EXCEPTION 
      'Cannot add UNIQUE constraint: % user(s) have duplicate profiles. Run cleanup_duplicate_profiles.sql first.',
      duplicate_count;
  END IF;
  
  RAISE NOTICE 'Safety check passed: No duplicate profiles found';
END $$;

-- ============================================
-- STEP 2: Verify Primary Key Exists
-- ============================================

-- The profiles.id column should already be a PRIMARY KEY
-- which implicitly enforces uniqueness
-- This step verifies that the constraint exists

DO $$
BEGIN
  -- Check if profiles.id is the primary key
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu 
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'profiles'
    AND tc.constraint_type = 'PRIMARY KEY'
    AND kcu.column_name = 'id'
  ) THEN
    RAISE EXCEPTION 'profiles.id is not a PRIMARY KEY! Database schema may be corrupted.';
  END IF;
  
  RAISE NOTICE 'Verified: profiles.id has PRIMARY KEY constraint';
END $$;

-- ============================================
-- STEP 3: Add Foreign Key Constraint (if missing)
-- ============================================

-- Ensure profiles.id references auth.users(id) with CASCADE delete
-- This prevents orphaned profiles when users are deleted
DO $$
BEGIN
  -- Check if FK constraint exists
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    WHERE tc.table_name = 'profiles'
    AND tc.constraint_type = 'FOREIGN KEY'
    AND tc.constraint_name LIKE '%auth_users%'
  ) THEN
    -- Add FK constraint
    ALTER TABLE profiles
      ADD CONSTRAINT profiles_id_fkey 
      FOREIGN KEY (id) 
      REFERENCES auth.users(id) 
      ON DELETE CASCADE;
    
    RAISE NOTICE 'Added foreign key constraint: profiles.id -> auth.users.id';
  ELSE
    RAISE NOTICE 'Foreign key constraint already exists';
  END IF;
END $$;

-- ============================================
-- STEP 4: Update Trigger for Idempotency
-- ============================================

-- Recreate the trigger function with ON CONFLICT handling
-- This ensures that even if the trigger fires multiple times,
-- it won't create duplicate profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  user_full_name TEXT;
  user_phone TEXT;
  user_city TEXT;
BEGIN
  -- Get role from user metadata, default to 'user'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  
  -- Ensure role is valid
  IF user_role NOT IN ('user', 'agent', 'merchant', 'admin') THEN
    user_role := 'user';
  END IF;

  -- Get other metadata
  user_full_name := NEW.raw_user_meta_data->>'full_name';
  user_phone := NEW.raw_user_meta_data->>'phone';
  user_city := NEW.raw_user_meta_data->>'city';

  -- Log the profile creation attempt
  RAISE LOG 'handle_new_user: Creating/updating profile for user %: role=%, email=%', 
    NEW.id, user_role, NEW.email;

  -- Create or update profile with role from metadata
  -- ON CONFLICT ensures idempotency - if profile exists, update it
  INSERT INTO public.profiles (
    id, 
    email, 
    role, 
    full_name, 
    phone, 
    city,
    created_at, 
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_role,
    user_full_name,
    user_phone,
    user_city,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    -- Only update role if it's not already set or if the new role is more specific
    role = CASE 
      WHEN profiles.role IS NULL OR profiles.role = 'user' THEN EXCLUDED.role
      ELSE profiles.role
    END,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    city = COALESCE(EXCLUDED.city, profiles.city),
    updated_at = NOW();

  RAISE LOG 'handle_new_user: Profile created/updated successfully for user %', NEW.id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'handle_new_user: Error for user %: % (SQLSTATE: %)', 
      NEW.id, SQLERRM, SQLSTATE;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger (drop first if exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 5: Add Helpful Indexes
-- ============================================

-- Index on email for lookups (if not exists)
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- Index on role for filtering (if not exists)
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Index on updated_at for sorting (useful for duplicate detection)
CREATE INDEX IF NOT EXISTS profiles_updated_at_idx ON profiles(updated_at DESC);

-- ============================================
-- STEP 6: Add Comments
-- ============================================

COMMENT ON TABLE profiles IS 
  'User profiles with role-based access control. Each user (auth.users.id) has exactly ONE profile (enforced by PRIMARY KEY). Automatically created via trigger.';

COMMENT ON COLUMN profiles.id IS 
  'Primary key and foreign key to auth.users(id). Each user has exactly one profile.';

COMMENT ON COLUMN profiles.role IS 
  'User role: user (private seller), agent (technician/craftsman), merchant (store/importer), admin. Set during signup from user metadata.';

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Trigger function that creates/updates profile when user signs up. Uses ON CONFLICT to ensure idempotency and prevent duplicates.';

-- ============================================
-- STEP 7: Final Verification
-- ============================================

DO $$
DECLARE
  total_users INTEGER;
  total_profiles INTEGER;
  duplicate_profiles INTEGER;
BEGIN
  -- Count users and profiles
  SELECT COUNT(*) INTO total_users FROM auth.users;
  SELECT COUNT(*) INTO total_profiles FROM profiles;
  
  -- Check for any remaining duplicates
  SELECT COUNT(*) INTO duplicate_profiles
  FROM (
    SELECT id
    FROM profiles
    GROUP BY id
    HAVING COUNT(*) > 1
  ) duplicates;
  
  RAISE NOTICE 'Migration complete:';
  RAISE NOTICE '  - Total auth users: %', total_users;
  RAISE NOTICE '  - Total profiles: %', total_profiles;
  RAISE NOTICE '  - Duplicate profiles: %', duplicate_profiles;
  
  IF duplicate_profiles > 0 THEN
    RAISE WARNING 'WARNING: Duplicate profiles still exist! Run cleanup script.';
  ELSIF total_profiles > total_users THEN
    RAISE WARNING 'WARNING: More profiles than users (orphaned profiles may exist)';
  ELSE
    RAISE NOTICE 'SUCCESS: Profile uniqueness verified';
  END IF;
END $$;

COMMIT;

-- ============================================
-- POST-MIGRATION NOTES
-- ============================================
-- After running this migration:
-- 1. Monitor application logs for "DUPLICATE PROFILES" warnings
-- 2. If duplicates appear, investigate the cause (race conditions, manual inserts, etc.)
-- 3. Ensure all profile creation code uses INSERT ... ON CONFLICT or upsert patterns
-- 4. Test the signup flow to verify trigger works correctly
