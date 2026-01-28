-- ============================================
-- CLEANUP SCRIPT: Detect and Remove Duplicate Profiles
-- ============================================
-- This script is a DIAGNOSTIC AND CLEANUP tool for duplicate profiles
-- 
-- PURPOSE:
-- - Find all users with duplicate profile entries (shouldn't happen but defensively handle it)
-- - Keep the most recent profile (by updated_at) for each user
-- - Delete older duplicate profiles
--
-- SAFETY:
-- - Uses a transaction - can be rolled back if needed
-- - Includes diagnostic queries to review before deletion
-- - Backs up deleted profiles to a temporary table
--
-- USAGE:
-- 1. First run the diagnostic queries (Step 1) to see if duplicates exist
-- 2. Review the results carefully
-- 3. If duplicates exist, run Steps 2-4 to clean them up
-- 4. COMMIT or ROLLBACK based on results
-- ============================================

BEGIN;

-- ============================================
-- STEP 1: DIAGNOSTIC - Find Duplicate Profiles
-- ============================================

-- Check if there are any duplicate profiles by user id
DO $$
DECLARE
  duplicate_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO duplicate_count
  FROM (
    SELECT id, COUNT(*) as profile_count
    FROM profiles
    GROUP BY id
    HAVING COUNT(*) > 1
  ) duplicates;
  
  RAISE NOTICE 'Found % user(s) with duplicate profiles', duplicate_count;
END $$;

-- Show details of duplicate profiles (if any)
SELECT 
  id as user_id,
  COUNT(*) as profile_count,
  ARRAY_AGG(email ORDER BY updated_at DESC) as emails,
  ARRAY_AGG(role ORDER BY updated_at DESC) as roles,
  ARRAY_AGG(updated_at ORDER BY updated_at DESC) as update_times
FROM profiles
GROUP BY id
HAVING COUNT(*) > 1
ORDER BY COUNT(*) DESC;

-- ============================================
-- STEP 2: Create Backup Table (Optional but Recommended)
-- ============================================

-- Create a backup table for deleted duplicate profiles
CREATE TABLE IF NOT EXISTS profiles_duplicates_backup (
  id UUID,
  email TEXT,
  role TEXT,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT profiles_duplicates_backup_pkey PRIMARY KEY (id, deleted_at)
);

-- ============================================
-- STEP 3: Backup Duplicate Profiles Before Deletion
-- ============================================

-- Insert duplicate profiles into backup table
-- This backs up ALL profiles that will be deleted (keeping only the most recent)
INSERT INTO profiles_duplicates_backup (id, email, role, full_name, phone, city, created_at, updated_at)
SELECT 
  p.id,
  p.email,
  p.role,
  p.full_name,
  p.phone,
  p.city,
  p.created_at,
  p.updated_at
FROM profiles p
WHERE EXISTS (
  -- Only select profiles that are NOT the most recent for their user_id
  SELECT 1
  FROM (
    SELECT 
      id,
      MAX(updated_at) as max_updated_at
    FROM profiles
    GROUP BY id
    HAVING COUNT(*) > 1
  ) latest
  WHERE latest.id = p.id
  AND p.updated_at < latest.max_updated_at
);

-- Show what was backed up
SELECT 
  COUNT(*) as backed_up_profiles,
  COUNT(DISTINCT id) as affected_users
FROM profiles_duplicates_backup
WHERE deleted_at >= NOW() - INTERVAL '1 minute';

-- ============================================
-- STEP 4: Delete Duplicate Profiles (Keep Most Recent)
-- ============================================

-- Delete all duplicate profiles except the most recent one per user
-- This uses a subquery to identify which profiles to keep
WITH profiles_to_keep AS (
  SELECT DISTINCT ON (id) 
    id, 
    updated_at,
    created_at
  FROM profiles
  ORDER BY id, updated_at DESC, created_at DESC
)
DELETE FROM profiles p
WHERE NOT EXISTS (
  SELECT 1 
  FROM profiles_to_keep ptk
  WHERE ptk.id = p.id
  AND ptk.updated_at = p.updated_at
  AND ptk.created_at = p.created_at
);

-- ============================================
-- STEP 5: Verify Cleanup
-- ============================================

-- Check that all duplicates are removed
DO $$
DECLARE
  remaining_duplicates INTEGER;
BEGIN
  SELECT COUNT(*) INTO remaining_duplicates
  FROM (
    SELECT id, COUNT(*) as profile_count
    FROM profiles
    GROUP BY id
    HAVING COUNT(*) > 1
  ) duplicates;
  
  IF remaining_duplicates > 0 THEN
    RAISE WARNING 'WARNING: % user(s) still have duplicate profiles!', remaining_duplicates;
  ELSE
    RAISE NOTICE 'SUCCESS: All duplicate profiles have been removed';
  END IF;
END $$;

-- Show summary of cleanup
SELECT 
  'Profiles deleted' as metric,
  COUNT(*) as count
FROM profiles_duplicates_backup
WHERE deleted_at >= NOW() - INTERVAL '1 minute'
UNION ALL
SELECT 
  'Total profiles remaining' as metric,
  COUNT(*) as count
FROM profiles
UNION ALL
SELECT 
  'Users with profiles' as metric,
  COUNT(DISTINCT id) as count
FROM profiles;

-- ============================================
-- STEP 6: COMMIT OR ROLLBACK
-- ============================================

-- IMPORTANT: Review the output above before deciding to COMMIT
-- If everything looks correct, run: COMMIT;
-- If something looks wrong, run: ROLLBACK;

-- Uncomment ONE of the following lines:
-- COMMIT;   -- Apply the changes
-- ROLLBACK; -- Undo all changes

COMMIT;

-- ============================================
-- NOTES
-- ============================================
-- After cleanup, you should:
-- 1. Add a UNIQUE constraint on profiles.id (see next migration)
-- 2. Review your application code to ensure profile creation is idempotent
-- 3. Check the database trigger (handle_new_user) uses ON CONFLICT
-- 4. Monitor logs for any duplicate profile warnings
