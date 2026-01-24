# Admin / Dashboard Access Flow Documentation

## Overview

This document describes the admin and dashboard access flow for the Mobile Morocco platform, including authentication, authorization, and role-based routing.

---

## User Roles

### Database Schema
The `profiles` table stores user role information:

**Field:** `role`  
**Type:** `TEXT NOT NULL DEFAULT 'user'`  
**Valid Values:** `'admin'` | `'user'`

**Important:** The application also uses `user_type` and `account_type` fields in different contexts, which can cause confusion. The canonical role field for authorization is `role` in the profiles table.

### Role Definitions

1. **Admin (`role: 'admin'`)**
   - Full system access
   - Access to admin dashboard
   - Can approve/reject listings, repair shops, campaigns, and neighborhoods
   - Can view system statistics and analytics

2. **User (`role: 'user'`)**
   - Standard user account
   - Access to user dashboard
   - May have different account types (shop, technician, individual, customer)

---

## Routes

### Admin Routes

| Route | Component | Protection | Description |
|-------|-----------|------------|-------------|
| `/admin` | `AdminDashboard` | `AdminRoute` | Admin dashboard (primary) |
| `/admin/dashboard` | `AdminDashboard` | `AdminRoute` | Admin dashboard (alias) |

**Access Control:** Routes are protected by the `AdminRoute` component, which checks if `user.profile.role === 'admin'`.

### User Dashboard Routes

| Route | Component | Protection | Description |
|-------|-----------|------------|-------------|
| `/dashboard` | `DashboardPage` | `ProtectedRoute` | Main user dashboard |
| `/dashboard/my-store` | `MyStorePage` | `ProtectedRoute` | Store management |
| `/dashboard/create-item` | `CreateItemPage` | `ProtectedRoute` | Create new item listing |

**Access Control:** Routes are protected by the `ProtectedRoute` component, which only requires authentication (no specific role).

---

## Authentication Flow

### Login Process

1. **User enters credentials** on `/auth/login`
2. **Supabase authentication** validates email/password
3. **Profile lookup** fetches user profile from `profiles` table
4. **Session created** with user data including profile.role

**Current Implementation Issue:**
The login page currently redirects based on `user_metadata.account_type` instead of `profile.role`, which causes admin users to be redirected incorrectly.

### Expected Redirect Logic (After Login)

| User Role | Redirect To |
|-----------|-------------|
| `admin` | `/admin` or `/admin/dashboard` |
| `user` (shop account_type) | `/dashboard/my-store` |
| `user` (other types) | `/dashboard` |
| No account_type set | `/auth/select-account-type` |

---

## Authorization Components

### ProtectedRoute

**File:** `src/components/ProtectedRoute.tsx`

**Purpose:** Guards routes requiring authentication and optionally specific roles.

**Usage:**
```tsx
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

**Features:**
- Shows loading state during authentication check
- Redirects to `/auth/login` if not authenticated
- Checks `user.profile.role` against `requiredRole`
- Admin users can access all routes regardless of `requiredRole`

### AdminRoute

**Purpose:** Shortcut component for admin-only routes.

**Implementation:**
```tsx
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" fallbackPath="/auth/login">
      {children}
    </ProtectedRoute>
  );
}
```

### Other Route Guards
- `TechnicianRoute` - For technician-specific routes (requiredRole="technician")
- `ImporterRoute` - For importer/seller routes (requiredRole="importer")

**Note:** The `requiredRole` values in these components don't match the actual database roles ('admin' | 'user'). This indicates the application uses different role systems in different places.

---

## Security Considerations

### Current Issues

1. **Inconsistent Role Checking**
   - Database uses `role` field ('admin' | 'user')
   - ProtectedRoute checks for roles like 'technician' and 'importer' which don't exist in the role enum
   - Login redirects based on `account_type` metadata instead of `role`

2. **No Admin Auto-Redirect**
   - Admin users who log in are not automatically redirected to the admin dashboard
   - They follow the same redirect logic as regular users

3. **Multiple User Type Fields**
   - `profiles.role` - Primary authorization field
   - `user_metadata.account_type` - Used in login redirects
   - `profiles.user_type` - May exist in some older migrations
   - These fields are not synchronized

### Row Level Security (RLS)

The application uses Supabase Row Level Security policies to protect data. Admin users should have elevated permissions in RLS policies.

**Example from migrations:**
```sql
-- Admin users can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (role = 'admin');
```

---

## Access Dashboard

### How to Access Admin Dashboard

1. **Account Setup:**
   - Must have a user account with `role = 'admin'` in the profiles table
   - This must be set directly in the database (Supabase Dashboard or SQL)

2. **Login:**
   - Go to `/auth/login`
   - Enter admin credentials
   - Currently: May be redirected to regular dashboard
   - Expected: Should redirect to `/admin`

3. **Direct Navigation:**
   - Navigate directly to `/admin` or `/admin/dashboard`
   - AdminRoute will verify role before allowing access

### Who Can Access

**Admin Dashboard:**
- Only users with `role = 'admin'` in the profiles table

**User Dashboard:**
- Any authenticated user

---

## Creating an Admin Account

### Method 1: Database Direct Update

```sql
-- Update an existing user to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

### Method 2: During Registration (Code Change Required)

Currently, the registration process sets role to 'user' by default. To create admin accounts programmatically, you would need to:

1. Create user account normally
2. Update the role to 'admin' via database or admin API

**Note:** There is no self-service admin registration for security reasons.

---

## Dashboard Features

### Admin Dashboard Features

Located in: `src/pages/admin/DashboardPage.tsx`

**Capabilities:**
- View system-wide statistics (users, listings, shops, campaigns)
- Approve/reject pending listings
- Approve/reject pending repair shops  
- Approve/reject pending ad campaigns
- Approve/reject pending neighborhoods
- View recent activity log
- System analytics and monitoring

### User Dashboard Features

Located in: `src/pages/DashboardPage.tsx`

**Features by Account Type:**
- **Importer:** Store management, product listings
- **Technician:** Service offerings, appointments
- **Customer:** Favorites, saved searches

---

## Technical Implementation Details

### AuthContext

**File:** `src/contexts/AuthContext.tsx`

**Key Functions:**
- `signIn(email, password)` - Authenticates user
- `signUp(email, password, fullName, metadata)` - Registers new user
- `signOut()` - Logs out user
- `resetPassword(email)` - Sends password reset email

**User Object Structure:**
```typescript
interface AuthUser {
  id: string;
  email: string | null;
  profile: Profile | null; // Contains role field
}
```

### Profile Type

**File:** `src/types/database.ts`

```typescript
type UserRole = 'admin' | 'user';

profiles: {
  Row: {
    id: string;
    email: string | null;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
    role: UserRole;
    city_id: string | null;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}
```

---

## Recommendations for Improvement

1. **Fix Login Redirects**
   - Check `profile.role` instead of `user_metadata.account_type`
   - Redirect admin users to `/admin` immediately after login

2. **Unify Role System**
   - Consolidate `role`, `user_type`, and `account_type` into a single system
   - Use `role` for permissions and add separate field for account features

3. **Update ProtectedRoute**
   - Remove unused roles from type definitions (technician, importer)
   - Or implement these as account_type flags separate from authorization role

4. **Add Admin User Management**
   - Create admin UI for promoting users to admin role
   - Add audit logging for admin role changes

5. **Improve Security**
   - Add rate limiting on login attempts
   - Add 2FA for admin accounts
   - Add session timeout for admin users
   - Log all admin actions

---

## Testing

### Test Accounts

See `supabase/migrations/20250211000001_create_test_accounts.sql` for test account information.

**Note:** Admin test accounts must be created manually via database.

### Testing Admin Access

1. Create or identify admin user in database
2. Login with admin credentials
3. Verify redirect to `/admin` (currently may fail)
4. Navigate manually to `/admin` if needed
5. Verify admin dashboard loads and shows admin features
6. Test admin actions (approve/reject listings, etc.)

### Testing Authorization

1. Try accessing `/admin` as non-admin user → Should redirect to `/`
2. Try accessing `/dashboard` as non-authenticated user → Should redirect to `/auth/login`
3. Verify admin users can access both `/admin` and `/dashboard`

---

## Changelog

- **2026-01-24:** Initial documentation created from code audit
- Identified inconsistencies in role-based routing
- Documented current state and recommended improvements
