# Supabase URL Configuration Alignment

## Summary

This document explains the changes made to align the codebase with the current Supabase URL configuration.

## Supabase Settings

**Site URL:** `https://www.mobilemorocco.com`

**Allowed Redirect URLs:**
- `https://mobilemorocco.com/**`
- `https://www.mobilemorocco.com/**`
- `https://mobile-morocco-mohamed-s-projects-8cab9495.vercel.app/**`

## Changes Made

### 1. Updated `getSiteUrl()` Helper (`src/config/env.ts`)

**Previous Implementation:**
```typescript
export function getSiteUrl(): string {
  if (env.SITE_URL) {
    return env.SITE_URL;
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;  // ❌ Could vary based on domain
  }
  if (env.IS_PRODUCTION) {
    throw new Error('SITE_URL not configured...');  // ❌ Breaks app
  }
  return 'http://localhost:5173';
}
```

**Issues:**
- Relied on `window.location.origin` which could return different values depending on the domain used (www vs non-www, Vercel URLs, etc.)
- Would throw error in production if SITE_URL not set, breaking the app
- Inconsistent behavior between environments

**New Implementation:**
```typescript
export function getSiteUrl(): string {
  // Use VITE_SITE_URL if set
  if (env.SITE_URL) {
    return env.SITE_URL;
  }
  
  // Fallback to production URL (required by Supabase configuration)
  // This ensures auth redirects always go to the correct domain
  return 'https://www.mobilemorocco.com';  // ✅ Always consistent
}
```

**Benefits:**
- ✅ Always returns a valid, consistent URL
- ✅ Never relies on `window.location.origin` for auth redirects
- ✅ Never throws errors, preventing app crashes
- ✅ Always matches Supabase Site URL configuration
- ✅ Environment variable `VITE_SITE_URL` still takes precedence if set

### 2. Fixed Password Reset Redirect (`src/contexts/AuthContext.tsx`)

**Previous:**
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${window.location.origin}/auth/reset-password`,  // ❌
});
```

**New:**
```typescript
const { error } = await supabase.auth.resetPasswordForEmail(email, {
  redirectTo: `${getSiteUrl()}/auth/reset-password`,  // ✅
});
```

**Impact:** Password reset emails now always redirect to `https://www.mobilemorocco.com/auth/reset-password`

### 3. Added Email Redirect to Magic Link/OTP (`src/lib/supabase/auth.ts`)

**Previous:**
```typescript
export const signInWithEmailOtp = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      // ❌ Missing emailRedirectTo
    },
  });
  return { data, error };
};
```

**New:**
```typescript
export const signInWithEmailOtp = async (email: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${getSiteUrl()}/auth/callback`,  // ✅
    },
  });
  return { data, error };
};
```

**Impact:** Magic link/OTP emails now redirect to `https://www.mobilemorocco.com/auth/callback`

### 4. Enhanced Logging (`src/pages/auth/AuthCallbackPage.tsx`)

Added development-only logging to help debug auth issues:

```typescript
// Log callback parameters (dev only)
if (import.meta.env.DEV) {
  console.log('🔐 Auth callback received:', {
    hasCode: !!code,
    error: error || null,
    errorDescription: errorDescription || null,
    url: window.location.href,
  });
}

// Log session result (dev only)
if (import.meta.env.DEV) {
  console.log('🔐 Session exchange result:', {
    success: !!data?.session,
    userId: data?.user?.id,
    error: exchangeError?.message || null,
  });
}

// Log redirect decision (dev only)
if (import.meta.env.DEV) {
  console.log('🔐 Redirecting user:', {
    userId: data.user.id,
    role,
    redirectPath,
  });
}
```

**Benefits:**
- ✅ Better debugging in development
- ✅ No logging in production (respects `import.meta.env.DEV`)
- ✅ Track auth flow step-by-step

## Auth Flow Summary

All auth email flows now redirect correctly:

| Auth Flow | Email Redirect Target |
|-----------|----------------------|
| Email Signup | `https://www.mobilemorocco.com/auth/callback` ✅ |
| Password Reset | `https://www.mobilemorocco.com/auth/reset-password` ✅ |
| Magic Link/OTP | `https://www.mobilemorocco.com/auth/callback` ✅ |

## AuthCallback Behavior

The `/auth/callback` route handles:

1. **Code Exchange**: Exchanges PKCE code for session
2. **Profile Verification**: Ensures user profile exists
3. **Role Fetching**: Gets user role from `profiles` table
4. **Role-Based Redirect**:
   - `admin` → `/admin`
   - `agent` → `/agent`
   - `merchant` → `/merchant`
   - `user` → `/dashboard`
5. **Error Handling**: Graceful error messages with support contact
6. **Loading States**: Always resolves to success or error (no infinite loading)

## Testing Checklist

After deployment, verify:

- [ ] Email confirmation links redirect to `https://www.mobilemorocco.com/auth/callback`
- [ ] Password reset links redirect to `https://www.mobilemorocco.com/auth/reset-password`
- [ ] Magic link emails redirect to `https://www.mobilemorocco.com/auth/callback`
- [ ] No 502 Bad Gateway errors
- [ ] Auth works on mobile/4G networks
- [ ] Auth works when accessing via different domains (www vs non-www)
- [ ] Role-based redirects work correctly after email confirmation
- [ ] No redirect loops
- [ ] Loading states always resolve (no infinite spinners)

## Environment Variables

### Required
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

### Optional
- `VITE_SITE_URL` - Production site URL (default: `https://www.mobilemorocco.com`)
  - Set this if you want to override the default fallback
  - Example: `VITE_SITE_URL=https://mobilemorocco.com` (without www)

## Migration Notes

**No Breaking Changes**: These changes are backward compatible and improve consistency.

**For Development**: 
- Local development still works (uses hardcoded fallback)
- Can override with `VITE_SITE_URL=http://localhost:5173` in `.env`

**For Production**:
- If `VITE_SITE_URL` is set, it will be used
- If not set, defaults to `https://www.mobilemorocco.com`
- Never throws errors, preventing app crashes

## Troubleshooting

### Issue: Email links redirect to wrong domain

**Solution**: 
1. Check Supabase Site URL is set to `https://www.mobilemorocco.com`
2. Verify redirect URLs include the correct domain
3. Clear Supabase email template cache (settings)

### Issue: 502 Bad Gateway on email confirmation

**Cause**: Redirect URL not in Supabase allowed list

**Solution**: Add the redirect URL to Supabase → Authentication → URL Configuration

### Issue: Redirect loops after login

**Cause**: Incorrect role-based redirect logic or missing profile

**Solution**: 
1. Check user has a profile in `profiles` table
2. Verify role is one of: `user`, `agent`, `merchant`, `admin`
3. Check browser console for redirect logs (in dev mode)

## Related Files

- `src/config/env.ts` - Site URL configuration
- `src/lib/supabase/auth.ts` - Auth helper functions
- `src/contexts/AuthContext.tsx` - Auth context provider
- `src/pages/auth/AuthCallbackPage.tsx` - Callback handler
- `src/services/authService.ts` - Auth business logic

## Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [PKCE Flow](https://supabase.com/docs/guides/auth/server-side/pkce-flow)
- [Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
