-- Mobile Morocco Complete Database Schema
-- Drop existing tables if needed for clean migration
DROP TABLE IF EXISTS ad_events CASCADE;
DROP TABLE IF EXISTS ad_bookings CASCADE;
DROP TABLE IF EXISTS ad_campaigns CASCADE;
DROP TABLE IF EXISTS adsense_units CASCADE;
DROP TABLE IF EXISTS otp_requests CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS listing_images CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS shop_images CASCADE;
DROP TABLE IF EXISTS repair_shops CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Cities Table
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  region TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories Table
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

-- Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'seller_store', 'repair_shop', 'advertiser', 'user')),
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings Table (Product Ads)
CREATE TABLE IF NOT EXISTS listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'MAD',
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  condition TEXT CHECK (condition IN ('new', 'used', 'refurbished')),
  brand TEXT,
  model TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'hidden')),
  whatsapp TEXT,
  phone TEXT,
  email TEXT,
  whatsapp_clicks INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  email_clicks INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listing Images Table
CREATE TABLE IF NOT EXISTS listing_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Repair Shops Table
CREATE TABLE IF NOT EXISTS repair_shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  address TEXT,
  city_id UUID REFERENCES cities(id) ON DELETE SET NULL,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  website TEXT,
  specialties TEXT[] DEFAULT '{}',
  working_hours JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp_clicks INTEGER DEFAULT 0,
  phone_clicks INTEGER DEFAULT 0,
  email_clicks INTEGER DEFAULT 0,
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
  alt_text TEXT,
  is_cover BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('listing', 'repair_shop')),
  target_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id)
);

-- OTP Requests Table (for WhatsApp OTP)
CREATE TABLE IF NOT EXISTS otp_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified BOOLEAN DEFAULT false,
  attempts INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ad Campaigns Table
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

-- Ad Bookings Table
CREATE TABLE IF NOT EXISTS ad_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES ad_campaigns(id) ON DELETE CASCADE,
  page TEXT NOT NULL CHECK (page IN ('home', 'categories', 'listings', 'listing_details', 'repair_shops', 'repair_shop_details')),
  slot TEXT NOT NULL CHECK (slot IN ('top', 'bottom')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_booking_per_slot UNIQUE (page, slot, start_date, end_date)
);

-- Ad Events Table (impressions & clicks)
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

-- AdSense Units Table
CREATE TABLE IF NOT EXISTS adsense_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL CHECK (page IN ('home', 'categories', 'listings', 'listing_details', 'repair_shops', 'repair_shop_details')),
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

CREATE INDEX IF NOT EXISTS idx_repair_shops_status ON repair_shops(status);
CREATE INDEX IF NOT EXISTS idx_repair_shops_city ON repair_shops(city_id);
CREATE INDEX IF NOT EXISTS idx_repair_shops_user ON repair_shops(user_id);
CREATE INDEX IF NOT EXISTS idx_repair_shops_slug ON repair_shops(slug);

CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_ad_campaigns_advertiser ON ad_campaigns(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_dates ON ad_campaigns(start_date, end_date);

CREATE INDEX IF NOT EXISTS idx_ad_bookings_campaign ON ad_bookings(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_page_slot ON ad_bookings(page, slot);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_dates ON ad_bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_status ON ad_bookings(status);

CREATE INDEX IF NOT EXISTS idx_ad_events_campaign ON ad_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_events_booking ON ad_events(booking_id);
CREATE INDEX IF NOT EXISTS idx_ad_events_created ON ad_events(created_at);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_city ON profiles(city_id);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_requests(phone);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_requests(expires_at);

-- Insert default cities
INSERT INTO cities (name_fr, name_ar, slug, region) VALUES
  ('Casablanca', 'الدار البيضاء', 'casablanca', 'Casablanca-Settat'),
  ('Rabat', 'الرباط', 'rabat', 'Rabat-Salé-Kénitra'),
  ('Marrakech', 'مراكش', 'marrakech', 'Marrakech-Safi'),
  ('Fès', 'فاس', 'fes', 'Fès-Meknès'),
  ('Tanger', 'طنجة', 'tanger', 'Tanger-Tétouan-Al Hoceïma'),
  ('Agadir', 'أكادير', 'agadir', 'Souss-Massa'),
  ('Meknès', 'مكناس', 'meknes', 'Fès-Meknès'),
  ('Oujda', 'وجدة', 'oujda', 'Oriental'),
  ('Kénitra', 'القنيطرة', 'kenitra', 'Rabat-Salé-Kénitra'),
  ('Tétouan', 'تطوان', 'tetouan', 'Tanger-Tétouan-Al Hoceïma'),
  ('Salé', 'سلا', 'sale', 'Rabat-Salé-Kénitra'),
  ('Nador', 'الناظور', 'nador', 'Oriental'),
  ('Mohammedia', 'المحمدية', 'mohammedia', 'Casablanca-Settat'),
  ('El Jadida', 'الجديدة', 'el-jadida', 'Casablanca-Settat'),
  ('Béni Mellal', 'بني ملال', 'beni-mellal', 'Béni Mellal-Khénifra')
ON CONFLICT (slug) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name_fr, name_ar, slug, icon, sort_order) VALUES
  ('Smartphones', 'الهواتف الذكية', 'smartphones', 'smartphone', 1),
  ('Accessoires', 'الإكسسوارات', 'accessories', 'headphones', 2),
  ('Pièces détachées', 'قطع الغيار', 'spare-parts', 'settings', 3),
  ('Équipement de réparation', 'معدات الإصلاح', 'repair-equipment', 'wrench', 4),
  ('Tablettes', 'الأجهزة اللوحية', 'tablets', 'tablet', 5),
  ('Montres connectées', 'الساعات الذكية', 'smartwatches', 'watch', 6)
ON CONFLICT (slug) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE adsense_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;
CREATE POLICY "Admin can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for Listings
DROP POLICY IF EXISTS "Approved listings are viewable by everyone" ON listings;
CREATE POLICY "Approved listings are viewable by everyone" ON listings
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view own listings" ON listings;
CREATE POLICY "Users can view own listings" ON listings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create listings" ON listings;
CREATE POLICY "Users can create listings" ON listings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own listings" ON listings;
CREATE POLICY "Users can update own listings" ON listings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own listings" ON listings;
CREATE POLICY "Users can delete own listings" ON listings
  FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage all listings" ON listings;
CREATE POLICY "Admin can manage all listings" ON listings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for Listing Images
DROP POLICY IF EXISTS "Listing images viewable with listing" ON listing_images;
CREATE POLICY "Listing images viewable with listing" ON listing_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND status = 'approved')
    OR EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own listing images" ON listing_images;
CREATE POLICY "Users can manage own listing images" ON listing_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND user_id = auth.uid())
  );

-- RLS Policies for Repair Shops
DROP POLICY IF EXISTS "Approved shops are viewable by everyone" ON repair_shops;
CREATE POLICY "Approved shops are viewable by everyone" ON repair_shops
  FOR SELECT USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view own shops" ON repair_shops;
CREATE POLICY "Users can view own shops" ON repair_shops
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own shops" ON repair_shops;
CREATE POLICY "Users can manage own shops" ON repair_shops
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage all shops" ON repair_shops;
CREATE POLICY "Admin can manage all shops" ON repair_shops
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for Shop Images
DROP POLICY IF EXISTS "Shop images viewable with shop" ON shop_images;
CREATE POLICY "Shop images viewable with shop" ON shop_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM repair_shops WHERE id = shop_id AND status = 'approved')
    OR EXISTS (SELECT 1 FROM repair_shops WHERE id = shop_id AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can manage own shop images" ON shop_images;
CREATE POLICY "Users can manage own shop images" ON shop_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM repair_shops WHERE id = shop_id AND user_id = auth.uid())
  );

-- RLS Policies for Reviews
DROP POLICY IF EXISTS "Visible reviews are public" ON reviews;
CREATE POLICY "Visible reviews are public" ON reviews
  FOR SELECT USING (is_visible = true);

DROP POLICY IF EXISTS "Users can create reviews" ON reviews;
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews" ON reviews
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can manage reviews" ON reviews;
CREATE POLICY "Admin can manage reviews" ON reviews
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for Ad Campaigns
DROP POLICY IF EXISTS "Advertisers can view own campaigns" ON ad_campaigns;
CREATE POLICY "Advertisers can view own campaigns" ON ad_campaigns
  FOR SELECT USING (auth.uid() = advertiser_id);

DROP POLICY IF EXISTS "Advertisers can create campaigns" ON ad_campaigns;
CREATE POLICY "Advertisers can create campaigns" ON ad_campaigns
  FOR INSERT WITH CHECK (auth.uid() = advertiser_id);

DROP POLICY IF EXISTS "Advertisers can update own campaigns" ON ad_campaigns;
CREATE POLICY "Advertisers can update own campaigns" ON ad_campaigns
  FOR UPDATE USING (auth.uid() = advertiser_id);

DROP POLICY IF EXISTS "Admin can manage all campaigns" ON ad_campaigns;
CREATE POLICY "Admin can manage all campaigns" ON ad_campaigns
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for Ad Bookings
DROP POLICY IF EXISTS "Advertisers can view own bookings" ON ad_bookings;
CREATE POLICY "Advertisers can view own bookings" ON ad_bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM ad_campaigns WHERE id = campaign_id AND advertiser_id = auth.uid())
  );

DROP POLICY IF EXISTS "Public can check booking availability" ON ad_bookings;
CREATE POLICY "Public can check booking availability" ON ad_bookings
  FOR SELECT USING (status = 'confirmed');

DROP POLICY IF EXISTS "Advertisers can create bookings" ON ad_bookings;
CREATE POLICY "Advertisers can create bookings" ON ad_bookings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM ad_campaigns WHERE id = campaign_id AND advertiser_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin can manage all bookings" ON ad_bookings;
CREATE POLICY "Admin can manage all bookings" ON ad_bookings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for Ad Events
DROP POLICY IF EXISTS "Anyone can create ad events" ON ad_events;
CREATE POLICY "Anyone can create ad events" ON ad_events
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Advertisers can view own events" ON ad_events;
CREATE POLICY "Advertisers can view own events" ON ad_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM ad_campaigns WHERE id = campaign_id AND advertiser_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admin can view all events" ON ad_events;
CREATE POLICY "Admin can view all events" ON ad_events
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for AdSense Units
DROP POLICY IF EXISTS "AdSense units are public" ON adsense_units;
CREATE POLICY "AdSense units are public" ON adsense_units
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Admin can manage adsense units" ON adsense_units;
CREATE POLICY "Admin can manage adsense units" ON adsense_units
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- RLS Policies for Categories and Cities (public read)
DROP POLICY IF EXISTS "Categories are public" ON categories;
CREATE POLICY "Categories are public" ON categories
  FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Cities are public" ON cities;
CREATE POLICY "Cities are public" ON cities
  FOR SELECT USING (is_active = true);

-- Trigger for profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
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
  base_slug := LOWER(REGEXP_REPLACE(title, '[^a-zA-Z0-9]+', '-', 'g'));
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
    NEW.slug := generate_slug(NEW.title, 'listings');
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
    NEW.slug := generate_slug(NEW.name, 'repair_shops');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS shop_slug_trigger ON repair_shops;
CREATE TRIGGER shop_slug_trigger
  BEFORE INSERT OR UPDATE ON repair_shops
  FOR EACH ROW EXECUTE FUNCTION set_shop_slug();

-- Function to check ad booking availability
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
