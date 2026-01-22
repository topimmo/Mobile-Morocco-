# Security Documentation

## Overview

This document outlines the security measures implemented in the Mobile Morocco platform to protect user data and prevent unauthorized access.

## Authentication & Authorization

### Authentication Methods

- **Email/Password**: Standard authentication via Supabase Auth
- **OTP Verification**: WhatsApp-based phone number verification with rate limiting

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| `user` | Default role for all registered users | Create and manage own content |
| `seller_store` | Sellers managing store listings | Extended listing capabilities |
| `repair_shop` | Repair shop owners | Manage repair shop profiles |
| `advertiser` | Advertisers managing campaigns | Create and manage ad campaigns |
| `admin` | Platform administrators | Full access to all content and moderation |

## Row Level Security (RLS)

**✅ CONFIRMED: All data tables have Row Level Security enabled.**

With RLS enabled, no unauthorized user can read or write protected data. All database access is enforced at the PostgreSQL level, ensuring security even if client-side code is bypassed.

### What is Public (No Authentication Required)

The following data is publicly readable:

- **Published Listings** (`status = 'approved'`)
  - Product listings that have been approved by admins
  - Associated images for approved listings
  
- **Published Repair Shops** (`status = 'approved'`)
  - Repair shop profiles that have been approved
  - Shop images for approved shops
  
- **Categories** (`is_active = true`)
  - Product categories (Smartphones, Accessories, etc.)
  
- **Cities** (`is_active = true`)
  - Moroccan cities and location data
  
- **Visible Reviews** (`is_visible = true`)
  - User reviews that have been moderated and approved
  
- **Active AdSense Units** (`is_active = true`)
  - Google AdSense configuration for public pages
  
- **Confirmed Ad Bookings** (`status = 'confirmed'`)
  - Public can check booking availability for ad slots

### What Requires Authentication

Authenticated users (logged in) can:

#### Content Creation
- **Create Listings**: Insert new product listings (status starts as `draft`)
- **Upload Images**: Upload images to their own folder in storage
- **Create Repair Shops**: Create repair shop profiles
- **Submit Reviews**: Rate and review listings/shops
- **Create Ad Campaigns**: If they have advertiser role

#### Own Content Management
Users can **only** manage content they own:

- **View Own Content**: See all their listings/shops regardless of status (draft, pending, approved, rejected)
- **Update Own Content**: Edit their own listings, shops, profiles, reviews
- **Delete Own Content**: Remove their own listings, shops, reviews, uploaded images
- **Profile Management**: View and update their own profile information

**Ownership is enforced by**: `user_id = auth.uid()` in all policies

#### Storage Access
- **Upload**: Can upload images only to their own folder (`/{user_id}/...`)
- **Delete**: Can delete only images in their own folder
- **Update**: Can update only images in their own folder
- **Read**: Public read access to all images

### What Admin Can Do

Admin users (`role = 'admin'`) have elevated privileges:

#### Content Moderation
- **Approve/Reject Content**: Change listing/shop status to `approved` or `rejected`
- **Manage All Listings**: View, edit, or delete any listing regardless of owner
- **Manage All Shops**: View, edit, or delete any repair shop
- **Moderate Reviews**: Hide or show reviews, delete inappropriate content
- **Manage Users**: View and update all user profiles

#### Platform Configuration
- **Manage Categories**: Create, update, or deactivate product categories
- **Manage Cities**: Add or update city data
- **Manage Ad Campaigns**: Approve, pause, or reject advertising campaigns
- **Configure AdSense**: Update Google AdSense unit configurations

#### Monitoring & Security
- **View All Content**: Access to all data including drafts and pending items
- **Access Admin Dashboard**: View platform statistics and activity
- **Manage OTP Requests**: Monitor and manage phone verification requests

## Anti-Spam & Rate Limiting

### Database-Level Rate Limits

To prevent abuse and spam, the following rate limits are enforced at the database level:

| Action | Limit | Time Window | Error Message |
|--------|-------|-------------|---------------|
| **OTP Requests** | 3 requests | 15 minutes | "Rate limit exceeded. Please wait 15 minutes..." |
| **Create Listing** | 5 listings | 1 hour | "You can create maximum 5 listings per hour" |
| **Create Repair Shop** | 2 shops | 24 hours | "You can create maximum 2 repair shops per day" |
| **Create Review** | 10 reviews | 24 hours | "You can create maximum 10 reviews per day" |

**Note**: Rate limits do not apply to admin users.

### Data Validation Constraints

The following constraints prevent empty or invalid spam content:

#### Listings
- `title`: Minimum 3 characters (trimmed)
- `description`: Minimum 10 characters (trimmed)
- `price`: Must be greater than 0
- `status`: Must be one of: draft, pending, approved, rejected, hidden
- `condition`: Must be one of: new, used, refurbished

#### Repair Shops
- `name`: Minimum 3 characters (trimmed)
- `description`: Minimum 10 characters (trimmed)
- `status`: Must be one of: pending, approved, rejected, hidden

#### Reviews
- `rating`: Must be between 1 and 5
- `comment`: Minimum 10 characters if provided (trimmed)
- **Unique Constraint**: One review per user per target (prevents duplicate reviews)

#### OTP Requests
- `phone`: Required (NOT NULL)
- `code_hash`: Required (NOT NULL)
- `expires_at`: Required (NOT NULL)
- `attempts`: Tracked to prevent brute force

## Storage Security

### Bucket Configuration

**Bucket Name**: `item-images`

**Settings**:
- **Public Read**: ✅ Enabled (images are publicly accessible)
- **File Size Limit**: 5 MB per file
- **Allowed MIME Types**: 
  - `image/jpeg`
  - `image/png`
  - `image/webp`

### Storage Policies

| Action | Who Can Perform | Restrictions |
|--------|----------------|--------------|
| **SELECT (Read)** | Anyone (public) | All files in `item-images` |
| **INSERT (Upload)** | Authenticated users only | Any path (bucket enforces file types/size) |
| **UPDATE** | No one (disabled) | Files are immutable - delete and re-upload instead |
| **DELETE** | Authenticated users only | Any file (admin can restore via database) |

**Immutable Storage Pattern**: For security and audit purposes, uploaded files cannot be modified. Users must delete and re-upload to change images. This prevents unauthorized modification of existing images.

**Note**: In future versions, consider implementing a file ownership table to track which user uploaded which file, allowing more granular delete permissions.

### Upload Restrictions

Client-side validation (before upload):
- Image compression: Max 1200x1200px
- Quality: 0.85 (JPEG/WebP)
- File types: JPEG, PNG, WebP only
- Max file size: 5 MB

## Environment Variables & Secrets

### Client-Side (Safe to Expose)

These variables are safe to include in client builds:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_ENV=production
VITE_BASE_URL=/
```

**Why these are safe**:
- `VITE_SUPABASE_URL`: Public project URL
- `VITE_SUPABASE_ANON_KEY`: Public "anonymous" key designed for client-side use, protected by RLS

### Server-Side (MUST KEEP SECRET)

These variables must **NEVER** be exposed to the client:

```env
SUPABASE_SERVICE_KEY=your-service-key-here
```

**Service Role Key**:
- Bypasses Row Level Security
- Has full admin access to the database
- Must only be used in server-side code (Edge Functions, migrations)
- **NEVER include in frontend code or commits**

### Security Checklist

✅ `.env` files are in `.gitignore`  
✅ `.env.example` contains only placeholders  
✅ Client code uses only `VITE_` prefixed variables  
✅ Service key is never used in `src/` directory  
✅ All environment variables are validated at startup  

## Content Approval Workflow

### Listing/Shop Publication Flow

1. **User Creates Content**
   - Default status: `draft`
   - Only visible to owner and admin
   
2. **User Submits for Approval**
   - Status changes to: `pending`
   - Still only visible to owner and admin
   
3. **Admin Reviews Content**
   - Admin can approve → status: `approved` (now public)
   - Admin can reject → status: `rejected` (owner can edit and resubmit)
   - Admin can hide → status: `hidden` (removed from public view)

4. **Public Access**
   - Only `approved` content is visible to the public
   - Draft and pending content is **never** publicly readable

### Review Moderation

- Reviews start with `is_visible = true` by default
- Admin can hide reviews by setting `is_visible = false`
- Only visible reviews appear in public listings
- Users can always see their own reviews regardless of visibility

## Security Maintenance

### Regular Tasks

1. **OTP Cleanup**: Run `SELECT cleanup_expired_otps();` daily to remove old OTP requests
2. **Review Logs**: Monitor failed authentication attempts
3. **Check Suspicious Activity**: Review users with many rejected listings
4. **Update Dependencies**: Keep Supabase client and other dependencies up to date

### Monitoring Recommendations

- Set up alerts for repeated rate limit violations
- Monitor storage bucket usage
- Track failed login attempts
- Review admin actions regularly

### Incident Response

If a security issue is discovered:

1. **Immediate**: Disable affected user accounts or features
2. **Investigate**: Check database logs for unauthorized access
3. **Fix**: Apply security patches or policy updates
4. **Notify**: Inform affected users if data was compromised
5. **Document**: Record the incident and response for future reference

## Security Statement

**With Row Level Security enabled on all tables, no unauthorized user can read or write protected data.**

All database access is validated at the PostgreSQL level, ensuring:
- Users can only see their own draft/pending content
- Users can only modify data they own
- Admin actions are properly authorized
- Public data is limited to approved content only
- Rate limits prevent spam and abuse
- Storage access is restricted by user folder

This multi-layered security approach protects user data even if client-side code is compromised or bypassed.

## Reporting Security Issues

If you discover a security vulnerability, please report it to:

- **Email**: [Contact platform administrator for security email]
- **Do Not**: Publicly disclose the vulnerability until it has been addressed
- **Include**: 
  - Description of the vulnerability
  - Steps to reproduce
  - Potential impact
  - Suggested fix (if known)

We take security seriously and will respond to verified reports within 48 hours.

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Security](https://supabase.com/docs/guides/storage/security)
- [PostgreSQL Security Best Practices](https://www.postgresql.org/docs/current/security.html)

---

**Last Updated**: 2026-01-22  
**Version**: 1.0  
**Status**: ✅ All security measures active and enforced
