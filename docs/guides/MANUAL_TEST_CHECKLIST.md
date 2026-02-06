# Manual Test Checklist: Admin Login & Role-Based Authentication

## Overview
This document provides a comprehensive manual test checklist for verifying the admin login fix and role-based authentication system.

## Prerequisites
- [ ] Supabase database is running and migrations are applied
- [ ] Application is running locally or deployed
- [ ] Test user accounts exist for each role (admin, agent, merchant, user)
- [ ] Browser console is open to view diagnostic logs

## Test Accounts Setup
Create test accounts for each role (if not already exists):

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| admin | admin@test.local | Test123! | Admin dashboard access |
| agent | agent@test.local | Test123! | Agent dashboard access |
| merchant | merchant@test.local | Test123! | Merchant dashboard access |
| user | user@test.local | Test123! | User dashboard access |

## Test Categories

### 1. Login Flow Tests

#### 1.1 Successful Login Tests
- [ ] **Test**: Login as admin user
  - Email: admin@test.local
  - Password: Test123!
  - **Expected**: Redirects to `/admin` dashboard
  - **Check Console**: Look for "✅ Sign in successful", "✅ getUserRole: Role fetched successfully"

- [ ] **Test**: Login as agent user
  - Email: agent@test.local
  - Password: Test123!
  - **Expected**: Redirects to `/agent` dashboard
  - **Check Console**: No errors, successful role fetch logs

- [ ] **Test**: Login as merchant user
  - Email: merchant@test.local
  - Password: Test123!
  - **Expected**: Redirects to `/merchant` dashboard
  - **Check Console**: No errors, successful role fetch logs

- [ ] **Test**: Login as regular user
  - Email: user@test.local
  - Password: Test123!
  - **Expected**: Redirects to `/dashboard`
  - **Check Console**: No errors, successful role fetch logs

#### 1.2 Failed Login Tests
- [ ] **Test**: Invalid password
  - Email: admin@test.local
  - Password: WrongPassword123
  - **Expected**: Error message "Invalid email or password"
  - **Check Console**: Should see "Sign in error details" with code "invalid_credentials"
  - **NOT Expected**: "Error fetching role" message (should fail at auth, not profile fetch)

- [ ] **Test**: Non-existent email
  - Email: nonexistent@test.local
  - Password: Test123!
  - **Expected**: Error message "Invalid email or password"
  - **Check Console**: Should see auth error, NOT profile fetch error

- [ ] **Test**: Unconfirmed email (if applicable)
  - Use an account that hasn't verified email
  - **Expected**: Error message about email verification
  - **Expected**: "Resend confirmation" button appears
  - **Check Console**: Error should mention "email not confirmed"

### 2. Profile Error Handling Tests

#### 2.1 Missing Profile Test
- [ ] **Test**: Login with account that has no profile
  - Create auth user manually in Supabase without profile
  - Login with this account
  - **Expected**: Redirects to `/auth/select-account-type`
  - **Expected**: Error message "Profile not found. Please complete your account setup."
  - **Check Console**: "⚠️ getUserRole: Profile not found"

#### 2.2 Duplicate Profile Test (Simulated)
- [ ] **Test**: If duplicate profiles exist (should not happen after migration)
  - **Expected**: Login succeeds using most recent profile
  - **Check Console**: "🔴 DUPLICATE PROFILES DETECTED" warning
  - **Check Console**: "⚠️ Using most recent profile" message
  - **Expected**: User is redirected correctly based on role from most recent profile

#### 2.3 Null Role Test
- [ ] **Test**: Profile exists but role is NULL
  - Manually update profile in DB: `UPDATE profiles SET role = NULL WHERE id = '<user-id>'`
  - Login with this account
  - **Expected**: Redirects to `/auth/select-account-type`
  - **Expected**: Error message "Account role not configured. Please complete your account setup."
  - **Check Console**: "⚠️ getUserRole: User role is null/undefined"

### 3. Role-Based Routing Tests

#### 3.1 Protected Route Access Tests
- [ ] **Test**: Admin accessing admin routes
  - Login as admin
  - Navigate to `/admin`
  - **Expected**: Page loads successfully
  - **Check Console**: "✅ RoleGuard: Access granted - user role: admin"

- [ ] **Test**: User trying to access admin route
  - Login as user
  - Navigate to `/admin`
  - **Expected**: Redirected to `/dashboard` (user's own dashboard)
  - **Check Console**: "⚠️ RoleGuard: Access denied"

- [ ] **Test**: Agent trying to access merchant route
  - Login as agent
  - Navigate to `/merchant`
  - **Expected**: Redirected to `/agent` or `/unauthorized`
  - **Check Console**: "⚠️ RoleGuard: Access denied"

- [ ] **Test**: Admin accessing all role routes
  - Login as admin
  - Navigate to each: `/admin`, `/agent`, `/merchant`, `/dashboard`
  - **Expected**: Admin should have access to ALL routes (admin privilege)
  - **Check Console**: "✅ RoleGuard: Access granted" for each route

#### 3.2 Cross-Role Access Tests
- [ ] **Test**: Each role can only access their own dashboard
  - Login as each role (agent, merchant, user)
  - Try accessing other roles' dashboards
  - **Expected**: Redirected to their own dashboard

### 4. Email Confirmation Callback Tests

#### 4.1 Successful Email Confirmation
- [ ] **Test**: Click email confirmation link
  - Register new account
  - Click confirmation link in email
  - **Expected**: Redirected to login page or appropriate dashboard
  - **Expected**: Profile is created automatically via trigger
  - **Check Console**: "✅ Profile created successfully"

#### 4.2 Email Confirmation with Missing Profile
- [ ] **Test**: Email confirmation when profile creation fails
  - Simulate trigger failure (if possible)
  - **Expected**: Error message appears
  - **Expected**: User prompted to contact support or retry
  - **Check Console**: Profile creation error logged

### 5. RLS Policy Tests

#### 5.1 Profile Access Tests
- [ ] **Test**: User can read their own profile
  - Login as any user
  - Check that user profile data loads in UI
  - **Expected**: Profile data visible (name, email, role, etc.)
  - **Check Console**: No "Permission denied" errors

- [ ] **Test**: User cannot read other users' profiles
  - Login as user A
  - Try to fetch user B's profile via API/console
  - **Expected**: Query returns empty or permission denied
  - **Check Console**: RLS policy blocks access

- [ ] **Test**: Admin can read all profiles
  - Login as admin
  - Attempt to view/search other users' profiles
  - **Expected**: Admin can see all profiles
  - **Check Console**: No permission errors

#### 5.2 Profile Update Tests
- [ ] **Test**: User can update their own profile
  - Login as any user
  - Update profile fields (name, phone, etc.)
  - **Expected**: Update succeeds
  - **Check Console**: No errors

- [ ] **Test**: User cannot update their own role
  - Login as user
  - Try to update role via API: `UPDATE profiles SET role = 'admin' WHERE id = '<user-id>'`
  - **Expected**: Update fails or role doesn't change
  - **Check Console**: RLS policy blocks role change

- [ ] **Test**: Admin can update any profile including role
  - Login as admin
  - Update another user's profile and role
  - **Expected**: Update succeeds
  - **Check Console**: No errors

### 6. Duplicate Profile Detection Tests

#### 6.1 Application Logs
- [ ] **Test**: Check logs during login
  - Login with each role
  - **Check Console**: Look for duplicate profile warnings
  - **Expected**: No "🔴 DUPLICATE PROFILES" errors (after cleanup migration)

#### 6.2 Database Verification
- [ ] **Test**: Run diagnostic query
  ```sql
  SELECT id, COUNT(*) as profile_count
  FROM profiles
  GROUP BY id
  HAVING COUNT(*) > 1;
  ```
  - **Expected**: Returns 0 rows (no duplicates)

### 7. Error Message Differentiation Tests

#### 7.1 Auth Error vs Profile Error
- [ ] **Test**: Verify error messages distinguish between error types
  - Wrong password → "Invalid email or password"
  - Missing profile → "Profile not found. Please complete your account setup."
  - Duplicate profiles → "Multiple profiles detected for your account. Please contact support."
  - Network error → "A technical error occurred. Please check your connection and try again."
  - **Expected**: Each error type shows a distinct, user-friendly message

### 8. Signup Flow Tests

#### 8.1 New User Registration
- [ ] **Test**: Register new user with each role
  - Register as user role
  - **Expected**: Profile created automatically via trigger
  - **Expected**: Email confirmation sent
  - **Check Console**: "✅ User registered successfully"
  - **Check DB**: Profile exists in `profiles` table with correct role

- [ ] **Test**: Register with existing email
  - Try to register with an already-used email
  - **Expected**: Error "This email is already registered"
  - **NOT Expected**: Generic "Registration failed" message

### 9. Session Persistence Tests

#### 9.1 Page Refresh
- [ ] **Test**: Refresh page while logged in
  - Login as any role
  - Navigate to dashboard
  - Refresh page (F5)
  - **Expected**: User remains logged in, dashboard loads
  - **Check Console**: "✅ getUserRole: Role fetched successfully"

#### 9.2 Browser Close/Reopen
- [ ] **Test**: Close and reopen browser
  - Login as any role
  - Close browser completely
  - Reopen and navigate to app
  - **Expected**: User remains logged in (if "Remember me" was selected)

### 10. Performance & Logging Tests

#### 10.1 Console Log Verification
- [ ] **Test**: Verify logging is appropriate
  - **Production**: Logs should not expose sensitive data
  - **Development**: Detailed logs for debugging (🔵 [DEV] prefix)
  - **Check**: No passwords, tokens, or PII in logs

#### 10.2 Query Performance
- [ ] **Test**: Check profile fetch performance
  - Login and measure time to fetch profile
  - **Expected**: Profile fetch completes in < 200ms
  - **Check**: Database indexes are used (run EXPLAIN ANALYZE if needed)

## Test Results Template

Use this template to record test results:

```markdown
## Test Results - [Date]

### Tester: [Your Name]
### Environment: [Local/Staging/Production]
### Browser: [Chrome/Firefox/Safari/Edge]

| Test Category | Test Case | Status | Notes |
|---------------|-----------|--------|-------|
| Login Flow | Admin login | ✅ Pass | Redirected to /admin |
| Login Flow | Invalid password | ✅ Pass | Correct error message |
| ... | ... | ... | ... |

### Issues Found:
1. [Issue description]
   - Severity: [High/Medium/Low]
   - Steps to reproduce:
   - Expected behavior:
   - Actual behavior:

### Console Errors:
- [List any unexpected console errors]

### Recommendations:
- [Any improvements or fixes needed]
```

## Post-Testing Checklist

After completing all tests:
- [ ] All critical tests pass (login, role routing, profile creation)
- [ ] No duplicate profiles exist in database
- [ ] Error messages are user-friendly and accurate
- [ ] Console logs are appropriate for environment (dev vs prod)
- [ ] RLS policies are working correctly
- [ ] No security vulnerabilities identified
- [ ] Performance is acceptable (< 200ms for profile fetch)
- [ ] Document any issues found
- [ ] Create tickets for any bugs or improvements

## Notes
- Run these tests in a test/staging environment first
- Use browser's private/incognito mode for clean testing
- Clear browser cache between test runs if needed
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Test on mobile devices if applicable
