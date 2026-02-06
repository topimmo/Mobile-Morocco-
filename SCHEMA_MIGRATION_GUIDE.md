# Authoritative Schema Migration - Implementation Guide

## Overview
This document describes the authoritative PostgreSQL schema for Mobile-Morocco, designed to match the service layer exactly with no stubs or aliases.

## Migration File
**Location:** `supabase/migrations/20260206000001_authoritative_schema.sql`

## Schema Summary

### Tables Implemented (15 total)

#### Core Infrastructure (3 tables)
1. **profiles** - User profiles extending auth.users
2. **categories** - Product/service categories with hierarchy
3. **cities** - Location/city data

#### Products & Commerce (2 tables)
4. **products** - Product listings with seller_id (NOT user_id)
   - Columns: seller_id, title, description, price, category, subcategory, brand, model, images[], specifications, location, city, is_available, view_count
5. **stores** - Store management with owner_id (NOT user_id)
   - Columns: owner_id, name, description, logo_url, address, city, phone, email, website, social_media, business_hours

#### User Interactions (4 tables)
6. **favorites** - User favorites
   - Columns: user_id, product_id
7. **reviews** - Reviews system
   - Columns: reviewer_id, subject_type, subject_id, rating, comment
8. **messages** - Direct messaging
   - Columns: sender_id, receiver_id, content, is_read, related_to_type, related_to_id
9. **reports** - User reporting system
   - Columns: reporter_id, reported_type, reported_id, reason, description, status, admin_notes

#### Services (4 tables)
10. **technician_services** - Technician service offerings
    - Columns: technician_id, service_name, description, price, price_type, estimated_time
11. **service_requests** - Customer service requests
    - Columns: customer_id, technician_id, service_id, status, description, device_details, location, scheduled_date, completed_date, price
12. **job_listings** - Job postings
    - Columns: creator_id, title, description, location, city, payment_type, payment_amount, required_skills[], status
13. **job_applications** - Job applications
    - Columns: job_id, technician_id, cover_note, status

#### Monetization (2 tables)
14. **ads** - Advertisement management
    - Columns: advertiser_id, title, image_url, link_url, placement, start_date, end_date, is_active, impressions, clicks
15. **subscriptions** - User subscriptions
    - Columns: user_id, plan_id, plan_type, status, start_date, end_date, payment_method
16. **influencers** - Influencer management
    - Columns: name, username, platform, followers_count, engagement_rate, niche, contact_email, contact_phone, location, bio, profile_url, is_verified, is_active
17. **notifications** - System notifications (camelCase columns)
    - Columns: userId, title, message, type, relatedId, isRead, channel, createdAt, scheduledFor

## Key Design Decisions

### Service-Driven Schema
Every table and column name is based on what the services actually use:

- **productService** expects `products` table with `seller_id`
- **storeService** expects `stores` table with `owner_id`
- **favoriteService** expects `favorites` table with `user_id` and `product_id`
- **reviewService** expects `reviewer_id`, `subject_type`, `subject_id`
- **messageService** expects `sender_id`, `receiver_id`, `is_read`
- **notificationService** expects camelCase: `userId`, `isRead`, `relatedId`

### Column Naming Strategy
- **Snake_case** for most tables (PostgreSQL convention)
- **camelCase** for notifications table (service uses this exact format)
- **No aliases** - each service gets its expected column names

### Data Types
- **UUID** - All primary and foreign keys
- **TEXT[]** - Arrays (images, skills, specialties)
- **JSONB** - Complex objects (specifications, business_hours, device_details)
- **DECIMAL** - Money and coordinates
- **TIMESTAMPTZ** - All timestamps with timezone
- **BOOLEAN** - Flags
- **CHECK** constraints - Enum validation

### Indexes
Strategic indexes on:
- Foreign keys (user_id, seller_id, etc.)
- Frequently queried columns (created_at, status)
- Lookup columns (category, city, placement)
- Composite indexes for common queries

### Security (RLS)
Complete row-level security policies:
- Public read for listings (products, stores, jobs)
- Users manage own data (favorites, messages)
- Creators control own content (products, stores, ads)
- Privacy for conversations (messages, service_requests)
- Admin-only where appropriate (influencers, some reports)

## How to Apply

### Option 1: Supabase CLI
```bash
cd /path/to/Mobile-Morocco
supabase db push
```

### Option 2: Supabase Dashboard
1. Go to SQL Editor
2. Paste migration contents
3. Click "Run"

### Option 3: New Project Setup
```bash
supabase db reset
```

## After Migration

### 1. Regenerate TypeScript Types
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts
```

### 2. Update tsconfig.json
Remove these exclusions:
```json
"exclude": [
  "src/services/jobService.ts",
  "src/services/technicianService.ts",
  "src/services/productService.ts",
  "src/services/reportService.ts",
  "src/services/reviewService.ts",
  "src/services/storeService.ts",
  "src/services/subscriptionService.ts",
  "src/services/adService.ts",
  "src/services/notificationService.ts"
]
```

### 3. Remove Stub Definitions
From `src/types/supabase.ts`, remove these stub tables:
- products (stub)
- reports (stub)
- subscriptions (stub with extra fields)
- technician_bookings (stub)
- Any alias columns (owner_id, reviewer_id on wrong tables)

### 4. Verify Build
```bash
npm run build
```

Should complete with **zero TypeScript errors**.

## Validation Checklist

- [ ] Migration applied successfully
- [ ] Types regenerated
- [ ] tsconfig.json updated
- [ ] Stub definitions removed
- [ ] Build succeeds without errors
- [ ] Services can query expected tables
- [ ] RLS policies working correctly

## Schema Consistency

This schema ensures:
✅ Service layer matches database exactly
✅ No stubs or placeholders
✅ No column aliases
✅ Production-ready constraints
✅ Proper foreign keys
✅ Complete RLS policies
✅ Strategic indexes
✅ Auto-updating timestamps

## Support Tables Not Included

The following are handled by existing migrations or are Supabase built-ins:
- `auth.users` - Supabase Auth
- `storage.objects` - Supabase Storage
- Historical ad/campaign tables - Already in previous migrations
- Demo/seed data - Separate migration files

## Migration Safety

This migration uses:
- `IF NOT EXISTS` clauses
- Proper CASCADE on foreign keys
- Non-destructive approach
- Can be run multiple times safely

## Troubleshooting

**Q: Type errors after regeneration?**
A: Ensure all stub definitions are removed from supabase.ts

**Q: RLS blocking queries?**
A: Check that auth.uid() is properly set in your Supabase client

**Q: Missing columns?**
A: Verify migration ran completely - check Supabase dashboard

**Q: Services still have type errors?**
A: Services may need mapper functions updated to match exact column names

## Notes

- Notifications table uses camelCase because the service was written that way
- All other tables use snake_case per PostgreSQL convention
- No table was renamed to fit - schema adapts to services
- RLS policies are permissive for development but production-ready
