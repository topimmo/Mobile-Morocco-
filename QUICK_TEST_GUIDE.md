# Quick Start: Testing Registration Fix

This guide helps you quickly test the registration fix for all three user roles.

## Prerequisites

Before testing, ensure the database migration has been applied. See `DEPLOYMENT_GUIDE_REGISTRATION_FIX.md` for deployment instructions.

## Quick Test Procedure

### Method 1: Visual Testing (Recommended for First Test)

Open your browser's Developer Console (F12) to see detailed logs during registration.

#### Test 1: Private Seller (Should Already Work)

1. Navigate to your app's registration page: `/auth/register`
2. Select **"Particulier / Vendeur individuel"** (Individual/Private Seller)
3. Fill in:
   - Full Name: `Test User`
   - Email: `test-user@example.com`
   - Phone: `+212600000001`
   - City: `Casablanca`
   - Password: `test123456`
   - Confirm Password: `test123456`
4. Click **"Créer le compte"** (Create Account)

**Expected Result**:
- ✅ Redirect to login page with success message
- ✅ In Dev Console: `✅ User registered successfully: { role: 'user', ... }`

#### Test 2: Technician/Craftsman (Previously Failing - Should Now Work)

1. Navigate to `/auth/register`
2. Select **"Technicien / Artisan"** (Technician/Craftsman)
3. Fill in:
   - Full Name: `Test Technician`
   - Email: `test-agent@example.com`
   - Phone: `+212600000002`
   - City: `Rabat`
   - Password: `test123456`
   - Confirm Password: `test123456`
4. Click **"Créer le compte"**

**Expected Result**:
- ✅ Redirect to login page with success message
- ✅ In Dev Console: `✅ User registered successfully: { role: 'agent', ... }`

**If you see an error**:
- Look for `🔴 Sign up error details:` in console
- Note the error `code` and `message`
- Check Supabase Dashboard → Logs for trigger errors

#### Test 3: Store/Importer (Previously Failing - Should Now Work)

1. Navigate to `/auth/register`
2. Select **"Boutique / Importateur"** (Shop/Importer)
3. Fill in:
   - Full Name: `Test Store`
   - Email: `test-merchant@example.com`
   - Phone: `+212600000003`
   - City: `Marrakech`
   - Password: `test123456`
   - Confirm Password: `test123456`
4. Click **"Créer le compte"**

**Expected Result**:
- ✅ Redirect to login page with success message
- ✅ In Dev Console: `✅ User registered successfully: { role: 'merchant', ... }`

### Method 2: Automated Testing (After Manual Verification)

You can create a simple test script to verify all registrations work:

```javascript
// Run this in your browser console on the registration page

async function testAllRoles() {
  const roles = [
    { ui: 'individual', db: 'user', email: 'auto-test-user@example.com' },
    { ui: 'technician', db: 'agent', email: 'auto-test-agent@example.com' },
    { ui: 'shop', db: 'merchant', email: 'auto-test-merchant@example.com' },
  ];
  
  for (const role of roles) {
    console.log(`Testing ${role.ui} registration...`);
    
    // Navigate to registration with role
    window.location.href = `/auth/register?role=${role.ui}`;
    
    // Wait for page load (you'll need to manually continue from here)
    // Fill in form and submit, checking for success
  }
}

// Note: This is a manual helper. For full automation, use Playwright tests.
```

## Verification in Supabase Dashboard

After each successful registration, verify the data:

1. **Go to Supabase Dashboard** → Authentication → Users
   - Find the newly registered user
   - Check email matches

2. **Go to Supabase Dashboard** → Table Editor → profiles
   - Find the profile by user ID
   - Verify:
     - ✅ `role` = 'user' | 'agent' | 'merchant' (matches role selected)
     - ✅ `email` matches registration email
     - ✅ `full_name` has the entered name
     - ✅ `phone` has the phone number (if provided)
     - ✅ `city` has the city (if provided)

## Dev Console Logs to Look For

### Success Logs (in dev mode)

```
🔵 [DEV] Registration attempt: { role: 'agent', email: '...', ... }
✅ User registered successfully: { id: '...', email: '...', role: 'agent' }
✅ [DEV] Registration successful with metadata: { ... }
```

### Error Logs (if something fails)

```
🔴 Sign up error details: { message: '...', code: '...', ... }
🔴 [DEV] Full error context: { attemptedRole: 'merchant', ... }
```

## Common Issues and Quick Fixes

### Issue: "Unable to complete registration"

**Check**:
1. Browser console for error code
2. Supabase Dashboard → Logs → Postgres Logs for trigger errors

**Quick Fix**:
- Verify migration was applied: Run the migration SQL again in Supabase SQL Editor
- Check RLS policies exist: `SELECT * FROM pg_policies WHERE tablename = 'profiles';`

### Issue: "This email is already registered"

**Solution**: Use a different email address or delete the test user from Supabase Auth.

### Issue: Profile not created in profiles table

**Check**:
1. Supabase Dashboard → Logs for trigger errors
2. Run manually:
   ```sql
   SELECT * FROM profiles WHERE email = 'test-agent@example.com';
   ```

**Quick Fix**: Re-run the migration to fix the trigger.

## Production Testing Checklist

Before marking as complete:

- [ ] Private Seller registration works
- [ ] Technician/Craftsman registration works
- [ ] Store/Importer registration works
- [ ] All profiles created with correct role in database
- [ ] Users can log in after registration
- [ ] No errors in Supabase logs
- [ ] Dev console shows no unexpected errors

## Next Steps After Successful Testing

1. Mark all tests as passed
2. Monitor production registrations for 24-48 hours
3. Check Supabase logs for any unexpected errors
4. Update user documentation if needed

## Getting Help

If tests fail:
1. Collect error logs from browser console
2. Check Supabase Postgres logs
3. Verify migration was applied
4. See `DEPLOYMENT_GUIDE_REGISTRATION_FIX.md` for detailed troubleshooting
