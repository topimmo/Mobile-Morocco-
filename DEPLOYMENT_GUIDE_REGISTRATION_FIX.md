# Fix Registration for Technician/Craftsman and Store/Importer Roles

## Problem Summary

**Issue**: Registration fails for Technician/Craftsman (role: 'agent') and Store/Importer (role: 'merchant') with "Unable to complete registration" error, while Private Seller (role: 'user') registration works.

**Root Cause**: Database configuration issues including:
1. Potentially missing or misconfigured RLS (Row Level Security) policies
2. Database trigger (`handle_new_user()`) may fail for certain roles
3. Possible constraint violations or missing columns

## Solution Applied

### 1. Enhanced Error Logging (Code Changes)

**Files Modified**:
- `src/services/authService.ts` - Added comprehensive error logging in `signUpWithRole()`
- `src/pages/auth/RegisterPage.tsx` - Added dev-mode logging for registration flow

**Features**:
- 🔍 Logs full error details: message, status, code, hint, details
- 🎯 Dev-mode only detailed logging (not in production)
- ✅ Better user-friendly error messages
- 🔬 Captures role-specific information to diagnose failures

**Example Dev Logs**:
```
🔵 [DEV] Registration attempt: { role: 'agent', email: '...', fullName: '...' }
✅ [DEV] Registration successful with metadata: { userId: '...', role: 'agent' }
🔴 [DEV] Full error context: { code: 'database_error', attemptedRole: 'merchant' }
```

### 2. Comprehensive Database Migration

**File Created**: `supabase/migrations/20260127220000_comprehensive_role_registration_fix.sql`

**What It Does**:
1. ✅ Ensures all required columns exist in `profiles` table
2. ✅ Validates and fixes column constraints (role CHECK, email NOT NULL)
3. ✅ Creates/updates `handle_new_user()` trigger with better error handling
4. ✅ Recreates all RLS policies from scratch (removes conflicts)
5. ✅ Grants proper permissions to authenticated users
6. ✅ Creates performance indexes
7. ✅ Adds comprehensive documentation

**Key Features**:
- **Idempotent**: Safe to run multiple times
- **Non-destructive**: Doesn't drop existing data
- **Self-healing**: Fixes common configuration issues automatically
- **Comprehensive error handling**: Trigger never fails user creation

## Deployment Instructions

### Prerequisites

You need access to:
- Your Supabase project dashboard
- OR Supabase CLI with project linked

### Option 1: Using Supabase Dashboard (Recommended for Quick Fix)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Execute Migration**
   - Copy the entire contents of `supabase/migrations/20260127220000_comprehensive_role_registration_fix.sql`
   - Paste into the SQL editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Success**
   - Check the output panel for success messages
   - You should see: "Migration completed successfully!"
   - Number of policies should be 5
   - Trigger exists: true

### Option 2: Using Supabase CLI (Recommended for Production)

```bash
# 1. Ensure you're logged in to Supabase CLI
supabase login

# 2. Link to your project (if not already linked)
supabase link --project-ref YOUR_PROJECT_REF

# 3. Check migration status
supabase migration list

# 4. Apply all pending migrations
supabase db push

# 5. Verify the migration was applied
supabase migration list
# You should see: 20260127220000_comprehensive_role_registration_fix.sql ✓
```

### Option 3: Manual Verification (If Migrations Already Applied)

If the previous migrations were already applied, you can verify and manually fix issues:

```sql
-- 1. Check if profiles table has correct columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Required columns: id, email, role, full_name, phone, city, created_at, updated_at

-- 2. Check if trigger exists
SELECT tgname, tgenabled 
FROM pg_trigger 
WHERE tgname = 'on_auth_user_created';

-- Should return: on_auth_user_created | O (enabled)

-- 3. Check RLS policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Should have 5 policies:
-- - profiles_select_own (SELECT)
-- - profiles_select_admin (SELECT)
-- - profiles_insert_own (INSERT) ← Critical!
-- - profiles_update_own (UPDATE)
-- - profiles_update_admin (UPDATE)

-- 4. Check role constraint
SELECT conname, consrc
FROM pg_constraint
WHERE conname = 'profiles_role_check';

-- Should include: CHECK (role IN ('user', 'agent', 'merchant', 'admin'))
```

## Testing After Deployment

### Test 1: Private Seller Registration (Should Already Work)

1. Go to `/auth/register`
2. Select "Particulier / Vendeur individuel" (Individual/Private Seller)
3. Fill in details:
   - Full Name: Test User
   - Email: test-user@example.com
   - Phone: +212600000001
   - City: Casablanca
   - Password: test123456
4. Submit

**Expected**: ✅ Success → Redirect to login

### Test 2: Technician/Craftsman Registration (Currently Failing - Should Be Fixed)

1. Go to `/auth/register`
2. Select "Technicien / Artisan" (Technician/Craftsman)
3. Fill in details:
   - Full Name: Test Technician
   - Email: test-agent@example.com
   - Phone: +212600000002
   - City: Rabat
   - Password: test123456
4. Submit

**Expected**: ✅ Success → Redirect to login

**Dev Console Should Show**:
```
🔵 [DEV] Registration attempt: { role: 'agent', ... }
✅ User registered successfully: { role: 'agent', ... }
✅ [DEV] Registration successful with metadata: { role: 'agent', ... }
```

**If Fails**, check:
- Browser console for error details
- Supabase Dashboard → Logs → look for trigger errors
- Verify migration was applied correctly

### Test 3: Store/Importer Registration (Currently Failing - Should Be Fixed)

1. Go to `/auth/register`
2. Select "Boutique / Importateur" (Shop/Importer)
3. Fill in details:
   - Full Name: Test Store
   - Email: test-merchant@example.com
   - Phone: +212600000003
   - City: Marrakech
   - Password: test123456
4. Submit

**Expected**: ✅ Success → Redirect to login

### Verification in Supabase Dashboard

After each successful registration:

1. **Check Auth Users**
   - Dashboard → Authentication → Users
   - New user should appear with correct email

2. **Check Profiles Table**
   - Dashboard → Table Editor → profiles
   - Find the user by ID
   - Verify:
     - `role` = 'user' | 'agent' | 'merchant' (matches registration type)
     - `email` = registration email
     - `full_name` = entered name
     - `phone` = entered phone (if provided)
     - `city` = entered city (if provided)

## Troubleshooting

### Issue: "Unable to complete registration" still appears

**Possible Causes**:
1. Migration not applied to database
2. Different error than database trigger

**Debug Steps**:

1. **Check Browser Console** (press F12)
   - Look for `🔴 Sign up error details:` log
   - Note the error code and message

2. **Check Supabase Logs**
   - Dashboard → Logs → Postgres Logs
   - Look for warnings/errors during registration time
   - Search for user email or "handle_new_user"

3. **Test Trigger Manually**:
   ```sql
   -- Try to insert a test profile manually
   INSERT INTO profiles (id, email, role, full_name)
   VALUES (
     gen_random_uuid(), 
     'test@example.com', 
     'agent',  -- Try 'agent' and 'merchant'
     'Test User'
   );
   
   -- If this fails, check the error message
   ```

4. **Verify RLS Policy**:
   ```sql
   -- Test if authenticated users can insert
   -- (Run this as an authenticated user, or temporarily disable RLS)
   SET ROLE authenticated;
   INSERT INTO profiles (id, email, role, full_name)
   VALUES (
     auth.uid(), 
     'test@example.com', 
     'agent',
     'Test User'
   );
   ```

### Issue: Error mentions "constraint violation"

**Likely Cause**: Role value not in allowed list

**Fix**: Ensure role is one of: 'user', 'agent', 'merchant', 'admin'

Check RegisterPage.tsx role mapping:
- Shop → 'merchant' ✓
- Technician → 'agent' ✓
- Individual → 'user' ✓

### Issue: Error mentions "permission denied"

**Likely Cause**: RLS policy missing or incorrect

**Fix**: Re-run Part 3 of the migration (RLS Policies section)

### Issue: Trigger exists but profile not created

**Check Supabase Logs**:
```sql
-- Look for trigger warnings
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%handle_new_user%';
```

**Possible Fix**: Trigger function might have an error. Re-run Part 2 of migration.

## Expected Outcomes After Fix

✅ **All three role types can register successfully**:
- Private Seller (user) - Already working
- Technician/Craftsman (agent) - Now working
- Store/Importer (merchant) - Now working

✅ **Improved error messages**:
- Field-specific errors instead of generic "Unable to complete registration"
- Dev-mode logging for debugging

✅ **Better monitoring**:
- Comprehensive logs in dev mode
- Supabase logs show trigger execution
- Clear success/failure indicators

✅ **Robust database configuration**:
- Proper RLS policies for all roles
- Trigger with comprehensive error handling
- Proper constraints and indexes

## Rollback Plan

If issues occur after deployment:

1. **Revert Code Changes**:
   ```bash
   git revert HEAD
   git push
   ```

2. **Database is Safe**:
   - Migration is non-destructive
   - No data is deleted
   - Old columns preserved
   - Trigger has fallback to 'user' role if issues

3. **Emergency Fix**:
   ```sql
   -- Temporarily disable trigger if causing issues
   ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;
   
   -- Then manually create profiles or fix trigger
   ```

## Support

If issues persist after applying all fixes:

1. **Collect Evidence**:
   - Browser console error screenshots
   - Supabase logs (Dashboard → Logs)
   - Migration execution output
   - Test results for all three roles

2. **Check Configuration**:
   - Verify migration was applied: `supabase migration list`
   - Check trigger exists: Query in SQL Editor
   - Verify policies: Query pg_policies table

3. **Contact Support** with:
   - Error logs from browser console
   - Supabase trigger/RLS logs
   - Migration execution results
   - Which role(s) are failing

## Next Steps After Fix

1. **Monitor Registration Success Rate**
   - Track which roles are being registered
   - Monitor for any errors in Supabase logs

2. **Consider Additional Features**:
   - Email verification flow
   - Phone number verification
   - Profile completion wizard for new users

3. **Performance Monitoring**:
   - Track registration response times
   - Monitor database query performance
   - Optimize indexes if needed

## Documentation Updates

After successful deployment:

- [ ] Update README with registration process
- [ ] Document the three role types
- [ ] Add troubleshooting guide for users
- [ ] Create admin documentation for role management
