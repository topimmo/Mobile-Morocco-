-- Fix Profile Creation and RLS Policies
-- This migration ensures profiles are created reliably with proper RLS policies

-- ============================================
-- 1. Ensure profiles table has required columns
-- ============================================

-- Add role column if it doesn't exist (with proper constraint)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- Add full_name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
  END IF;
END $$;

-- Add phone column if it doesn't exist (some migrations use 'phone', others 'phoneNumber')
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    -- Check if phoneNumber exists and copy data
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'phoneNumber'
    ) THEN
      ALTER TABLE profiles ADD COLUMN phone TEXT;
      UPDATE profiles SET phone = "phoneNumber" WHERE phone IS NULL;
    ELSE
      ALTER TABLE profiles ADD COLUMN phone TEXT;
    END IF;
  END IF;
END $$;

-- Add city column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE profiles ADD COLUMN city TEXT;
  END IF;
END $$;

-- Add created_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Add updated_at column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
  END IF;
END $$;

-- Ensure role constraint exists
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'agent', 'merchant', 'admin'));

-- Set default role to 'user' 
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';

-- Make email NOT NULL if it isn't already
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'email'
    AND is_nullable = 'YES'
  ) THEN
    -- First, update any NULL emails
    UPDATE profiles SET email = id::text || '@placeholder.local' WHERE email IS NULL;
    -- Then add the constraint
    ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;
  END IF;
END $$;

-- ============================================
-- 2. Enable RLS and Drop Old Policies
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- ============================================
-- 3. Create Comprehensive RLS Policies
-- ============================================

-- SELECT Policies
-- Policy: Users can SELECT only their own profile
CREATE POLICY "users_select_own_profile" ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy: Admins can SELECT all profiles
CREATE POLICY "admins_select_all_profiles" ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- INSERT Policies
-- Policy: Allow authenticated users to insert their own profile (backup if trigger fails)
CREATE POLICY "users_insert_own_profile" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE Policies
-- Policy: Users can UPDATE their own profile, but NOT the role or id fields
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND id = (SELECT id FROM profiles WHERE id = auth.uid())
    AND (
      role IS NULL OR 
      role = (SELECT role FROM profiles WHERE id = auth.uid())
    )
  );

-- Policy: Admins can UPDATE all profiles including roles
CREATE POLICY "admins_update_all_profiles" ON profiles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================
-- 4. Recreate or Update the Trigger Function
-- ============================================

-- Drop and recreate the trigger function with better error handling
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
  RAISE LOG 'Creating profile for user %: role=%, email=%', NEW.id, user_role, NEW.email;

  -- Create profile with role from metadata
  -- Use INSERT ... ON CONFLICT to handle cases where profile already exists
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
    role = EXCLUDED.role,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
    city = COALESCE(EXCLUDED.city, profiles.city),
    updated_at = NOW();

  RAISE LOG 'Profile created successfully for user %', NEW.id;

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 5. Create Helpful Indexes
-- ============================================

-- Index on role for better query performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Index on email for lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- ============================================
-- 6. Add Comments for Documentation
-- ============================================

COMMENT ON TABLE profiles IS 'User profiles with role-based access control. Automatically created via trigger when auth user is created.';
COMMENT ON COLUMN profiles.role IS 'User role: user (private seller), agent (technician/craftsman), merchant (store/importer), admin';
COMMENT ON COLUMN profiles.full_name IS 'Full name of the user from signup metadata';
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile when a new user signs up, extracting role and metadata from user metadata. Uses ON CONFLICT to handle edge cases.';

-- ============================================
-- 7. Grant Necessary Permissions
-- ============================================

-- Grant authenticated users permission to read and modify their own profiles
GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

-- Service role should have full access
GRANT ALL ON profiles TO service_role;
