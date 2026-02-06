# Administrator Guide: Manual Email Verification

This guide provides instructions for administrators to manually verify user emails when automatic confirmation fails or when expedited verification is needed.

---

## When to Use Manual Verification

Manual email verification should be used in these situations:

1. **User reports they can't confirm their email** despite:
   - Receiving confirmation emails
   - Trying multiple times
   - Checking spam folder

2. **Confirmation links are expired or invalid**
   - User registered more than 24 hours ago
   - Confirmation link has been used or tampered with
   - Token validation errors in Supabase logs

3. **Urgent account access needed**
   - VIP customer or business partner
   - Time-sensitive business need
   - Critical support escalation

4. **Email delivery issues**
   - Email provider blocking Supabase emails
   - User's email server is down
   - Temporary email service used

5. **Migration or bulk import**
   - Users imported from old system
   - Email verification not possible for imported accounts

---

## Prerequisites

To manually verify emails, you need:

- [ ] Access to Supabase Dashboard
- [ ] Admin or Owner role in Supabase project
- [ ] User's email address
- [ ] Approval from project owner (for security)

---

## Method 1: Supabase Dashboard (Recommended)

This is the easiest and safest method.

### Step 1: Access Supabase Dashboard

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in to your account
3. Select project: **Mobile Morocco**

### Step 2: Navigate to Authentication

1. In the left sidebar, click **Authentication**
2. Click on **Users** tab

### Step 3: Find the User

**Option A: Search by Email**
1. In the search box, enter the user's email address
2. Press Enter or click Search

**Option B: Browse Users List**
1. Scroll through the users list
2. Look for the user's email address

### Step 4: Verify the User

Once you find the user:

1. **Click on the user row** to open user details
2. Look for the **Email** field
3. Check if `email_confirmed_at` is `null` or has a value
   - If `null`: Email is NOT confirmed
   - If has a timestamp: Email IS confirmed

4. **If email is NOT confirmed, you have 2 options:**

   **Option A: Resend Confirmation Email**
   - Click the "Send confirmation email" button
   - User will receive a new confirmation email
   - Ask user to check inbox and spam folder

   **Option B: Manually Set Confirmation Timestamp**
   - Scroll down to `email_confirmed_at` field
   - Click "Edit"
   - Set to current timestamp (use format: `2026-01-27 12:00:00+00`)
   - OR simply set to `NOW()` if supported
   - Click "Save"

5. **Verify the change:**
   - Refresh the user details page
   - Confirm `email_confirmed_at` now has a timestamp
   - Status should change to "Confirmed"

### Step 5: Notify the User

Send a message to the user:

```
Subject: Your Email Has Been Verified

Hello [User Name],

Your email address has been manually verified by our support team. You can now log in to your account at https://mobilemorocco.com/auth/login

If you have any questions or encounter any issues, please contact us at support@mobilemorocco.com

Best regards,
Mobile Morocco Support Team
```

---

## Method 2: SQL Editor (Advanced)

Use this method if Dashboard method doesn't work or for bulk operations.

### Step 1: Access SQL Editor

1. Go to Supabase Dashboard
2. Click **SQL Editor** in the left sidebar

### Step 2: Manually Verify Single User

Run this SQL query (replace with actual email):

```sql
-- Verify single user by email
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmation_sent_at = NOW()
WHERE email = 'user@example.com'
  AND email_confirmed_at IS NULL
RETURNING id, email, email_confirmed_at;
```

**Expected Result:**
```
id                                   | email            | email_confirmed_at
-------------------------------------|------------------|----------------------------
550e8400-e29b-41d4-a716-446655440000 | user@example.com | 2026-01-27 12:34:56+00
```

If query returns 0 rows, the user either:
- Doesn't exist
- Email is already confirmed
- Email address is incorrect

### Step 3: Verify Multiple Users (Bulk)

⚠️ **Use with caution!** This confirms ALL unconfirmed users.

```sql
-- Verify all unconfirmed users (USE WITH CAUTION)
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmation_sent_at = NOW()
WHERE email_confirmed_at IS NULL
RETURNING email, email_confirmed_at;
```

### Step 4: Check User Profile Exists

After confirming email, verify the user has a profile:

```sql
-- Check if profile exists
SELECT 
  p.id,
  p.email,
  p.role,
  p.full_name,
  u.email_confirmed_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'user@example.com';
```

**If profile is missing:**

```sql
-- Create missing profile (adjust role as needed)
INSERT INTO public.profiles (id, email, role, full_name, created_at, updated_at)
SELECT 
  id, 
  email, 
  'user' AS role,  -- Change to 'merchant', 'agent', or 'admin' as needed
  COALESCE(raw_user_meta_data->>'full_name', email) AS full_name,
  created_at,
  NOW() AS updated_at
FROM auth.users
WHERE email = 'user@example.com'
  AND id NOT IN (SELECT id FROM public.profiles);
```

---

## Method 3: Supabase CLI (Developers)

For developers with CLI access:

```bash
# Connect to Supabase project
supabase db push --project-ref your-project-ref

# Run verification query
supabase db query "UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'user@example.com'"
```

---

## Verification Checklist

After manually verifying an email, complete this checklist:

- [ ] User exists in `auth.users` table
- [ ] `email_confirmed_at` field is set to a valid timestamp
- [ ] `confirmation_sent_at` field is set (optional but recommended)
- [ ] User profile exists in `public.profiles` table
- [ ] User's role in `public.profiles` matches their account type
- [ ] User has been notified of the verification
- [ ] Incident has been logged in support system
- [ ] Root cause has been investigated (if recurring)

---

## Troubleshooting

### Issue: User Still Can't Log In After Manual Verification

**Possible Causes:**
1. Profile doesn't exist in `public.profiles` table
2. Wrong password
3. Account is suspended or disabled
4. Role is not set correctly

**Solution:**
1. Check if profile exists (see "Check User Profile Exists" above)
2. Ask user to reset password via "Forgot Password" link
3. Check `banned_until` field in `auth.users` table
4. Verify `role` field in `public.profiles` table

### Issue: Manual Verification Doesn't Save

**Possible Causes:**
1. Insufficient permissions
2. Database constraints preventing update
3. User is already confirmed

**Solution:**
1. Check your Supabase role (must be Owner or Admin)
2. Check database logs for constraint errors
3. Verify current `email_confirmed_at` value first

### Issue: Profile Missing After Registration

**Possible Causes:**
1. Database trigger not firing
2. Profile creation failed during signup
3. Database connection issue during signup

**Solution:**
1. Create profile manually using SQL query above
2. Check database triggers:
   ```sql
   SELECT * FROM pg_trigger WHERE tgname LIKE '%profile%';
   ```
3. Review database logs for errors during user creation

---

## Security Considerations

### Before Manual Verification

**Always verify user identity first:**

1. **Verify via email:**
   - Send email to the registered address
   - Ask user to reply with specific information
   - Confirm response matches registration details

2. **Verify via phone (if available):**
   - Call user at registered phone number
   - Confirm name and account details

3. **Check for red flags:**
   - Recently created account (<24 hours old)
   - Suspicious email domain
   - Multiple verification requests
   - User requesting urgent access without valid reason

### Logging Manual Verifications

**Always log manual verification actions:**

```sql
-- Log manual verification (create table if needed)
CREATE TABLE IF NOT EXISTS admin_actions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id UUID REFERENCES auth.users(id),
  action_type TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  target_user_email TEXT,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert log entry
INSERT INTO admin_actions (
  admin_id,
  action_type,
  target_user_id,
  target_user_email,
  reason
)
VALUES (
  'your-admin-uuid',
  'manual_email_verification',
  'user-uuid',
  'user@example.com',
  'User reported confirmation link expired, verified via email'
);
```

### Audit Trail

Keep records of:
- ✅ Date and time of manual verification
- ✅ Administrator who performed the action
- ✅ User's email address
- ✅ Reason for manual verification
- ✅ Verification method used (email, phone, etc.)
- ✅ Support ticket number (if applicable)

---

## Bulk Verification (Emergency)

**⚠️ USE ONLY IN EMERGENCY SITUATIONS**

If many users are affected by the same issue (e.g., email service outage), you may need to bulk verify.

### Step 1: Identify Affected Users

```sql
-- Find users who registered during the outage period
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE created_at BETWEEN '2026-01-27 10:00:00+00' AND '2026-01-27 12:00:00+00'
  AND email_confirmed_at IS NULL
ORDER BY created_at DESC;
```

### Step 2: Export List for Review

1. Copy the results to a spreadsheet
2. Review each user
3. Mark users for verification

### Step 3: Bulk Verify Approved Users

```sql
-- Bulk verify users (provide list of user IDs)
UPDATE auth.users
SET 
  email_confirmed_at = NOW(),
  confirmation_sent_at = NOW()
WHERE id IN (
  '550e8400-e29b-41d4-a716-446655440000',
  '550e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440002'
  -- Add more user IDs as needed
)
RETURNING email, email_confirmed_at;
```

### Step 4: Notify Affected Users

Send mass email notification:

```
Subject: Your Mobile Morocco Account is Now Active

Hello,

Due to a temporary technical issue with email verification, we have manually verified your account. You can now log in at https://mobilemorocco.com/auth/login

We apologize for any inconvenience this may have caused.

If you have any questions, please contact support@mobilemorocco.com

Best regards,
Mobile Morocco Support Team
```

---

## Best Practices

### 1. Always Verify User Identity First
- Never verify emails without confirming user identity
- Use multiple verification methods when possible

### 2. Document Everything
- Log all manual verifications
- Keep records of communications with users
- Note reasons for manual verification

### 3. Investigate Root Causes
- If same user needs multiple manual verifications, investigate
- If many users need manual verification, check system issues
- Report patterns to development team

### 4. Use Dashboard When Possible
- Dashboard method is safer and easier
- SQL method should be last resort
- Bulk operations require extra caution

### 5. Monitor Patterns
- Track number of manual verifications per week
- If increasing, there may be a system issue
- Report trends to development team

### 6. Keep Skills Updated
- Review this guide quarterly
- Practice on test accounts
- Stay updated on Supabase Auth changes

---

## Emergency Contacts

### For System Issues
- **Development Team:** dev@mobilemorocco.com
- **On-Call Developer:** [Phone number]

### For Security Issues
- **Security Team:** security@mobilemorocco.com
- **Escalation:** [Security lead contact]

### For Database Issues
- **DBA:** dba@mobilemorocco.com
- **Supabase Support:** [Support portal link]

---

## Related Documentation

- [SUPABASE_AUTH_CONFIG.md](./SUPABASE_AUTH_CONFIG.md) - Supabase configuration guide
- [REGISTRATION_CONFIRMATION_DEPLOYMENT_GUIDE.md](./REGISTRATION_CONFIRMATION_DEPLOYMENT_GUIDE.md) - Deployment guide
- [AUTH_IMPLEMENTATION_SUMMARY.md](./AUTH_IMPLEMENTATION_SUMMARY.md) - Technical implementation details

---

## Appendix: Common SQL Queries

### Check User Status
```sql
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at,
  u.last_sign_in_at,
  u.banned_until,
  p.role,
  p.full_name
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE u.email = 'user@example.com';
```

### Find Unconfirmed Users
```sql
SELECT 
  email,
  created_at,
  confirmation_sent_at
FROM auth.users
WHERE email_confirmed_at IS NULL
  AND created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 50;
```

### Find Users with Missing Profiles
```sql
SELECT 
  u.id,
  u.email,
  u.created_at,
  u.email_confirmed_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
  AND u.email_confirmed_at IS NOT NULL
ORDER BY u.created_at DESC;
```

### Check Recent Admin Actions (if logging table exists)
```sql
SELECT 
  aa.created_at,
  aa.action_type,
  aa.target_user_email,
  aa.reason,
  au.email AS admin_email
FROM admin_actions aa
JOIN auth.users au ON au.id = aa.admin_id
WHERE aa.action_type = 'manual_email_verification'
  AND aa.created_at > NOW() - INTERVAL '30 days'
ORDER BY aa.created_at DESC;
```

---

**Last Updated:** 2026-01-27
**Version:** 1.0
**Access Level:** Administrators and Support Staff Only
