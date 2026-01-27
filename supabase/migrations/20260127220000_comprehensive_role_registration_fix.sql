-- Comprehensive Role Registration Fix
-- This migration ensures all three roles (user, agent, merchant) can register successfully
-- 
-- Root Cause: Registration failures for agent/merchant roles were likely due to:
-- 1. Missing or misconfigured RLS policies
-- 2. Database trigger failures
-- 3. Column mismatches or constraints
--
-- This migration is idempotent and can be run multiple times safely.

-- ============================================
-- PART 1: Ensure profiles table has correct schema
-- ============================================

-- Ensure all required columns exist with correct types
DO $$ 
BEGIN
  -- id column (UUID, primary key, references auth.users)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'id'
  ) THEN
    RAISE EXCEPTION 'profiles table is missing id column - table may not exist!';
  END IF;

  -- email column (TEXT, NOT NULL)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles ADD COLUMN email TEXT;
  END IF;
  
  -- Make email NOT NULL
  UPDATE profiles SET email = COALESCE(email, 'noemail+' || id::text || '@system.local') WHERE email IS NULL;
  ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;

  -- role column (TEXT, NOT NULL, with constraint)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
  
  -- Update NULL roles to 'user'
  UPDATE profiles SET role = 'user' WHERE role IS NULL;
  
  -- Add or replace constraint
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
  ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('user', 'agent', 'merchant', 'admin'));
  ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';
  ALTER TABLE profiles ALTER COLUMN role SET NOT NULL;

  -- full_name column (TEXT, nullable)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
  END IF;

  -- phone column (TEXT, nullable)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
  END IF;

  -- city column (TEXT, nullable)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE profiles ADD COLUMN city TEXT;
  END IF;

  -- created_at column (TIMESTAMPTZ, NOT NULL with default)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
  END IF;

  -- updated_at column (TIMESTAMPTZ, NOT NULL with default)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL;
  END IF;
END $$;

-- ============================================
-- PART 2: Create/Update Trigger Function
-- ============================================

-- Drop and recreate the trigger function with comprehensive error handling
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
  -- Extract metadata with safe defaults
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  user_full_name := NEW.raw_user_meta_data->>'full_name';
  user_phone := NEW.raw_user_meta_data->>'phone';
  user_city := NEW.raw_user_meta_data->>'city';
  
  -- Validate and sanitize role
  IF user_role NOT IN ('user', 'agent', 'merchant', 'admin') THEN
    RAISE WARNING 'Invalid role % provided for user %, defaulting to user', user_role, NEW.id;
    user_role := 'user';
  END IF;

  -- Log profile creation attempt (visible in Supabase logs)
  RAISE LOG 'Creating profile for user % (email: %, role: %)', 
    NEW.id, NEW.email, user_role;

  -- Insert profile with ON CONFLICT to handle edge cases
  BEGIN
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
      COALESCE(NEW.email, 'noemail+' || NEW.id::text || '@system.local'),
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
      role = EXCLUDED.role,
      full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
      phone = COALESCE(EXCLUDED.phone, profiles.phone),
      city = COALESCE(EXCLUDED.city, profiles.city),
      updated_at = NOW();
    
    RAISE LOG 'Profile created successfully for user % with role %', NEW.id, user_role;
    
  EXCEPTION
    WHEN unique_violation THEN
      -- Should not happen with ON CONFLICT, but handle gracefully
      RAISE WARNING 'Profile already exists for user %, skipping creation', NEW.id;
    WHEN foreign_key_violation THEN
      RAISE WARNING 'Foreign key violation for user %: %', NEW.id, SQLERRM;
    WHEN check_violation THEN
      RAISE WARNING 'Check constraint violation for user %: %', NEW.id, SQLERRM;
    WHEN not_null_violation THEN
      RAISE WARNING 'NOT NULL violation for user %: %', NEW.id, SQLERRM;
    WHEN OTHERS THEN
      -- Log detailed error but don't fail user creation
      RAISE WARNING 'Failed to create profile for user %: % (SQLSTATE: %)', 
        NEW.id, SQLERRM, SQLSTATE;
  END;

  -- Always return NEW to allow user authentication to succeed
  -- Even if profile creation failed, user can still authenticate
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PART 3: Configure RLS Policies
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to start fresh
DO $$ 
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
  END LOOP;
END $$;

-- Create comprehensive, non-conflicting policies

-- SELECT: Users can view their own profile
CREATE POLICY "profiles_select_own" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- SELECT: Admins can view all profiles
CREATE POLICY "profiles_select_admin" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- INSERT: Authenticated users can insert their own profile
-- This is critical - it allows profile creation as a backup if trigger fails
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own profile (but not role or id)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- UPDATE: Admins can update any profile
CREATE POLICY "profiles_update_admin" ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- PART 4: Grant Permissions
-- ============================================

-- Ensure authenticated users have necessary permissions
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- ============================================
-- PART 5: Create Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- ============================================
-- PART 6: Add Documentation
-- ============================================

COMMENT ON TABLE profiles IS 'User profiles with role-based access. Auto-created via trigger on auth.users insert.';
COMMENT ON COLUMN profiles.role IS 'User role: user (private seller), agent (technician/craftsman), merchant (store/importer), admin';
COMMENT ON COLUMN profiles.full_name IS 'User full name from registration metadata';
COMMENT ON COLUMN profiles.phone IS 'User phone number (optional)';
COMMENT ON COLUMN profiles.city IS 'User city location (optional)';
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile when a new user signs up. Extracts role and metadata from raw_user_meta_data. Uses ON CONFLICT for idempotency. Never fails user creation even if profile insert fails.';

-- ============================================
-- PART 7: Verification Queries
-- ============================================

-- Log migration completion and current state
DO $$
DECLARE
  policy_count INTEGER;
  trigger_exists BOOLEAN;
BEGIN
  -- Count policies
  SELECT COUNT(*) INTO policy_count 
  FROM pg_policies 
  WHERE tablename = 'profiles';
  
  -- Check trigger
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) INTO trigger_exists;
  
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE '==============================================';
  RAISE NOTICE 'Profiles table RLS: ENABLED';
  RAISE NOTICE 'Number of policies: %', policy_count;
  RAISE NOTICE 'Trigger exists: %', trigger_exists;
  RAISE NOTICE 'Supported roles: user, agent, merchant, admin';
  RAISE NOTICE '==============================================';
END $$;
