# Role-Based Authentication & Redirect Implementation

This document describes the role-based authentication and redirection system implemented for the Mobile Morocco platform.

## Overview

The system uses the `profiles` table as the single source of truth for user roles, ensuring consistent and secure role-based access control throughout the application.

## Database Schema

### Profiles Table

The `profiles` table stores user information including their role:

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  role TEXT CHECK (role IN ('user', 'agent', 'merchant', 'admin')),
  full_name TEXT,
  phone TEXT,
  ...
);
```

### Roles

The system supports four roles:

1. **user** - Private sellers (individuals selling their own phones/parts)
2. **agent** - Technicians/Craftsmen (offering repair services)
3. **merchant** - Store owners/Importers (businesses selling multiple items)
4. **admin** - Platform administrators

### UI Role Mapping

The registration UI maps user-friendly role names to database roles:

| UI Selection | Description | Database Role |
|-------------|-------------|---------------|
| Particulier / Vendeur individuel | Private seller | `user` |
| Technicien / Artisan | Technician/Craftsman | `agent` |
| Boutique / Importateur | Store/Importer | `merchant` |

## Database Trigger

A database trigger automatically creates a profile when a user signs up:

```sql
CREATE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, role, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

## Row Level Security (RLS)

RLS policies ensure data security:

### SELECT Policies
- Users can view only their own profile
- Admins can view all profiles

### UPDATE Policies
- Users can update their profile BUT NOT their role field
- Admins can update all profiles including roles

### INSERT Policies
- Service role can insert profiles (for the trigger)

## Authentication Service

### signUpWithRole()

Registers a new user with a specific role:

```typescript
import { signUpWithRole } from '@/services/authService';

const { user, error } = await signUpWithRole(
  'user@example.com',
  'password',
  'merchant', // role
  'John Doe', // full name
  '+212...', // phone
  'Casablanca' // city
);
```

### signInAndRedirect()

Signs in a user and determines the redirect path based on their role:

```typescript
import { signInAndRedirect } from '@/services/authService';

const { user, redirectPath, role, error } = await signInAndRedirect(
  'user@example.com',
  'password'
);

// Redirect logic:
// admin    → /admin
// agent    → /agent
// merchant → /merchant
// user     → /dashboard
```

### getUserRole()

Fetches the role of a user from the profiles table:

```typescript
import { getUserRole } from '@/services/authService';

const { role, error } = await getUserRole(); // current user
// or
const { role, error } = await getUserRole(userId); // specific user
```

## Route Protection

### RoleGuard Component

The `RoleGuard` component protects routes based on allowed roles:

```tsx
import { RoleGuard } from '@/components/RoleGuard';

// Protect a route for multiple roles
<RoleGuard allowedRoles={['agent', 'merchant']}>
  <ServiceManagementPage />
</RoleGuard>

// Admins always have access
```

### Specialized Guards

Pre-configured guards for common use cases:

```tsx
import { AdminGuard, AgentGuard, MerchantGuard } from '@/components/RoleGuard';

// Admin only
<AdminGuard>
  <AdminDashboard />
</AdminGuard>

// Agent only
<AgentGuard>
  <AgentDashboard />
</AgentGuard>

// Merchant only
<MerchantGuard>
  <MerchantDashboard />
</MerchantGuard>
```

## Implementation in App.tsx

```tsx
import { AdminGuard, AgentGuard, MerchantGuard } from '@/components/RoleGuard';

// Admin routes
<Route path="/admin" element={
  <AdminGuard>
    <AdminDashboard />
  </AdminGuard>
} />

// Agent routes
<Route path="/agent" element={
  <AgentGuard>
    <AgentDashboard />
  </AgentGuard>
} />

// Merchant routes
<Route path="/merchant" element={
  <MerchantGuard>
    <MerchantDashboard />
  </MerchantGuard>
} />
```

## User Flow

### Sign Up Flow

1. User selects role on registration page (UI: Boutique, Technicien, Particulier)
2. Role is mapped to database role (merchant, agent, user)
3. `signUpWithRole()` is called with role in metadata
4. User is created in `auth.users`
5. Database trigger creates profile with role from metadata
6. User is redirected to login page

### Sign In Flow

1. User enters credentials
2. `signInAndRedirect()` is called
3. Authentication succeeds
4. User's role is fetched from profiles table
5. Redirect path is determined based on role
6. User is redirected to appropriate dashboard

### Route Access Flow

1. User navigates to protected route
2. `RoleGuard` checks authentication
3. User's role is fetched from profiles table
4. Access is granted if user's role is in allowedRoles
5. Otherwise, user is redirected to /unauthorized

## Security Features

1. **Single Source of Truth**: Role is stored only in profiles table
2. **Immutable Roles**: Users cannot change their own role (RLS enforced)
3. **Admin Control**: Only admins can change user roles
4. **Server-Side Validation**: RLS policies prevent unauthorized access at database level
5. **Type Safety**: TypeScript types ensure role consistency

## Error Handling

- Profile not found → Redirect to account setup
- Unauthorized access → Redirect to /unauthorized page
- Database errors → Logged and graceful fallback

## Testing Checklist

- [ ] Sign up as user (private seller)
- [ ] Sign up as agent (technician)
- [ ] Sign up as merchant (store owner)
- [ ] Login redirects correctly for each role
- [ ] RoleGuard blocks unauthorized access
- [ ] Admins can access all routes
- [ ] Users cannot modify their own role
- [ ] RLS policies work correctly

## Migration

Run the migration to set up the role-based auth system:

```bash
# Apply migration
supabase db push

# Or manually run
supabase/migrations/20260126000002_role_based_auth_setup.sql
```

## Files Modified/Created

### Created
- `src/components/RoleGuard.tsx` - Route protection component
- `src/pages/agent/DashboardPage.tsx` - Agent dashboard
- `src/pages/merchant/DashboardPage.tsx` - Merchant dashboard
- `src/pages/UnauthorizedPage.tsx` - Unauthorized access page
- `supabase/migrations/20260126000002_role_based_auth_setup.sql` - Database setup

### Modified
- `src/services/authService.ts` - Added role-based auth functions
- `src/pages/auth/LoginPage.tsx` - Updated to use signInAndRedirect
- `src/pages/auth/RegisterPage.tsx` - Updated role mapping
- `src/App.tsx` - Added new routes with RoleGuard

## Future Enhancements

- [ ] Role-based permissions within dashboards
- [ ] Audit log for role changes
- [ ] Role-based feature flags
- [ ] Multi-role support (users with multiple roles)
- [ ] Custom permissions per role
