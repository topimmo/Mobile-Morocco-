-- Mobile Morocco Unified Platform Schema
-- This is a DISPLAY + CONNECT platform only
-- NO marketplace, NO payments, NO orders
-- Single account/store profile structure

-- Drop tables that will be recreated (order matters for dependencies)
DROP TABLE IF EXISTS repair_services CASCADE;
DROP TABLE IF EXISTS store_services CASCADE;
DROP TABLE IF EXISTS items CASCADE;
DROP TABLE IF EXISTS item_images CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS store_images CASCADE;

-- Stores Table (One per user - unified profile for all user types)
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  store_type TEXT NOT NULL DEFAULT 'individual' CHECK (store_type IN ('shop', 'individual')),
  address_fr TEXT,
  address_ar TEXT,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
  neighborhood_custom TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  working_hours JSONB DEFAULT '{}',
  working_days TEXT[] DEFAULT '{}',
  emergency_service BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp_clicks INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  rating_avg DECIMAL(2,1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Store Images Table
CREATE TABLE IF NOT EXISTS store_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text_fr TEXT,
  alt_text_ar TEXT,
  is_cover BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Items Table (Phones, Spare Parts, Equipment - unified)
CREATE TABLE IF NOT EXISTS items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('phone', 'spare_part', 'equipment')),
  condition TEXT NOT NULL CHECK (condition IN ('new', 'used')),
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  slug TEXT NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  price DECIMAL(12,2),
  price_text TEXT,
  currency TEXT DEFAULT 'MAD',
  brand TEXT,
  model TEXT,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
  neighborhood_custom TEXT,
  phone TEXT,
  whatsapp TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp_clicks INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Item Images Table
CREATE TABLE IF NOT EXISTS item_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text_fr TEXT,
  alt_text_ar TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repair Services Table (Optional activity for stores)
CREATE TABLE IF NOT EXISTS repair_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  service_name_fr TEXT NOT NULL,
  service_name_ar TEXT NOT NULL,
  slug TEXT NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  device_types TEXT[] DEFAULT '{}',
  price DECIMAL(12,2),
  price_on_request BOOLEAN DEFAULT false,
  estimated_duration TEXT,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
  neighborhood_custom TEXT,
  phone TEXT,
  whatsapp TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp_clicks INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Store Reviews Table
CREATE TABLE IF NOT EXISTS store_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_phone TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update profiles table to support unified role
ALTER TABLE profiles 
  ADD COLUMN IF NOT EXISTS store_id UUID REFERENCES stores(id) ON DELETE SET NULL,
  DROP CONSTRAINT IF EXISTS profiles_role_check,
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'advertiser', 'user'));

-- Set default role to 'user' for regular accounts
ALTER TABLE profiles ALTER COLUMN role SET DEFAULT 'user';

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_stores_user ON stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_type ON stores(store_type);
CREATE INDEX IF NOT EXISTS idx_stores_city ON stores(city_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);

CREATE INDEX IF NOT EXISTS idx_items_store ON items(store_id);
CREATE INDEX IF NOT EXISTS idx_items_type ON items(item_type);
CREATE INDEX IF NOT EXISTS idx_items_condition ON items(condition);
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);
CREATE INDEX IF NOT EXISTS idx_items_city ON items(city_id);
CREATE INDEX IF NOT EXISTS idx_items_slug ON items(slug);
CREATE INDEX IF NOT EXISTS idx_items_type_condition ON items(item_type, condition);
CREATE INDEX IF NOT EXISTS idx_items_created ON items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_repair_services_store ON repair_services(store_id);
CREATE INDEX IF NOT EXISTS idx_repair_services_status ON repair_services(status);
CREATE INDEX IF NOT EXISTS idx_repair_services_city ON repair_services(city_id);

CREATE INDEX IF NOT EXISTS idx_store_reviews_store ON store_reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_store_reviews_status ON store_reviews(status);

-- Function to generate store slug
CREATE OR REPLACE FUNCTION generate_store_slug(name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9\u0600-\u06FF]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  new_slug := base_slug;
  
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM stores WHERE slug = new_slug);
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to generate item slug
CREATE OR REPLACE FUNCTION generate_item_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9\u0600-\u06FF]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  new_slug := base_slug;
  
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM items WHERE slug = new_slug);
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Function to generate service slug
CREATE OR REPLACE FUNCTION generate_service_slug(name TEXT)
RETURNS TEXT AS $$
DECLARE
  base_slug TEXT;
  new_slug TEXT;
  counter INTEGER := 0;
BEGIN
  base_slug := LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9\u0600-\u06FF]+', '-', 'g'));
  base_slug := TRIM(BOTH '-' FROM base_slug);
  new_slug := base_slug;
  
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM repair_services WHERE slug = new_slug);
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate store slug
CREATE OR REPLACE FUNCTION set_store_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_store_slug(COALESCE(NEW.name_ar, NEW.name_fr));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS store_slug_trigger ON stores;
CREATE TRIGGER store_slug_trigger
  BEFORE INSERT OR UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION set_store_slug();

-- Trigger to auto-generate item slug
CREATE OR REPLACE FUNCTION set_item_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_item_slug(COALESCE(NEW.title_ar, NEW.title_fr));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS item_slug_trigger ON items;
CREATE TRIGGER item_slug_trigger
  BEFORE INSERT OR UPDATE ON items
  FOR EACH ROW EXECUTE FUNCTION set_item_slug();

-- Trigger to auto-generate service slug
CREATE OR REPLACE FUNCTION set_service_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_service_slug(COALESCE(NEW.service_name_ar, NEW.service_name_fr));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS service_slug_trigger ON repair_services;
CREATE TRIGGER service_slug_trigger
  BEFORE INSERT OR UPDATE ON repair_services
  FOR EACH ROW EXECUTE FUNCTION set_service_slug();

-- Function to update store rating
CREATE OR REPLACE FUNCTION update_store_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stores 
  SET 
    rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM store_reviews WHERE store_id = NEW.store_id AND status = 'approved'),
    rating_count = (SELECT COUNT(*) FROM store_reviews WHERE store_id = NEW.store_id AND status = 'approved')
  WHERE id = NEW.store_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_rating_trigger ON store_reviews;
CREATE TRIGGER update_rating_trigger
  AFTER INSERT OR UPDATE ON store_reviews
  FOR EACH ROW EXECUTE FUNCTION update_store_rating();

-- Update handle_new_user function to use new role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update ad_campaigns status options to include draft and submitted
ALTER TABLE ad_campaigns 
  DROP CONSTRAINT IF EXISTS ad_campaigns_status_check,
  ADD CONSTRAINT ad_campaigns_status_check 
  CHECK (status IN ('draft', 'submitted', 'pending_review', 'approved', 'active', 'expired', 'rejected', 'paused', 'completed'));

-- Add payment proof to ad_campaigns
ALTER TABLE ad_campaigns
  ADD COLUMN IF NOT EXISTS payment_proof_url TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'uploaded', 'verified', 'rejected'));

-- Update banner_slots check constraint to allow new pages
ALTER TABLE banner_slots DROP CONSTRAINT IF EXISTS banner_slots_page_check;
ALTER TABLE banner_slots ADD CONSTRAINT banner_slots_page_check 
  CHECK (page IN ('home', 'categories', 'category', 'city', 'listings', 'listing_details', 
                  'repair_shops', 'repair_shop_details', 'services', 'stores', 'store_details',
                  'phones', 'spare_parts', 'equipment', 'advertise', 'item_details'));

-- Update ad_bookings check constraint similarly
ALTER TABLE ad_bookings DROP CONSTRAINT IF EXISTS ad_bookings_page_check;
ALTER TABLE ad_bookings ADD CONSTRAINT ad_bookings_page_check 
  CHECK (page IN ('home', 'categories', 'category', 'city', 'listings', 'listing_details', 
                  'repair_shops', 'repair_shop_details', 'services', 'stores', 'store_details',
                  'phones', 'spare_parts', 'equipment', 'advertise', 'item_details'));

-- Insert sample banner placements info
INSERT INTO banner_slots (page, slot, desktop_sizes, mobile_sizes, is_active) VALUES
  ('services', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('services', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('stores', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('stores', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('store_details', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('store_details', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('phones', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('phones', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('spare_parts', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('spare_parts', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('equipment', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('equipment', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('advertise', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('advertise', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('item_details', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('item_details', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true)
ON CONFLICT (page, slot) DO NOTHING;
