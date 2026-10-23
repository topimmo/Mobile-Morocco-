-- =====================================================
-- Mobile Morocco - Performance Indexes
-- =====================================================
-- Add missing indexes for high-traffic queries
-- Based on app usage patterns in lib/supabase/*.ts
-- =====================================================

-- Listings table indexes (most queried table)
CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category_id ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_city_id ON listings(city_id);
CREATE INDEX IF NOT EXISTS idx_listings_neighborhood_id ON listings(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_created_at_desc ON listings(created_at DESC);

-- Composite index for common filtered queries (status + featured + sorted by date)
CREATE INDEX IF NOT EXISTS idx_listings_featured_status_created ON listings(is_featured, status, created_at DESC) 
  WHERE is_featured = true AND status = 'approved';

-- Composite index for category browsing
CREATE INDEX IF NOT EXISTS idx_listings_category_status_created ON listings(category_id, status, created_at DESC)
  WHERE status = 'approved';

-- Repair shops indexes
CREATE INDEX IF NOT EXISTS idx_repair_shops_city_id ON repair_shops(city_id);
CREATE INDEX IF NOT EXISTS idx_repair_shops_status ON repair_shops(status);
CREATE INDEX IF NOT EXISTS idx_repair_shops_status_city ON repair_shops(status, city_id)
  WHERE status = 'approved';

-- Stores indexes
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_city_id ON stores(city_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);

-- Items indexes (store inventory)
CREATE INDEX IF NOT EXISTS idx_items_store_id ON items(store_id);
CREATE INDEX IF NOT EXISTS idx_items_item_type ON items(item_type);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_store_type_status ON items(store_id, item_type, status);

-- Ad campaigns indexes
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_advertiser_id ON ad_campaigns(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_active_dates ON ad_campaigns(is_active, end_date)
  WHERE is_active = true;

-- Categories indexes (for hierarchical queries)
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active) WHERE is_active = true;

-- Neighborhoods indexes
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_id ON neighborhoods(city_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_is_verified ON neighborhoods(is_verified) WHERE is_verified = true;

-- Profiles indexes (for user lookups)
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_city_id ON profiles(city_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_active ON profiles(is_active) WHERE is_active = true;

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at_desc ON reviews(created_at DESC);

-- Image tables indexes (for joins)
CREATE INDEX IF NOT EXISTS idx_listing_images_listing_id ON listing_images(listing_id);
CREATE INDEX IF NOT EXISTS idx_shop_images_shop_id ON shop_images(shop_id);
CREATE INDEX IF NOT EXISTS idx_store_images_store_id ON store_images(store_id);
CREATE INDEX IF NOT EXISTS idx_item_images_item_id ON item_images(item_id);

-- Full-text search indexes (if using pg_trgm extension)
-- Uncomment if pg_trgm extension is enabled
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX IF NOT EXISTS idx_listings_title_trgm ON listings USING gin (title_fr gin_trgm_ops, title_ar gin_trgm_ops);
-- CREATE INDEX IF NOT EXISTS idx_listings_description_trgm ON listings USING gin (description_fr gin_trgm_ops);
