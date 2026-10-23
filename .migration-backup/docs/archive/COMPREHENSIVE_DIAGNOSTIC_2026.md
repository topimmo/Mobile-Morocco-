# COMPREHENSIVE MARKETPLACE DIAGNOSTIC REPORT
**Platform:** Mobile Morocco Real Estate & Listings Platform  
**Date:** February 5, 2026  
**Analysis Type:** Full System Logic & Readiness Assessment  
**Status:** Production Candidate - Beta Stage  

---

## EXECUTIVE SUMMARY

### Platform Overview
Mobile Morocco is a multilingual (Arabic/French/English) marketplace platform for mobile phones, computers, parts, and repair services. Built with React + TypeScript + Supabase, the platform includes:
- **9 main database tables** with Row Level Security
- **40+ routes** including public, authenticated, and role-protected pages
- **4 user roles:** user, agent, merchant, admin
- **Comprehensive SEO** with dynamic metadata, structured data (JSON-LD), and Open Graph tags
- **Multilingual support** with dual language fields (_fr, _ar)

### Overall Readiness: **BETA (65% Production-Ready)**
- ✅ **Strong Foundation:** Database schema, RLS policies, authentication, SEO
- ⚠️ **Critical Gaps:** User listing management (edit/delete), price filtering, admin featured listings
- 🔧 **Needs Work:** User dashboards, error messaging, test data cleanup

---

## 1. DATA MODEL & DATABASE SCHEMA ✅

### Core Tables
| Table | Purpose | Status | Key Features |
|-------|---------|--------|--------------|
| **profiles** | User accounts (extends auth.users) | ✅ Complete | role, city, phone, is_verified, full_name |
| **listings** | Product ads (legacy structure) | ✅ Active | is_featured, status, views, multilingual |
| **items** | Store inventory (phones, parts, equipment) | ✅ Active | item_type, condition, price, status |
| **stores** | Seller profiles (1 per user) | ✅ Active | store_type, rating_avg, rating_count |
| **repair_services** | Services offered by stores | ✅ Active | device_types[], estimated_duration |
| **categories** | Hierarchical product categories | ✅ Active | parent_id, slug, icon, multilingual |
| **cities** | Moroccan cities with regions | ✅ Active | coordinates, slug, region |
| **neighborhoods** | User-submitted neighborhoods | ✅ Active | is_verified, created_by (needs approval) |
| **ad_campaigns** | Advertising system | ✅ Active | status workflow, payment tracking |

### Relationships ✅ Well-Structured
```
profiles (1) → (1) stores → (*) items
                         → (*) repair_services
items → (1) category
items → (1) city → (*) neighborhoods
listings → (1) category, city, neighborhood
ad_campaigns → (*) ad_bookings → (*) ad_events
```

### Featured/Promoted Logic ⚠️ EXISTS BUT UNDERUTILIZED
- `listings.is_featured` boolean field with partial index
- **Issue:** Homepage doesn't filter by featured flag (just shows latest 8)
- **Issue:** No admin UI to toggle featured status
- **Recommendation:** Implement featured listing management in admin dashboard

---

## 2. AUTHENTICATION & AUTHORIZATION ✅ MOSTLY COMPLETE

### Implementation ✅ Robust
- **Framework:** Supabase Auth with custom service layer
- **Profile Creation:** ✅ Automatic on signup via `registerUser()` + `ensureProfileExists()` fallback
- **Session Management:** ✅ Auto-refresh 5 mins before expiration
- **Login/Logout:** ✅ Fully functional with role-based redirects
- **Password Reset:** ⚠️ Backend ready, UI incomplete (placeholder only)

### Role System ✅ Well-Designed
- **Roles:** user, agent, merchant, admin
- **Access Control:** RoleGuard components with admin bypass
- **Authorization:** Route-level protection with unauthorized redirect

### 🔴 CRITICAL GAPS
| Issue | Severity | Impact |
|-------|----------|--------|
| **Two signup paths** | ⚠️ Medium | `registerUser()` vs `signUpWithRole()` inconsistent field mapping (user_type vs role) |
| **Password reset UI incomplete** | ⚠️ Medium | ResetPasswordPage doesn't call authService function |
| **Duplicate profile detection** | ⚠️ Medium | Detected but only logged, no cleanup mechanism |
| **No email verification enforcement** | ⚠️ Medium | Users can login before email confirmed |
| **Account Type Selection disconnect** | 🔴 High | Metadata created but not synced to profiles.role, may cause redirect failures |

---

## 3. LISTING FLOWS & CRUD OPERATIONS ⚠️ INCOMPLETE

### CREATE Listings ✅ FULLY FUNCTIONAL
- **Pages:** PublishPhonePage, PublishComputerPage, PublishComputerPartPage
- **Alternative:** Dashboard → CreateItemPage
- **Status:** All listings start as `pending` (requires admin approval)
- **Images:** Up to 6 images per listing
- **Validation:** Form validation with required fields

### READ Listings ✅ COMPREHENSIVE
- **Visibility:** Only `status = 'approved'` shown to public
- **Display Locations:**
  - Homepage (featured section, latest listings)
  - Category pages (phones, computers, parts, etc.)
  - City pages (location-based)
  - Search results
  - Store profiles (store inventory)
- **Details:** ItemDetailsPage with full specs, images, contact info

### UPDATE Listings 🔴 MISSING UI
- **Backend:** ✅ `updateItem(id, update)` function exists
- **Frontend:** ❌ **NO edit pages or forms**
- **Impact:** Users cannot modify listings after creation
- **Blocker:** Critical for production use

### DELETE Listings 🔴 MISSING UI
- **Backend:** ✅ `deleteItem(id)` function exists
- **Frontend:** ❌ **NO delete buttons in UI**
- **Impact:** Users cannot remove unwanted listings
- **Blocker:** Critical for production use

### Listing Status Workflow ✅ DEFINED
```
CREATE (pending) → ADMIN APPROVAL (approved/rejected) → PUBLIC DISPLAY (approved only)
```
- Statuses: pending, approved, rejected, hidden
- **Gap:** No user dashboard showing "My Listings" with status indicators

---

## 4. ADMIN CAPABILITIES ⚠️ PARTIAL

### ✅ IMPLEMENTED FEATURES
| Feature | Status | Notes |
|---------|--------|-------|
| **Listing approval/rejection** | ✅ Complete | `approveListing`, `rejectListing` |
| **Item approval/rejection** | ✅ Complete | For phones, computers, parts |
| **Repair shop approval** | ✅ Complete | `approveRepairShop`, `rejectRepairShop` |
| **Ad campaign approval** | ✅ Complete | Full workflow management |
| **Neighborhood approval** | ✅ Complete | User-submitted neighborhoods verified |
| **Dashboard analytics** | ✅ Complete | Counts, pending items, recent activity |

### 🔴 MISSING FEATURES
| Feature | Impact | Priority |
|---------|--------|----------|
| **Featured listing management** | Medium | No UI to toggle is_featured flag |
| **User management** | High | No ban/suspend/delete user functions |
| **Category management** | Medium | Categories appear hardcoded, no CRUD |
| **City management** | Low | No admin ability to add/edit cities |
| **Bulk operations** | Medium | No multi-select approve/reject |
| **Listing deletion** | Medium | Admins can only approve/reject, not delete |

---

## 5. SEARCH & FILTERING ⚠️ FUNCTIONAL BUT INCOMPLETE

### ✅ WORKING FILTERS
- **Keyword Search:** Full-text search across title_ar, title_fr, description (Supabase ilike)
- **Category:** Dropdown select (functional)
- **City:** Dropdown with region grouping (functional)
- **Neighborhood:** Conditional autocomplete after city selected (functional)
- **Condition:** new/used/refurbished radio buttons (functional)
- **Search Analytics:** Tracks search queries

### 🔴 CRITICAL ISSUES
| Issue | Details | Impact |
|-------|---------|--------|
| **Price filtering UI only** | Sliders visible but don't pass minPrice/maxPrice to backend | Users can't filter by price range |
| **Sorting broken** | sortBy param exists but ignored in queries; always sorts by date | Price sorting (low→high, high→low) doesn't work |
| **Inconsistent filter components** | 3 different filter implementations (FilterSidebar, FiltersPanel, AdvancedSearch) | Confusion, maintenance burden |
| **Backend supports price filters** | But frontend never sends them | Feature exists but disconnected |

### Recommendations
1. Connect price slider to API calls (add minPrice/maxPrice to FilterValues)
2. Implement sortBy in Supabase queries (replace hardcoded date sort)
3. Consolidate filter components into single source of truth
4. Add brand filtering if needed by users

---

## 6. DATA DISPLAY & VISIBILITY RULES ✅ STRICT

### Visibility Enforcement ✅ EXCELLENT
- **Public Queries:** Hard filter `.eq('status', 'approved')` on all listings/items
- **Owner Preview:** No draft/pending visibility for listing owners (gap)
- **Admin Override:** Admins can view all statuses
- **Consistent:** Applied across listings.ts, computers.ts, stores.ts

### Empty States ✅ COMPREHENSIVE
- All pages have proper empty state messaging
- Icons + helpful hints ("Try adjusting filters")
- Consistent pattern: Loading skeleton → Empty state → Grid

### Featured Listings Display ⚠️ NOT LEVERAGED
- `is_featured` field exists in schema
- Homepage shows "Featured Listings" label but doesn't filter by is_featured
- Just shows latest 8 listings regardless of featured status
- **Recommendation:** Filter homepage by is_featured = true OR implement manual curation

---

## 7. UX & CONVERSION REVIEW

### ✅ STRENGTHS
- **Clear CTAs:** "Publish Listing" buttons on category pages
- **Multilingual:** AR/FR/EN support throughout
- **SEO-optimized:** Clean URLs, metadata, structured data
- **Contact Exposure:** Phone/WhatsApp buttons visible on listings
- **Professional Design:** Consistent UI with Shadcn components

### 🔴 UX GAPS
| Issue | Impact | Severity |
|-------|--------|----------|
| **No user dashboard** | Users can't see their listings | 🔴 Critical |
| **No edit/delete listing** | Users stuck with mistakes | 🔴 Critical |
| **No approval status visibility** | Users don't know if listing is pending/approved | ⚠️ High |
| **Test credentials visible** | LoginForm shows test emails (remove before production) | ⚠️ High |
| **Error messages console-only** | Users don't see fetch errors | ⚠️ Medium |
| **No favorites functionality** | /favorites route exists but not implemented | ⚠️ Medium |

---

## 8. SEO & STRUCTURE READINESS ✅ EXCELLENT

### Routes ✅ SEO-FRIENDLY
- Clean URLs: `/items/{slug}`, `/categories/{slug}`, `/cities/{slug}`
- Proper sitemap.xml with priorities (0.6-1.0)
- robots.txt properly configured

### Metadata ✅ DYNAMIC PER PAGE
- SEO component with dynamic titles, descriptions, keywords
- Canonical URLs
- Multilingual locale tags (fr/ar)
- Meta robots control (noindex for protected pages)

### Structured Data ✅ COMPREHENSIVE
- **Product schema:** Price, currency (MAD), condition, brand, seller
- **LocalBusiness schema:** For repair shops with address, phone, ratings
- **WebSite schema:** Search action template
- **BreadcrumbList schema:** Helper functions available
- **Open Graph:** Complete with image dimensions (1200x630)
- **Twitter Card:** Supported (@mobilemaroc)

### Indexability ✅ PROPERLY CONFIGURED
- Protected pages (auth, admin, agent, merchant) have `noindex={true}`
- robots.txt excludes `/admin/`, `/advertiser/`, `/auth/`
- Category/city pages properly indexed

### ⚠️ MINOR ISSUE
- **Test credentials visible in LoginForm** (lines showing test emails) - **REMOVE BEFORE PRODUCTION**

---

## 9. PERFORMANCE & STABILITY ⚠️ MIXED

### ✅ GOOD PRACTICES
- **Pagination:** Robust with configurable page size (default: 20, max: 50)
- **Caching:** In-memory cache with 5-min TTL, automatic cleanup
- **Loading States:** All major pages track loading boolean
- **Error Handling:** Try-catch blocks with fallback data
- **Retry Logic:** `useDataFetch` hook with 2 attempts, 1s delay

### 🔴 PERFORMANCE ISSUES
| Issue | Impact | Severity |
|-------|--------|----------|
| **Bare `.select()` queries** | Overfetching all columns in stores.ts, neighborhoods.ts, computers.ts | ⚠️ Medium (bandwidth waste) |
| **No user-facing error UI** | Errors only logged to console, not shown to users | ⚠️ Medium |
| **Cache invalidation limited** | Only homepage and listings cached, not categories/cities | Low |

### Recommendations
1. Replace bare `.select()` with specific field selection (e.g., `.select('id, title_fr, price, status')`)
2. Add error toast notifications for failed fetches
3. Expand caching to categories and cities (rarely change)

---

## 10. SECURITY & PERMISSIONS ✅ STRONG

### RLS Policies ✅ COMPREHENSIVE
| Entity | Policy Pattern | Status |
|--------|---------------|--------|
| **Public Read** | Categories, cities, neighborhoods, approved listings | ✅ Secure |
| **Owner Control** | Users can CRUD only own listings/items/shops (auth.uid() = user_id) | ✅ Secure |
| **Admin Override** | `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')` | ✅ Secure |
| **Storage Access** | Public read for approved items, authenticated upload | ✅ Secure |
| **Immutable Storage** | Deny all updates (users must delete + reupload) | ✅ Secure |

### Data Validation ✅ ENFORCED
- **Listings:** title ≥3 chars, description ≥10 chars, price >0
- **Repair Shops:** name ≥3 chars, description ≥10 chars
- **Reviews:** comment ≥10 chars or NULL
- **OTP Rate Limiting:** Max 3 requests per phone per 15 minutes

### Security Hardening ✅ APPLIED
- Migration 20260122000001: Comprehensive security improvements
- RLS enabled on all tables
- CHECK constraints prevent empty/invalid data
- Storage policies prevent unauthorized file access

### ⚠️ MINOR GAPS
- **Storage ownership tracking:** Any authenticated user can delete files (consider ownership table)
- **Email verification:** Not enforced (users can login before confirming)

---

## 11. READINESS SCORE & CLASSIFICATION

### Overall Score: **65/100 - BETA STAGE**

| Category | Score | Status |
|----------|-------|--------|
| **Database & Schema** | 95/100 | ✅ Production-ready |
| **Authentication** | 80/100 | ⚠️ Minor gaps (password reset UI, email verification) |
| **Listing CRUD** | 50/100 | 🔴 Edit/delete missing |
| **Admin Features** | 70/100 | ⚠️ Featured listings, user mgmt missing |
| **Search & Filtering** | 60/100 | 🔴 Price filter broken, sorting broken |
| **Data Display** | 85/100 | ✅ Good visibility rules, empty states |
| **UX & Conversion** | 55/100 | 🔴 No user dashboard, no listing management |
| **SEO** | 98/100 | ✅ Excellent implementation |
| **Performance** | 75/100 | ⚠️ Minor optimizations needed |
| **Security** | 95/100 | ✅ Strong RLS, validation, policies |

### Classification: **BETA - NEAR PRODUCTION**
- **Not a prototype:** Core functionality works, real users could use it
- **Not production-ready:** Critical user-facing features missing (edit/delete listings, dashboard)
- **Beta candidate:** Can support early adopters with manual support, but needs completion

---

## 12. CRITICAL BLOCKERS (MUST-FIX FOR PRODUCTION)

### 🔴 Priority 1: User Cannot Manage Their Listings
**Issue:** Users can create listings but cannot edit or delete them  
**Impact:** Users stuck with mistakes, typos, outdated info  
**Fix Required:**
- Create EditListingPage (mirror PublishPage structure)
- Add edit/delete buttons to user dashboard
- Build "My Listings" page showing user's listings with status
- Implement permissions check (owner only)

**Estimated Effort:** 2-3 days  

### 🔴 Priority 2: Price Filtering Broken
**Issue:** Price sliders visible but don't actually filter results  
**Impact:** Users frustrated, can't find items in their budget  
**Fix Required:**
- Add minPrice/maxPrice to FilterValues interface
- Connect slider onChange to filter state
- Pass filters to backend query

**Estimated Effort:** 2-4 hours  

### 🔴 Priority 3: Sorting Broken
**Issue:** sortBy parameter ignored, always sorts by date  
**Impact:** "Price: Low to High" and other sorts don't work  
**Fix Required:**
- Implement sortBy in Supabase queries
- Replace hardcoded `.order('created_at', ...)` with dynamic sorting

**Estimated Effort:** 1-2 hours  

### 🔴 Priority 4: No User Dashboard
**Issue:** Users have nowhere to see their listings, profile, or activity  
**Impact:** Poor UX, users can't track their listings  
**Fix Required:**
- Build comprehensive dashboard with tabs: My Listings, Profile, Activity
- Show listing status (pending/approved/rejected)
- Add quick actions (edit, delete, duplicate)

**Estimated Effort:** 3-4 days  

### 🔴 Priority 5: Account Type Selection Disconnect
**Issue:** Account type selection creates metadata but doesn't sync to profiles.role  
**Impact:** Users may fail to redirect properly after signup  
**Fix Required:**
- Update account type selection to directly update profiles.role
- Or add database trigger to sync metadata → profiles.role

**Estimated Effort:** 2-3 hours  

---

## 13. IMPORTANT IMPROVEMENTS (SHOULD-FIX)

### ⚠️ Priority 6: Password Reset UI Incomplete
- Complete ResetPasswordPage integration with authService
- Add email verification enforcement
- **Effort:** 4-6 hours

### ⚠️ Priority 7: Admin Featured Listings Management
- Add UI to toggle is_featured flag
- Filter homepage by is_featured = true
- Add featured duration/expiration
- **Effort:** 1-2 days

### ⚠️ Priority 8: Error Messaging to Users
- Replace console.log errors with toast notifications
- Add error boundaries for crash recovery
- Show friendly error messages ("Failed to load listings. Please try again.")
- **Effort:** 1 day

### ⚠️ Priority 9: Cleanup Test Data
- Remove test credentials from LoginForm component
- Add environment check (only show in dev mode)
- **Effort:** 30 minutes

### ⚠️ Priority 10: User Management for Admins
- Add user suspension/ban functionality
- Add user search and filtering
- View user activity logs
- **Effort:** 2-3 days

---

## 14. NICE-TO-HAVE ENHANCEMENTS

### 💡 Enhancement 1: Favorites Functionality
- `/favorites` route exists but not implemented
- Add bookmark icon to listings
- Store favorites in database or localStorage
- **Effort:** 1-2 days

### 💡 Enhancement 2: Listing Analytics
- Show view count to listing owner
- Track WhatsApp clicks, phone clicks
- Show performance over time
- **Effort:** 1-2 days

### 💡 Enhancement 3: Bulk Admin Actions
- Multi-select listings for approve/reject
- Batch operations for efficiency
- **Effort:** 1-2 days

### 💡 Enhancement 4: Email Notifications
- Notify user when listing approved/rejected
- Notify admin when new listing pending
- **Effort:** 2-3 days

### 💡 Enhancement 5: Advanced Search
- Consolidate 3 filter implementations
- Add brand filtering (if needed)
- Add feature filtering (5G, wireless charging, etc.)
- **Effort:** 2-3 days

### 💡 Enhancement 6: Category & City Management
- Admin UI to create/edit categories
- Admin UI to add/edit cities
- **Effort:** 2-3 days

---

## 15. TECHNICAL RECOMMENDATIONS

### Database Optimizations
1. **Add indexes:**
   - `CREATE INDEX idx_items_status_created ON items(status, created_at DESC);`
   - `CREATE INDEX idx_listings_is_featured ON listings(is_featured) WHERE is_featured = true;`
2. **Query optimization:** Replace bare `.select()` with specific field selection
3. **Expand caching:** Cache categories and cities (rarely change)

### Code Quality
1. **Consolidate filter components:** Merge FilterSidebar, FiltersPanel, AdvancedSearch
2. **Add TypeScript strict mode:** Enable in tsconfig.json
3. **Add error boundaries:** Wrap major sections for crash recovery
4. **Standardize auth flow:** Unify registerUser() and signUpWithRole()

### Testing
1. **Add unit tests:** Critical functions (auth, listing CRUD, search)
2. **E2E tests:** User flows (signup → create listing → edit → delete)
3. **RLS testing:** Verify policies prevent unauthorized access

### Documentation
1. **API documentation:** Document all service functions
2. **User guide:** How to create, edit, delete listings
3. **Admin guide:** How to approve listings, manage featured items

---

## 16. IMPLEMENTATION PRIORITY ROADMAP

### Week 1: Critical Blockers (Production Blockers)
- [ ] User listing management (edit/delete UI)
- [ ] My Listings dashboard
- [ ] Price filtering fix
- [ ] Sorting fix
- [ ] Account type selection sync

### Week 2: Important Improvements (Production Polish)
- [ ] Password reset UI completion
- [ ] Admin featured listings management
- [ ] Error toast notifications
- [ ] Test data cleanup
- [ ] Email verification enforcement

### Week 3: Nice-to-Have (Production Enhancement)
- [ ] Favorites functionality
- [ ] Listing analytics
- [ ] Email notifications
- [ ] Bulk admin actions
- [ ] Category/city management

### Week 4: Performance & Quality (Production Optimization)
- [ ] Query optimization (specific field selection)
- [ ] Consolidate filter components
- [ ] Add unit tests
- [ ] E2E tests
- [ ] Documentation

---

## 17. CONCLUSION

### Summary
Mobile Morocco is a **well-architected marketplace platform** with:
- ✅ **Solid foundation:** Database schema, RLS, authentication, SEO
- ⚠️ **Critical gaps:** User listing management, search/filter issues
- 🔧 **Polish needed:** Dashboard, admin features, error handling

### Readiness Assessment: **BETA (65% Production-Ready)**
- **Can launch:** Yes, with manual support for edit/delete requests
- **Should launch:** Not yet - complete critical blockers first
- **Time to production:** 2-3 weeks with focused effort

### Key Strengths
1. **Security:** Comprehensive RLS policies, validation, secure storage
2. **SEO:** Excellent metadata, structured data, Open Graph
3. **Architecture:** Clean separation of concerns, TypeScript, Supabase

### Key Weaknesses
1. **User Experience:** Missing listing management dashboard
2. **Feature Completeness:** Edit/delete functionality not exposed
3. **Search Quality:** Price filtering and sorting broken

### Recommendation
**Focus next sprint on:**
1. User listing management (edit/delete)
2. User dashboard with "My Listings"
3. Fix search/filter issues (price, sorting)
4. Admin featured listings management
5. Error messaging improvements

**After these fixes, the platform will be production-ready at ~85% completion.**

---

## APPENDIX A: DATABASE SCHEMA REFERENCE

### Tables Summary
```sql
-- Core user & content tables
profiles (id, email, full_name, phone, role, city_id, is_verified)
listings (id, title_fr, title_ar, price, category_id, city_id, neighborhood_id, status, is_featured, view_count)
items (id, store_id, item_type, title_fr, title_ar, price, condition, status, view_count)
stores (id, user_id, name_fr, name_ar, store_type, city_id, rating_avg, status)

-- Taxonomy & location
categories (id, name_fr, name_ar, slug, icon, parent_id)
cities (id, name_fr, name_ar, slug, region_fr, region_ar, lat, lng)
neighborhoods (id, city_id, name, slug, is_verified, created_by)

-- Services & advertising
repair_services (id, store_id, service_name_fr, service_name_ar, device_types, price, status)
ad_campaigns (id, advertiser_id, banner_urls, slot, duration_days, status, payment_status)
ad_bookings (id, campaign_id, page, slot, start_date, end_date, status)
ad_events (id, campaign_id, event_type, page, slot, ip_address)

-- Social
reviews (id, user_id, target_type, target_id, rating, comment, is_visible)
store_reviews (id, store_id, user_id, rating, comment, status)
```

---

## APPENDIX B: ROUTES REFERENCE

### Public Routes
- `/` - Homepage
- `/phones`, `/computers`, `/spare-parts`, `/equipment`, `/computer-parts` - Category pages
- `/items/:slug` - Item details
- `/stores`, `/stores/:slug` - Store directory & profiles
- `/repair-shops`, `/repair-shops/:slug` - Service directory
- `/compare` - Product comparison
- `/advertise`, `/ads/request` - Advertising requests

### Auth Routes (Public, Unauthenticated)
- `/auth/login` - Login
- `/auth/register` - Registration
- `/auth/reset-password` - Password reset
- `/auth/callback` - OAuth callback

### User Routes (Authenticated)
- `/dashboard` - User dashboard
- `/dashboard/my-store` - Store management
- `/dashboard/create-item` - Create item
- `/publish-phone`, `/publish-computer`, `/publish-computer-part` - Publish listings
- `/favorites` - Saved favorites (not implemented)

### Admin Routes
- `/admin`, `/admin/dashboard` - Admin dashboard
- `/debug` - Debug mode

### Agent Routes
- `/agent`, `/agent/dashboard` - Agent dashboard

### Merchant Routes
- `/merchant`, `/merchant/dashboard` - Merchant dashboard

---

**END OF DIAGNOSTIC REPORT**
