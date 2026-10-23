# Mobile Morocco - Architecture Summary

## Project Overview
Mobile Morocco is a marketplace platform for buying/selling mobile phones, computers, parts, and repair services in Morocco. Built with modern web technologies focusing on performance, multilingual support (Arabic/French), and mobile-first design.

## Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 6
- **Routing**: React Router v6 (SPA architecture)
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Context API (no Redux/Zustand)
- **Internationalization**: i18next (Arabic/French)
- **Testing**: Playwright for E2E tests

### Backend
- **Database**: Supabase (PostgreSQL with RLS)
- **Auth**: Supabase Auth (email/password, OAuth ready)
- **Storage**: Supabase Storage (images)
- **API Server**: FastAPI (Python) - supplementary for RAG/document processing
- **Deployment**: Vercel (primary), supports Apache/Nginx

## Architecture Patterns

### Data Flow
```
User Action → Component → Context/Hook → Service Layer (lib/supabase/*) → Supabase Client → Database
                                                                           ↓
                                                                      Cache Layer (3 min TTL)
```

### State Management (5 Context Providers)
1. **AuthContext** - User authentication, session management
2. **ComparisonContext** - Product comparison (max 3 items, localStorage)
3. **FavoritesContext** - User favorites (localStorage)
4. **LanguageContext** - i18n language selection
5. **LocationContext** - City/neighborhood selection

### Caching Strategy
- **Cache Layer**: SimpleCache class with TTL expiration
- **Default TTL**: 3 minutes for listings, categories, cities
- **Cache Keys**: `LISTINGS`, `CATEGORIES`, `CITIES`, etc.
- **Invalidation**: Manual on mutations (create/update/delete)

## Directory Structure

```
/src
├── components/           # UI components
│   ├── pages/           # Page components (14 pages)
│   ├── dashboards/      # Role-specific dashboards (5 dashboards)
│   ├── admin/           # Admin-specific components
│   ├── auth/            # Authentication components
│   ├── ui/              # Base UI components (shadcn/ui)
│   └── [feature].tsx    # Feature components
├── contexts/            # React Context providers (5 contexts)
├── lib/                 # Core utilities
│   ├── supabase/        # Supabase service layer (13 modules)
│   ├── cache.ts         # Caching implementation
│   ├── logger.ts        # Structured logging
│   └── utils.ts         # Helper functions
├── services/            # Business logic (10 services)
├── hooks/               # Custom React hooks
├── types/               # TypeScript definitions
│   ├── database.ts      # App-level types
│   └── supabase.ts      # Generated from Supabase
├── config/              # Environment & feature flags
├── data/                # Mock data for development
└── locales/             # i18n translations (ar, fr)

/supabase
├── migrations/          # Database migrations (39 files)
└── [config files]

/backend
├── app.py              # FastAPI entry point
├── routes/             # API endpoints
├── models/             # SQLAlchemy models
└── rag/                # RAG/document processing
```

## Routing Structure

### Public Routes
- `/` - HomePage (product listings)
- `/category/:slug` - Category browsing (phones, computers, parts)
- `/listing/:id` - Product details
- `/search` - Search results
- `/stores` - Stores directory
- `/repair/phones`, `/repair/computers` - Repair services
- `/vendor/:id` - Vendor profile
- `/compare` - Product comparison
- `/sitemap` - Site map

### Auth Routes
- `/login` - Login page
- `/register` - Registration
- `/forgot-password` - Password reset

### Protected Routes (Authenticated Users)
- `/profile` - User profile & settings
- `/dashboard` - Role-based dashboard (Vendor/Customer/Technician/Advertiser)

### Admin Routes (Admin Role Only)
- `/admin` - Admin dashboard (stats, ads, neighborhoods, influencers, subscriptions)

## Database Schema (Supabase)

### Core Tables
- **profiles** - User profiles (extends auth.users)
- **listings** - Product listings (multilingual: title_fr/ar, description_fr/ar)
- **listing_images** - Product images
- **categories** - Hierarchical categories
- **cities** - Moroccan cities (multilingual)
- **neighborhoods** - City subdivisions (verified/pending)

### E-Commerce Tables
- **stores** - Seller stores
- **store_images** - Store media
- **items** - Store inventory (phones, parts, equipment)
- **item_images** - Item media
- **repair_shops** - Service providers
- **shop_images** - Repair shop media
- **repair_services** - Services catalog
- **reviews**, **store_reviews** - Rating system

### Advertising System
- **ad_campaigns** - Advertisement campaigns
- **ad_bookings** - Ad placement bookings
- **ad_events** - Ad analytics (impressions, clicks)
- **adsense_units** - AdSense integration

### Supporting Tables
- **favorites** - User favorites
- **messages** - User messaging
- **notifications** - In-app notifications
- **otp_requests** - Phone verification
- **influencers** - Influencer tracking
- **subscriptions** - Subscription management

## Security (RLS Policies)

### Row Level Security
All tables have RLS enabled with policies:
- **Public read**: listings, stores, repair_shops, categories, cities
- **User-owned write**: Users can create/update/delete their own data
- **Admin-only**: Neighborhood approval, ad management

### Authentication
- **Token refresh**: Automatic refresh < 5 min to expiry
- **Session management**: Persistent session in localStorage
- **Role-based access**: admin, user, seller, technician, advertiser

## Performance Optimizations

### Indexes (20260207000001_add_performance_indexes.sql)
- **Listings**: user_id, category_id, city_id, neighborhood_id, status, slug, created_at
- **Composite**: (is_featured, status, created_at) for homepage queries
- **Repair shops**: city_id, status
- **Items**: store_id, item_type, status
- **Images**: Foreign key indexes for joins

### Caching
- Homepage queries cached (3 min TTL)
- Category/city data cached
- Manual cache invalidation on mutations

### Code Splitting
- Dynamic imports for large components
- Lazy loading with Suspense

## Multilingual Support (i18n)

### Supported Languages
- **Arabic** (ar) - RTL support
- **French** (fr) - LTR support

### Implementation
- Database columns: `name_fr`, `name_ar`, `title_fr`, `title_ar`
- UI translations: `/src/locales/`
- LanguageContext for runtime switching

## Key Features

1. **Product Marketplace**
   - Browse phones, computers, parts, equipment
   - Advanced search & filters
   - Product comparison (up to 3 items)
   - Featured listings

2. **Repair Services**
   - Find repair shops by city
   - Service catalog
   - Booking system (calendar-based)

3. **Store Management**
   - Vendor dashboards
   - Inventory management
   - Sales analytics

4. **Advertising Platform**
   - Ad campaign management
   - Placement booking (page + slot)
   - Analytics (impressions, clicks)

5. **Admin Tools**
   - Real-time stats
   - Neighborhood moderation
   - Influencer tracking
   - Subscription management

## Deployment

### Environment Variables
Required (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
Optional (VITE_APP_ENV, VITE_SITE_URL, VITE_ADMIN_ADS_EMAIL, VITE_RESEND_API_KEY)

### Deployment Targets
- **Vercel** (primary) - Auto env var detection
- **Apache/Hostinger** - Uses public/.htaccess for SPA routing
- **Netlify** - Uses vercel.json/_redirects

### Build Process
```bash
npm run typecheck  # TypeScript check
npm run build      # tsc + vite build
npm run test:e2e   # Playwright tests
npm run deploy:check  # All checks
```

## Known Issues & Fixes

### Fixed
✅ ESLint v9 migration completed
✅ Removed incorrect authoritative_schema.sql
✅ Added performance indexes
✅ Removed deprecated services (productService, storeService, technicianService)

### In Progress
⚠️ Duplicate profile handling (detection exists, cleanup needed)
⚠️ 39 migration files (consolidation recommended)

## Future Improvements

1. **Performance**
   - Enable pg_trgm for full-text search
   - Add Redis cache layer
   - Implement CDN for images

2. **Features**
   - OAuth providers (Google, Facebook)
   - Real-time messaging (Supabase Realtime)
   - Mobile app (React Native)

3. **Code Quality**
   - Add unit tests (Jest/Vitest)
   - Storybook for component documentation
   - API documentation (Swagger)

## Contact & Support

For technical questions, refer to:
- `/docs` directory for detailed guides
- `README.md` for setup instructions
- `SECURITY.md` for security policies
