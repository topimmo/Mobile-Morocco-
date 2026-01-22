-- ================================================
-- Security Hardening Migration
-- Date: 2026-01-22
-- Purpose: Comprehensive security improvements for RLS, constraints, and anti-spam
-- ================================================

-- ================================================
-- PART 1: IMPROVED RLS POLICIES
-- ================================================

-- ----------------------------------------
-- Profiles: Add missing INSERT policy
-- ----------------------------------------
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- ----------------------------------------
-- OTP Requests: Secure OTP handling with rate limiting
-- ----------------------------------------
DROP POLICY IF EXISTS "Anyone can create OTP requests" ON otp_requests;
CREATE POLICY "Anyone can create OTP requests" ON otp_requests
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Users can view own OTP requests" ON otp_requests;
CREATE POLICY "Users can view own OTP requests" ON otp_requests
  FOR SELECT USING (phone = (SELECT phone FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Users can update own OTP requests" ON otp_requests;
CREATE POLICY "Users can update own OTP requests" ON otp_requests
  FOR UPDATE USING (phone = (SELECT phone FROM profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admin can manage OTP requests" ON otp_requests;
CREATE POLICY "Admin can manage OTP requests" ON otp_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ----------------------------------------
-- Categories & Cities: Admin-only management
-- ----------------------------------------
DROP POLICY IF EXISTS "Admin can manage categories" ON categories;
CREATE POLICY "Admin can manage categories" ON categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Admin can manage cities" ON cities;
CREATE POLICY "Admin can manage cities" ON cities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ================================================
-- PART 2: STORAGE SECURITY IMPROVEMENTS
-- ================================================

-- Drop old storage policies and create improved ones
DROP POLICY IF EXISTS "Public read access for item images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload item images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own images" ON storage.objects;

-- Allow public read access to item images
CREATE POLICY "Public read access for item images"
ON storage.objects FOR SELECT
USING (bucket_id = 'item-images');

-- Allow authenticated users to upload images (with file type enforcement at bucket level)
-- Note: Bucket already restricts to image/jpeg, image/png, image/webp and 5MB limit
CREATE POLICY "Authenticated users can upload item images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'item-images' 
  AND auth.role() = 'authenticated'
);

-- Prevent updates to existing files (immutable storage pattern for security)
-- Users should delete and re-upload rather than update
CREATE POLICY "Prevent file updates"
ON storage.objects FOR UPDATE
USING (false);

-- Allow authenticated users to delete files
-- In production, consider tracking ownership in a separate table
-- For now, any authenticated user can delete (admin can restore via DB)
CREATE POLICY "Authenticated users can delete item images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'item-images'
  AND auth.role() = 'authenticated'
);

-- ================================================
-- PART 3: DATABASE CONSTRAINTS FOR DATA INTEGRITY
-- ================================================

-- ----------------------------------------
-- Listings: Prevent empty/invalid data
-- ----------------------------------------
ALTER TABLE listings 
  ALTER COLUMN title SET NOT NULL,
  ALTER COLUMN description SET NOT NULL,
  ADD CONSTRAINT title_not_empty CHECK (LENGTH(TRIM(title)) >= 3),
  ADD CONSTRAINT description_not_empty CHECK (LENGTH(TRIM(description)) >= 10),
  ADD CONSTRAINT price_positive CHECK (price > 0);

-- ----------------------------------------
-- Repair Shops: Prevent empty/invalid data
-- ----------------------------------------
ALTER TABLE repair_shops
  ALTER COLUMN name SET NOT NULL,
  ALTER COLUMN description SET NOT NULL,
  ADD CONSTRAINT name_not_empty CHECK (LENGTH(TRIM(name)) >= 3),
  ADD CONSTRAINT description_not_empty CHECK (LENGTH(TRIM(description)) >= 10);

-- ----------------------------------------
-- Reviews: Prevent spam reviews
-- ----------------------------------------
ALTER TABLE reviews
  ADD CONSTRAINT comment_min_length CHECK (
    comment IS NULL OR LENGTH(TRIM(comment)) >= 10
  );

-- Add constraint to prevent duplicate reviews (already exists via UNIQUE constraint)
-- UNIQUE(user_id, target_type, target_id) is already in place

-- ----------------------------------------
-- OTP Requests: Rate limiting via DB constraint
-- ----------------------------------------
-- Add index for efficient rate limit checks
CREATE INDEX IF NOT EXISTS idx_otp_requests_phone_created 
  ON otp_requests(phone, created_at DESC);

-- Function to check OTP rate limit (max 3 requests per phone per 15 minutes)
CREATE OR REPLACE FUNCTION check_otp_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Count OTP requests from this phone in last 15 minutes
  SELECT COUNT(*)
  INTO recent_count
  FROM otp_requests
  WHERE phone = NEW.phone
    AND created_at > NOW() - INTERVAL '15 minutes';
  
  -- Enforce limit of 3 requests per 15 minutes
  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait 15 minutes before requesting another OTP.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for OTP rate limiting
DROP TRIGGER IF EXISTS enforce_otp_rate_limit ON otp_requests;
CREATE TRIGGER enforce_otp_rate_limit
  BEFORE INSERT ON otp_requests
  FOR EACH ROW
  EXECUTE FUNCTION check_otp_rate_limit();

-- ----------------------------------------
-- Listings & Repair Shops: Prevent spam creation
-- ----------------------------------------
-- Add index for efficient rate limit checks
CREATE INDEX IF NOT EXISTS idx_listings_user_created 
  ON listings(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_repair_shops_user_created 
  ON repair_shops(user_id, created_at DESC);

-- Function to check listing creation rate limit (max 5 listings per hour per user)
CREATE OR REPLACE FUNCTION check_listing_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Skip check for admin users
  IF EXISTS (SELECT 1 FROM profiles WHERE id = NEW.user_id AND role = 'admin') THEN
    RETURN NEW;
  END IF;
  
  -- Count listings created by this user in last hour
  SELECT COUNT(*)
  INTO recent_count
  FROM listings
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '1 hour';
  
  -- Enforce limit of 5 listings per hour
  IF recent_count >= 5 THEN
    RAISE EXCEPTION 'Rate limit exceeded. You can create maximum 5 listings per hour.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for listing rate limiting
DROP TRIGGER IF EXISTS enforce_listing_rate_limit ON listings;
CREATE TRIGGER enforce_listing_rate_limit
  BEFORE INSERT ON listings
  FOR EACH ROW
  EXECUTE FUNCTION check_listing_rate_limit();

-- Function to check repair shop creation rate limit (max 2 shops per day per user)
CREATE OR REPLACE FUNCTION check_shop_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Skip check for admin users
  IF EXISTS (SELECT 1 FROM profiles WHERE id = NEW.user_id AND role = 'admin') THEN
    RETURN NEW;
  END IF;
  
  -- Count shops created by this user in last 24 hours
  SELECT COUNT(*)
  INTO recent_count
  FROM repair_shops
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '24 hours';
  
  -- Enforce limit of 2 shops per day
  IF recent_count >= 2 THEN
    RAISE EXCEPTION 'Rate limit exceeded. You can create maximum 2 repair shops per day.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for shop rate limiting
DROP TRIGGER IF EXISTS enforce_shop_rate_limit ON repair_shops;
CREATE TRIGGER enforce_shop_rate_limit
  BEFORE INSERT ON repair_shops
  FOR EACH ROW
  EXECUTE FUNCTION check_shop_rate_limit();

-- ----------------------------------------
-- Reviews: Prevent review spam
-- ----------------------------------------
CREATE INDEX IF NOT EXISTS idx_reviews_user_created 
  ON reviews(user_id, created_at DESC);

-- Function to check review creation rate limit (max 10 reviews per day per user)
CREATE OR REPLACE FUNCTION check_review_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  recent_count INTEGER;
BEGIN
  -- Skip check for admin users
  IF EXISTS (SELECT 1 FROM profiles WHERE id = NEW.user_id AND role = 'admin') THEN
    RETURN NEW;
  END IF;
  
  -- Count reviews created by this user in last 24 hours
  SELECT COUNT(*)
  INTO recent_count
  FROM reviews
  WHERE user_id = NEW.user_id
    AND created_at > NOW() - INTERVAL '24 hours';
  
  -- Enforce limit of 10 reviews per day
  IF recent_count >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded. You can create maximum 10 reviews per day.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for review rate limiting
DROP TRIGGER IF EXISTS enforce_review_rate_limit ON reviews;
CREATE TRIGGER enforce_review_rate_limit
  BEFORE INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION check_review_rate_limit();

-- ================================================
-- PART 4: ADDITIONAL SECURITY INDEXES
-- ================================================

-- Indexes for efficient RLS policy checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role) WHERE role = 'admin';
CREATE INDEX IF NOT EXISTS idx_listings_status_user ON listings(status, user_id);
CREATE INDEX IF NOT EXISTS idx_repair_shops_status_user ON repair_shops(status, user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_visible ON reviews(is_visible) WHERE is_visible = true;

-- ================================================
-- PART 5: CLEANUP OLD EXPIRED OTP REQUESTS
-- ================================================

-- Function to clean up expired OTP requests (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete OTP requests older than 24 hours
  DELETE FROM otp_requests
  WHERE created_at < NOW() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- VERIFICATION & SUMMARY
-- ================================================

-- Verify all tables have RLS enabled
DO $$
DECLARE
  table_record RECORD;
  missing_rls TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOR table_record IN 
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public'
      AND tablename IN (
        'profiles', 'listings', 'listing_images', 'repair_shops', 'shop_images',
        'reviews', 'ad_campaigns', 'ad_bookings', 'ad_events', 'adsense_units',
        'categories', 'cities', 'otp_requests'
      )
  LOOP
    IF NOT (
      SELECT relrowsecurity 
      FROM pg_class 
      WHERE relname = table_record.tablename 
        AND relnamespace = 'public'::regnamespace
    ) THEN
      missing_rls := array_append(missing_rls, table_record.tablename);
    END IF;
  END LOOP;
  
  IF array_length(missing_rls, 1) > 0 THEN
    RAISE WARNING 'Tables missing RLS: %', array_to_string(missing_rls, ', ');
  ELSE
    RAISE NOTICE 'SUCCESS: All required tables have Row Level Security enabled';
  END IF;
END;
$$;
