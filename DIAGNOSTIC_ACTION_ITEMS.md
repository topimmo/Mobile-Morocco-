# DIAGNOSTIC ACTION ITEMS CHECKLIST
**Mobile Morocco Platform - Developer TODO List**  
**Date:** February 5, 2026  

---

## 🔴 CRITICAL BLOCKERS (Week 1 - Production Blockers)

### Task 1: Fix Price Filtering ⏱️ 2-4 hours
**File:** `src/components/filters/FiltersPanel.tsx`
- [ ] Add `minPrice` and `maxPrice` to `FilterValues` interface
- [ ] Connect price slider `onChange` to filter state
- [ ] Pass price filters to backend in `onFilterChange`

**File:** `src/lib/supabase/listings.ts`
- [ ] Verify `minPrice`/`maxPrice` are properly applied in query (already exists, just needs frontend connection)

**Test:** Search for items, adjust price slider, verify results change

---

### Task 2: Fix Sorting ⏱️ 1-2 hours
**File:** `src/lib/supabase/listings.ts`
- [ ] Replace hardcoded `.order('created_at', { ascending: false })` with dynamic sorting
- [ ] Implement switch statement for `sortBy` values:
  - `newest` → `order('created_at', desc)`
  - `oldest` → `order('created_at', asc)`
  - `price_low` → `order('price', asc)`
  - `price_high` → `order('price', desc)`

**File:** `src/lib/supabase/computers.ts`
- [ ] Same fix for computers query

**Test:** Select "Price: Low to High", verify results sorted by price ascending

---

### Task 3: Remove Test Credentials ⏱️ 30 mins
**File:** `src/pages/auth/LoginPage.tsx` or similar
- [ ] Find hardcoded test emails/passwords
- [ ] Wrap in environment check: `if (import.meta.env.DEV) { ... }`
- [ ] Or remove entirely before production deploy

**Test:** Verify no test credentials visible in production build

---

### Task 4: Fix Account Type Selection ⏱️ 2-3 hours
**File:** `src/pages/auth/SelectAccountTypePage.tsx` or similar
- [ ] Update account type selection to directly call Supabase update:
  ```ts
  await supabase.from('profiles').update({ role: selectedRole }).eq('id', user.id)
  ```
- [ ] Or create database trigger to sync `auth.users.user_metadata.role` → `profiles.role`

**Test:** Register, select account type, verify role in database, test redirect

---

### Task 5: Build "My Listings" Dashboard Page ⏱️ 3-4 days

#### Step 5.1: Create Dashboard Page Structure
**File:** `src/pages/dashboard/MyListingsPage.tsx` (new)
- [ ] Create page component with tabs: "All", "Pending", "Approved", "Rejected"
- [ ] Fetch user's listings: `getListings({ userId: auth.uid() })`
- [ ] Display listings in grid/table with status badges
- [ ] Add empty state for each tab

#### Step 5.2: Add Status Indicator Component
**File:** `src/components/listings/StatusBadge.tsx` (new)
- [ ] Create badge component with color coding:
  - Pending → Yellow
  - Approved → Green
  - Rejected → Red
  - Hidden → Gray

#### Step 5.3: Add Action Buttons
**File:** `src/components/listings/ListingCard.tsx` or similar
- [ ] Add "Edit" button (links to edit page)
- [ ] Add "Delete" button (with confirmation dialog)
- [ ] Add "View" button (links to public item page)
- [ ] Show actions only for owner

#### Step 5.4: Create Route
**File:** `src/App.tsx`
- [ ] Add route: `/dashboard/my-listings` → `MyListingsPage`
- [ ] Protect with `ProtectedRoute`

#### Step 5.5: Update Dashboard Navigation
**File:** `src/pages/DashboardPage.tsx`
- [ ] Add "My Listings" tab/link in dashboard menu
- [ ] Set as default landing page for dashboard

**Test:** Login, create listing, view in dashboard, verify status shown, test navigation

---

### Task 6: Build Edit Listing Page ⏱️ 2-3 days

#### Step 6.1: Create Edit Page
**File:** `src/pages/EditListingPage.tsx` (new)
- [ ] Duplicate `PublishPhonePage.tsx` structure
- [ ] Fetch existing listing data: `getItemById(id)`
- [ ] Pre-populate form with existing values
- [ ] Change submit to call `updateItem(id, data)` instead of `createItem`

#### Step 6.2: Add Route with ID Parameter
**File:** `src/App.tsx`
- [ ] Add route: `/listings/:id/edit` → `EditListingPage`
- [ ] Protect with `ProtectedRoute`

#### Step 6.3: Add Permission Check
**File:** `src/pages/EditListingPage.tsx`
- [ ] Verify user owns listing: `listing.user_id === auth.uid() || userRole === 'admin'`
- [ ] Redirect to unauthorized page if not owner

#### Step 6.4: Update Backend Function (if needed)
**File:** `src/lib/supabase/stores.ts`
- [ ] Verify `updateItem(id, update)` exists and works (already exists at line 633)

**Test:** Edit listing, change title/price, save, verify changes in database and public view

---

### Task 7: Implement Delete Listing ⏱️ 1-2 hours

#### Step 7.1: Create Delete Confirmation Dialog
**File:** `src/components/listings/DeleteListingDialog.tsx` (new)
- [ ] Create AlertDialog component
- [ ] Show warning message
- [ ] Confirm/Cancel buttons
- [ ] Call `deleteItem(id)` on confirm

#### Step 7.2: Add Delete Button
**File:** `src/components/listings/ListingCard.tsx`
- [ ] Add delete button with trash icon
- [ ] Open confirmation dialog on click
- [ ] Show only for owner or admin

#### Step 7.3: Update Backend (if needed)
**File:** `src/lib/supabase/stores.ts`
- [ ] Verify `deleteItem(id)` exists and works (already exists at line 654)

#### Step 7.4: Handle Success/Error
- [ ] Show success toast after deletion
- [ ] Refresh listings list
- [ ] Show error toast if deletion fails

**Test:** Delete listing, verify removed from database and UI, verify cannot delete others' listings

---

## ⚠️ IMPORTANT IMPROVEMENTS (Week 2 - Production Polish)

### Task 8: Complete Password Reset UI ⏱️ 4-6 hours
**File:** `src/pages/auth/ResetPasswordPage.tsx`
- [ ] Remove placeholder logic
- [ ] Import `requestPasswordReset` from authService
- [ ] Call `requestPasswordReset(email)` on form submit
- [ ] Show success message after email sent
- [ ] Add link to login page

**File:** `src/pages/auth/UpdatePasswordPage.tsx` (may need to create)
- [ ] Create page for password reset link callback
- [ ] Call `updatePassword(newPassword)` from authService
- [ ] Handle token validation errors

**Test:** Request password reset, receive email, click link, update password, login with new password

---

### Task 9: Admin Featured Listings Management ⏱️ 1-2 days

#### Step 9.1: Add Toggle Featured Function
**File:** `src/services/admin.ts` (new or existing)
- [ ] Create function:
  ```ts
  export async function toggleFeatured(listingId: string, isFeatured: boolean) {
    return supabase.from('listings').update({ is_featured: isFeatured }).eq('id', listingId)
  }
  ```

#### Step 9.2: Add Featured Toggle in Admin Dashboard
**File:** `src/pages/admin/AdminDashboardPage.tsx`
- [ ] Add "Featured" column to listings table
- [ ] Add toggle switch or star icon
- [ ] Call `toggleFeatured` on click
- [ ] Update UI optimistically

#### Step 9.3: Update Homepage Query
**File:** `src/pages/HomePage.tsx`
- [ ] Change featured listings query to filter: `is_featured = true`
- [ ] Or implement priority: featured first, then latest

**Test:** Toggle featured status in admin, verify appears on homepage

---

### Task 10: Add Error Toast Notifications ⏱️ 1 day

#### Step 10.1: Create Toast Context
**File:** `src/contexts/ToastContext.tsx` (may exist already)
- [ ] Use Radix UI Toast or similar
- [ ] Export `useToast()` hook

#### Step 10.2: Replace Console Errors
**Files:** All service files (`listings.ts`, `stores.ts`, etc.)
- [ ] Find all `console.error` calls
- [ ] Replace with `toast.error(message)`
- [ ] Keep technical error in console for debugging

#### Step 10.3: Add Success Toasts
- [ ] Show success toast after create/edit/delete listing
- [ ] Show success toast after admin approval/rejection

**Test:** Trigger error (disconnect network), verify toast shows, verify friendly message

---

### Task 11: Enforce Email Verification ⏱️ 2-3 hours
**File:** `src/services/authService.ts`
- [ ] Check `user.email_confirmed_at` in login flow
- [ ] Redirect to "Verify Email" page if not confirmed
- [ ] Add resend verification email button

**File:** Supabase Auth Settings (manual)
- [ ] Enable email confirmation requirement
- [ ] Configure email template

**Test:** Register, try to login without confirming email, verify blocked

---

## 💡 NICE-TO-HAVE ENHANCEMENTS (Week 3+ - Future)

### Task 12: Favorites Functionality ⏱️ 1-2 days
- [ ] Create `favorites` table in Supabase
- [ ] Add bookmark icon to listings
- [ ] Toggle favorite on/off
- [ ] Implement `/favorites` page showing saved listings

---

### Task 13: Listing Analytics ⏱️ 1-2 days
- [ ] Display view_count to listing owner
- [ ] Track whatsapp_clicks, phone_clicks
- [ ] Create analytics page showing performance over time

---

### Task 14: Email Notifications ⏱️ 2-3 days
- [ ] Set up email service (SendGrid, Resend, or Supabase Edge Functions)
- [ ] Send email when listing approved/rejected
- [ ] Send email to admin when new listing pending
- [ ] Add email preferences page

---

### Task 15: Bulk Admin Actions ⏱️ 1-2 days
- [ ] Add checkboxes to listings table in admin
- [ ] Add "Approve Selected" and "Reject Selected" buttons
- [ ] Implement batch update logic

---

### Task 16: Category & City Management ⏱️ 2-3 days
- [ ] Create admin page for category CRUD
- [ ] Create admin page for city CRUD
- [ ] Add validation and permission checks

---

## 🔧 TECHNICAL DEBT (Ongoing)

### Performance Optimization
- [ ] Replace bare `.select()` with specific field selection in:
  - `src/lib/supabase/stores.ts`
  - `src/lib/supabase/neighborhoods.ts`
  - `src/lib/supabase/computers.ts`
- [ ] Add database indexes for common queries
- [ ] Expand caching to categories and cities

### Code Quality
- [ ] Consolidate FilterSidebar, FiltersPanel, AdvancedSearch into one component
- [ ] Standardize registerUser() and signUpWithRole() into single flow
- [ ] Enable TypeScript strict mode
- [ ] Add error boundaries to major sections

### Testing
- [ ] Add unit tests for auth functions
- [ ] Add unit tests for listing CRUD
- [ ] Add E2E tests for user flows (signup → create → edit → delete)
- [ ] Add RLS policy tests

### Documentation
- [ ] Document all service functions with JSDoc
- [ ] Create user guide (how to create/edit listings)
- [ ] Create admin guide (how to approve, feature listings)

---

## 📅 SPRINT PLANNING

### Sprint 1 (Week 1): Critical Blockers
**Goal:** Fix production blockers, achieve 80% readiness  
**Tasks:** 1-7  
**Estimated:** 5-6 days  

### Sprint 2 (Week 2): Important Improvements
**Goal:** Polish UX, achieve 85% readiness  
**Tasks:** 8-11  
**Estimated:** 4-5 days  

### Sprint 3 (Week 3+): Enhancements
**Goal:** Add nice-to-have features, achieve 90% readiness  
**Tasks:** 12-16  
**Estimated:** 8-10 days  

### Ongoing: Technical Debt
**Goal:** Improve code quality, performance, testing  
**Tasks:** Performance, Code Quality, Testing, Documentation  

---

## ✅ DEFINITION OF DONE

Each task is considered complete when:
- [ ] Code implemented and tested locally
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Manual testing passed
- [ ] Code reviewed (if team workflow requires)
- [ ] Committed to feature branch
- [ ] Deployed to staging (if applicable)
- [ ] User acceptance testing passed (if applicable)

---

## 🎯 SUCCESS METRICS

### After Week 1 (Critical Blockers Complete):
- ✅ Users can edit/delete their listings
- ✅ Price filtering works correctly
- ✅ Sorting works correctly
- ✅ Users can see their listings in dashboard with status
- ✅ No test credentials visible

### After Week 2 (Important Improvements Complete):
- ✅ Users can reset their passwords
- ✅ Admins can feature/unfeature listings
- ✅ Error messages visible to users
- ✅ Email verification enforced

### Production Ready Criteria:
- ✅ All Week 1 tasks complete
- ✅ All Week 2 tasks complete
- ✅ No critical bugs in user flows
- ✅ Performance acceptable (< 3s page load)
- ✅ SEO working correctly
- ✅ Security policies tested and verified

---

**Total Estimated Time to Production: 2-3 weeks**  
**Current Status: BETA (65% ready)**  
**After Week 1: BETA+ (80% ready)**  
**After Week 2: PRODUCTION READY (85% ready)**  
