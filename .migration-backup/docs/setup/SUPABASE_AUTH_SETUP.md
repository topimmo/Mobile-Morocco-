# Supabase Authentication Setup Guide

This guide explains how to configure Supabase for email confirmation to work properly with the production application.

## Issue Fixed

Previously, email confirmation links from Supabase were redirecting to incorrect domains (e.g., `*.tempo.build` or Vercel preview URLs), causing 502 Bad Gateway errors.

## Solution Implemented

1. **Auth Callback Route**: Added `/auth/callback` route that handles PKCE flow
2. **Email Redirect Configuration**: Updated signup to use production domain
3. **Error Handling**: Added user-friendly error messages

## Supabase Dashboard Configuration

### Required Settings in Supabase Dashboard

Navigate to **Authentication → URL Configuration** in your Supabase project:

#### 1. Site URL
Set to your production domain:
```
https://your-production-domain.com
```
Or for www subdomain:
```
https://www.your-production-domain.com
```

#### 2. Redirect URLs
Add the following URLs (add both if you use www):
```
https://your-production-domain.com/auth/callback
https://www.your-production-domain.com/auth/callback
```

For local development, also add:
```
http://localhost:5173/auth/callback
```

#### 3. Email Templates (Optional)
Update the confirmation email template to use the callback route:
- Go to **Authentication → Email Templates**
- Edit "Confirm signup" template
- Ensure the confirmation link uses: `{{ .ConfirmationURL }}`
- The URL will automatically redirect to your configured Site URL + `/auth/callback`

## How It Works

### Email Signup Flow

1. User registers with email and password
2. Supabase sends confirmation email with magic link
3. User clicks the link in email
4. Link contains a `code` parameter (PKCE flow)
5. User is redirected to `/auth/callback`
6. The callback page:
   - Extracts the `code` from URL
   - Calls `supabase.auth.exchangeCodeForSession(code)`
   - Shows success/error message
   - Redirects to dashboard on success

### Code Reference

The auth callback handler is in: `src/pages/auth/AuthCallbackPage.tsx`

The signup function with redirect is in: `src/lib/supabase/auth.ts`

## Testing

### Test Email Confirmation

1. Register a new account at `/auth/register`
2. Check your email for confirmation link
3. Click the confirmation link
4. Should redirect to `/auth/callback` and show "Confirming your email..."
5. Should then redirect to `/dashboard` with success message

### Troubleshooting

**Problem**: Still getting 502 errors
- **Solution**: Verify Site URL and Redirect URLs are correct in Supabase dashboard
- **Solution**: Clear browser cache and cookies
- **Solution**: Check that production domain exactly matches Supabase settings

**Problem**: "Invalid confirmation link" error
- **Solution**: Link may have expired (default 24h)
- **Solution**: Request a new confirmation email
- **Solution**: Ensure the link hasn't been used already

**Problem**: Redirects to wrong domain
- **Solution**: Update Site URL in Supabase to production domain
- **Solution**: Remove any temporary/preview domains from Redirect URLs

## Environment Variables

Ensure these are set in your production environment:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Security Notes

- The callback route is public (no authentication required)
- It uses PKCE flow which is secure for public clients
- The code is single-use and expires after exchange
- Error messages don't expose sensitive information

## Related Files

- `src/pages/auth/AuthCallbackPage.tsx` - Callback handler
- `src/lib/supabase/auth.ts` - Auth functions including signup
- `src/App.tsx` - Route definition for `/auth/callback`
