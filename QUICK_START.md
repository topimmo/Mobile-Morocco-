# Quick Start Guide - Deploy Auth Fixes

## 🚀 Quick Deployment (5 minutes)

### Step 1: Deploy Database Migration (2 min)
Choose one option:

**Option A: Supabase CLI** (recommended)
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Push migration
supabase db push
```

**Option B: Supabase Dashboard** (manual)
1. Open [Supabase Dashboard](https://app.supabase.com)
2. Go to SQL Editor
3. Copy entire file: `supabase/migrations/20260127000001_fix_profile_creation_and_rls.sql`
4. Paste and click "Run"
5. Verify: "Success. No rows returned"

### Step 2: Set Environment Variable (1 min)

**Vercel**:
```bash
# Via CLI
vercel env add VITE_SITE_URL
# Enter: https://mobilemorocco.com

# Or in dashboard:
# Settings → Environment Variables → Add
# Name: VITE_SITE_URL
# Value: https://mobilemorocco.com
```

**Netlify**:
```bash
# Site settings → Environment variables
# Add: VITE_SITE_URL = https://mobilemorocco.com
```

### Step 3: Configure Supabase Auth (1 min)
1. Open [Supabase Dashboard](https://app.supabase.com) → Authentication → URL Configuration
2. Set **Site URL**: `https://mobilemorocco.com`
3. Add **Redirect URLs**:
   ```
   https://mobilemorocco.com/**
   https://www.mobilemorocco.com/**
   ```
4. Click Save

### Step 4: Deploy Code (1 min)
Code is already in your branch. Merge to main:
```bash
git checkout main
git merge copilot/fix-user-registration-login-flow
git push
```

Or merge the PR in GitHub.

### Step 5: Test (2-5 min)
1. Go to your production site: `https://mobilemorocco.com/auth/register`
2. Register a new account
3. ✅ Should succeed without "Database error"
4. Check email for verification (if enabled)
5. Login at `/auth/login`
6. ✅ Should redirect to dashboard/merchant/agent based on role

## ✅ Success Indicators
- [ ] Registration completes without errors
- [ ] Profile created in Supabase (check Table Editor → profiles)
- [ ] No "multiple GoTrueClient instances" warning in console
- [ ] Login redirects correctly based on role
- [ ] Session persists after page reload

## ❌ If Issues Occur

### "SITE_URL not configured in production"
→ Set `VITE_SITE_URL` environment variable and redeploy

### "Database error saving new user"
→ Migration not applied. Run migration again.

### Email verification redirects to wrong domain
→ Update Supabase Auth redirect URLs to include production domain

### Role-based redirect not working
→ Check that profile has `role` column populated

## 📚 Full Documentation
- **Detailed Guide**: `AUTHENTICATION_FIX_DOCUMENTATION.md`
- **Technical Summary**: `IMPLEMENTATION_SUMMARY.md`

## 🔧 Troubleshooting SQL
If you need to manually check or fix:

```sql
-- Check if trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'profiles';

-- Check if profile was created for a user
SELECT id, email, role, full_name, created_at 
FROM profiles 
WHERE email = 'your-test-email@example.com';

-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;
```

## 🎯 What This Fixes
1. ✅ "Database error saving new user" → Registration now works
2. ✅ "multiple GoTrueClient instances" → Single client instance
3. ✅ Generic error messages → User-friendly messages
4. ✅ Wrong redirect domains → Production-safe redirects
5. ✅ Missing RLS policies → Comprehensive security policies
6. ✅ Profile creation failures → Backup INSERT policy + improved trigger

## 📞 Support
If issues persist after following this guide:
1. Check Supabase Dashboard → Logs for errors
2. Check browser console for client-side errors
3. Verify all environment variables are set correctly
4. Review the full documentation files for detailed troubleshooting

---

**Estimated Total Time**: 5-10 minutes
**Difficulty**: Easy (Copy/paste SQL, set env var, click buttons)
**Rollback**: Migrations are safe - they only ADD, never remove or modify existing data
