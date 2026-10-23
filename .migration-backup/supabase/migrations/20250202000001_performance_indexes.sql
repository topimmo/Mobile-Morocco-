-- Performance Indexes Migration for Phase 5
-- Ensures all frequently queried columns have proper indexes

-- ============ LISTINGS TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city_id);
CREATE INDEX IF NOT EXISTS idx_listings_condition ON listings(condition);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_is_featured ON listings(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_listings_status_created ON listings(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);

-- ============ ITEMS TABLE INDEXES (if not already created) ============
CREATE INDEX IF NOT EXISTS idx_items_price ON items(price);
CREATE INDEX IF NOT EXISTS idx_items_brand ON items(brand);
CREATE INDEX IF NOT EXISTS idx_items_type_status ON items(item_type, status);
CREATE INDEX IF NOT EXISTS idx_items_city_type ON items(city_id, item_type);
CREATE INDEX IF NOT EXISTS idx_items_status_type_created ON items(status, item_type, created_at DESC);

-- ============ STORES TABLE INDEXES (if not already created) ============
CREATE INDEX IF NOT EXISTS idx_stores_created_at ON stores(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stores_status_type ON stores(status, store_type);

-- ============ REPAIR SERVICES INDEXES ============
CREATE INDEX IF NOT EXISTS idx_repair_services_slug ON repair_services(slug);
CREATE INDEX IF NOT EXISTS idx_repair_services_created_at ON repair_services(created_at DESC);

-- ============ REPAIR SHOPS TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_repair_shops_status ON repair_shops(status);
CREATE INDEX IF NOT EXISTS idx_repair_shops_city ON repair_shops(city_id);
CREATE INDEX IF NOT EXISTS idx_repair_shops_created_at ON repair_shops(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_repair_shops_slug ON repair_shops(slug);

-- ============ CITIES TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);

-- ============ NEIGHBORHOODS TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city ON neighborhoods(city_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_slug ON neighborhoods(slug);

-- ============ CATEGORIES TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_id);

-- ============ ADS TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);
CREATE INDEX IF NOT EXISTS idx_ads_placement ON ads(placement);
CREATE INDEX IF NOT EXISTS idx_ads_dates ON ads(start_date, end_date);

-- ============ PROFILES TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);

-- ============ NOTIFICATIONS TABLE INDEXES ============
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- ============ PARTIAL INDEXES FOR ACTIVE CONTENT ============
-- These are efficient for queries that filter by status='approved'
CREATE INDEX IF NOT EXISTS idx_listings_active ON listings(created_at DESC) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_items_active ON items(created_at DESC) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_stores_active ON stores(created_at DESC) WHERE status = 'approved';
CREATE INDEX IF NOT EXISTS idx_repair_shops_active ON repair_shops(created_at DESC) WHERE status = 'approved';

-- ============ UNIQUE CONSTRAINTS FOR SLUGS ============
-- Ensure slugs are unique (adds index automatically)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'listings_slug_unique'
  ) THEN
    ALTER TABLE listings ADD CONSTRAINT listings_slug_unique UNIQUE (slug);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN NULL;
  WHEN undefined_table THEN NULL;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'repair_shops_slug_unique'
  ) THEN
    ALTER TABLE repair_shops ADD CONSTRAINT repair_shops_slug_unique UNIQUE (slug);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN NULL;
  WHEN undefined_table THEN NULL;
END $$;
