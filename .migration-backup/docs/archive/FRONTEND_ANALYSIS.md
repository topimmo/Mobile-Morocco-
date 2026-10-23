# Frontend Architecture Analysis - Mobile Morocco

This document provides a comprehensive analysis of the frontend structure, extracted from the Mobile Morocco repository.

## Technology Stack

- **Framework**: React 18.2.0
- **Build Tool**: Vite 6.2.3
- **Language**: TypeScript 5.8.2
- **Router**: React Router DOM 6.23.1
- **UI Library**: Radix UI (comprehensive component set)
- **Styling**: TailwindCSS 3.4.1
- **State Management**: React Context API
- **Animations**: Framer Motion 11.18.0
- **Backend**: Supabase 2.54.0
- **Internationalization**: i18next 25.3.6 + react-i18next 15.6.1
- **Form Handling**: React Hook Form 7.51.5 + Zod 3.23.8

---

## Folder Structure and Conventions

### Root Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── lib/                # Library utilities and integrations
├── services/           # Business logic and API services
├── types/              # TypeScript type definitions
├── models/             # Data models
├── data/               # Static data and mock data
├── config/             # Configuration files
├── utils/              # Utility functions
├── stories/            # Storybook stories
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

### Component Organization
Components are organized into several subdirectories:

1. **`components/ui/`** - Primitive UI components (45 components)
   - Based on Radix UI and shadcn/ui patterns
   - Includes: buttons, dialogs, forms, navigation, etc.

2. **`components/layout/`** - Layout components
   - `Navbar.tsx` - Main navigation bar
   - `Footer.tsx` - Site footer
   - `PageLayout.tsx` - Page wrapper layout

3. **`components/common/`** - Shared common components
   - Banners, error displays, etc.

4. **`components/search/`** - Search-related components
   - Search bars, filters, etc.

5. **`components/admin/`** - Admin-specific components

6. **`components/dashboards/`** - Dashboard components

7. **`components/_marocmobile-reference/`** - Reference implementation components

### Page Organization (53 pages total)

Pages are organized by feature and role:

1. **Root Pages** - `/pages/*.tsx`
   - Public pages (Home, About, Contact, etc.)
   
2. **`/pages/auth/`** - Authentication pages
   - LoginPage, RegisterPage, ResetPasswordPage, etc.

3. **`/pages/admin/`** - Admin dashboard pages
   - DashboardPage.tsx

4. **`/pages/agent/`** - Agent dashboard pages
   - DashboardPage.tsx

5. **`/pages/merchant/`** - Merchant dashboard pages
   - DashboardPage.tsx

6. **`/pages/dashboard/`** - User dashboard pages
   - MyStorePage, CreateItemPage

---

## Routes and Pages

### Public Routes

#### **Homepage**
- **Route**: `/`
- **Component**: `HomePage`
- **Features**: Hero search, categories, featured listings, repair shops

#### **Product & Service Routes**
- `/phones` - PhonesPage (Mobile phones marketplace)
- `/spare-parts` - SparePartsPage (Mobile spare parts)
- `/equipment` - EquipmentPage (Repair equipment)
- `/computers` - ComputersPage (Computer marketplace)
- `/computer-parts` - ComputerPartsPage (Computer parts)
- `/computer-repair` - ComputerRepairPage (Computer repair services)
- `/services` - ServicesPage (Mobile repair services)

#### **Store Routes**
- `/stores` - StoresPage (Store directory)
- `/stores/:slug` - StoreProfilePage (Individual store profile)

#### **Item Routes**
- `/items/:slug` - ItemDetailsPage (Generic item details)
- `/listings` - ListingsPage (All listings)
- `/listings/:slug` - ListingDetailsPage (Single listing details)

#### **Repair & Technician Routes**
- `/repair-shops` - RepairShopsPage
- `/repair-shops/:slug` - RepairShopDetailsPage
- `/technicians` - TechniciansPage

#### **Utility Routes**
- `/compare` - ComparePage (Product comparison)
- `/favorites` - FavoritesPage (User favorites - protected)
- `/advertise` - AdvertisePage (Advertising information)
- `/ads/request` - AdRequestPage (Ad request form)

#### **Category & Location Routes**
- `/categories/:slug` - CategoryPage (Category-specific listings)
- `/cities/:slug` - CityPage (City-specific listings)

#### **Legal & Info Pages**
- `/about` - AboutPage
- `/contact` - ContactPage
- `/faq` - FAQPage
- `/terms` - TermsPage
- `/privacy` - PrivacyPage

### Protected Routes (Authentication Required)

#### **Publishing Routes**
- `/publish-phone` - PublishPhonePage
- `/publish-computer` - PublishComputerPage
- `/publish-computer-part` - PublishComputerPartPage

#### **User Dashboard**
- `/dashboard` - DashboardPage (User dashboard)
- `/dashboard/my-store` - MyStorePage
- `/dashboard/create-item` - CreateItemPage

#### **Test Routes**
- `/test-listing-form` - TestCreateListingPage

### Role-Based Protected Routes

#### **Admin Routes** (Admin role required)
- `/admin` - AdminDashboard
- `/admin/dashboard` - AdminDashboard
- `/debug` - DebugModePage

#### **Agent Routes** (Agent role required)
- `/agent` - AgentDashboard
- `/agent/dashboard` - AgentDashboard

#### **Merchant Routes** (Merchant role required)
- `/merchant` - MerchantDashboard
- `/merchant/dashboard` - MerchantDashboard

### Authentication Routes
- `/auth/login` - LoginPage
- `/auth/register` - RegisterPage
- `/auth/reset-password` - ResetPasswordPage
- `/auth/callback` - AuthCallbackPage (OAuth callback)
- `/auth/select-account-type` - AccountTypeSelectionPage (protected)

### Error Routes
- `/unauthorized` - UnauthorizedPage
- `*` (404) - NotFoundPage

---

## Navigation Structure

### Desktop Navigation

The main navigation bar (`Navigation.tsx`) includes:

#### **Primary Navigation Links**
1. **Home** (`/`) - Always visible
   - Icon: Home
   - Label: "الرئيسية" (AR) / "Accueil" (FR)

#### **Products Dropdown Menu**
Grouped product categories with icons:
- **Téléphones** (`/phones`) - Smartphone icon
- **Pièces Mobiles** (`/spare-parts`) - Settings icon
- **Ordinateurs** (`/computers`) - Laptop icon
- **Pièces PC** (`/computer-parts`) - CPU icon
- **Équipements** (`/equipment`) - Wrench icon

#### **Services Dropdown Menu**
Service categories:
- **Réparation Mobile** (`/services`) - Users icon
- **Réparation PC** (`/computer-repair`) - Monitor icon

#### **Standalone Links**
- **Boutiques** (`/stores`) - Store icon
- **Comparer** (`/compare`) - BarChart2 icon

#### **User Actions**
- Language Selector (AR/FR toggle) - Globe icon
- Login/Register (for guests)
- Dashboard link (for authenticated users)
- Admin/Agent/Merchant dashboard (role-based)
- Logout button (for authenticated users)

### Mobile Navigation

Mobile menu includes all navigation items in a flat list:
- All primary links
- All product categories
- All service categories
- Stores
- Compare

---

## Layout Components

### 1. **Navbar** (`components/layout/Navbar.tsx`)
Currently empty - navigation is handled by `Navigation.tsx`

### 2. **Navigation** (`components/Navigation.tsx`)
Main navigation bar with:
- Logo display with fallback
- Desktop horizontal menu with dropdowns
- Mobile hamburger menu (Sheet component)
- Language switcher
- Authentication state-aware links
- Role-based navigation items
- RTL support for Arabic

### 3. **Footer** (`components/Footer.tsx`)
Three-column footer with:

**Column 1: Brand & Social**
- Brand name and description
- Social media links (Facebook, Twitter, Instagram, LinkedIn)

**Column 2: Quick Links**
- Home, Listings, Phones, Stores, Services, Technicians, Compare

**Column 3: Information & Contact**
- About, FAQ, Contact, Advertise
- Email: support@mobilemaroc.ma
- Phone: +212522123456
- Address: Casablanca, Morocco

**Bottom Bar**
- Copyright notice
- Legal links (Terms, Privacy)

### 4. **PageLayout** (`components/layout/PageLayout.tsx`)
Currently empty/placeholder

### 5. **Global Wrappers**

**App.tsx structure:**
```
GlobalErrorBoundary
  ├── LanguageProvider
  │   └── AuthProvider
  │       └── ComparisonProvider
  │           └── FavoritesProvider
  │               └── AppContent
  │                   ├── NetworkErrorBanner
  │                   ├── Routes (Suspense wrapped)
  │                   ├── ComparisonFloatingButton
  │                   └── Toaster
```

### 6. **Error Boundaries**
- `GlobalErrorBoundary` - Top-level error catching
- `PageErrorBoundary` - Per-route error handling
- `ErrorBoundary` - General error boundary component

---

## Categories

### Category Data Structure
```typescript
interface Category {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  icon: string | null;
  parent_id: string | null;
  sort_order: number;
  is_active: boolean;
}
```

### Default Categories (Fallback)
From `lib/supabase/categories.ts`:

1. **Téléphones** (الهواتف)
   - Slug: `telephones`
   - Icon: smartphone
   - Sort: 1

2. **Pièces Détachées** (قطع الغيار)
   - Slug: `pieces-detachees`
   - Icon: settings
   - Sort: 2

3. **Équipements** (معدات الإصلاح)
   - Slug: `equipement-reparation`
   - Icon: wrench
   - Sort: 3

4. **Accessoires** (الإكسسوارات)
   - Slug: `accessoires`
   - Icon: headphones
   - Sort: 4

### Category Icons Mapping
From `pages/HomePage.tsx`:
```typescript
const CATEGORY_ICONS = {
  'telephones': Smartphone,
  'telephones-neufs': Smartphone,
  'telephones-occasion': Smartphone,
  'accessoires': Headphones,
  'pieces-detachees': Settings,
  'equipement-reparation': Wrench,
}
```

### Category API Functions
- `getCategories()` - Fetch all active categories
- `getCategoryBySlug(slug)` - Fetch category by slug
- `getCategoryById(id)` - Fetch category by ID
- `getParentCategories()` - Fetch top-level categories
- `getChildCategories(parentId)` - Fetch subcategories
- `getCategoryName(category, language)` - Get localized name

---

## Cities and Locations

### City Data Structure
```typescript
interface City {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
  region_fr: string | null;
  region_ar: string | null;
  is_active: boolean;
  sort_order: number;
}
```

### Default Cities (Fallback)
From `lib/supabase/cities.ts`:

1. **Casablanca** (الدار البيضاء)
   - Region: Casablanca-Settat / الدار البيضاء-سطات
   - Slug: casablanca

2. **Rabat** (الرباط)
   - Region: Rabat-Salé-Kénitra / الرباط-سلا-القنيطرة
   - Slug: rabat

3. **Marrakech** (مراكش)
   - Region: Marrakech-Safi / مراكش-آسفي
   - Slug: marrakech

4. **Fès** (فاس)
   - Region: Fès-Meknès / فاس-مكناس
   - Slug: fes

5. **Tanger** (طنجة)
   - Region: Tanger-Tétouan-Al Hoceïma / طنجة-تطوان-الحسيمة
   - Slug: tanger

6. **Agadir** (أكادير)
   - Region: Souss-Massa / سوس-ماسة
   - Slug: agadir

7. **Oujda** (وجدة)
   - Region: Oriental / الشرق
   - Slug: oujda

8. **Meknès** (مكناس)
   - Region: Fès-Meknès / فاس-مكناس
   - Slug: meknes

### City API Functions
- `getCities(language)` - Fetch all active cities
- `getCitiesByRegion(language)` - Group cities by region
- `getCityBySlug(slug)` - Fetch city by slug
- `getCityById(id)` - Fetch city by ID
- `getCityName(city, language)` - Get localized city name
- `getRegionName(city, language)` - Get localized region name

---

## Constants and Configuration

### Product Conditions
From `data/mockProducts.ts`:
- `new` - New items
- `used` - Used items
- `refurbished` - Refurbished items

### Brand Lists
Brands are defined in various components (not centralized):
- FilterSidebar.tsx
- ProductListingForm.tsx
- AdvancedSearch.tsx

Common brands include:
- Apple
- Samsung
- Google
- OnePlus
- Xiaomi
- HP
- Dell
- Lenovo

### User Roles
From authentication system:
- `admin` - Administrator (full access)
- `agent` - Agent (agent dashboard)
- `merchant` - Merchant (merchant dashboard)
- `user` - Regular user (user dashboard)

### Cache Keys
From `lib/cache.ts`:
- `CACHE_KEYS.CATEGORIES` - Categories cache
- `CACHE_KEYS.HOMEPAGE_DATA` - Homepage data
- Various page-specific cache keys

---

## Context Providers

The application uses React Context for state management:

### 1. **LanguageContext** (`contexts/LanguageContext.tsx`)
- Current language (Arabic/French)
- Translation function
- RTL detection
- Language switching

### 2. **AuthContext** (`contexts/AuthContext.tsx`)
- Current user state
- Authentication status
- User profile with role
- Sign in/out methods
- Loading state

### 3. **ComparisonContext** (`contexts/ComparisonContext.tsx`)
- Product comparison state
- Add/remove products
- Comparison list management

### 4. **FavoritesContext** (`contexts/FavoritesContext.tsx`)
- User favorites
- Add/remove favorites
- Favorites list management

### 5. **LocationContext** (`contexts/LocationContext.tsx`)
- User location state
- Location preferences

---

## Key UI Components

### Navigation Components
- `Navigation.tsx` - Main navigation bar
- `NavigationSkeleton` - Loading skeleton for navigation

### Search Components (`components/search/`)
- `SearchBar` - Main search input
- `CitySelector` - City selection dropdown
- `FiltersPanel` - Advanced filters

### Common Components
- `BannerSlot` - Advertisement banners
- `InlineError` - Error messages
- `NetworkErrorBanner` - Network status indicator

### Product Components
- `ProductCard` - Product card display
- `ProductGrid` - Grid of products
- `ProductDetails` - Product details view
- `ProductComparison` - Product comparison view
- `ProductListingForm` - Create/edit product

### Dashboard Components
- `PreviewDashboard` - Dashboard preview
- Various role-specific dashboards

### Other Key Components
- `ComparisonFloatingButton` - Floating comparison button
- `SEO` - SEO meta tags
- `LoadingSkeletons` - Various loading states
- `AdvancedLocationSelector` - Enhanced location selector
- `ImageWithFallback` - Image with error handling
- `OptimizedImage` - Performance-optimized images
- `PaginationControls` - Pagination UI

---

## Route Protection

### Protection Levels

1. **Public Routes**
   - No authentication required
   - Wrapped with `PageErrorBoundary`

2. **Protected Routes**
   - Uses `<ProtectedRoute>` component
   - Redirects to `/auth/login` if not authenticated
   - Examples: favorites, publish pages, user dashboard

3. **Role-Based Routes**
   - Uses specific guards: `AdminGuard`, `AgentGuard`, `MerchantGuard`
   - Checks user role from profile
   - Redirects to `/unauthorized` if insufficient permissions
   - Admin can access all routes

### Redirect Logic

Based on user role (`getRedirectPath` function):
- Admin → `/admin`
- Agent → `/agent`
- Merchant → `/merchant`
- User → `/dashboard`
- Guest → `/`

---

## Internationalization (i18n)

### Supported Languages
- **Arabic (ar)** - Default, RTL
- **French (fr)** - Secondary

### Translation Keys (Examples from Footer)
- `footer.brand_name`
- `footer.brand_description`
- `footer.quick_links`
- `footer.home`
- `footer.listings`
- `footer.phones`
- `footer.stores`
- `footer.services`
- `footer.technicians`
- `footer.compare`
- `footer.information`
- `footer.about`
- `footer.faq`
- `footer.contact`
- `footer.advertise`

### RTL Support
- Direction changes based on language
- Component layouts adapt with `isRTL` flag
- Flex direction reversal for Arabic
- Text alignment adjustments

---

## Special Features

### 1. **Lazy Loading**
All pages are lazy-loaded using React.lazy() for better performance:
```typescript
const HomePage = lazy(() => import("@/pages/HomePage"));
```

### 2. **Code Splitting**
Vite configuration includes manual chunk splitting:
- vendor (React, React Router)
- supabase (Supabase client)
- radix (Radix UI components)
- forms (Form libraries)
- i18n (Internationalization)

### 3. **Suspense Fallback**
Global loading spinner during route transitions

### 4. **Error Handling**
- Global error boundary
- Page-level error boundaries
- Network status monitoring
- Environment validation

### 5. **Analytics**
Custom hook `usePageTracking()` for page view tracking

### 6. **Caching**
- API response caching (SimpleCache)
- Categories cache (10 min TTL)
- Cities cache (10 min TTL)
- Homepage cache (3 min TTL)

### 7. **Accessibility**
- Proper ARIA labels
- Semantic HTML
- Keyboard navigation support
- Screen reader compatibility

---

## Search and Filter Components

### SearchBar
Main search component with keyword input

### CitySelector
Dropdown for city selection

### FiltersPanel
Advanced filtering with:
- Price range
- Condition (new, used, refurbished)
- Brand selection
- Category filtering
- Location filtering

### AdvancedSearch
Comprehensive search with multiple criteria

---

## Environment Configuration

From `config/env.ts`:
- Environment validation
- Required env variables check
- `isEnvValid()` function

### Feature Flags
From `config/features.ts`:
- Feature toggle configuration

---

## Summary

This Mobile Morocco frontend application is a comprehensive marketplace platform built with modern React patterns:

- **54 pages** organized by feature and role
- **145+ components** with clear separation of concerns
- **Bilingual support** (Arabic/French) with RTL
- **Role-based access control** (4 user roles)
- **Well-structured routing** with protection layers
- **Performance optimized** with lazy loading and caching
- **Type-safe** with TypeScript throughout
- **Accessible** with proper semantic HTML and ARIA
- **Scalable** with clear folder conventions and patterns

The navigation provides easy access to multiple product categories (phones, computers, parts, equipment) and services (repair shops, technicians), with city-based filtering and product comparison features.
