# User Registration Fix - Deployment Instructions

## Problem Summary

User registration was failing with the error message "Impossible de terminer l'enregistrement" (Unable to complete registration). This was caused by a database schema mismatch between the database trigger and the actual profiles table structure.

## Root Cause

The `handle_new_user()` database trigger function expected columns named:
- `role`
- `full_name`
- `phone`
- `city`

But the profiles table had different column names from earlier migrations:
- `userType` (instead of `role`)
- `firstName` and `lastName` (instead of `full_name`)
- `phoneNumber` (instead of `phone`)
- Missing `city` column

This mismatch caused the INSERT operation in the trigger to fail, preventing user accounts from being created.

## Solution

A new database migration has been created that:

1. **Adds missing columns** if they don't exist: `role`, `full_name`, `phone`, `city`
2. **Migrates existing data** from old columns to new ones
3. **Updates the trigger function** with better error handling
4. **Recreates RLS policies** for consistency
5. **Adds proper constraints and indexes**

## Deployment Steps

### For Supabase Hosted Database

You need to apply the migration to your Supabase instance:

#### Option 1: Using Supabase CLI (Recommended)

```bash
# Make sure you're logged in to Supabase CLI
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply the new migration
supabase db push
```

#### Option 2: Manual SQL Execution

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `supabase/migrations/20260127000002_fix_registration_column_mapping.sql`
4. Paste it into the SQL Editor
5. Click "Run" to execute the migration

### Verification

After applying the migration, verify that registration works:

1. Go to your application's registration page
2. Try to create a new account
3. The registration should now complete successfully
4. Check the Supabase Dashboard > Authentication > Users to verify the user was created
5. Check the Supabase Dashboard > Table Editor > profiles to verify the profile was created with the correct columns

## Migration File

The migration file is located at:
```
supabase/migrations/20260127000002_fix_registration_column_mapping.sql
```

## What Changed

### Database Schema

- Added columns: `role`, `full_name`, `phone`, `city`, `created_at`, `updated_at`
- Migrated data from old columns to new ones
- Added constraint on `role` column: CHECK (role IN ('user', 'agent', 'merchant', 'admin'))
- Made `email` column NOT NULL

### Trigger Function

Updated `handle_new_user()` to:
- Use correct column names
- Include better error logging
- Handle errors gracefully without failing user creation
- Use ON CONFLICT for idempotency

### RLS Policies

Cleaned up and recreated all RLS policies with clear naming:
- `profiles_select_own` - Users can view their own profile
- `profiles_select_admin` - Admins can view all profiles
- `profiles_insert_own` - Users can insert their own profile
- `profiles_update_own` - Users can update their own profile (but not role)
- `profiles_update_admin` - Admins can update any profile

## Rollback Plan

If you need to rollback this migration:

1. The migration is designed to be non-destructive - it adds columns but doesn't remove old ones
2. Old columns like `userType`, `firstName`, `lastName`, `phoneNumber` are preserved
3. You can manually drop the new columns if needed, but this is not recommended as it may break the application

## Testing Checklist

After deployment, test the following:

- [ ] New user registration completes successfully
- [ ] User profile is created with correct role
- [ ] User can log in after registration
- [ ] User profile data (name, phone, city) is saved correctly
- [ ] Error messages are displayed correctly in both French and Arabic
- [ ] Existing users can still log in
- [ ] Existing user profiles are not affected

## Support

If you encounter any issues during deployment:

1. Check the Supabase logs for detailed error messages
2. Verify that all migrations have been applied in order
3. Ensure your Supabase project is on a recent version
4. Contact support with the specific error message and stack trace

## Additional Notes

- This migration is idempotent - it can be run multiple times safely
- The migration checks for column existence before adding them
- Data migration from old columns to new ones happens automatically
- The trigger function now has better error handling and logging
