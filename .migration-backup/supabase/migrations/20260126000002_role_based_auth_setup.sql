-- Role-Based Authentication Setup
-- This migration sets up the profiles table with proper role management and RLS policies

-- Update profiles table role constraint to match requirements
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('user', 'agent', 'merchant', 'admin'));

-- Set default role to 'user' 
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

-- Policy: Users can SELECT only their own profile
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
    AND (role = (SELECT role FROM profiles WHERE id = auth.uid()))
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

-- Policy: Allow service role to insert profiles (for trigger)
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT
  WITH CHECK (true);

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from user metadata, default to 'user'
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'user');
  
  -- Ensure role is valid
  IF user_role NOT IN ('user', 'agent', 'merchant', 'admin') THEN
    user_role := 'user';
  END IF;

  -- Create profile with role from metadata
  INSERT INTO public.profiles (id, email, role, full_name, phone, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    user_role,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    NOW(),
    NOW()
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger to auto-create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create index on role for better query performance
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Add comment for documentation
COMMENT ON COLUMN profiles.role IS 'User role: user (private seller), agent (technician/craftsman), merchant (store/importer), admin';
COMMENT ON FUNCTION public.handle_new_user() IS 'Automatically creates a profile when a new user signs up, extracting role from user metadata';
