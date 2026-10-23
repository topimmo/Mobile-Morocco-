-- =====================================================
-- Mobile Morocco - Authoritative Database Schema
-- =====================================================
-- This schema matches the service layer expectations
-- No stubs, no aliases - production ready
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'seller', 'technician', 'advertiser')),
  city TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  region TEXT,
  lat DECIMAL(10,8),
  lng DECIMAL(11,8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PRODUCTS & STORES
-- =====================================================

-- Products (NOT listings - service expects "products")
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'MAD',
  condition TEXT CHECK (condition IN ('new', 'used', 'refurbished')),
  category TEXT,
  subcategory TEXT,
  brand TEXT,
  model TEXT,
  images TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  location TEXT,
  city TEXT,
  is_available BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_seller ON products(seller_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_city ON products(city);
CREATE INDEX idx_products_created_at ON products(created_at DESC);

-- Stores (uses owner_id - as per service)
CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  city TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  social_media JSONB DEFAULT '{}',
  business_hours JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_stores_owner ON stores(owner_id);
CREATE INDEX idx_stores_city ON stores(city);

-- =====================================================
-- USER INTERACTIONS
-- =====================================================

-- Favorites (user_id, product_id - as per service)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_product ON favorites(product_id);

-- Reviews (reviewer_id, subject_type, subject_id - as per service)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject_type TEXT NOT NULL CHECK (subject_type IN ('product', 'technician', 'store')),
  subject_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(reviewer_id, subject_type, subject_id)
);

CREATE INDEX idx_reviews_subject ON reviews(subject_type, subject_id);
CREATE INDEX idx_reviews_reviewer ON reviews(reviewer_id);

-- Messages (sender_id, receiver_id, is_read - as per service)
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_to_type TEXT,
  related_to_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Reports (reporter_id, reported_type, reported_id - as per service)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reported_type TEXT NOT NULL CHECK (reported_type IN ('product', 'user', 'review', 'store')),
  reported_id UUID NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_reported ON reports(reported_type, reported_id);

-- =====================================================
-- TECHNICIAN SERVICES
-- =====================================================

-- Technician Services
CREATE TABLE IF NOT EXISTS technician_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  price_type TEXT DEFAULT 'fixed' CHECK (price_type IN ('fixed', 'hourly', 'quote')),
  estimated_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_technician_services_technician ON technician_services(technician_id);

-- Service Requests
CREATE TABLE IF NOT EXISTS service_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES technician_services(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
  description TEXT,
  device_details JSONB,
  location TEXT,
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  price DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_service_requests_customer ON service_requests(customer_id);
CREATE INDEX idx_service_requests_technician ON service_requests(technician_id);
CREATE INDEX idx_service_requests_status ON service_requests(status);

-- =====================================================
-- JOB LISTINGS
-- =====================================================

-- Job Listings (creator_id - as per service)
CREATE TABLE IF NOT EXISTS job_listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  city TEXT,
  payment_type TEXT DEFAULT 'negotiable' CHECK (payment_type IN ('fixed', 'hourly', 'negotiable')),
  payment_amount DECIMAL(10,2),
  required_skills TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_job_listings_creator ON job_listings(creator_id);
CREATE INDEX idx_job_listings_city ON job_listings(city);
CREATE INDEX idx_job_listings_status ON job_listings(status);

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  technician_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_note TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, technician_id)
);

CREATE INDEX idx_job_applications_job ON job_applications(job_id);
CREATE INDEX idx_job_applications_technician ON job_applications(technician_id);

-- =====================================================
-- ADVERTISEMENTS
-- =====================================================

-- Ads (advertiser_id, image_url, link_url - as per adService)
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advertiser_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  placement TEXT NOT NULL CHECK (placement IN ('header', 'home_middle', 'footer', 'sidebar', 'between_listings')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ads_advertiser ON ads(advertiser_id);
CREATE INDEX idx_ads_placement ON ads(placement);
CREATE INDEX idx_ads_active_dates ON ads(is_active, start_date, end_date);

-- =====================================================
-- SUBSCRIPTIONS
-- =====================================================

-- Subscriptions (user_id, plan_id, plan_type - as per subscriptionService)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  plan_type TEXT CHECK (plan_type IN ('free', 'professional', 'premium')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'expired', 'cancelled')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- =====================================================
-- INFLUENCERS
-- =====================================================

-- Influencers (as per influencerService - exact schema match)
CREATE TABLE IF NOT EXISTS influencers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  platform TEXT NOT NULL,
  followers_count INTEGER NOT NULL,
  engagement_rate DECIMAL(5,2),
  niche TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  location TEXT,
  bio TEXT,
  profile_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_influencers_platform ON influencers(platform);
CREATE INDEX idx_influencers_active ON influencers(is_active);

-- =====================================================
-- NOTIFICATIONS
-- =====================================================

-- Notifications (camelCase fields as per notificationService)
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  "relatedId" UUID,
  "isRead" BOOLEAN DEFAULT false,
  channel TEXT NOT NULL CHECK (channel IN ('in_app', 'email', 'whatsapp')),
  "createdAt" TIMESTAMPTZ DEFAULT NOW(),
  "scheduledFor" TIMESTAMPTZ
);

-- Use quoted names for camelCase columns
CREATE INDEX idx_notifications_user ON notifications("userId");
CREATE INDEX idx_notifications_read ON notifications("isRead");
CREATE INDEX idx_notifications_created ON notifications("createdAt" DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE technician_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Products: Public read, sellers manage own
CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Sellers can insert own products"
  ON products FOR INSERT
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update own products"
  ON products FOR UPDATE
  USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete own products"
  ON products FOR DELETE
  USING (auth.uid() = seller_id);

-- Stores: Public read, owners manage own
CREATE POLICY "Stores are viewable by everyone"
  ON stores FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own stores"
  ON stores FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update own stores"
  ON stores FOR UPDATE
  USING (auth.uid() = owner_id);

-- Favorites: Users manage own
CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Reviews: Public read, users create own
CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = reviewer_id);

-- Messages: Users see own conversations
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Reports: Users create, admins manage
CREATE POLICY "Users can insert reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON reports FOR SELECT
  USING (auth.uid() = reporter_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Technician Services: Public read, technicians manage own
CREATE POLICY "Services are viewable by everyone"
  ON technician_services FOR SELECT
  USING (true);

CREATE POLICY "Technicians can manage own services"
  ON technician_services FOR ALL
  USING (auth.uid() = technician_id);

-- Service Requests: Involved parties only
CREATE POLICY "Users can view related service requests"
  ON service_requests FOR SELECT
  USING (auth.uid() = customer_id OR auth.uid() = technician_id);

CREATE POLICY "Customers can create service requests"
  ON service_requests FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Involved parties can update requests"
  ON service_requests FOR UPDATE
  USING (auth.uid() = customer_id OR auth.uid() = technician_id);

-- Job Listings: Public read, creators manage
CREATE POLICY "Job listings are viewable by everyone"
  ON job_listings FOR SELECT
  USING (true);

CREATE POLICY "Users can create job listings"
  ON job_listings FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update own job listings"
  ON job_listings FOR UPDATE
  USING (auth.uid() = creator_id);

-- Job Applications: Applicants and job creators
CREATE POLICY "Job creators and applicants can view applications"
  ON job_applications FOR SELECT
  USING (
    auth.uid() = technician_id OR 
    EXISTS (SELECT 1 FROM job_listings WHERE id = job_id AND creator_id = auth.uid())
  );

CREATE POLICY "Technicians can apply to jobs"
  ON job_applications FOR INSERT
  WITH CHECK (auth.uid() = technician_id);

-- Ads: Public read, advertisers manage own
CREATE POLICY "Ads are viewable by everyone"
  ON ads FOR SELECT
  USING (true);

CREATE POLICY "Advertisers can manage own ads"
  ON ads FOR ALL
  USING (auth.uid() = advertiser_id);

-- Subscriptions: Users view own
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Influencers: Public read, admins manage
CREATE POLICY "Influencers are viewable by everyone"
  ON influencers FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage influencers"
  ON influencers FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Notifications: Users see own
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = "userId");

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = "userId");

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technician_services_updated_at BEFORE UPDATE ON technician_services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_requests_updated_at BEFORE UPDATE ON service_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_listings_updated_at BEFORE UPDATE ON job_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ads_updated_at BEFORE UPDATE ON ads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_influencers_updated_at BEFORE UPDATE ON influencers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE products IS 'Product listings (NOT listings table - matches service expectations)';
COMMENT ON TABLE stores IS 'Store information (uses owner_id column - matches storeService)';
COMMENT ON TABLE reviews IS 'Reviews with reviewer_id, subject_type, subject_id - matches reviewService';
COMMENT ON TABLE messages IS 'Direct messages with sender_id, receiver_id, is_read - matches messageService';
COMMENT ON TABLE favorites IS 'User favorites with user_id, product_id - matches favoriteService';
COMMENT ON TABLE notifications IS 'Notifications with camelCase columns - matches notificationService';
COMMENT ON TABLE subscriptions IS 'User subscriptions with plan_id, plan_type - matches subscriptionService';
