# Supabase Authentication Configuration Guide

This document provides comprehensive instructions for configuring Supabase Authentication to fix email confirmation failures for user registration.

## 🔴 Problem Overview

### Affected Account Types
- **Merchant / Importer** - Email confirmation fails
- **Technician / Craftsman** - Email confirmation fails  
- **Private Seller** - Account created but login blocked due to unconfirmed email

### Symptoms
During signup, users experience:
1. Sometimes see: "Unable to complete registration"
2. Confirmation email is sent successfully
3. When clicking the confirmation link, page shows: **"Confirmation failed – Invalid confirmation link"**
4. User cannot log in because email remains unconfirmed (`email_confirmed = false`)

### Root Cause
This is **NOT** a frontend or database issue. The root cause is:

**Incorrect Supabase Authentication URL Configuration:**
- Site URL and/or Redirect URLs are misconfigured in Supabase Dashboard
- Domain mismatch (e.g., `mobilemorocco.com` vs `www.mobilemorocco.com`)
- Required auth callback paths are missing (e.g., `/auth/callback`)

**What Happens:**
1. Supabase generates a confirmation link with a redirect URL
2. That redirect URL is not in the allowed list or doesn't match the configured domain
3. The confirmation token is rejected → "Invalid confirmation link" error
4. Result: User is created in Supabase Auth, but email confirmation fails, blocking login

---

## 🔧 Required Fixes

### 1. Supabase Dashboard → Authentication → URL Configuration

#### A. Site URL Configuration

The Site URL is the **default redirect after authentication**. This must be set to your **canonical production domain**.

**✅ Set Site URL to ONE of these (choose your primary domain):**

```
https://mobilemorocco.com
```

**OR**

```
https://www.mobilemorocco.com
```

**⚠️ IMPORTANT:**
- Choose **ONLY ONE** canonical domain (with or without `www`)
- Do **NOT** mix `www` and non-`www` domains
- Do **NOT** include any path like `/auth/callback` - just the base domain
- This should match your production domain exactly

#### B. Redirect URLs Configuration

Add **ALL** authentication-related routes used by your application to the **Redirect URLs** allowlist.

**✅ Add these URLs (replace with your actual domain):**

For `https://mobilemorocco.com`:
```
https://mobilemorocco.com/**
https://mobilemorocco.com/auth/callback
https://mobilemorocco.com/auth/confirm
https://mobilemorocco.com/auth/login
https://mobilemorocco.com/auth/register
```

For `https://www.mobilemorocco.com`:
```
https://www.mobilemorocco.com/**
https://www.mobilemorocco.com/auth/callback
https://www.mobilemorocco.com/auth/confirm
https://www.mobilemorocco.com/auth/login
https://www.mobilemorocco.com/auth/register
```

**Explanation:**
- `/**` - Wildcard allowing redirects to any path on your domain (most permissive)
- `/auth/callback` - **Required** - Email confirmation callback endpoint
- `/auth/confirm` - Alternative confirmation endpoint
- `/auth/login` - Login page redirect
- `/auth/register` - Registration page redirect

**For Development/Testing:**
If you need local development access, add:
```
http://localhost:5173/**
http://localhost:5173/auth/callback
```

**For Staging/Preview Environments:**
Add your staging URLs if applicable:
```
https://staging.mobilemorocco.com/**
https://preview-*.vercel.app/**
```

#### C. Remove Non-Production URLs

**❌ Remove these from the allowlist (for production):**
- Any `*.tempo.build` domains
- Preview URLs (e.g., `*-preview.vercel.app`) unless specifically needed
- Old Vercel preview URLs
- `localhost` URLs (unless you're configuring for development)

### 2. Supabase Dashboard → Authentication → Email Templates

Verify that your email templates use the correct confirmation URL variable.

#### Confirm Signup Template

1. Go to **Authentication** → **Email Templates** → **Confirm signup**
2. Ensure the confirmation link uses the template variable:

```html
<a href="{{ .ConfirmationURL }}">Confirm your email</a>
```

**⚠️ Do NOT:**
- Hardcode domains in the template
- Add custom redirect logic that could break the token
- Modify the `.ConfirmationURL` variable

**Example Full Template:**

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email address</a></p>
```

### 3. Save Changes

1. Click **Save** at the bottom of the configuration page
2. Wait a few seconds for changes to propagate across Supabase's infrastructure
3. Test the email confirmation flow immediately

---

## ✅ How to Verify the Fix

### Test Email Confirmation Flow

1. **Register a new test user**
   - Choose account type: Merchant / Importer
   - Use a real email address you can access
   - Complete the registration form

2. **Check your email**
   - Look for the confirmation email (check spam folder too)
   - Inspect the confirmation link URL - it should point to your configured domain

3. **Click the confirmation link**
   - **Expected Result ✅:**
     - You should be redirected to `https://mobilemorocco.com/auth/callback`
     - The page shows "Confirming your email..."
     - After 2 seconds, you're redirected to the appropriate dashboard based on your role:
       - Admin → `/admin`
       - Agent → `/agent`  
       - Technician → `/agent`
       - Merchant → `/merchant`
       - User → `/dashboard`

   - **NOT Expected ❌:**
     - 502 Bad Gateway error
     - "Invalid confirmation link" error
     - Redirect to `tempo.build` or preview domains
     - Redirect to `localhost` in production

4. **Test Login**
   - Log in with the confirmed account
   - Should redirect to role-specific dashboard
   - All functionality should work normally

5. **Repeat for other account types**
   - Test with Technician / Craftsman account
   - Test with Private Seller account

---

## 🔍 Troubleshooting

### Still Getting "Invalid confirmation link" Error?

1. **Clear browser cache and cookies**
   - Sometimes cached redirects can interfere
   - Try in an incognito/private window

2. **Check Supabase Auth Logs**
   - Go to Supabase Dashboard → **Logs** → **Auth Logs**
   - Look for errors related to redirect URLs
   - Check for messages about invalid redirects

3. **Verify redirect URLs are saved correctly**
   - Double-check the URL Configuration page
   - Ensure there are no typos in the domains
   - Confirm the wildcard `/**` is included

4. **Wait 5-10 minutes**
   - Configuration changes may take a few minutes to propagate
   - Try the confirmation flow again after waiting

5. **Check for domain mismatches**
   - Ensure Site URL matches the domain in Redirect URLs
   - Verify your frontend `.env` has `VITE_SITE_URL` set correctly

### Still Getting 502 Bad Gateway Error?

1. This usually indicates a complete redirect URL mismatch
2. Check that your production domain is in the Redirect URLs list
3. Verify the Site URL is set to your production domain
4. Make sure you didn't accidentally include development URLs in production config

### Email Not Confirmed After Clicking Link?

1. Check Supabase Database:
   - Go to **Authentication** → **Users**
   - Find the user by email
   - Check the `email_confirmed_at` column
   - If it's still `null`, the confirmation didn't complete

2. **Manual Fix for Affected Users:**
   - Go to Supabase Dashboard → **Authentication** → **Users**
   - Click on the user
   - Click "Send confirmation email" or manually set `email_confirmed_at` to current timestamp

### Buttons Not Clickable After Login?

This is a different frontend issue. See the main implementation documentation.

### Users Can't Log In - "Email not confirmed" Error?

**Frontend Improvement Implemented:**
- The login page now shows a "Resend Confirmation Email" button
- Users can request a new confirmation email directly from the login page
- Enhanced error messages explain the issue clearly

---

## 🛠️ Frontend Code Changes (Already Implemented)

The following improvements have been made to the codebase to enhance user experience:

### 1. Resend Confirmation Email Function

Added to `src/services/authService.ts`:

```typescript
export const resendConfirmationEmail = async (email: string): Promise<{ success: boolean; error: string | null }>
```

This function allows users to request a new confirmation email if:
- They didn't receive the original email
- The confirmation link expired
- They accidentally deleted the email

### 2. Improved Error Handling in AuthCallbackPage

`src/pages/auth/AuthCallbackPage.tsx` now:
- Categorizes errors (confirmation, profile, other)
- Shows user-friendly error messages
- Provides a "Resend Confirmation Email" form for confirmation errors
- Displays helpful guidance for different error types

### 3. Enhanced Login Page

`src/pages/auth/LoginPage.tsx` now:
- Detects "email not confirmed" errors during login
- Shows a "Resend Confirmation Email" button automatically
- Displays success message after registration
- Provides clear feedback when resending confirmation emails

### 4. Better Error Messages

All error messages now:
- Explain what went wrong in user-friendly language
- Suggest next steps (resend email, contact support, etc.)
- Distinguish between different types of errors

---

## 📋 Deployment Checklist

Before deploying to production:

- [ ] Set `VITE_SITE_URL` in your hosting environment to your production domain
- [ ] Configure Supabase Site URL to match your production domain (with or without `www`)
- [ ] Add all required Redirect URLs to Supabase Dashboard
- [ ] Remove development/staging URLs from production Supabase config
- [ ] Verify email template uses `{{ .ConfirmationURL }}`
- [ ] Test email confirmation flow with a test account
- [ ] Test all account types: Merchant, Technician, Private Seller
- [ ] Verify login works after email confirmation
- [ ] Check that resend confirmation email feature works

---

## 🆘 Still Having Issues?

If you've followed all steps and are still experiencing problems:

1. **Check Supabase Status:** [https://status.supabase.com](https://status.supabase.com)
2. **Review Supabase Logs:** Dashboard → Logs → Auth Logs
3. **Check Browser Console:** Look for JavaScript errors
4. **Verify Environment Variables:**
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_SITE_URL=https://mobilemorocco.com
   ```
5. **Database Check:**
   - Verify user exists in `auth.users` table
   - Check if profile exists in `public.profiles` table
   - Confirm `email_confirmed_at` is set after confirmation

6. **Contact Support:**
   - Email: support@mobilemorocco.com
   - Include: User email, timestamp, error message, screenshots

---

## 📚 Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Email Confirmation Guide](https://supabase.com/docs/guides/auth/auth-email)
- [URL Configuration](https://supabase.com/docs/guides/auth/redirect-urls)

---

## Summary

**Critical Configuration Requirements:**

✅ **Site URL:** Set to your canonical production domain
  - Example: `https://mobilemorocco.com` OR `https://www.mobilemorocco.com`
  - Choose ONE - don't mix www and non-www

✅ **Redirect URLs:** Include all authentication routes
  - Must include: `https://yourdomain.com/**`
  - Must include: `https://yourdomain.com/auth/callback`
  - Add others as needed

✅ **Email Template:** Use `{{ .ConfirmationURL }}` variable
  - No hardcoded domains
  - No custom redirect logic

✅ **Environment Variable:** Set `VITE_SITE_URL` in hosting environment
  - Must match Supabase Site URL
  - Used for generating confirmation links

After proper configuration:
- Email confirmation works correctly ✅
- Users can log in after confirming email ✅
- No "Invalid confirmation link" errors ✅
- Resend confirmation email feature available ✅

---

**Last Updated:** 2026-01-27
