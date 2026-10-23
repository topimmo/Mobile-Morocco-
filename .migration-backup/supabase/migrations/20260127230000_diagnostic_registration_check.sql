-- DIAGNOSTIC MIGRATION - Identify Root Cause of Registration Failures
-- Run this to identify why agent/merchant registration fails
-- This migration DOES NOT fix anything, only diagnoses

DO $$
DECLARE
  column_record RECORD;
  constraint_record RECORD;
  policy_record RECORD;
  trigger_exists BOOLEAN;
  function_body TEXT;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'DIAGNOSTIC: Registration Failure Analysis';
  RAISE NOTICE '========================================';
  
  -- 1. Check profiles table columns
  RAISE NOTICE '';
  RAISE NOTICE '1. PROFILES TABLE COLUMNS:';
  FOR column_record IN 
    SELECT column_name, data_type, is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'profiles'
    ORDER BY ordinal_position
  LOOP
    RAISE NOTICE '  - % (%): nullable=%, default=%', 
      column_record.column_name, 
      column_record.data_type,
      column_record.is_nullable,
      column_record.column_default;
  END LOOP;
  
  -- 2. Check role constraint
  RAISE NOTICE '';
  RAISE NOTICE '2. ROLE CONSTRAINT:';
  SELECT consrc INTO constraint_record
  FROM pg_constraint
  WHERE conname = 'profiles_role_check'
  LIMIT 1;
  
  IF FOUND THEN
    RAISE NOTICE '  profiles_role_check exists';
    RAISE NOTICE '  Definition: %', constraint_record.consrc;
  ELSE
    RAISE NOTICE '  ⚠️  profiles_role_check NOT FOUND!';
  END IF;
  
  -- 3. Check RLS policies
  RAISE NOTICE '';
  RAISE NOTICE '3. RLS POLICIES ON profiles:';
  FOR policy_record IN 
    SELECT policyname, cmd, qual, with_check
    FROM pg_policies
    WHERE tablename = 'profiles'
    ORDER BY policyname
  LOOP
    RAISE NOTICE '  - % (%) - USING: %, WITH CHECK: %', 
      policy_record.policyname,
      policy_record.cmd,
      LEFT(policy_record.qual::TEXT, 50),
      LEFT(policy_record.with_check::TEXT, 50);
  END LOOP;
  
  -- 4. Check if INSERT policy exists for authenticated users
  RAISE NOTICE '';
  RAISE NOTICE '4. INSERT POLICIES CHECK:';
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND cmd = 'INSERT'
    AND (
      policyname LIKE '%insert%' 
      OR policyname LIKE '%Service role%'
    )
  ) THEN
    RAISE NOTICE '  ✓ INSERT policy found';
  ELSE
    RAISE NOTICE '  ⚠️  NO INSERT POLICY FOUND for authenticated users!';
    RAISE NOTICE '  This could cause registration to fail!';
  END IF;
  
  -- 5. Check trigger
  RAISE NOTICE '';
  RAISE NOTICE '5. TRIGGER CHECK:';
  SELECT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) INTO trigger_exists;
  
  IF trigger_exists THEN
    RAISE NOTICE '  ✓ Trigger on_auth_user_created exists';
  ELSE
    RAISE NOTICE '  ⚠️  Trigger on_auth_user_created NOT FOUND!';
  END IF;
  
  -- 6. Check function definition
  RAISE NOTICE '';
  RAISE NOTICE '6. TRIGGER FUNCTION:';
  SELECT pg_get_functiondef(oid) INTO function_body
  FROM pg_proc 
  WHERE proname = 'handle_new_user';
  
  IF FOUND THEN
    RAISE NOTICE '  ✓ Function handle_new_user exists';
    -- Check if function has SECURITY DEFINER
    IF function_body LIKE '%SECURITY DEFINER%' THEN
      RAISE NOTICE '  ✓ Function has SECURITY DEFINER';
    ELSE
      RAISE NOTICE '  ⚠️  Function does NOT have SECURITY DEFINER!';
    END IF;
    -- Check if function has exception handling
    IF function_body LIKE '%EXCEPTION%' THEN
      RAISE NOTICE '  ✓ Function has EXCEPTION handling';
    ELSE
      RAISE NOTICE '  ⚠️  Function does NOT have EXCEPTION handling';
    END IF;
    -- Check if function inserts city column
    IF function_body LIKE '%city%' THEN
      RAISE NOTICE '  ✓ Function references city column';
    ELSE
      RAISE NOTICE '  ⚠️  Function does NOT reference city column';
    END IF;
  ELSE
    RAISE NOTICE '  ⚠️  Function handle_new_user NOT FOUND!';
  END IF;
  
  -- 7. Final assessment
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'LIKELY ROOT CAUSES:';
  RAISE NOTICE '========================================';
  
  -- Check for missing columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'city'
  ) THEN
    RAISE NOTICE '⚠️  CRITICAL: city column missing but trigger might try to use it!';
  END IF;
  
  -- Check for missing INSERT policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' 
    AND cmd = 'INSERT'
    AND policyname LIKE '%user%'
  ) THEN
    RAISE NOTICE '⚠️  WARNING: No INSERT policy for authenticated users (only service role)';
    RAISE NOTICE '   If trigger fails, user cannot create profile manually';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE 'To reproduce the error:';
  RAISE NOTICE '1. Try registering with role=agent or role=merchant';
  RAISE NOTICE '2. Check Supabase logs for trigger errors';
  RAISE NOTICE '3. The error will show which constraint/column is failing';
  
END $$;
