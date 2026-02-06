# Registration Email Confirmation - Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the email confirmation fix for user registration. The issue affects Merchant/Importer, Technician/Craftsman, and Private Seller account types.

---

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure the following environment variables are set in your hosting environment:

```bash
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Required for production - must match Supabase Site URL
VITE_SITE_URL=https://mobilemorocco.com
# OR
VITE_SITE_URL=https://www.mobilemorocco.com

# Optional
VITE_APP_ENV=production
```

**Important:**
- `VITE_SITE_URL` must match exactly with the Site URL configured in Supabase Dashboard
- Choose ONE canonical domain (with or without `www`)
- Do NOT mix `www` and non-`www` domains between frontend and Supabase config

### 2. Supabase Dashboard Configuration

This is the **MOST CRITICAL** step. Follow these instructions carefully.

#### A. Configure Site URL

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: **Mobile Morocco**
3. Navigate to **Authentication** → **URL Configuration**
4. Set **Site URL** to your production domain:

```
https://mobilemorocco.com
```

OR (if using www subdomain):

```
https://www.mobilemorocco.com
```

**⚠️ Critical Rules:**
- Use ONLY ONE canonical domain
- Do NOT include any path (no `/auth/callback`)
- Must be HTTPS in production
- Must match your `VITE_SITE_URL` environment variable

#### B. Configure Redirect URLs

Add the following URLs to the **Redirect URLs** allowlist:

**For `https://mobilemorocco.com`:**
```
https://mobilemorocco.com/**
https://mobilemorocco.com/auth/callback
https://mobilemorocco.com/auth/confirm
https://mobilemorocco.com/auth/login
https://mobilemorocco.com/auth/register
```

**For `https://www.mobilemorocco.com`:**
```
https://www.mobilemorocco.com/**
https://www.mobilemorocco.com/auth/callback
https://www.mobilemorocco.com/auth/confirm
https://www.mobilemorocco.com/auth/login
https://www.mobilemorocco.com/auth/register
```

**Optional - Development URLs (do NOT use in production):**
```
http://localhost:5173/**
http://localhost:5173/auth/callback
```

#### C. Remove Non-Production URLs

**❌ Remove these from production configuration:**
- Any `*.tempo.build` domains
- Preview URLs (e.g., `*-preview.vercel.app`)
- Development URLs (e.g., `localhost`)
- Any old or unused domains

#### D. Verify Email Template

1. Go to **Authentication** → **Email Templates** → **Confirm signup**
2. Verify the template uses the correct variable:

```html
<a href="{{ .ConfirmationURL }}">Confirm your email</a>
```

3. Click **Save** if you made any changes

---

## Deployment Steps

### Step 1: Deploy Frontend Changes

The following files have been updated and need to be deployed:

```
src/services/authService.ts
src/pages/auth/AuthCallbackPage.tsx
src/pages/auth/LoginPage.tsx
SUPABASE_AUTH_CONFIG.md
REGISTRATION_CONFIRMATION_DEPLOYMENT_GUIDE.md
```

**Deploy using your standard deployment process:**

```bash
# Example for Vercel
vercel --prod

# Example for Netlify
netlify deploy --prod

# Example for manual deployment
npm run build
# Then upload dist/ folder to your hosting provider
```

### Step 2: Verify Environment Variables

After deployment, verify environment variables are set correctly:

1. Check your hosting provider's dashboard
2. Confirm `VITE_SITE_URL` is set to your production domain
3. Confirm it matches the Supabase Site URL exactly

### Step 3: Test Email Confirmation Flow

**Important:** Test BEFORE announcing the fix to users.

#### Test 1: New User Registration

1. **Create a test account:**
   - Go to `/auth/register`
   - Choose account type: **Merchant / Importer**
   - Fill in all required fields
   - Use a real email address you can access
   - Submit the form

2. **Check for success message:**
   - ✅ Should show "Registration successful! Please check your email..."
   - ✅ Should redirect to login page with success message

3. **Check your email:**
   - ✅ Should receive confirmation email within 1-2 minutes
   - ✅ Check spam folder if not in inbox
   - ✅ Inspect the confirmation link URL - should point to your production domain

4. **Click the confirmation link:**
   - ✅ Should redirect to `/auth/callback`
   - ✅ Should show "Confirming your email..." with loading spinner
   - ✅ After 2 seconds, should redirect to `/merchant` dashboard
   - ✅ Dashboard should load correctly

5. **Test login:**
   - Log out
   - Log back in with the test account credentials
   - ✅ Should redirect to `/merchant` dashboard
   - ✅ No errors should appear

#### Test 2: Resend Confirmation Email

1. **Attempt to log in with unconfirmed account:**
   - Try to log in before confirming email
   - ✅ Should see error: "Please verify your email address before logging in..."
   - ✅ Should see "Resend Confirmation Email" button

2. **Click "Resend Confirmation Email":**
   - ✅ Should see loading state
   - ✅ Should show success message: "A new confirmation email has been sent..."

3. **Check email and confirm:**
   - Check inbox for new confirmation email
   - Click confirmation link
   - ✅ Should work as in Test 1

#### Test 3: Expired/Invalid Confirmation Link

1. **Use an old or modified confirmation link:**
   - Try to access a link that was already used
   - OR manually modify the token in the URL

2. **Expected behavior:**
   - ✅ Should show "Confirmation failed" page
   - ✅ Should show error message: "This confirmation link has expired or is invalid..."
   - ✅ Should show "Resend Confirmation Email" form
   - ✅ Enter email and submit
   - ✅ Should show success message

#### Test 4: Different Account Types

Repeat Test 1 for each account type:

- ✅ **Technician / Craftsman** → Should redirect to `/agent` dashboard
- ✅ **Private Seller** → Should redirect to `/dashboard`
- ✅ (Optional) **Admin** → Should redirect to `/admin` dashboard

---

## Post-Deployment Monitoring

### Monitor Auth Logs

1. Go to Supabase Dashboard → **Logs** → **Auth Logs**
2. Filter by `level: error` to see any authentication errors
3. Look for:
   - Redirect URL errors
   - Token validation errors
   - Session exchange errors

### Monitor User Signups

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Check that new users have `email_confirmed_at` set after confirmation
3. If users have `null` in `email_confirmed_at`, they couldn't confirm their email

### User Feedback Channels

Monitor your support channels for:
- "Can't confirm email" reports
- "Invalid confirmation link" errors
- "Can't log in" after registration

---

## Rollback Plan

If issues occur after deployment:

### Quick Fix: Manual Email Verification

For users stuck with unconfirmed emails:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find the user by email
3. Click on the user
4. Manually set `email_confirmed_at` to current timestamp
5. User can now log in

### Code Rollback

If critical issues occur:

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or rollback via hosting provider
vercel rollback
# or
netlify rollback
```

### Supabase Config Rollback

If Supabase configuration causes issues:

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add back temporary/preview URLs if needed
3. Update Site URL if there's a domain issue

---

## Common Issues & Solutions

### Issue 1: Still Getting "Invalid Confirmation Link"

**Possible Causes:**
- Redirect URLs not saved properly
- Domain mismatch between frontend and Supabase
- Email template using wrong variable

**Solutions:**
1. Double-check Redirect URLs in Supabase Dashboard
2. Verify `VITE_SITE_URL` matches Supabase Site URL exactly
3. Wait 5-10 minutes for configuration changes to propagate
4. Clear browser cache and cookies
5. Check Supabase Auth Logs for specific error

### Issue 2: Email Not Received

**Possible Causes:**
- Email provider blocking Supabase emails
- Incorrect email address
- Supabase email quota exceeded

**Solutions:**
1. Check spam/junk folder
2. Verify email address is correct
3. Check Supabase Dashboard → **Logs** → **Auth Logs** for email delivery status
4. Try resending confirmation email
5. If persistent, check Supabase email quotas

### Issue 3: Redirect After Confirmation Goes to Wrong Dashboard

**Possible Causes:**
- Role not set correctly in profiles table
- AuthCallback logic error

**Solutions:**
1. Check user's role in `public.profiles` table
2. Verify role matches account type selected during registration
3. Check browser console for errors
4. Review AuthCallbackPage code logic

### Issue 4: "Profile not found" Error

**Possible Causes:**
- Database trigger not firing during signup
- Profile not created in `public.profiles` table

**Solutions:**
1. Check if user exists in `auth.users` table
2. Check if corresponding profile exists in `public.profiles` table
3. If profile missing, create manually:
   ```sql
   INSERT INTO public.profiles (id, email, role, full_name, created_at)
   VALUES (
     'user-uuid-from-auth-users',
     'user@email.com',
     'merchant', -- or 'agent', 'user', 'admin'
     'Full Name',
     NOW()
   );
   ```
4. Review database triggers for profile creation

---

## Success Metrics

Monitor these metrics after deployment:

### Week 1

- **Registration Completion Rate:** % of users who confirm email after registration
  - Target: >90%
  - Previous: ~50% (many failed)

- **Confirmation Error Rate:** % of confirmation attempts that fail
  - Target: <5%
  - Previous: ~40%

- **Support Tickets:** Number of "can't confirm email" tickets
  - Target: <5 per week
  - Previous: 10-15 per week

### Week 2-4

- **User Onboarding Time:** Time from registration to first login
  - Target: <10 minutes average
  - Previous: 1-2 hours (due to manual fixes)

- **Resend Email Usage:** Number of times users use "Resend Confirmation Email"
  - Target: <20% of registrations
  - If higher, investigate email delivery issues

---

## Maintenance

### Weekly Tasks

- [ ] Review Supabase Auth Logs for errors
- [ ] Check for users with unconfirmed emails older than 7 days
- [ ] Monitor support tickets related to email confirmation
- [ ] Verify redirect URLs are still correct in Supabase Dashboard

### Monthly Tasks

- [ ] Analyze registration completion rates
- [ ] Review and update email templates if needed
- [ ] Check for any changes in Supabase Auth API
- [ ] Update documentation if processes change

---

## Support & Documentation

### For Developers

- **Code Changes:** See PR description and commit history
- **Technical Details:** See `SUPABASE_AUTH_CONFIG.md`
- **Architecture:** See `AUTH_IMPLEMENTATION_SUMMARY.md`

### For Support Team

- **Manual Email Verification:** See "Quick Fix: Manual Email Verification" above
- **Common User Issues:** See "Common Issues & Solutions" above
- **Escalation:** If issue persists after manual verification, escalate to dev team

### For End Users

- **Can't Confirm Email:** Click "Resend Confirmation Email" on login page
- **Didn't Receive Email:** Check spam folder, try resending
- **Still Having Issues:** Contact support at support@mobilemorocco.com

---

## Appendix: Environment-Specific Configurations

### Production

```bash
VITE_SITE_URL=https://mobilemorocco.com
VITE_APP_ENV=production
```

Supabase Site URL: `https://mobilemorocco.com`

Supabase Redirect URLs:
```
https://mobilemorocco.com/**
https://mobilemorocco.com/auth/callback
```

### Staging (if applicable)

```bash
VITE_SITE_URL=https://staging.mobilemorocco.com
VITE_APP_ENV=development
```

Supabase Site URL: `https://staging.mobilemorocco.com`

Supabase Redirect URLs:
```
https://staging.mobilemorocco.com/**
https://staging.mobilemorocco.com/auth/callback
```

### Local Development

```bash
VITE_SITE_URL=http://localhost:5173
VITE_APP_ENV=development
```

Supabase Site URL: Keep production URL

Supabase Redirect URLs: Add temporarily for testing
```
http://localhost:5173/**
http://localhost:5173/auth/callback
```

---

**Last Updated:** 2026-01-27
**Version:** 1.0
**Status:** Ready for Production Deployment
