# 🚀 Mobile Morocco - Comprehensive Deployment & Testing Guide

## Executive Summary

This guide provides complete instructions for deploying the Mobile Morocco platform with all security, stability, and observability improvements implemented.

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables (CRITICAL)

All deployments **MUST** have these environment variables configured:

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `VITE_SUPABASE_URL` | ✅ Yes | Supabase project URL | `https://xyz.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | ✅ Yes | Supabase anonymous key | `eyJ...` |
| `VITE_SITE_URL` | ⚠️ Production Only | Production URL for auth redirects | `https://mobilemorocco.com` |
| `VITE_APP_ENV` | ❌ Optional | Environment name | `production` |

**⚠️ CRITICAL**: If `VITE_SITE_URL` is not set in production, the app will throw an error. This prevents authentication redirect issues.

### 2. Supabase Console Configuration

#### A. Auth Redirect URLs

Navigate to: **Supabase Dashboard → Authentication → URL Configuration**

**Site URL:**
```
https://mobilemorocco.com
```

**Redirect URLs (add all):**
```
https://mobilemorocco.com/**
https://mobilemorocco.com/auth/**
https://mobilemorocco.com/auth/callback
https://mobilemorocco.com/auth/confirm
```

**Remove These URLs:**
- ❌ `*.tempo.build`
- ❌ Preview/staging domains (unless explicitly needed)
- ❌ `localhost` (in production)

#### B. RLS Policies Verification

Run this SQL query in Supabase SQL Editor:

```sql
-- Verify RLS is enabled on all tables
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Expected:** All tables should have `rowsecurity = true`

### 3. Database Integrity Check

```sql
-- Check for duplicate profiles
SELECT id, COUNT(*) as profile_count
FROM profiles
GROUP BY id
HAVING COUNT(*) > 1;
```

**Expected:** No results (zero duplicates)

If duplicates exist, run the cleanup migration first:
```bash
# See supabase/migrations/20260128000001_enforce_profile_uniqueness.sql
```

---

## 🔧 Build & Deployment Steps

### Development Build

```bash
# Install dependencies
npm install

# Run type check
npm run typecheck

# Build the application
npm run build

# Preview production build locally
npm run preview
```

### Production Deployment (Vercel)

```bash
# Validate deployment readiness
npm run deploy:check

# This runs:
# - TypeScript type check
# - Production build
# - E2E tests
# - Deployment validation
```

**Expected Output:**
```
✅ All checks passed! Ready for deployment.
```

### Production Deployment (Hostinger/Apache)

1. Build locally:
   ```bash
   npm run build
   ```

2. Upload `dist/` folder to server

3. Ensure `.htaccess` is in place:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 🧪 Post-Deployment Testing

### 1. Smoke Tests

#### A. Environment Check
1. Navigate to `/debug` (login as admin first)
2. Verify all checkmarks are green:
   - ✅ Supabase URL configured
   - ✅ Supabase Anon Key configured  
   - ✅ Site URL configured (production only)
   - ✅ Environment validation passed

#### B. Authentication Flow Tests

**Test #1: User Signup**
```
1. Navigate to /auth/register
2. Sign up with new email
3. Check email for confirmation link
4. Click confirmation link
5. Expected: Redirected to /dashboard
6. Expected: No 502 errors
7. Expected: Dashboard loads with user data
```

**Test #2: Admin Login**
```
1. Navigate to /auth/login
2. Login with admin credentials
3. Expected: Redirected to /admin
4. Expected: Admin dashboard loads
5. Navigate to /debug
6. Expected: Debug screen accessible
```

**Test #3: Agent Login**
```
1. Navigate to /auth/login
2. Login with agent credentials
3. Expected: Redirected to /agent
4. Expected: Agent dashboard loads
```

**Test #4: Merchant Login**
```
1. Navigate to /auth/login
2. Login with merchant credentials
3. Expected: Redirected to /merchant
4. Expected: Merchant dashboard loads
```

**Test #5: Logout**
```
1. While logged in, click Logout
2. Expected: Redirected to home page
3. Expected: Session cleared
4. Try accessing /dashboard
5. Expected: Redirected to /auth/login
```

### 2. Role-Based Access Control Tests

**Test #1: User accessing Admin routes**
```
1. Login as regular user
2. Navigate to /admin
3. Expected: Redirected to /unauthorized
4. Navigate to /debug
5. Expected: Redirected to /unauthorized
```

**Test #2: User accessing Agent routes**
```
1. Login as regular user
2. Navigate to /agent
3. Expected: Redirected to /unauthorized
```

**Test #3: Admin universal access**
```
1. Login as admin
2. Navigate to /dashboard
3. Expected: Access granted
4. Navigate to /agent
5. Expected: Access granted
6. Navigate to /merchant
7. Expected: Access granted
```

### 3. Image Upload Tests

**Test: Create Listing with Images**
```
1. Login as any user
2. Navigate to Create Listing
3. Upload 3 images (< 5MB each)
4. Expected: Upload progress shown
5. Expected: Images preview correctly
6. Click X to remove one image
7. Expected: Image removed from UI
8. Submit listing
9. Expected: Listing created successfully
10. View listing details
11. Expected: All images display
```

**Error Scenarios:**
- Upload fails (network error): Toast shows error, loading state clears
- Delete fails: Toast shows error, image remains in UI

### 4. Session Persistence Tests

**Test #1: Page Refresh**
```
1. Login as any user
2. Navigate to /dashboard
3. Refresh page (F5)
4. Expected: Still logged in
5. Expected: Dashboard loads without redirect to login
```

**Test #2: Token Expiration**
```
1. Login as any user
2. Wait 55 minutes (or manually expire token in Supabase)
3. Perform any action (navigation, API call)
4. Check browser console
5. Expected: "🔄 Token expiring soon, refreshing session..."
6. Expected: No logout, session continues
```

**Test #3: Mobile/4G Network**
```
1. Login on mobile device or slow 4G
2. Navigate between pages
3. Expected: No infinite loading states
4. Expected: Timeout errors show user-friendly messages
5. Expected: Automatic retry on transient failures
```

---

## 🔍 Monitoring & Troubleshooting

### Debug Mode Dashboard

Access: `/debug` (admin only)

**Features:**
- Environment variable validation
- Current session information
- User profile verification
- Network status monitoring
- Token expiration tracking

### Browser Console Logging

**Development Mode:**
- All API calls logged with correlation IDs
- Auth state changes tracked
- Session refresh events logged

**Production Mode:**
- Only errors and warnings logged
- Sensitive data redacted

### Key Log Messages

| Message | Type | Meaning |
|---------|------|---------|
| `🔐 Auth state changed: SIGNED_IN` | Info | User logged in |
| `🔄 Token expiring soon, refreshing session...` | Info | Auto-refresh triggered |
| `✅ Session refreshed successfully` | Info | Token refreshed |
| `❌ Failed to refresh session` | Error | Manual login required |
| `🔴 AuthContext: DUPLICATE PROFILES` | Error | Data integrity issue |
| `⚠️ AuthContext: No profile found` | Warning | Profile creation failed |

### Common Issues & Solutions

#### Issue #1: 502 Bad Gateway After Email Confirmation

**Symptoms:**
- Click email confirmation link
- See "502 Bad Gateway" error
- Cannot complete signup

**Solution:**
1. Check Supabase redirect URLs (see section 2A above)
2. Verify `VITE_SITE_URL` is set correctly
3. Check Supabase logs for errors

#### Issue #2: Infinite Loading on Dashboard

**Symptoms:**
- Login succeeds
- Dashboard shows loading spinner forever
- Buttons not clickable

**Solution:**
1. Open browser console
2. Check for JavaScript errors
3. Verify network requests completing
4. Check for CORS errors
5. Verify RLS policies allow SELECT on profiles table

#### Issue #3: "Configuration Error" Page

**Symptoms:**
- App shows red error page immediately
- Says environment variables missing

**Solution:**
1. Verify `VITE_SUPABASE_URL` is set
2. Verify `VITE_SUPABASE_ANON_KEY` is set
3. In production, verify `VITE_SITE_URL` is set
4. Rebuild and redeploy after setting variables

#### Issue #4: Unauthorized Access to Protected Routes

**Symptoms:**
- Non-admin user can access /admin
- URL changes but content doesn't match role

**Solution:**
1. Verify RoleGuard is used (not just ProtectedRoute)
2. Check profile role in database matches expected
3. Clear browser cache and cookies
4. Re-login

---

## 📊 Performance Metrics

### Target Metrics

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| Email confirmation success rate | > 95% | < 90% |
| Login success rate | > 98% | < 95% |
| Token refresh success rate | > 99% | < 95% |
| Image upload success rate | > 90% | < 85% |
| 502 error rate | 0% | > 1% |
| Average page load time | < 3s | > 5s |

### Monitoring Queries

**Signup conversion:**
```sql
SELECT 
  COUNT(*) as total_signups,
  COUNT(confirmed_at) as confirmed,
  ROUND(COUNT(confirmed_at)::numeric / COUNT(*) * 100, 2) as confirmation_rate
FROM auth.users
WHERE created_at > now() - interval '7 days';
```

**Role distribution:**
```sql
SELECT role, COUNT(*) as count
FROM profiles
GROUP BY role
ORDER BY count DESC;
```

**Active sessions:**
```sql
SELECT COUNT(DISTINCT user_id)
FROM auth.sessions
WHERE expires_at > now();
```

---

## 🔐 Security Verification

### RLS Policy Audit

```sql
-- List all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Verify:**
- ✅ All tables have at least one policy
- ✅ Admin policies use role check: `role = 'admin'`
- ✅ User policies use: `auth.uid() = id`
- ✅ No policies with `TO public` (unless intentional)

### Rate Limiting Verification

```sql
-- Test OTP rate limit
INSERT INTO otp_requests (phone, code) 
VALUES ('+212600000000', '123456');
-- Repeat 4 times rapidly
-- 4th attempt should fail with rate limit error
```

### Storage Security

```sql
-- Verify storage bucket settings
SELECT *
FROM storage.buckets
WHERE id = 'item-images';
```

**Expected:**
- `public = true` (for public read)
- `file_size_limit = 5242880` (5MB)
- `allowed_mime_types = ['image/jpeg', 'image/png', 'image/webp']`

---

## 📞 Support & Escalation

### Level 1: Self-Service
- Check this deployment guide
- Review browser console logs
- Access `/debug` dashboard (admin)
- Check Supabase logs

### Level 2: Database Investigation
- Run SQL diagnostic queries
- Check RLS policies
- Verify user roles
- Review auth logs

### Level 3: Code Review
- Review recent commits
- Check for regressions
- Run local development build
- Compare with production

### Emergency Rollback
```bash
# If deployment breaks production
git revert HEAD
npm run build
# Redeploy previous version
```

---

## 📝 Change Log

### Latest Version (Current Deployment)

**Security Fixes:**
- ✅ Removed insecure demo mode login bypass
- ✅ Added error handling to all image operations
- ✅ Enhanced auth redirect error handling
- ✅ Added session refresh monitoring

**New Features:**
- ✅ API timeout utilities with retry logic
- ✅ Debug mode dashboard for troubleshooting
- ✅ Correlation ID tracking for API calls
- ✅ Enhanced logging throughout auth flow

**Stability Improvements:**
- ✅ Prevent infinite loading states
- ✅ Better mobile/4G network handling
- ✅ Proactive token refresh (5min before expiry)
- ✅ Try-catch-finally on all async operations

---

## ✅ Final Deployment Checklist

Before marking deployment as complete:

- [ ] All environment variables set
- [ ] Supabase redirect URLs configured
- [ ] RLS policies verified
- [ ] No duplicate profiles in database
- [ ] Build passes all checks
- [ ] Deployed to production
- [ ] Smoke tests passed (all 5 auth flows)
- [ ] RBAC tests passed (unauthorized access blocked)
- [ ] Image upload test passed
- [ ] Session persistence test passed
- [ ] Debug mode accessible (admin)
- [ ] Monitoring queries documented
- [ ] Team trained on troubleshooting

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-28  
**Author:** GitHub Copilot - Mobile Morocco Team
