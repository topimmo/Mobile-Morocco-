# User Registration & Login Flow - Fix Documentation

## Root Cause Analysis

### Issues Identified

1. **Multiple Supabase Client Instances**
   - **Problem**: Two separate Supabase client files existed:
     - `/src/lib/supabase/client.ts` (newer, typed with Database)
     - `/src/utils/supabaseClient.ts` (older, legacy with demo mode)
   - **Impact**: Caused "multiple GoTrueClient instances" warnings and potential session inconsistencies
   - **Solution**: Consolidated by making the old client re-export from the new one

2. **Missing RLS Policies for Profile Creation**
   - **Problem**: The profiles table had RLS enabled but only allowed service role to INSERT profiles
   - **Impact**: When the database trigger failed or didn't execute, users couldn't create their profiles manually
   - **Root Cause**: "Database error saving new user" occurred because authenticated users had no INSERT permission
   - **Solution**: Added RLS policy to allow authenticated users to INSERT their own profile as a backup

3. **Schema Column Mismatch**
   - **Problem**: Different migrations created conflicting column names:
     - Trigger expected: `role`, `full_name`, `phone`, `city`
     - Old migrations had: `userType`, `firstName`, `lastName`, `phoneNumber`
   - **Impact**: Even if INSERT succeeded, data wasn't properly stored
   - **Solution**: Migration adds missing columns and handles backward compatibility

4. **Hardcoded Redirect URLs**
   - **Problem**: Auth redirects used `window.location.origin` which works locally but fails in production
   - **Impact**: Email verification links would redirect to wrong domain (e.g., Vercel preview instead of production)
   - **Solution**: Added `VITE_SITE_URL` environment variable and `getSiteUrl()` helper

5. **Poor Error Handling**
   - **Problem**: Generic error messages like "Database error" weren't helpful
   - **Impact**: Users and developers couldn't diagnose issues
   - **Solution**: Added comprehensive error logging and user-friendly error messages

## Changes Made

### 1. Database Migration (`20260127000001_fix_profile_creation_and_rls.sql`)

**Purpose**: Ensure reliable profile creation with proper RLS policies

**Key Changes**:
- ✅ Adds `role`, `full_name`, `phone`, `city`, `created_at`, `updated_at` columns if missing
- ✅ Handles backward compatibility (copies data from `phoneNumber` to `phone` if needed)
- ✅ Creates comprehensive RLS policies:
  - `users_select_own_profile`: Users can SELECT their own profile
  - `admins_select_all_profiles`: Admins can SELECT all profiles
  - `users_insert_own_profile`: Users can INSERT their own profile (backup if trigger fails)
  - `users_update_own_profile`: Users can UPDATE their profile except role/id
  - `admins_update_all_profiles`: Admins can UPDATE any profile
- ✅ Improves trigger function with ON CONFLICT handling to prevent duplicate key errors
- ✅ Adds error handling in trigger (logs warning but doesn't fail user creation)
- ✅ Creates indexes for better performance

**SQL Policies Created**:
```sql
-- Users can view their own profile
CREATE POLICY "users_select_own_profile" ON profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Users can insert their own profile (backup)
CREATE POLICY "users_insert_own_profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

-- Users can update their profile (except role)
CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (role IS NULL OR role = (SELECT role FROM profiles WHERE id = auth.uid()))
  );
```

### 2. Supabase Client Consolidation

**Files Changed**:
- `/src/utils/supabaseClient.ts` - Now re-exports from canonical client
- `/src/lib/supabase/client.ts` - The single source of truth for Supabase client

**Benefits**:
- ✅ Single client instance (no more GoTrueClient warnings)
- ✅ Consistent session management
- ✅ Backward compatible (old imports still work)

### 3. Enhanced Error Handling

**Files Changed**:
- `/src/services/authService.ts` - `signUpWithRole()` and `signInAndRedirect()`

**Improvements**:
- ✅ Logs full error details: `message`, `status`, `code`, `details`, `hint`
- ✅ User-friendly error messages:
  - "Database error" → "Unable to complete registration. Please try again..."
  - "already registered" → "This email is already registered. Please try logging in..."
  - "Invalid login credentials" → "Invalid email or password. Please check..."
- ✅ Success logging for debugging

### 4. Production Redirect URLs

**Files Changed**:
- `/src/config/env.ts` - Added `SITE_URL` and `getSiteUrl()` helper
- `/src/services/authService.ts` - Uses `getSiteUrl()`
- `/src/lib/supabase/auth.ts` - Uses `getSiteUrl()`
- `/.env.example` - Documented new variable

**Usage**:
```bash
# Set in production environment (Vercel, Netlify, etc.)
VITE_SITE_URL=https://mobilemorocco.com
# or
VITE_SITE_URL=https://www.mobilemorocco.com
```

**Fallback**: If not set, falls back to `window.location.origin` (works for local dev)

## Deployment Steps

### 1. Database Migration

**Option A: Automatic (Supabase CLI)**
```bash
# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migration
supabase db push
```

**Option B: Manual (Supabase Dashboard)**
1. Go to Supabase Dashboard → SQL Editor
2. Copy contents of `supabase/migrations/20260127000001_fix_profile_creation_and_rls.sql`
3. Run the SQL
4. Verify no errors

### 2. Environment Variables

**Vercel/Netlify/Other Hosting**:
1. Add environment variable: `VITE_SITE_URL=https://mobilemorocco.com`
2. Also ensure these are set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

**Local Development**:
```bash
# Create .env file from example
cp .env.example .env

# Edit .env and set:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SITE_URL=http://localhost:5173  # Optional for local
```

### 3. Supabase Auth Configuration

**Important**: Update Supabase Auth settings to allow your domain(s)

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add to "Redirect URLs":
   - `https://mobilemorocco.com/auth/callback`
   - `https://www.mobilemorocco.com/auth/callback`
   - `https://mobilemorocco.com/**` (wildcard)
   - `https://www.mobilemorocco.com/**` (wildcard)
   - Add Vercel preview domains if needed: `https://*.vercel.app/**`

3. Set "Site URL": `https://mobilemorocco.com`

### 4. Deploy Code

```bash
# Build and deploy
npm run build

# Or deploy via Git (automatic on Vercel/Netlify)
git push
```

## Manual Test Plan

### Test 1: New User Registration

**Steps**:
1. Navigate to `/auth/register`
2. Select account type (Shop/Technician/Individual)
3. Fill in registration form:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Phone: "+212600000000"
   - City: "Casablanca"
   - Password: "test123456"
   - Confirm Password: "test123456"
4. Click "Create Account"

**Expected Results**:
- ✅ No "Database error saving new user" error
- ✅ Redirect to `/auth/login?registered=true`
- ✅ Success message shown
- ✅ Check Supabase Dashboard → Authentication → Users → New user created
- ✅ Check Supabase Dashboard → Table Editor → profiles → Profile row created with:
  - `id` matches auth user ID
  - `email` matches registration email
  - `role` matches selected account type (user/agent/merchant)
  - `full_name` has the name entered
  - `phone` has the phone number
  - `city` has the city

**Check Browser Console**:
- ✅ No errors
- ✅ Log: "User registered successfully: {id, email, role}"
- ✅ NO "multiple GoTrueClient instances" warning

### Test 2: Duplicate Email Registration

**Steps**:
1. Try to register again with the same email from Test 1

**Expected Results**:
- ✅ Error message: "This email is already registered. Please try logging in instead."
- ✅ No registration created

### Test 3: Login with Registered User

**Steps**:
1. Navigate to `/auth/login`
2. Enter email and password from Test 1
3. Click "Login"

**Expected Results**:
- ✅ Successful login
- ✅ Redirect based on role:
  - `user` → `/dashboard`
  - `merchant` → `/merchant`
  - `agent` → `/agent`
  - `admin` → `/admin`
- ✅ User session persisted (check localStorage for Supabase session)

**Check Browser Console**:
- ✅ Log: "Sign in successful: {userId, email, role, redirectPath}"
- ✅ No errors

### Test 4: Invalid Login Credentials

**Steps**:
1. Navigate to `/auth/login`
2. Enter incorrect email or password

**Expected Results**:
- ✅ Error message: "Invalid email or password. Please check your credentials and try again."
- ✅ No redirect

### Test 5: Email Verification (if enabled)

**Steps**:
1. Register a new user
2. Check email inbox for verification email
3. Click verification link

**Expected Results**:
- ✅ Verification link redirects to: `https://mobilemorocco.com/auth/callback` (not localhost or preview domain)
- ✅ After verification, redirect to login or dashboard
- ✅ User's `email_confirmed_at` timestamp set in auth.users table

### Test 6: Session Persistence

**Steps**:
1. Login successfully
2. Close browser tab
3. Reopen application
4. Navigate to a protected route

**Expected Results**:
- ✅ User still logged in
- ✅ No need to login again
- ✅ Session auto-refreshes when expired

### Test 7: Logout

**Steps**:
1. While logged in, click logout button
2. Try to access protected route

**Expected Results**:
- ✅ User logged out
- ✅ Redirect to login page
- ✅ Session cleared from localStorage

### Test 8: Production Domain vs Preview Domain

**For Vercel Deployments**:

**Preview Domain Test**:
1. Deploy to Vercel preview (e.g., `https://mobile-morocco-git-main-username.vercel.app`)
2. Register/login on preview domain

**Production Domain Test**:
1. Deploy to production (e.g., `https://mobilemorocco.com`)
2. Register/login on production domain

**Expected Results**:
- ✅ Both domains work independently
- ✅ Email verification links go to production domain (if VITE_SITE_URL is set to production)
- ✅ OR preview domain (if VITE_SITE_URL not set, uses window.location.origin)

## Troubleshooting

### Issue: "Database error saving new user"

**Possible Causes**:
1. Migration not applied
2. RLS policies not created
3. Trigger function failed

**Debug Steps**:
```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check if function exists
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Try manual profile insert (as authenticated user)
INSERT INTO profiles (id, email, role) 
VALUES (auth.uid(), 'test@example.com', 'user');
```

**Fix**:
1. Run migration again
2. Check Supabase logs for trigger errors
3. Verify user has INSERT permission

### Issue: "multiple GoTrueClient instances"

**Possible Causes**:
1. Multiple Supabase clients created
2. Client created in multiple places

**Debug Steps**:
```bash
# Search for createClient calls
grep -r "createClient" src/
```

**Fix**:
1. Ensure only `/src/lib/supabase/client.ts` creates the client
2. All other files should import from there

### Issue: Email verification redirects to wrong domain

**Possible Causes**:
1. `VITE_SITE_URL` not set in production
2. Wrong domain in Supabase Auth settings

**Fix**:
1. Set `VITE_SITE_URL=https://mobilemorocco.com` in hosting environment
2. Update Supabase Dashboard → Authentication → URL Configuration
3. Add production domain to redirect URLs

### Issue: Role-based redirect not working

**Possible Causes**:
1. Profile doesn't have `role` column
2. Role not set correctly

**Debug Steps**:
```sql
-- Check user's role
SELECT id, email, role FROM profiles WHERE email = 'test@example.com';
```

**Fix**:
1. Run migration to add `role` column
2. Verify trigger sets role from metadata

## Security Considerations

### RLS Policies

**Current Security Model**:
- ✅ Users can only SELECT/INSERT/UPDATE their own profile
- ✅ Users cannot change their own role (prevents privilege escalation)
- ✅ Admins can view and update all profiles
- ✅ Service role has full access (for migrations and triggers)

**Important**:
- ❌ No anonymous access to profiles table
- ❌ Users cannot view other users' profiles (unless explicitly shared)
- ❌ Users cannot delete profiles (no DELETE policy)

### Best Practices

1. **Never expose SUPABASE_SERVICE_KEY to frontend**
   - Only use in backend/edge functions
   - Keep in server environment variables only

2. **Always validate user input**
   - Email format
   - Password strength (min 6 chars enforced by Supabase)
   - Role must be valid: user/agent/merchant/admin

3. **Use HTTPS in production**
   - Ensure `VITE_SITE_URL` uses `https://`
   - Supabase enforces HTTPS

4. **Monitor auth logs**
   - Check Supabase Dashboard → Logs for auth events
   - Look for failed login attempts
   - Monitor trigger execution

## Performance Considerations

**Indexes Created**:
- `profiles_role_idx` - For role-based queries
- `profiles_email_idx` - For email lookups

**Trigger Performance**:
- Trigger executes AFTER INSERT on auth.users
- Uses ON CONFLICT to prevent duplicate errors
- Logs warnings instead of failing on errors

**Expected Performance**:
- Registration: ~500ms - 1s (includes trigger execution)
- Login: ~200ms - 500ms
- Profile fetch: ~50ms - 200ms (with indexes)

## Next Steps

1. **Test in Production**:
   - Deploy to production
   - Test with real email addresses
   - Monitor Supabase logs for errors

2. **Enable Email Verification** (optional):
   - Go to Supabase Dashboard → Authentication → Email
   - Enable "Confirm email"
   - Test email verification flow

3. **Add Rate Limiting** (recommended):
   - Implement rate limiting for registration/login
   - Prevent brute force attacks
   - Use Supabase Rate Limiting or external service

4. **Monitor and Optimize**:
   - Track registration success rate
   - Monitor auth error logs
   - Optimize queries if needed

## Support

If issues persist:
1. Check Supabase Dashboard → Logs
2. Enable verbose logging in authService.ts
3. Test with a fresh user account
4. Verify all environment variables are set correctly
