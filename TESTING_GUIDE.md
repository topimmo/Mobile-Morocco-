# Role-Based Authentication Testing Guide

This guide provides step-by-step instructions to test the role-based authentication and redirection system.

## Prerequisites

1. Supabase project is set up and running
2. Database migration `20260126000002_role_based_auth_setup.sql` has been applied
3. Frontend is running (`npm run dev`)

## Test 1: Database Setup Verification

### Steps:
1. Connect to your Supabase database
2. Run the following queries:

```sql
-- Verify role constraint
SELECT column_name, data_type, udt_name 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'role';

-- Check constraint
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name LIKE '%role%';

-- Verify RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'profiles';

-- List RLS policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Verify trigger exists
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

### Expected Results:
- Role column exists with CHECK constraint for ('user', 'agent', 'merchant', 'admin')
- RLS is enabled (rowsecurity = true)
- Policies exist for SELECT, UPDATE, INSERT
- Trigger `on_auth_user_created` exists

## Test 2: User Registration (Private Seller)

### Steps:
1. Navigate to `/auth/register`
2. Select "Particulier / Vendeur individuel" (Private seller)
3. Fill in the form:
   - Full Name: "Test User"
   - Email: "user@example.com"
   - Phone: "+212600000001"
   - City: "Casablanca"
   - Password: "password123"
   - Confirm Password: "password123"
4. Click "Créer le compte"

### Expected Results:
- Registration succeeds without errors
- User is redirected to `/auth/login?registered=true`
- Check database:
```sql
SELECT id, email, role, full_name 
FROM profiles 
WHERE email = 'user@example.com';
```
- Profile should exist with `role = 'user'`

## Test 3: User Login & Redirect (Private Seller)

### Steps:
1. Navigate to `/auth/login`
2. Login with:
   - Email: "user@example.com"
   - Password: "password123"
3. Click "Se connecter"

### Expected Results:
- Login succeeds
- User is redirected to `/dashboard`
- User can access `/dashboard`
- User CANNOT access `/agent` (should redirect to `/unauthorized`)
- User CANNOT access `/merchant` (should redirect to `/unauthorized`)
- User CANNOT access `/admin` (should redirect to `/unauthorized`)

## Test 4: Agent Registration (Technician)

### Steps:
1. Sign out if logged in
2. Navigate to `/auth/register`
3. Select "Technicien / Artisan" (Technician)
4. Fill in the form:
   - Full Name: "Test Agent"
   - Email: "agent@example.com"
   - Phone: "+212600000002"
   - City: "Rabat"
   - Password: "password123"
   - Confirm Password: "password123"
5. Click "Créer le compte"

### Expected Results:
- Registration succeeds
- User is redirected to login page
- Check database:
```sql
SELECT id, email, role, full_name 
FROM profiles 
WHERE email = 'agent@example.com';
```
- Profile should exist with `role = 'agent'`

## Test 5: Agent Login & Redirect

### Steps:
1. Navigate to `/auth/login`
2. Login with:
   - Email: "agent@example.com"
   - Password: "password123"
3. Click "Se connecter"

### Expected Results:
- Login succeeds
- User is redirected to `/agent`
- Agent dashboard displays with technician-specific content
- User can access `/agent`
- User can access `/dashboard` (general access)
- User CANNOT access `/admin` (should redirect to `/unauthorized`)
- User CANNOT access `/merchant` (should redirect to `/unauthorized`)

## Test 6: Merchant Registration (Store Owner)

### Steps:
1. Sign out if logged in
2. Navigate to `/auth/register`
3. Select "Boutique / Importateur" (Store/Importer)
4. Fill in the form:
   - Full Name: "Test Merchant"
   - Email: "merchant@example.com"
   - Phone: "+212600000003"
   - City: "Marrakech"
   - Password: "password123"
   - Confirm Password: "password123"
5. Click "Créer le compte"

### Expected Results:
- Registration succeeds
- User is redirected to login page
- Check database:
```sql
SELECT id, email, role, full_name 
FROM profiles 
WHERE email = 'merchant@example.com';
```
- Profile should exist with `role = 'merchant'`

## Test 7: Merchant Login & Redirect

### Steps:
1. Navigate to `/auth/login`
2. Login with:
   - Email: "merchant@example.com"
   - Password: "password123"
3. Click "Se connecter"

### Expected Results:
- Login succeeds
- User is redirected to `/merchant`
- Merchant dashboard displays with store-specific content
- User can access `/merchant`
- User can access `/dashboard` (general access)
- User CANNOT access `/admin` (should redirect to `/unauthorized`)
- User CANNOT access `/agent` (should redirect to `/unauthorized`)

## Test 8: Admin Access

### Steps:
1. Manually create an admin user in the database:
```sql
-- First create the auth user (use Supabase dashboard or API)
-- Then update their profile role:
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```
2. Login with the admin credentials

### Expected Results:
- Login succeeds
- User is redirected to `/admin`
- Admin dashboard displays
- Admin can access ALL routes: `/admin`, `/agent`, `/merchant`, `/dashboard`

## Test 9: RLS Policy Testing

### Test User Can't Change Their Own Role:
```sql
-- Login as a regular user, then try:
UPDATE profiles 
SET role = 'admin' 
WHERE id = auth.uid();
```
**Expected:** Error - RLS policy prevents role change

### Test User Can Update Other Fields:
```sql
-- Login as a regular user, then try:
UPDATE profiles 
SET full_name = 'New Name' 
WHERE id = auth.uid();
```
**Expected:** Success - user can update their own profile

### Test User Can't See Other Profiles:
```sql
-- Login as a regular user, then try:
SELECT * FROM profiles WHERE id != auth.uid();
```
**Expected:** No results (empty set)

### Test Admin Can See All Profiles:
```sql
-- Login as admin user, then try:
SELECT * FROM profiles;
```
**Expected:** All profiles visible

## Test 10: Unauthorized Access Handling

### Steps:
1. Login as a 'user' (private seller)
2. Try to navigate directly to `/admin`
3. Try to navigate directly to `/agent`
4. Try to navigate directly to `/merchant`

### Expected Results:
- Each attempt redirects to `/unauthorized`
- Unauthorized page displays with appropriate message
- "Page d'accueil" button redirects to `/`
- "Se connecter" button redirects to `/auth/login`

## Test 11: Session Persistence

### Steps:
1. Login with any role
2. Refresh the page
3. Close and reopen the browser tab
4. Navigate directly to a protected route

### Expected Results:
- User remains logged in after refresh
- Correct redirect happens on initial load
- Protected routes remain accessible

## Test 12: Logout and Re-login

### Steps:
1. Login as any role
2. Sign out using the logout button
3. Login again with the same credentials

### Expected Results:
- Logout succeeds
- User is redirected to home or login page
- Re-login succeeds with correct role-based redirect

## Common Issues & Troubleshooting

### Issue: Registration succeeds but no profile created
**Check:** 
- Verify trigger is installed: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Check trigger function: `SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';`

### Issue: Login succeeds but wrong redirect
**Check:**
- Console logs for role fetched
- Database: `SELECT role FROM profiles WHERE email = 'user@example.com';`
- Verify signInAndRedirect logic in browser DevTools

### Issue: RLS prevents user from seeing their profile
**Check:**
- User is authenticated: `SELECT auth.uid();` should return UUID
- RLS policies are correct
- Service role vs user role (check connection string)

### Issue: User can access unauthorized routes
**Check:**
- RoleGuard is properly imported and used in App.tsx
- No typos in allowedRoles array
- Browser cache (hard refresh with Ctrl+Shift+R)

## Clean Up Test Data

After testing, clean up test accounts:

```sql
-- Delete test profiles (this will cascade to auth.users)
DELETE FROM auth.users 
WHERE email IN (
  'user@example.com',
  'agent@example.com', 
  'merchant@example.com',
  'admin@example.com'
);
```

## Success Criteria

All tests pass when:
- [x] All three role types can register successfully
- [x] Each role redirects to the correct dashboard on login
- [x] RoleGuard correctly blocks unauthorized access
- [x] Users cannot modify their own roles
- [x] Admins can access all routes
- [x] RLS policies work correctly
- [x] Session persists across page refreshes
- [x] Logout and re-login work correctly

## Reporting Issues

If any test fails, gather the following information:
1. Browser console logs
2. Network tab showing API calls
3. Database query results for the affected user
4. Screenshots of error messages
5. Steps to reproduce

Report in the PR or create a new issue with this information.
