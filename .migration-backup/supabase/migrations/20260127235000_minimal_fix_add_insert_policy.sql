-- MINIMAL FIX: Add INSERT Policy for Authenticated Users
-- 
-- ROOT CAUSE: Registration fails for agent/merchant roles because there is no
-- RLS INSERT policy allowing authenticated users to create their own profile.
-- The trigger has SECURITY DEFINER so it should bypass RLS, but if the trigger
-- fails for any reason, users need a fallback INSERT policy.
--
-- This migration ONLY adds the missing INSERT policy. No other changes.

-- Check if the policy already exists
DO $$
BEGIN
  -- Only create the policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND policyname = 'users_insert_own_profile'
  ) THEN
    
    RAISE NOTICE 'Creating users_insert_own_profile policy...';
    
    -- Allow authenticated users to insert their own profile
    -- This serves as a fallback if the trigger fails
    CREATE POLICY "users_insert_own_profile" ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
      
    RAISE NOTICE '✓ Policy created successfully';
    
  ELSE
    RAISE NOTICE 'Policy users_insert_own_profile already exists, skipping...';
  END IF;
END $$;

-- Verify the fix
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'VERIFICATION:';
  RAISE NOTICE '========================================';
  
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND cmd = 'INSERT'
    AND policyname = 'users_insert_own_profile'
  ) THEN
    RAISE NOTICE '✓ INSERT policy for authenticated users exists';
    RAISE NOTICE '  Agent and merchant registration should now work';
  ELSE
    RAISE NOTICE '⚠️  INSERT policy still missing!';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Test registration with role=agent';
  RAISE NOTICE '2. Test registration with role=merchant';
  RAISE NOTICE '3. Test registration with role=user (should still work)';
  RAISE NOTICE '4. Check Supabase logs if issues persist';
END $$;
