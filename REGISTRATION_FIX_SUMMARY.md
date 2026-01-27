# Registration Fix - Visual Summary

## 🔴 BEFORE (Broken)

### What Happened
```
User fills registration form
    ↓
Clicks "Create Account"
    ↓
Supabase Auth creates user ✓
    ↓
Trigger tries to create profile ✗
    ↓
ERROR: column "role" does not exist
    ↓
User sees: "Impossible de terminer l'enregistrement"
```

### Database State
```sql
-- Profiles table had these columns:
CREATE TABLE profiles (
  id UUID,
  email TEXT,
  userType TEXT,        -- ❌ Expected "role"
  firstName TEXT,       -- ❌ Expected "full_name"
  lastName TEXT,        -- ❌ Expected "full_name"
  phoneNumber TEXT,     -- ❌ Expected "phone"
  -- Missing: city, created_at, updated_at
  ...
);

-- Trigger function tried to INSERT:
INSERT INTO profiles (role, full_name, phone, city, ...)
--                    ^^^^  ^^^^^^^^^  ^^^^^  ^^^^
--                    These columns didn't exist!
```

## 🟢 AFTER (Fixed)

### What Happens Now
```
User fills registration form
    ↓
Clicks "Create Account"
    ↓
Supabase Auth creates user ✓
    ↓
Trigger creates profile ✓
    ↓
SUCCESS: User registered!
    ↓
Redirect to login page with success message
```

### Database State After Migration
```sql
-- Profiles table now has both old and new columns:
CREATE TABLE profiles (
  id UUID,
  email TEXT NOT NULL,
  
  -- New standardized columns (added by migration):
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agent', 'merchant', 'admin')),
  full_name TEXT,
  phone TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  
  -- Old columns (preserved for backward compatibility):
  userType TEXT,
  firstName TEXT,
  lastName TEXT,
  phoneNumber TEXT,
  ...
);

-- Data is migrated automatically:
-- userType='Customer' → role='user'
-- userType='Technician' → role='agent'
-- userType='Importer' → role='merchant'
-- firstName + lastName → full_name
-- phoneNumber → phone
```

## 📋 Migration Summary

### What the Migration Does

1. **Adds New Columns** (if missing)
   - `role` - standardized user role
   - `full_name` - combined name field
   - `phone` - phone number
   - `city` - user location
   - `created_at`, `updated_at` - timestamps

2. **Migrates Existing Data**
   ```sql
   -- Maps old userType values to new role values:
   Customer    → user
   Technician  → agent
   Importer    → merchant
   
   -- Combines name fields:
   firstName + lastName → full_name
   
   -- Copies phone:
   phoneNumber → phone
   ```

3. **Updates Trigger Function**
   - Now inserts into correct columns
   - Better error handling
   - Logs detailed information for debugging

4. **Fixes RLS Policies**
   - Clear, consistent policy names
   - Proper permissions for users and admins
   - Prevents users from changing their own role

## 🎯 User Registration Flow

### Registration Form Fields
```
┌─────────────────────────────────────┐
│ Step 1: Select Role                 │
│  ○ Shop/Merchant   (→ role='merchant')│
│  ○ Technician      (→ role='agent')  │
│  ○ Individual      (→ role='user')   │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Step 2: Account Details             │
│  Full Name:    [____________]        │
│  Email:        [____________]        │
│  Phone:        [____________]        │
│  City:         [____________]        │
│  Password:     [____________]        │
│  Confirm:      [____________]        │
│                                      │
│  [Create Account]                    │
└─────────────────────────────────────┘
```

### Backend Processing
```javascript
// 1. Frontend calls signUpWithRole()
const { user, error } = await signUpWithRole(
  email,
  password,
  'merchant',  // or 'agent' or 'user'
  fullName,
  phone,
  city
);

// 2. Supabase Auth creates user
auth.signUp({
  email,
  password,
  options: {
    data: {
      role: 'merchant',
      full_name: fullName,
      phone: phone,
      city: city
    }
  }
});

// 3. Database trigger fires
// handle_new_user() extracts metadata and creates profile
INSERT INTO profiles (
  id,
  email,
  role,        -- ✅ Now exists!
  full_name,   -- ✅ Now exists!
  phone,       -- ✅ Now exists!
  city,        -- ✅ Now exists!
  created_at,
  updated_at
) VALUES (
  user_id,
  'user@example.com',
  'merchant',
  'John Doe',
  '+212...',
  'Casablanca',
  NOW(),
  NOW()
);
```

## 🧪 Testing Checklist

After deploying the migration, test:

- [ ] **New user registration** (all 3 roles)
  - [ ] Shop/Merchant role
  - [ ] Technician role
  - [ ] Individual seller role

- [ ] **Verify in Supabase Dashboard**
  - [ ] User appears in Authentication > Users
  - [ ] Profile appears in Table Editor > profiles
  - [ ] Role is correctly set
  - [ ] Full name, phone, city are saved

- [ ] **Existing users**
  - [ ] Can still log in
  - [ ] Profiles are preserved
  - [ ] Data was migrated correctly

- [ ] **Error handling**
  - [ ] Duplicate email shows proper error
  - [ ] Weak password shows proper error
  - [ ] Network errors are handled gracefully

## 📁 Files Changed

```
Mobile-Morocco-/
├── supabase/migrations/
│   └── 20260127000002_fix_registration_column_mapping.sql  [NEW]
│       ↳ 359 lines - Main fix migration
│
├── REGISTRATION_FIX_README.md  [NEW]
│   ↳ Deployment instructions and documentation
│
└── src/services/authService.ts  [MODIFIED]
    ↳ Minor: Enhanced error logging (no functional changes)
```

## 🚀 Deployment Instructions

See `REGISTRATION_FIX_README.md` for detailed instructions.

**Quick Start:**
```bash
# Using Supabase CLI (recommended)
supabase db push

# OR manually execute SQL in Supabase Dashboard
# Copy contents of: supabase/migrations/20260127000002_fix_registration_column_mapping.sql
# Paste into: Supabase Dashboard > SQL Editor > Run
```

## ✅ Validation

All checks passed:
- ✅ TypeScript type checking
- ✅ No new type errors
- ✅ Code review completed
- ✅ Security scan (CodeQL) - 0 vulnerabilities
- ✅ Migration is idempotent
- ✅ Migration is backward compatible

## 📞 Support

If issues occur after deployment:
1. Check Supabase logs for detailed errors
2. Verify migration was applied successfully
3. Test with the checklist above
4. Contact with specific error messages

---

**Status:** ✅ Ready for deployment
**Complexity:** Low
**Breaking Changes:** None
**Rollback:** Safe (migration is additive, doesn't delete data)
