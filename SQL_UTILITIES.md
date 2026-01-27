# SQL Utilities for Data Consistency Checks

This document provides SQL queries to check data consistency between `auth.users` and `public.profiles` tables in Supabase.

## Overview

The Mobile Morocco app uses:
- **`auth.users`** - Managed by Supabase Auth (authentication)
- **`public.profiles`** - Custom table storing user roles and profile data

**Important**: The `role` field is ONLY stored in `public.profiles`, not in `auth.users` metadata.

## Valid Roles

The system supports four user roles:
- `user` - Regular users
- `agent` - Real estate agents
- `merchant` - Merchants/shop owners
- `admin` - Administrators

**Note**: The `advertiser` role has been removed from the system.

## SQL Queries

### 1. Count Profiles and Auth Users

Check if the number of profiles matches the number of authenticated users.

```sql
-- Count profiles
SELECT count(*) AS profile_count FROM public.profiles;

-- Count auth users
SELECT count(*) AS auth_user_count FROM auth.users;

-- Compare counts side by side
SELECT 
  (SELECT count(*) FROM public.profiles) AS profiles,
  (SELECT count(*) FROM auth.users) AS auth_users,
  (SELECT count(*) FROM auth.users) - (SELECT count(*) FROM public.profiles) AS difference;
```

**Expected Result**: The difference should be 0 or close to 0.
- If positive: Some auth users don't have profiles (orphaned auth records)
- If negative: Some profiles don't have auth users (orphaned profiles)

### 2. Detect Orphaned Profiles

Find profiles that don't have a corresponding auth user.

```sql
SELECT 
  p.id,
  p.email,
  p.role,
  p.full_name,
  p.created_at
FROM public.profiles p
LEFT JOIN auth.users u ON u.id = p.id
WHERE u.id IS NULL
ORDER BY p.created_at DESC;
```

**What to do if found**:
- These are profiles without valid authentication
- Users cannot log in with these profiles
- Consider deleting them or investigating why auth was deleted

### 3. Detect Orphaned Auth Users

Find auth users that don't have a corresponding profile.

```sql
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.confirmed_at,
  u.email_confirmed_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ORDER BY u.created_at DESC;
```

**What to do if found**:
- These users can authenticate but have no profile
- They will fail role checks and be redirected to account setup
- Consider creating profiles for them or deleting the auth records

### 4. Role Distribution

See how many users are in each role.

```sql
SELECT 
  role,
  count(*) AS user_count
FROM public.profiles
GROUP BY role
ORDER BY user_count DESC;
```

**Expected Output**:
```
role      | user_count
----------|------------
user      | 1234
merchant  | 56
agent     | 23
admin     | 2
```

### 5. Find Users with Invalid Roles

Check if any profiles have roles that are not in the valid set.

```sql
SELECT 
  id,
  email,
  role,
  full_name,
  created_at
FROM public.profiles
WHERE role NOT IN ('user', 'agent', 'merchant', 'admin')
ORDER BY created_at DESC;
```

**What to do if found**:
- If role is `advertiser`: Update to `merchant` (see migration query below)
- If role is something else: Investigate and fix

### 6. Find Users Without Email Confirmation

Users who signed up but haven't confirmed their email.

```sql
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.confirmation_sent_at,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.confirmed_at IS NULL
ORDER BY u.created_at DESC
LIMIT 50;
```

**What to do**:
- These users cannot log in until they confirm email
- Consider resending confirmation emails
- Clean up very old unconfirmed accounts

### 7. Recently Created Users

Check recent signups and their role assignment.

```sql
SELECT 
  p.id,
  p.email,
  p.role,
  p.full_name,
  p.is_verified,
  p.is_active,
  u.email_confirmed_at,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
ORDER BY p.created_at DESC
LIMIT 20;
```

### 8. Active vs Inactive Users

Count active and inactive users.

```sql
SELECT 
  is_active,
  count(*) AS user_count
FROM public.profiles
GROUP BY is_active;
```

### 9. Email Mismatch Detection

Check if email in auth.users matches email in profiles.

```sql
SELECT 
  p.id,
  u.email AS auth_email,
  p.email AS profile_email,
  p.role,
  p.created_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email != p.email OR (u.email IS NOT NULL AND p.email IS NULL)
ORDER BY p.created_at DESC;
```

## Migration Queries

### Migrate Advertiser Role to Merchant

If you find users with the old `advertiser` role, migrate them to `merchant`:

```sql
-- First, check how many will be affected
SELECT count(*) 
FROM public.profiles 
WHERE role = 'advertiser';

-- Update advertiser role to merchant
UPDATE public.profiles
SET 
  role = 'merchant',
  updated_at = now()
WHERE role = 'advertiser';

-- Verify the update
SELECT role, count(*) 
FROM public.profiles 
GROUP BY role;
```

### Create Missing Profiles for Auth Users

If you have auth users without profiles, you can create basic profiles:

```sql
-- Create profiles for auth users that don't have them
INSERT INTO public.profiles (id, email, role, full_name, is_verified, is_active, created_at, updated_at)
SELECT 
  u.id,
  u.email,
  'user' AS role,  -- Default role
  COALESCE(u.raw_user_meta_data->>'full_name', 'Unknown') AS full_name,
  (u.email_confirmed_at IS NOT NULL) AS is_verified,
  true AS is_active,
  u.created_at,
  now() AS updated_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
  AND u.email_confirmed_at IS NOT NULL;  -- Only create for confirmed users
```

## Regular Maintenance

### Recommended Schedule

Run these queries regularly to maintain data consistency:

**Weekly**:
1. Check role distribution
2. Find users without email confirmation
3. Check recently created users

**Monthly**:
1. Detect orphaned profiles
2. Detect orphaned auth users
3. Find users with invalid roles
4. Check email mismatches

**After major updates**:
1. Run all consistency checks
2. Verify all users can access role-specific dashboards
3. Check for any stuck loading states

## Database Triggers

### Auto-create Profile Trigger

Ensure you have a database trigger that automatically creates a profile when a user signs up:

```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, full_name, is_verified, is_active, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'full_name',
    false,
    true,
    now(),
    now()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**What this does**:
- Automatically creates a profile when a user signs up
- Extracts role from signup metadata
- Defaults to 'user' role if not specified
- Prevents orphaned auth users

## Troubleshooting

### User can log in but gets "unauthorized" error

**Check**:
```sql
SELECT p.*, u.email_confirmed_at
FROM public.profiles p
JOIN auth.users u ON u.id = p.id
WHERE p.email = 'user@example.com';
```

**Possible issues**:
- Profile doesn't exist → Create it
- Role is invalid → Update to valid role
- `is_active` is false → Set to true
- Email not confirmed → Resend confirmation

### User stuck in loading state

This is usually a frontend issue, but check:
```sql
SELECT * FROM public.profiles WHERE id = 'user-id-here';
```

If query hangs, there might be database performance issues.

## Summary

**Key Points**:
1. Always keep `auth.users` and `public.profiles` in sync
2. Role is ONLY stored in `public.profiles.role`
3. Use database triggers to auto-create profiles
4. Run consistency checks regularly
5. Clean up orphaned records promptly

**Valid Roles**: `user | agent | merchant | admin`

**Removed Role**: `advertiser` (migrate to `merchant`)
