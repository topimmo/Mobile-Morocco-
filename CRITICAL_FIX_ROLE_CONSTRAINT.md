# Critical Fix: Role Constraint Mismatch

## Problem Statement

Users were experiencing "Database error saving new user" when signing up with `agent` or `merchant` roles, despite the application UI offering these options.

## Root Cause Analysis

### Database State
The `profiles` table had a CHECK constraint that only allowed:
```sql
CHECK (role IN ('user', 'advertiser', 'admin'))
```

### Application Code
The application (frontend and backend) uses these role values:
```typescript
type UserRole = 'user' | 'agent' | 'merchant' | 'admin';
```

### Role Mapping
- `user` - Private seller (default)
- `agent` - Technician/Craftsman
- `merchant` - Store owner/Importer
- `admin` - Platform administrator

### The Mismatch
When a user selected "Technician" or "Store" during signup:
1. Frontend sent `role: 'agent'` or `role: 'merchant'` in metadata
2. Trigger function tried to insert into `profiles` table
3. CHECK constraint rejected the insert (role not in allowed list)
4. Signup failed with database error

## Solution

### Two Deployment Options

#### Option 1: Immediate Hotfix (Recommended for Production)
**File**: `HOTFIX_role_constraint.sql`

**How to apply**:
1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the entire contents of `HOTFIX_role_constraint.sql`
4. Click "Run"
5. Verify with validation query (included in file)

**Time to fix**: ~30 seconds

**Impact**: Immediate - signup works instantly for all roles

#### Option 2: Proper Migration (Recommended for Staging/Dev)
**File**: `supabase/migrations/20260127000003_critical_fix_role_constraint.sql`

**How to apply**:
```bash
npx supabase db push
```

**Time to fix**: ~1-2 minutes (includes migration tracking)

**Impact**: Same as hotfix, but properly tracked in migration history

### What the Fix Does

1. **Removes incorrect constraint**:
   ```sql
   ALTER TABLE profiles 
     DROP CONSTRAINT IF EXISTS profiles_role_check;
   ```

2. **Adds correct constraint**:
   ```sql
   ALTER TABLE profiles 
     ADD CONSTRAINT profiles_role_check 
     CHECK (role IN ('user', 'agent', 'merchant', 'admin'));
   ```

3. **Verifies trigger function** (already correct in previous fixes):
   - Validates role against allowed values
   - Defaults to 'user' if invalid or missing
   - Uses `ON CONFLICT DO NOTHING` for safety

4. **Cleans up invalid data** (migration only):
   ```sql
   UPDATE profiles 
   SET role = 'user' 
   WHERE role NOT IN ('user', 'agent', 'merchant', 'admin');
   ```

## Verification

### Before Fix
```sql
-- Check current constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'profiles_role_check';

-- Output (BEFORE):
-- CHECK (role IN ('user', 'advertiser', 'admin'))
```

### After Fix
```sql
-- Check updated constraint
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'profiles_role_check';

-- Output (AFTER):
-- CHECK (role IN ('user', 'agent', 'merchant', 'admin'))
```

### Test Signup
After applying the fix, test signup with each role:

1. **Test user role** (private seller):
   - Select "Particulier / Vendeur individuel"
   - Complete signup
   - ✅ Should succeed

2. **Test agent role** (technician):
   - Select "Technicien / Artisan"
   - Complete signup
   - ✅ Should succeed (previously failed)

3. **Test merchant role** (store owner):
   - Select "Boutique / Importateur"
   - Complete signup
   - ✅ Should succeed (previously failed)

## Impact Assessment

### Users Affected
- **Before fix**: Users selecting "Technician" or "Store" could NOT register
- **After fix**: All users can register with any role

### Data Integrity
- ✅ Existing users NOT affected
- ✅ No data loss
- ✅ Invalid roles (if any) automatically corrected to 'user' (migration only)

### Application Compatibility
- ✅ Frontend code already uses correct roles
- ✅ Backend trigger already validates correct roles
- ✅ Only database constraint needed fixing

## Timeline of Issues

1. **Earlier migration** (`20250201000001_unified_platform_schema.sql`):
   - Set constraint to `('admin', 'advertiser', 'user')`
   - Did not match application code

2. **First fix attempt** (`20260127000001_fix_role_based_auth.sql`):
   - Updated constraint to `('user', 'agent', 'merchant', 'admin')`
   - But may not have been applied to production database

3. **This fix** (`20260127000003_critical_fix_role_constraint.sql`):
   - Definitively sets correct constraint
   - Includes validation and cleanup
   - Provides immediate hotfix option

## Production Deployment Checklist

- [ ] Run `HOTFIX_role_constraint.sql` in Supabase SQL Editor
- [ ] Verify constraint with validation query
- [ ] Test signup for each role type
- [ ] Monitor error logs for any database errors
- [ ] Verify existing users can still log in
- [ ] Check that new profiles are created correctly

## Rollback Plan

If issues occur (unlikely), rollback is simple:

```sql
-- Rollback to previous constraint (NOT RECOMMENDED - breaks agent/merchant)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'advertiser', 'admin'));
```

**Note**: Rolling back is NOT recommended as it breaks agent/merchant signups again.

## Future Prevention

To prevent similar issues:

1. **Always align database constraints with application code**
2. **Test all role values during signup** (not just default)
3. **Use migration files that are reviewed against application code**
4. **Add integration tests for signup with different roles**

---

**Status**: ✅ Fixed
**Migration**: `20260127000003_critical_fix_role_constraint.sql`
**Hotfix**: `HOTFIX_role_constraint.sql`
**Commit**: d2c6683
**Priority**: PRODUCTION CRITICAL
