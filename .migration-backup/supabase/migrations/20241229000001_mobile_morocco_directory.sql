-- Mobile Morocco Directory Platform Database Schema
-- This is a DIRECTORY + ADVERTISING platform only
-- NO marketplace, NO payments, NO orders

-- Drop existing tables for clean migration
DROP TABLE IF EXISTS ad_events CASCADE;
DROP TABLE IF EXISTS ad_bookings CASCADE;
DROP TABLE IF EXISTS ad_campaigns CASCADE;
DROP TABLE IF EXISTS adsense_units CASCADE;
DROP TABLE IF EXISTS banner_slots CASCADE;
DROP TABLE IF EXISTS otp_requests CASCADE;
DROP TABLE IF EXISTS listing_images CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS shop_images CASCADE;
DROP TABLE IF EXISTS repair_shops CASCADE;
DROP TABLE IF EXISTS neighborhoods CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Cities Table (Morocco only)
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  region_fr TEXT,
  region_ar TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Neighborhoods Table
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city_id, slug)
);

-- Categories Table (Phones, Accessories, Spare Parts)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (Users: admin, advertiser only - no client accounts)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'advertiser' CHECK (role IN ('admin', 'advertiser')),
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings Table (Ads for phones, accessories, spare parts)
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title_fr TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  slug TEXT NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  price DECIMAL(12,2),
  currency TEXT DEFAULT 'MAD',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
  condition TEXT CHECK (condition IN ('new', 'used', 'refurbished')),
  brand TEXT,
  model TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp TEXT,
  phone TEXT,
  whatsapp_clicks INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing Images Table
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text_fr TEXT,
  alt_text_ar TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repair Shops Table (Directory only, no job requests)
CREATE TABLE IF NOT EXISTS repair_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT NOT NULL,
  description_fr TEXT,
  description_ar TEXT,
  address_fr TEXT,
  address_ar TEXT,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  phone TEXT,
  whatsapp TEXT,
  specialties TEXT[] DEFAULT '{}',
  working_hours JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp_clicks INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shop Images Table
CREATE TABLE IF NOT EXISTS shop_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID NOT NULL REFERENCES repair_shops(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text_fr TEXT,
  alt_text_ar TEXT,
  is_cover BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- OTP Requests Table (for WhatsApp OTP authentication)
CREATE TABLE IF NOT EXISTS otp_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Banner Slots Configuration
CREATE TABLE IF NOT EXISTS banner_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL CHECK (page IN ('home', 'categories', 'category', 'city', 'listings', 'listing_details', 'repair_shops', 'repair_shop_details')),
  slot TEXT NOT NULL CHECK (slot IN ('top', 'bottom')),
  desktop_sizes TEXT[] NOT NULL,
  mobile_sizes TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, slot)
);

-- Ad Campaigns Table (Banner Advertisements)
CREATE TABLE IF NOT EXISTS ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_url TEXT NOT NULL,
  banner_desktop_url TEXT,
  banner_mobile_url TEXT,
  slot TEXT NOT NULL CHECK (slot IN ('top', 'bottom')),
  duration_days INTEGER NOT NULL CHECK (duration_days IN (7, 15, 30)),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paused', 'completed')),
  total_impressions INTEGER DEFAULT 0,
  total_clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Bookings Table (Which pages a campaign appears on)
CREATE TABLE IF NOT EXISTS ad_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  page TEXT NOT NULL CHECK (page IN ('home', 'categories', 'category', 'city', 'listings', 'listing_details', 'repair_shops', 'repair_shop_details')),
  slot TEXT NOT NULL CHECK (slot IN ('top', 'bottom')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Events Table (impressions & clicks tracking)
CREATE TABLE IF NOT EXISTS ad_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES ad_bookings(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('impression', 'click')),
  page TEXT NOT NULL,
  slot TEXT NOT NULL,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AdSense Units Table (fallback when no paid banner)
CREATE TABLE IF NOT EXISTS adsense_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL CHECK (page IN ('home', 'categories', 'category', 'city', 'listings', 'listing_details', 'repair_shops', 'repair_shop_details')),
  slot TEXT NOT NULL CHECK (slot IN ('top', 'bottom')),
  client_id TEXT NOT NULL,
  unit_id TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, slot)
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city_id);
CREATE INDEX IF NOT EXISTS idx_listings_price ON listings(price);
CREATE INDEX IF NOT EXISTS idx_listings_created ON listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listings_user ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON listings(is_featured) WHERE is_featured = true;

CREATE INDEX IF NOT EXISTS idx_repair_shops_status ON repair_shops(status);
CREATE INDEX IF NOT EXISTS idx_repair_shops_city ON repair_shops(city_id);
CREATE INDEX IF NOT EXISTS idx_repair_shops_user ON repair_shops(user_id);
CREATE INDEX IF NOT EXISTS idx_repair_shops_slug ON repair_shops(slug);

CREATE INDEX IF NOT EXISTS idx_neighborhoods_city ON neighborhoods(city_id);

CREATE INDEX IF NOT EXISTS idx_ad_campaigns_advertiser ON ad_campaigns(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_dates ON ad_campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_ad_bookings_campaign ON ad_bookings(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_page_slot ON ad_bookings(page, slot);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_dates ON ad_bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_status ON ad_bookings(status);

CREATE INDEX IF NOT EXISTS idx_ad_events_campaign ON ad_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_events_created ON ad_events(created_at);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_requests(phone);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_requests(expires_at);

-- Insert Moroccan cities
INSERT INTO cities (name_fr, name_ar, slug, region_fr, region_ar, sort_order) VALUES
  ('Casablanca', 'الدار البيضاء', 'casablanca', 'Casablanca-Settat', 'الدار البيضاء-سطات', 1),
  ('Rabat', 'الرباط', 'rabat', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 2),
  ('Marrakech', 'مراكش', 'marrakech', 'Marrakech-Safi', 'مراكش-آسفي', 3),
  ('Fès', 'فاس', 'fes', 'Fès-Meknès', 'فاس-مكناس', 4),
  ('Tanger', 'طنجة', 'tanger', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 5),
  ('Agadir', 'أكادير', 'agadir', 'Souss-Massa', 'سوس-ماسة', 6),
  ('Meknès', 'مكناس', 'meknes', 'Fès-Meknès', 'فاس-مكناس', 7),
  ('Oujda', 'وجدة', 'oujda', 'Oriental', 'الشرق', 8),
  ('Kénitra', 'القنيطرة', 'kenitra', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 9),
  ('Tétouan', 'تطوان', 'tetouan', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 10),
  ('Salé', 'سلا', 'sale', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 11),
  ('Nador', 'الناظور', 'nador', 'Oriental', 'الشرق', 12),
  ('El Jadida', 'الجديدة', 'el-jadida', 'Casablanca-Settat', 'الدار البيضاء-سطات', 13),
  ('Béni Mellal', 'بني ملال', 'beni-mellal', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 14),
  ('Safi', 'آسفي', 'safi', 'Marrakech-Safi', 'مراكش-آسفي', 15),
  ('Mohammedia', 'المحمدية', 'mohammedia', 'Casablanca-Settat', 'الدار البيضاء-سطات', 16),
  ('Khouribga', 'خريبكة', 'khouribga', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 17),
  ('Settat', 'سطات', 'settat', 'Casablanca-Settat', 'الدار البيضاء-سطات', 18),
  ('Laâyoune', 'العيون', 'laayoune', 'Laâyoune-Sakia El Hamra', 'العيون-الساقية الحمراء', 19),
  ('Taza', 'تازة', 'taza', 'Fès-Meknès', 'فاس-مكناس', 20)
ON CONFLICT (slug) DO NOTHING;

-- Insert categories
INSERT INTO categories (name_fr, name_ar, slug, icon, sort_order) VALUES
  ('Téléphones', 'الهواتف', 'telephones', 'smartphone', 1),
  ('Accessoires', 'الإكسسوارات', 'accessoires', 'headphones', 2),
  ('Pièces détachées', 'قطع الغيار', 'pieces-detachees', 'settings', 3),
  ('Équipement de réparation', 'معدات الإصلاح', 'equipement-reparation', 'wrench', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert banner slot configurations
INSERT INTO banner_slots (page, slot, desktop_sizes, mobile_sizes) VALUES
  ('home', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100']),
  ('home', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250']),
  ('categories', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100']),
  ('categories', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250']),
  ('category', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100']),
  ('category', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250']),
  ('city', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100']),
  ('city', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250']),
  ('listings', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100']),
  ('listings', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250']),
  ('listing_details', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100']),
  ('listing_details', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250']),
  ('repair_shops', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100']),
  ('repair_shops', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250']),
  ('repair_shop_details', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100']),
  ('repair_shop_details', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'])
ON CONFLICT (page, slot) DO NOTHING;

-- Trigger for profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'advertiser')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to generate slug
CREATE OR REPLACE FUNCTION generate_slug(title TEXT, table_name TEXT)
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
    IF table_name = 'listings' THEN
      EXIT WHEN NOT EXISTS (SELECT 1 FROM listings WHERE slug = new_slug);
    ELSIF table_name = 'repair_shops' THEN
      EXIT WHEN NOT EXISTS (SELECT 1 FROM repair_shops WHERE slug = new_slug);
    END IF;
    
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate listing slug
CREATE OR REPLACE FUNCTION set_listing_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title_ar, 'listings');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS listing_slug_trigger ON listings;
CREATE TRIGGER listing_slug_trigger
  BEFORE INSERT OR UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION set_listing_slug();

-- Trigger to auto-generate repair shop slug
CREATE OR REPLACE FUNCTION set_shop_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name_ar, 'repair_shops');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shop_slug_trigger ON repair_shops;
CREATE TRIGGER shop_slug_trigger
  BEFORE INSERT OR UPDATE ON repair_shops
  FOR EACH ROW EXECUTE FUNCTION set_shop_slug();

-- Function to check ad booking availability (prevent double booking)
CREATE OR REPLACE FUNCTION check_booking_availability(
  p_page TEXT,
  p_slot TEXT,
  p_start_date DATE,
  p_end_date DATE,
  p_exclude_campaign_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM ad_bookings b
    JOIN ad_campaigns c ON b.campaign_id = c.id
    WHERE b.page = p_page
      AND b.slot = p_slot
      AND b.status = 'confirmed'
      AND (p_exclude_campaign_id IS NULL OR c.id != p_exclude_campaign_id)
      AND (
        (p_start_date BETWEEN b.start_date AND b.end_date)
        OR (p_end_date BETWEEN b.start_date AND b.end_date)
        OR (b.start_date BETWEEN p_start_date AND p_end_date)
      )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get booking calendar for a page/slot
CREATE OR REPLACE FUNCTION get_booking_calendar(
  p_page TEXT,
  p_slot TEXT,
  p_from_date DATE DEFAULT CURRENT_DATE,
  p_to_date DATE DEFAULT CURRENT_DATE + INTERVAL '90 days'
)
RETURNS TABLE(
  booking_date DATE,
  is_booked BOOLEAN,
  campaign_id UUID
) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(p_from_date, p_to_date, '1 day'::interval)::DATE AS booking_date
  )
  SELECT 
    ds.booking_date,
    COALESCE(b.id IS NOT NULL, false) AS is_booked,
    b.campaign_id
  FROM date_series ds
  LEFT JOIN ad_bookings b ON 
    b.page = p_page 
    AND b.slot = p_slot 
    AND b.status = 'confirmed'
    AND ds.booking_date BETWEEN b.start_date AND b.end_date
  ORDER BY ds.booking_date;
END;
$$ LANGUAGE plpgsql;
