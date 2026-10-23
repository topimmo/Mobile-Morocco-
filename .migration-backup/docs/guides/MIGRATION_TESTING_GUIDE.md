# Security Hardening Migration - Testing Guide

## Migration File
`supabase/migrations/20260122000001_security_hardening.sql`

## Pre-Migration Checklist

Before applying this migration:

1. ✅ **Backup your database** - This migration adds constraints that may fail if existing data violates them
2. ✅ **Review existing data** - Check for:
   - Listings with empty titles or descriptions
   - Repair shops with empty names or descriptions
   - Listings with zero or negative prices
   - Any data that might violate the new constraints

## What This Migration Does

### 1. RLS Policy Enhancements
- Adds INSERT policy for profiles table
- Enhances OTP request policies with proper authentication
- Adds admin-only management for categories and cities

### 2. Storage Security
- Implements immutable storage (files cannot be updated, only deleted and re-uploaded)
- Maintains authentication requirements for uploads and deletes
- Public read access for all images

### 3. Data Validation Constraints
Adds the following constraints:

**Listings Table:**
- `title` and `description` must be NOT NULL
- `listings_title_not_empty`: Title must be at least 3 characters (trimmed)
- `listings_description_not_empty`: Description must be at least 10 characters (trimmed)
- `listings_price_positive`: Price must be greater than 0

**Repair Shops Table:**
- `name` and `description` must be NOT NULL
- `repair_shops_name_not_empty`: Name must be at least 3 characters (trimmed)
- `repair_shops_description_not_empty`: Description must be at least 10 characters (trimmed)

**Reviews Table:**
- `comment` must be at least 10 characters if provided (can be NULL)

### 4. Rate Limiting (Anti-Spam)
Adds database triggers to enforce:
- **OTP requests**: Max 3 per phone per 15 minutes
- **Listings**: Max 5 per user per hour
- **Repair shops**: Max 2 per user per day
- **Reviews**: Max 10 per user per day

*Note: Admin users are exempt from rate limits*

### 5. Performance Indexes
Adds indexes for:
- Efficient admin role checks
- Rate limit queries
- RLS policy lookups

### 6. Maintenance Function
- `cleanup_expired_otps()`: Removes OTP requests older than 24 hours

## Post-Migration Testing

### Test 1: Verify RLS is Active
```sql
-- Should show 'SUCCESS: All required tables have Row Level Security enabled'
-- This is automatically checked at the end of the migration
```

### Test 2: Test Rate Limiting

**OTP Rate Limit (15 minutes):**
```sql
-- Try to insert 4 OTP requests for same phone
-- The 4th should fail with rate limit error
INSERT INTO otp_requests (phone, code_hash, expires_at)
VALUES ('212600000001', 'hash1', NOW() + INTERVAL '10 minutes');
-- Repeat 3 more times... 4th should fail
```

**Listing Rate Limit (1 hour):**
```sql
-- Try to create 6 listings as the same user within an hour
-- The 6th should fail with rate limit error
```

### Test 3: Test Data Constraints

**Empty Title (should fail):**
```sql
-- Should fail with title_not_empty constraint violation
INSERT INTO listings (user_id, title, description, price, category_id, city_id)
VALUES (
  'some-user-id',
  '',
  'Valid description here',
  100,
  'category-id',
  'city-id'
);
```

**Short Description (should fail):**
```sql
-- Should fail with description_not_empty constraint violation
INSERT INTO listings (user_id, title, description, price, category_id, city_id)
VALUES (
  'some-user-id',
  'Valid Title',
  'Short',
  100,
  'category-id',
  'city-id'
);
```

**Zero Price (should fail):**
```sql
-- Should fail with price_positive constraint violation
INSERT INTO listings (user_id, title, description, price, category_id, city_id)
VALUES (
  'some-user-id',
  'Valid Title',
  'Valid description',
  0,
  'category-id',
  'city-id'
);
```

### Test 4: Test Storage Policies

**Upload (should succeed for authenticated users):**
- Log in as a regular user
- Try to upload an image
- Should succeed

**Update (should fail for everyone):**
```sql
-- Should fail - immutable storage policy
UPDATE storage.objects 
SET metadata = '{"updated": true}'
WHERE bucket_id = 'item-images';
```

**Delete (should succeed for authenticated users):**
- Log in as a regular user
- Try to delete an image
- Should succeed

### Test 5: Test Admin Permissions

**Categories Management:**
```sql
-- As regular user: Should fail
-- As admin: Should succeed
INSERT INTO categories (name_fr, name_ar, slug)
VALUES ('Test Category', 'تصنيف تجريبي', 'test-category');
```

### Test 6: Run Cleanup Function

```sql
-- Should return number of deleted OTP requests
SELECT cleanup_expired_otps();
```

## Expected Behavior After Migration

### Public Users (Not Logged In)
- ✅ Can view approved listings and repair shops
- ✅ Can view categories and cities
- ✅ Can view visible reviews
- ❌ Cannot create or modify any content
- ❌ Cannot upload files

### Authenticated Users
- ✅ Can create listings (up to 5 per hour)
- ✅ Can create repair shops (up to 2 per day)
- ✅ Can create reviews (up to 10 per day)
- ✅ Can view and edit their own draft content
- ✅ Can upload images
- ✅ Can delete images
- ❌ Cannot view other users' draft content
- ❌ Cannot update uploaded images (must delete and re-upload)
- ❌ Cannot manage categories or cities

### Admin Users
- ✅ Can do everything regular users can do
- ✅ Can view all content (including drafts)
- ✅ Can edit/delete any content
- ✅ Can approve/reject listings and shops
- ✅ Can manage categories and cities
- ✅ Exempt from rate limits

## Rollback Plan

If this migration causes issues:

1. **Constraint violations**: If existing data violates new constraints, you'll need to either:
   - Clean up the bad data first
   - Or temporarily remove/modify the constraints

2. **Rate limiting issues**: If rate limits are too strict:
   - Adjust the limits in the trigger functions
   - Or temporarily disable the triggers

3. **Full rollback**: To completely reverse this migration, you would need to:
   - Drop all new policies
   - Drop all new constraints
   - Drop all new triggers and functions
   - Drop all new indexes

**Note**: It's better to fix issues incrementally rather than full rollback.

## Monitoring After Migration

Monitor for:
- Rate limit error logs (might indicate legitimate users hitting limits)
- Constraint violation errors (might indicate UX issues in forms)
- Performance of admin role checks (should be fast with new indexes)
- Storage deletion patterns (ensure legitimate deletes aren't being blocked)

## Support

If you encounter issues:
1. Check database logs for specific error messages
2. Review SECURITY.md for detailed security behavior
3. Test policies manually using SQL queries with different user contexts
4. Contact database administrator if constraints need adjustment

---

**Migration Status**: Ready for deployment  
**Risk Level**: Low-Medium (adds constraints to existing data)  
**Recommended Deployment**: Test environment first, then production during low-traffic period
