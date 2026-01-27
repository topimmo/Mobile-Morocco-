-- Fix Registration Column Mapping
-- This migration resolves the registration failure by ensuring column consistency

-- ============================================
-- 1. Ensure all required columns exist
-- ============================================

-- Add role column if missing (maps to userType conceptually)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role TEXT DEFAULT 'user';
    
    -- Copy data from userType if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'userType'
    ) THEN
      -- Map userType values to role values
      UPDATE profiles SET role = CASE
        WHEN "userType" = 'Customer' THEN 'user'
        WHEN "userType" = 'Importer' THEN 'merchant'
        WHEN "userType" = 'Technician' THEN 'agent'
        ELSE 'user'
      END WHERE role IS NULL OR role = 'user';
    END IF;
  END IF;
END $$;

-- Add full_name if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN full_name TEXT;
    
    -- Try to construct from firstName and lastName if they exist
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'firstName'
    ) AND EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'lastName'
    ) THEN
      UPDATE profiles 
      SET full_name = TRIM(COALESCE("firstName", '') || ' ' || COALESCE("lastName", ''))
      WHERE full_name IS NULL AND ("firstName" IS NOT NULL OR "lastName" IS NOT NULL);
    END IF;
  END IF;
END $$;

-- Add phone if missing (may exist as phoneNumber)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE profiles ADD COLUMN phone TEXT;
    
    -- Copy from phoneNumber if it exists
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'phoneNumber'
    ) THEN
      UPDATE profiles SET phone = "phoneNumber" WHERE phone IS NULL;
    END IF;
  END IF;
END $$;

-- Add city if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'city'
  ) THEN
    ALTER TABLE profiles ADD COLUMN city TEXT;
  END IF;
END $$;

-- Add created_at if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'created_at'
  ) THEN
    -- Check for createdAt (camelCase version)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'createdAt'
    ) THEN
      ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE;
      UPDATE profiles SET created_at = "createdAt" WHERE created_at IS NULL;
    ELSE
      ALTER TABLE profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
  END IF;
END $$;

-- Add updated_at if missing
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'updated_at'
  ) THEN
    -- Check for updatedAt (camelCase version)
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' AND column_name = 'updatedAt'
    ) THEN
      ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE;
      UPDATE profiles SET updated_at = "updatedAt" WHERE updated_at IS NULL;
    ELSE
      ALTER TABLE profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;
  END IF;
END $$;

-- ============================================
-- 2. Add role constraint
-- ============================================

ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'agent', 'merchant', 'admin'));

-- Set default
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';

-- Update any NULL roles to 'user'
UPDATE profiles SET role = 'user' WHERE role IS NULL;

-- ============================================
-- 3. Make email NOT NULL (important for trigger)
-- ============================================

DO $$ 
BEGIN
  -- First ensure email column exists
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'email'
  ) THEN
    -- Update any NULL emails before adding constraint
    UPDATE profiles SET email = id::text || '@placeholder.local' WHERE email IS NULL;
    
    -- Check if already NOT NULL
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'profiles' 
      AND column_name = 'email'
      AND is_nullable = 'YES'
    ) THEN
      ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;
    END IF;
  ELSE
    -- Add email column if it doesn't exist
    ALTER TABLE profiles ADD COLUMN email TEXT NOT NULL DEFAULT '';
  END IF;
END $$;

-- ============================================
-- 4. Drop and Recreate Trigger Function with Better Error Handling
-- ============================================

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
  insert_successful BOOLEAN := FALSE;
BEGIN
  -- Extract metadata with defaults
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  user_full_name := NEW.raw_user_meta_data->>'full_name';
  user_phone := NEW.raw_user_meta_data->>'phone';
  user_city := NEW.raw_user_meta_data->>'city';
  
  -- Validate role
  IF user_role NOT IN ('user', 'agent', 'merchant', 'admin') THEN
    user_role := 'user';
  END IF;

  -- Log attempt
  RAISE LOG 'Attempting to create profile for user % with role % and email %', 
    NEW.id, user_role, NEW.email;

  -- Try to insert profile
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
      COALESCE(NEW.email, NEW.id::text || '@placeholder.local'),
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
    
    insert_successful := TRUE;
    RAISE LOG 'Profile created successfully for user %', NEW.id;
    
  EXCEPTION
    WHEN OTHERS THEN
      -- Log detailed error but don't fail user creation
      RAISE WARNING 'Failed to create profile for user %: % (SQLSTATE: %)', 
        NEW.id, SQLERRM, SQLSTATE;
      RAISE WARNING 'Error detail: %', SQLSTATE;
  END;

  -- Always return NEW to allow user creation to succeed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. Ensure Trigger Exists
-- ============================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 6. Update RLS Policies for Compatibility
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;
DROP POLICY IF EXISTS "users_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "admins_select_all_profiles" ON profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "admins_update_all_profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "System can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;

-- Create clean, comprehensive policies

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
-- This is needed as a backup if trigger fails
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own profile (but not role)
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND (
      role IS NULL OR 
      role = (SELECT role FROM profiles WHERE id = auth.uid())
    )
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
-- 7. Grant Permissions
-- ============================================

GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;
GRANT ALL ON profiles TO service_role;

-- ============================================
-- 8. Create Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

-- ============================================
-- 9. Add Documentation
-- ============================================

COMMENT ON TABLE profiles IS 'User profiles with role-based access. Auto-created via trigger on auth.users insert.';
COMMENT ON COLUMN profiles.role IS 'User role: user (individual seller), agent (technician), merchant (shop/importer), admin';
COMMENT ON COLUMN profiles.full_name IS 'User full name from registration';
COMMENT ON COLUMN profiles.phone IS 'User phone number';
COMMENT ON COLUMN profiles.city IS 'User city location';
