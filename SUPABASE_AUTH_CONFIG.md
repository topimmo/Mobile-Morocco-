# Supabase Authentication Configuration

This document provides step-by-step instructions for configuring Supabase Authentication to fix the 502 Bad Gateway error after email confirmation.

## Problem

After users sign up and receive email confirmation, clicking the confirmation link results in:
- **502 Bad Gateway** error (often on preview/tempo domains)
- Redirect to incorrect URLs

## Root Cause

The issue is caused by incorrect redirect URL configuration in Supabase Console. Supabase only allows redirects to pre-approved URLs for security reasons.

## Solution: Configure Authentication URLs in Supabase Console

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project: **Mobile Morocco**

### Step 2: Navigate to Authentication Settings

1. In the left sidebar, click on **Authentication** (shield icon)
2. Click on **URL Configuration** tab

### Step 3: Configure Site URL

The Site URL is the default redirect after authentication.

**Set Site URL to:**
```
https://mobilemorocco.com
```

> ⚠️ **Important**: Use your production domain. Do NOT include `/auth/callback` or any path - just the base domain.

### Step 4: Configure Redirect URLs

Add the following URLs to the **Redirect URLs** allowlist (one per line):

```
https://mobilemorocco.com/**
https://mobilemorocco.com/auth/**
https://mobilemorocco.com/auth/callback
https://mobilemorocco.com/auth/confirm
```

**Explanation:**
- `https://mobilemorocco.com/**` - Allows redirects to any path on your domain
- `https://mobilemorocco.com/auth/**` - Explicitly allows all auth routes
- `https://mobilemorocco.com/auth/callback` - Email confirmation callback
- `https://mobilemorocco.com/auth/confirm` - Alternative confirmation endpoint

### Step 5: Remove Non-Production URLs

**Remove or disable these URLs from the allowlist:**

❌ Remove:
- Any `*.tempo.build` domains
- Preview URLs (e.g., `*-preview.vercel.app`)
- Old Vercel preview URLs
- `localhost` URLs (if this is production)

> 💡 **Note**: For development/testing, you can add `http://localhost:3000/**` back temporarily.

### Step 6: Configure Email Templates (Optional but Recommended)

1. Go to **Authentication** → **Email Templates**
2. For **Confirm signup** template:
   - Ensure the confirmation link uses: `{{ .ConfirmationURL }}`
   - The redirect should go to: `/auth/callback`

Example template snippet:
```html
<a href="{{ .ConfirmationURL }}">Confirm your email</a>
```

### Step 7: Save Changes

1. Click **Save** at the bottom of the page
2. Wait a few seconds for changes to propagate

## Verification

### Test Email Confirmation Flow

1. **Sign up a new test user** using a real email address
2. **Check your email** for the confirmation link
3. **Click the confirmation link**
4. **Expected Result**: 
   - ✅ You should be redirected to `https://mobilemorocco.com/auth/callback`
   - ✅ The page shows "Confirming your email..."
   - ✅ After 2 seconds, you're redirected to the appropriate dashboard based on your role:
     - Admin → `/admin`
     - Agent → `/agent`
     - Merchant → `/merchant`
     - User → `/dashboard`

5. **NOT Expected**:
   - ❌ 502 Bad Gateway error
   - ❌ Redirect to tempo.build or preview domains
   - ❌ Redirect to localhost in production

### Test Login Flow

1. **Log in** with existing credentials
2. **Expected Result**:
   - ✅ Redirected to role-specific dashboard
   - ✅ All buttons are clickable
   - ✅ No overlay blocking interactions

## Additional Configuration (Advanced)

### Email Redirect URL in Code

The frontend code sets the redirect URL when signing up:

```typescript
// src/lib/supabase/auth.ts
options: {
  emailRedirectTo: `${window.location.origin}/auth/callback`,
}
```

This should automatically use your production domain. No code changes needed.

### Environment Variables

Ensure your `.env` file has:
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Troubleshooting

### Still Getting 502 Error?

1. **Clear browser cache** and try again
2. **Check Supabase logs**:
   - Go to Supabase Dashboard → Logs → Auth Logs
   - Look for redirect errors
3. **Verify redirect URLs** are saved correctly in Supabase Console
4. **Wait 5 minutes** - sometimes changes take a moment to propagate

### Buttons Not Clickable?

This is usually a frontend issue with loading states or overlays. See the main implementation documentation.

### Still Having Issues?

1. Check Supabase status: [https://status.supabase.com](https://status.supabase.com)
2. Review Supabase logs in Dashboard
3. Check browser console for errors
4. Verify user exists in both `auth.users` and `public.profiles` tables

## Summary

**Critical Settings:**
- ✅ Site URL: `https://mobilemorocco.com`
- ✅ Redirect URLs: Include production domain with `/**` wildcard
- ✅ Remove non-production domains from allowlist

After configuration, email confirmation should redirect correctly without 502 errors.
