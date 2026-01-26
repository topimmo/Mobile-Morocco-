-- Fix Role-Based Authentication Issues
-- This migration addresses schema conflicts and ensures all users have proper roles

-- Step 1: Ensure role column has default value
ALTER TABLE profiles 
  ALTER COLUMN role SET DEFAULT 'user';

-- Step 2: Backfill any NULL roles for existing users (must be done before adding NOT NULL constraint)
UPDATE profiles 
SET role = 'user' 
WHERE role IS NULL;

-- Step 3: Add NOT NULL constraint (after backfilling NULL values)
ALTER TABLE profiles 
  ALTER COLUMN role SET NOT NULL;

-- Step 4: Ensure role has correct constraint
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'agent', 'merchant', 'admin'));

-- Step 5: Update the trigger function to ensure role is always set
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

-- Step 6: Ensure RLS policies are correctly configured
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated users to read own profile" ON profiles;

-- Policy: Users can SELECT their own profile (primary read access)
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Users can update their own profile, but NOT the role field
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Policy: Admins can update all profiles including roles
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Allow service role and trigger to insert profiles
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT
  WITH CHECK (true);

-- Step 7: Create index on role for better query performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Step 8: Add helpful comments for documentation
COMMENT ON COLUMN profiles.role IS 'User role: user (default/private seller), agent (technician/craftsman), merchant (store/importer), admin';
COMMENT ON CONSTRAINT profiles_role_check ON profiles IS 'Ensures role is one of: user, agent, merchant, admin';
