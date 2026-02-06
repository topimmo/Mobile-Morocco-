# How to Use the Diagnostic Migration

## Purpose

The diagnostic migration helps identify the EXACT root cause of registration failures in your Supabase instance.

## How to Run

### Option 1: Supabase CLI
```bash
supabase db push
# This applies all pending migrations including the diagnostic
```

### Option 2: Supabase Dashboard
1. Go to Supabase Dashboard → SQL Editor
2. Copy entire contents of `supabase/migrations/20260127230000_diagnostic_registration_check.sql`
3. Paste and click "Run"
4. Check the "Messages" or "Output" panel

## What to Look For

The diagnostic will output:

### 1. Profiles Table Columns
```
1. PROFILES TABLE COLUMNS:
  - id (uuid): nullable=NO, default=NULL
  - email (text): nullable=YES, default=NULL
  - role (text): nullable=NO, default='user'
  - full_name (text): nullable=YES, default=NULL
  - phone (text): nullable=YES, default=NULL
  - city (text): nullable=YES, default=NULL  <-- Check if this exists
  - created_at (timestamp): nullable=YES, default=NOW()
  - updated_at (timestamp): nullable=YES, default=NOW()
```

**Check**: Does `city` column exist? If NO, and trigger tries to insert it → FAILURE

### 2. Role Constraint
```
2. ROLE CONSTRAINT:
  profiles_role_check exists
  Definition: (role = ANY (ARRAY['user'::text, 'agent'::text, 'merchant'::text, 'admin'::text]))
```

**Check**: Does constraint include 'agent' and 'merchant'? If NO → FAILURE

### 3. RLS Policies
```
3. RLS POLICIES ON profiles:
  - Service role can insert profiles (INSERT) - USING: true, WITH CHECK: true
  - Users can view own profile (SELECT) - USING: (auth.uid() = id), WITH CHECK:
  - users_select_own_profile (SELECT) - USING: (auth.uid() = id), WITH CHECK:
```

**Check**: Is there an INSERT policy for authenticated users? If NO → FAILURE (this is likely the issue)

### 4. INSERT Policies Check
```
4. INSERT POLICIES CHECK:
  ⚠️  NO INSERT POLICY FOUND for authenticated users!
  This could cause registration to fail!
```

**This is the smoking gun!** If you see this warning, the minimal fix should work.

### 5. Trigger Check
```
5. TRIGGER CHECK:
  ✓ Trigger on_auth_user_created exists
```

**Check**: Does trigger exist? If NO → FAILURE

### 6. Trigger Function
```
6. TRIGGER FUNCTION:
  ✓ Function handle_new_user exists
  ✓ Function has SECURITY DEFINER
  ⚠️  Function does NOT have EXCEPTION handling
  ⚠️  Function does NOT reference city column
```

**Important checks**:
- `SECURITY DEFINER` - Should be YES (allows trigger to bypass RLS)
- `EXCEPTION handling` - If NO, any error kills registration
- `city column` - If function tries to insert city but column doesn't exist → FAILURE

## Interpreting Results

### Scenario 1: Missing INSERT Policy (Most Likely)
```
⚠️  NO INSERT POLICY FOUND for authenticated users!
```
**Solution**: Apply the minimal fix migration → Should work!

### Scenario 2: Missing city Column
```
1. PROFILES TABLE COLUMNS:
  - city column NOT FOUND
6. TRIGGER FUNCTION:
  ✓ Function references city column
```
**Solution**: Either:
- Option A: Add city column: `ALTER TABLE profiles ADD COLUMN city TEXT;`
- Option B: Update trigger to not insert city

### Scenario 3: Wrong Role Constraint
```
2. ROLE CONSTRAINT:
  Definition: (role = ANY (ARRAY['user'::text, 'seller_store'::text, ...]))
```
**Solution**: Update constraint to include 'agent' and 'merchant':
```sql
ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('user', 'agent', 'merchant', 'admin'));
```

### Scenario 4: No Trigger
```
5. TRIGGER CHECK:
  ⚠️  Trigger on_auth_user_created NOT FOUND!
```
**Solution**: Apply migration `20260126000002_role_based_auth_setup.sql`

## After Running Diagnostic

1. **Note any ⚠️  warnings**
2. **Apply the minimal fix** (if INSERT policy is the issue)
3. **If other issues found**, create targeted fix for that specific issue
4. **Re-run diagnostic** after fix to verify

## Example Output (Healthy State)

```
========================================
DIAGNOSTIC: Registration Failure Analysis
========================================

1. PROFILES TABLE COLUMNS:
  - id, email, role, full_name, phone, city, created_at, updated_at ✓

2. ROLE CONSTRAINT:
  ✓ Includes: user, agent, merchant, admin

3. RLS POLICIES:
  ✓ users_insert_own_profile (INSERT) found

4. INSERT POLICIES CHECK:
  ✓ INSERT policy for authenticated users exists

5. TRIGGER CHECK:
  ✓ Trigger exists

6. TRIGGER FUNCTION:
  ✓ Function exists with SECURITY DEFINER

========================================
No critical issues found!
========================================
```

---

**Next**: After reviewing diagnostic results, apply the appropriate minimal fix.
