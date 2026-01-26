# Quick Testing Guide - Role-Based Auth Fix

## Prerequisites
1. Supabase project configured
2. Migration `20260127000001_fix_role_based_auth.sql` applied
3. Frontend deployed with latest code

## Test Scenarios

### 1. New User Registration

#### Test Case 1.1: Register as Individual User
1. Navigate to `/auth/register`
2. Select "Particulier / Vendeur individuel" (Individual)
3. Fill in all required fields
4. Submit form
5. **Expected:** Redirected to login page with success message

**Verification:**
```sql
SELECT id, email, role FROM profiles WHERE email = 'test-user@example.com';
-- Expected role: 'user'
```

#### Test Case 1.2: Register as Technician
1. Navigate to `/auth/register`
2. Select "Technicien / Artisan" (Technician)
3. Fill in all required fields
4. Submit form
5. **Expected:** Redirected to login page with success message

**Verification:**
```sql
SELECT id, email, role FROM profiles WHERE email = 'test-agent@example.com';
-- Expected role: 'agent'
```

#### Test Case 1.3: Register as Store Owner
1. Navigate to `/auth/register`
2. Select "Boutique / Importateur" (Store)
3. Fill in all required fields
4. Submit form
5. **Expected:** Redirected to login page with success message

**Verification:**
```sql
SELECT id, email, role FROM profiles WHERE email = 'test-merchant@example.com';
-- Expected role: 'merchant'
```

---

### 2. User Login & Redirect

#### Test Case 2.1: Login as User
1. Navigate to `/auth/login`
2. Enter credentials for user with role='user'
3. Submit form
4. **Expected:** Redirected to `/dashboard`
5. **Browser Console:** Should show successful role fetch logs

**Console Logs to Verify:**
```
signInAndRedirect: Starting login for: user@example.com
getUserRole: Fetching role for user: <user-id>
getUserRole: Successfully fetched role: user
signInAndRedirect: Redirecting to: /dashboard
```

#### Test Case 2.2: Login as Agent
1. Navigate to `/auth/login`
2. Enter credentials for user with role='agent'
3. Submit form
4. **Expected:** Redirected to `/agent`

#### Test Case 2.3: Login as Merchant
1. Navigate to `/auth/login`
2. Enter credentials for user with role='merchant'
3. Submit form
4. **Expected:** Redirected to `/merchant`

#### Test Case 2.4: Login as Admin
1. Navigate to `/auth/login`
2. Enter credentials for user with role='admin'
3. Submit form
4. **Expected:** Redirected to `/admin`

---

### 3. Role-Based Access Control

#### Test Case 3.1: User Cannot Access Agent Dashboard
1. Login as user with role='user'
2. Navigate to `/agent` (directly or via URL)
3. **Expected:** Redirected to `/dashboard` (fallback path)

**Console Logs to Verify:**
```
RoleGuard: User role: user Allowed roles: ['agent']
RoleGuard: Authorization denied, redirecting to: /dashboard
```

#### Test Case 3.2: Agent Can Access Agent Dashboard
1. Login as user with role='agent'
2. Navigate to `/agent`
3. **Expected:** Page loads successfully

#### Test Case 3.3: Admin Can Access All Dashboards
1. Login as user with role='admin'
2. Navigate to `/agent`, `/merchant`, `/admin`
3. **Expected:** All pages load successfully (admin bypasses role checks)

---

### 4. Edge Cases

#### Test Case 4.1: Immediate Login After Signup
**Purpose:** Test race condition handling
1. Register a new user
2. Immediately login with same credentials
3. **Expected:** Successful login with correct redirect
4. **Console:** May show retry logs if race condition occurs

**Console Logs to Watch:**
```
signInAndRedirect: Retrying role fetch (attempt 2/3)...
```

#### Test Case 4.2: Page Refresh on Protected Route
1. Login as any user
2. Navigate to role-specific dashboard
3. Refresh the page (F5 or Ctrl+R)
4. **Expected:** Page reloads successfully without redirect

#### Test Case 4.3: Direct URL Access
1. Logout completely
2. Attempt to navigate to `/agent` directly via URL
3. **Expected:** Redirected to `/auth/login`

#### Test Case 4.4: Back Button After Login
1. Login successfully
2. Press browser back button
3. **Expected:** Does NOT return to login page (due to `replace: true`)

#### Test Case 4.5: Logout and Re-login
1. Login as any user
2. Logout
3. Login again with same credentials
4. **Expected:** Successful login with correct redirect

---

### 5. Database Edge Cases

#### Test Case 5.1: User with NULL Role
**Setup:**
```sql
-- Create user with NULL role (if possible, should be prevented by NOT NULL constraint)
UPDATE profiles SET role = NULL WHERE email = 'test@example.com';
```

**Test:**
1. Attempt to login
2. **Expected:** Redirected to `/auth/select-account-type` or error shown

#### Test Case 5.2: User with Invalid Role
**Setup:**
```sql
-- This should fail due to CHECK constraint
UPDATE profiles SET role = 'invalid' WHERE email = 'test@example.com';
-- Expected: Error due to role check constraint
```

#### Test Case 5.3: User with No Profile
**Setup:**
```sql
-- Delete profile (if RLS allows)
DELETE FROM profiles WHERE email = 'test@example.com';
```

**Test:**
1. Attempt to login
2. **Expected:** Redirected to `/auth/select-account-type`

**Console Logs:**
```
getUserRole: No profile found for user: <user-id>
signInAndRedirect: Failed to fetch role after retries: Profile not found
```

---

### 6. Performance Testing

#### Test Case 6.1: Login Response Time
1. Login as any user
2. Measure time from submit to redirect
3. **Expected:** < 2 seconds (including retry logic)

#### Test Case 6.2: RoleGuard Performance
1. Navigate between protected pages
2. Observe loading state duration
3. **Expected:** < 1 second for authorization check

---

## Verification Checklist

### Database Verification
- [ ] All profiles have non-NULL role values
- [ ] Role constraint is `('user', 'agent', 'merchant', 'admin')`
- [ ] RLS policies allow users to read their own profile
- [ ] Trigger creates profiles for new users

### Frontend Verification
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] Build succeeds (`npm run build`)
- [ ] No console errors on page load
- [ ] All role-based redirects work correctly

### Security Verification
- [ ] Users cannot escalate their own role
- [ ] RLS prevents unauthorized profile reads
- [ ] Admin role required to change user roles
- [ ] Session tokens refresh automatically

---

## Quick SQL Verification Queries

```sql
-- Check role distribution
SELECT role, COUNT(*) as count 
FROM profiles 
GROUP BY role;

-- Check for NULL roles (should return 0)
SELECT COUNT(*) 
FROM profiles 
WHERE role IS NULL;

-- Check role constraint
SELECT constraint_name, check_clause 
FROM information_schema.check_constraints 
WHERE constraint_name = 'profiles_role_check';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Check trigger
SELECT trigger_name, event_manipulation, event_object_table, action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

---

## Troubleshooting

### If login fails:
1. Check browser console for error logs
2. Check Supabase logs for database errors
3. Verify environment variables are set correctly
4. Verify migration was applied successfully

### If redirect is wrong:
1. Check console logs for role fetch result
2. Verify role in database matches expected value
3. Check redirect path mapping in code

### If RoleGuard blocks access:
1. Verify user role in database
2. Check RLS policies allow profile reads
3. Check console logs for authorization check results

---

**Last Updated:** 2026-01-27
**Version:** 1.0
