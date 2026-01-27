# Minimal Registration Fix

## Problem
Registration fails for `agent` (Technician/Craftsman) and `merchant` (Store/Importer) roles with "Unable to complete registration", while `user` (Private Seller) registration works.

## Root Cause Analysis

### Step 1: Run Diagnostic (Optional)
To identify the exact issue in your Supabase instance:

```bash
# Apply diagnostic migration
supabase db push
# OR in Supabase Dashboard → SQL Editor:
# Copy/paste contents of: supabase/migrations/20260127230000_diagnostic_registration_check.sql
```

Check the output logs for warnings about missing INSERT policies.

### Step 2: Most Likely Root Cause

**Missing RLS INSERT Policy for Authenticated Users**

The `handle_new_user()` trigger runs with `SECURITY DEFINER` privileges, which should bypass RLS. However, if the trigger encounters ANY error (missing column, constraint violation, etc.), there is no fallback INSERT policy allowing authenticated users to create their own profile.

Migration `20260126000002_role_based_auth_setup.sql` only has:
```sql
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT
  WITH CHECK (true);
```

This allows ONLY the service role to insert, not authenticated users.

## Minimal Fix

**File**: `supabase/migrations/20260127235000_minimal_fix_add_insert_policy.sql`

**What it does**:
- Adds ONE RLS policy: `users_insert_own_profile`
- Allows authenticated users to insert their own profile
- Serves as fallback if trigger fails

**What it does NOT do**:
- ❌ No email NOT NULL changes
- ❌ No placeholder emails
- ❌ No global RLS refactor
- ❌ No column additions
- ❌ No trigger changes

## Deployment

### Option 1: Supabase CLI
```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### Option 2: Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20260127235000_minimal_fix_add_insert_policy.sql`
3. Paste and run
4. Check logs for "✓ Policy created successfully"

## Testing

After deploying the fix, test all three roles:

1. **Private Seller** (role: user) - Should still work
2. **Technician/Craftsman** (role: agent) - Should now work ✓
3. **Store/Importer** (role: merchant) - Should now work ✓

## If This Doesn't Fix It

If registration still fails after applying this fix, the root cause is something else. Run the diagnostic migration and check Supabase logs for:

1. **Column errors**: Missing `city`, `full_name`, or `phone` columns
2. **Constraint errors**: Role CHECK constraint not allowing 'agent'/'merchant'
3. **Trigger errors**: Exception in `handle_new_user()` function

Then we can create an additional minimal fix for that specific issue.

## Rollback

To rollback this change:
```sql
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
```

---

**Status**: Minimal fix ready to deploy
**Files**: 2 SQL migrations (1 diagnostic, 1 fix)
**Impact**: Adds ONE RLS policy only
