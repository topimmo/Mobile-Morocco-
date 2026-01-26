-- ============================================================================
-- HOTFIX: Fix profiles role constraint to match application roles
-- ============================================================================
-- This hotfix resolves "Database error saving new user" by aligning the
-- database constraint with application roles (user, agent, merchant, admin)
-- 
-- Previous constraint only allowed: 'user', 'advertiser', 'admin'
-- Application uses: 'user', 'agent', 'merchant', 'admin'
-- ============================================================================

-- Step 1: Drop the incorrect constraint
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Step 2: Add the correct constraint matching application roles
ALTER TABLE profiles 
  ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'agent', 'merchant', 'admin'));

-- Step 3: Ensure default role is 'user'
ALTER TABLE profiles 
  ALTER COLUMN role SET DEFAULT 'user';

-- Step 4: Verify the trigger function is correct (idempotent - safe to re-run)
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

-- Step 5: Verify the trigger exists (create if missing)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Add documentation comments
COMMENT ON CONSTRAINT profiles_role_check ON profiles IS 
  'Ensures role matches application values: user (private seller), agent (technician), merchant (store owner), admin';

COMMENT ON FUNCTION public.handle_new_user() IS 
  'Auto-creates profile on signup. Guarantees role is never NULL. Validates role against constraint. Handles conflicts gracefully.';

-- ============================================================================
-- VALIDATION QUERY (run after applying this hotfix)
-- ============================================================================
-- Run this to verify the constraint is correct:
-- SELECT conname, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conname = 'profiles_role_check';
--
-- Expected output should show: CHECK (role IN ('user', 'agent', 'merchant', 'admin'))
-- ============================================================================
