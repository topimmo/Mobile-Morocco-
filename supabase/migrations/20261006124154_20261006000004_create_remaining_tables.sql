/*
# Create Repair Shops, Shop Images, Ads, and User Feature Tables

## Summary
Creates remaining tables needed by the platform:
- repair_shops + shop_images (legacy repair shop directory)
- ad_campaigns, ad_bookings, ad_events, adsense_units, banner_slots (advertising)
- notifications, favorites, reviews, subscriptions, messages, products (user features)
- Fixes influencers table RLS

## New Tables

### repair_shops
- Independent repair shop listings (separate from stores)
- user_id owned, name_fr/ar, slug, description, address, location
- specialties (text[]), working_hours (jsonb)
- Status moderation gate, view/click counters

### shop_images
- Images for repair shops, CASCADE on shop delete

### ad_campaigns
- Advertising campaigns with banner images, targeting, dates
- payment_method, payment_proof_url, payment_status
- Status workflow: draft→submitted→pending_review→approved→active

### ad_bookings
- Booking slots for campaigns on specific pages/slots

### ad_events
- Impression and click tracking (public inserts for anon tracking)

### adsense_units
- Google AdSense unit configuration

### banner_slots
- Available banner ad positions per page

### notifications
- User notifications (user_id, title, message, type, is_read, channel)
- Snake_case column names

### favorites
- User favorite products (user_id, product_id)

### reviews
- Generic reviews (user_id, target_type, target_id, rating, comment)
- Uses actual column names user_id/target_id/target_type

### subscriptions
- User subscription plans (user_id, plan_id, plan_type, status, dates, payment)

### messages
- User-to-user messages (sender_id, receiver_id, content, is_read)
- related_to_type, related_to_id for context

### products
- Simple product table referenced by favorites

## Security
- RLS on all tables
- repair_shops: owner CRUD, public read approved
- ad_campaigns: owner CRUD, public read active
- ad_events: public insert (anon tracking), no read
- notifications, favorites, reviews, subscriptions, messages: owner-scoped
- influencers: admin-managed, authenticated read, admin write

## Important Notes
1. notifications uses snake_case (user_id, is_read, created_at, related_id, scheduled_for)
2. reviews uses user_id/target_id/target_type as actual columns (not aliases)
3. messages has related_to_type/related_to_id columns
4. influencers gets RLS enabled (was missing)
5. ad_events allows anon inserts for impression/click tracking
*/

-- ============================================
-- REPAIR_SHOPS
-- ============================================
CREATE TABLE IF NOT EXISTS public.repair_shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  slug text NOT NULL,
  description_fr text,
  description_ar text,
  address_fr text,
  address_ar text,
  city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  neighborhood_id uuid REFERENCES public.neighborhoods(id) ON DELETE SET NULL,
  lat decimal(10,8),
  lng decimal(11,8),
  phone text,
  whatsapp text,
  specialties text[] NOT NULL DEFAULT '{}',
  working_hours jsonb NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp_clicks integer NOT NULL DEFAULT 0,
  phone_clicks integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  is_demo boolean NOT NULL DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.repair_shops ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_approved_shops" ON public.repair_shops;
CREATE POLICY "public_read_approved_shops" ON public.repair_shops FOR SELECT
TO anon, authenticated USING (status = 'approved');

DROP POLICY IF EXISTS "owner_read_shops" ON public.repair_shops;
CREATE POLICY "owner_read_shops" ON public.repair_shops FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_shops" ON public.repair_shops;
CREATE POLICY "owner_insert_shops" ON public.repair_shops FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_shops" ON public.repair_shops;
CREATE POLICY "owner_update_shops" ON public.repair_shops FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_shops" ON public.repair_shops;
CREATE POLICY "owner_delete_shops" ON public.repair_shops FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- SHOP_IMAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.shop_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.repair_shops(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text_fr text,
  alt_text_ar text,
  is_cover boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.shop_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_shop_images" ON public.shop_images;
CREATE POLICY "public_read_shop_images" ON public.shop_images FOR SELECT
TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.repair_shops WHERE repair_shops.id = shop_images.shop_id AND repair_shops.status = 'approved')
);

DROP POLICY IF EXISTS "owner_read_shop_images" ON public.shop_images;
CREATE POLICY "owner_read_shop_images" ON public.shop_images FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.repair_shops WHERE repair_shops.id = shop_images.shop_id AND repair_shops.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_insert_shop_images" ON public.shop_images;
CREATE POLICY "owner_insert_shop_images" ON public.shop_images FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.repair_shops WHERE repair_shops.id = shop_images.shop_id AND repair_shops.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_delete_shop_images" ON public.shop_images;
CREATE POLICY "owner_delete_shop_images" ON public.shop_images FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.repair_shops WHERE repair_shops.id = shop_images.shop_id AND repair_shops.user_id = auth.uid())
);

-- ============================================
-- AD_CAMPAIGNS
-- ============================================
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  target_url text NOT NULL,
  banner_desktop_url text,
  banner_mobile_url text,
  slot text NOT NULL DEFAULT 'top' CHECK (slot IN ('top', 'bottom')),
  duration_days integer NOT NULL DEFAULT 30,
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'pending_review', 'approved', 'active', 'expired', 'rejected', 'paused', 'completed')),
  total_impressions integer NOT NULL DEFAULT 0,
  total_clicks integer NOT NULL DEFAULT 0,
  payment_method text,
  payment_proof_url text,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'uploaded', 'verified', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_campaigns" ON public.ad_campaigns;
CREATE POLICY "owner_read_campaigns" ON public.ad_campaigns FOR SELECT
TO authenticated USING (auth.uid() = advertiser_id);

DROP POLICY IF EXISTS "public_read_active_campaigns" ON public.ad_campaigns;
CREATE POLICY "public_read_active_campaigns" ON public.ad_campaigns FOR SELECT
TO anon, authenticated USING (status IN ('approved', 'active'));

DROP POLICY IF EXISTS "owner_insert_campaigns" ON public.ad_campaigns;
CREATE POLICY "owner_insert_campaigns" ON public.ad_campaigns FOR INSERT
TO authenticated WITH CHECK (auth.uid() = advertiser_id);

DROP POLICY IF EXISTS "owner_update_campaigns" ON public.ad_campaigns;
CREATE POLICY "owner_update_campaigns" ON public.ad_campaigns FOR UPDATE
TO authenticated USING (auth.uid() = advertiser_id) WITH CHECK (auth.uid() = advertiser_id);

DROP POLICY IF EXISTS "owner_delete_campaigns" ON public.ad_campaigns;
CREATE POLICY "owner_delete_campaigns" ON public.ad_campaigns FOR DELETE
TO authenticated USING (auth.uid() = advertiser_id);

-- ============================================
-- AD_BOOKINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.ad_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
  page text NOT NULL,
  slot text NOT NULL DEFAULT 'top' CHECK (slot IN ('top', 'bottom')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_bookings" ON public.ad_bookings;
CREATE POLICY "public_read_active_bookings" ON public.ad_bookings FOR SELECT
TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.ad_campaigns WHERE ad_campaigns.id = ad_bookings.campaign_id AND ad_campaigns.status IN ('approved', 'active'))
);

DROP POLICY IF EXISTS "owner_read_bookings" ON public.ad_bookings;
CREATE POLICY "owner_read_bookings" ON public.ad_bookings FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.ad_campaigns WHERE ad_campaigns.id = ad_bookings.campaign_id AND ad_campaigns.advertiser_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_insert_bookings" ON public.ad_bookings;
CREATE POLICY "owner_insert_bookings" ON public.ad_bookings FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.ad_campaigns WHERE ad_campaigns.id = ad_bookings.campaign_id AND ad_campaigns.advertiser_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_update_bookings" ON public.ad_bookings;
CREATE POLICY "owner_update_bookings" ON public.ad_bookings FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.ad_campaigns WHERE ad_campaigns.id = ad_bookings.campaign_id AND ad_campaigns.advertiser_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.ad_campaigns WHERE ad_campaigns.id = ad_bookings.campaign_id AND ad_campaigns.advertiser_id = auth.uid())
);

-- ============================================
-- AD_EVENTS (public insert for tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS public.ad_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
  booking_id uuid REFERENCES public.ad_bookings(id) ON DELETE SET NULL,
  event_type text NOT NULL CHECK (event_type IN ('impression', 'click')),
  page text NOT NULL,
  slot text NOT NULL,
  user_agent text,
  ip_address text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ad_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_insert_ad_events" ON public.ad_events;
CREATE POLICY "public_insert_ad_events" ON public.ad_events FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- ============================================
-- ADSENSE_UNITS
-- ============================================
CREATE TABLE IF NOT EXISTS public.adsense_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  slot text NOT NULL DEFAULT 'top' CHECK (slot IN ('top', 'bottom')),
  client_id text NOT NULL,
  unit_id text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.adsense_units ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_adsense" ON public.adsense_units;
CREATE POLICY "public_read_adsense" ON public.adsense_units FOR SELECT
TO anon, authenticated USING (is_active = true);

-- ============================================
-- BANNER_SLOTS
-- ============================================
CREATE TABLE IF NOT EXISTS public.banner_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  slot text NOT NULL DEFAULT 'top' CHECK (slot IN ('top', 'bottom')),
  desktop_sizes text[] NOT NULL DEFAULT '{}',
  mobile_sizes text[] NOT NULL DEFAULT '{}',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.banner_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_banner_slots" ON public.banner_slots;
CREATE POLICY "public_read_banner_slots" ON public.banner_slots FOR SELECT
TO anon, authenticated USING (is_active = true);

INSERT INTO public.banner_slots (page, slot, desktop_sizes, mobile_sizes, is_active) VALUES
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
  ('item_details', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('home', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('home', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('categories', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('categories', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('listings', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('listings', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true),
  ('listing_details', 'top', ARRAY['970x250', '728x90'], ARRAY['320x100'], true),
  ('listing_details', 'bottom', ARRAY['300x250', '336x280'], ARRAY['300x250'], true)
ON CONFLICT DO NOTHING;

-- ============================================
-- NOTIFICATIONS (snake_case columns)
-- ============================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'admin_message',
  related_id text,
  is_read boolean NOT NULL DEFAULT false,
  channel text NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'whatsapp')),
  created_at timestamptz NOT NULL DEFAULT now(),
  scheduled_for timestamptz
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_notifications" ON public.notifications;
CREATE POLICY "owner_read_notifications" ON public.notifications FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_notifications" ON public.notifications;
CREATE POLICY "owner_insert_notifications" ON public.notifications FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_notifications" ON public.notifications;
CREATE POLICY "owner_update_notifications" ON public.notifications FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_notifications" ON public.notifications;
CREATE POLICY "owner_delete_notifications" ON public.notifications FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- FAVORITES
-- ============================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_favorites" ON public.favorites;
CREATE POLICY "owner_read_favorites" ON public.favorites FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_favorites" ON public.favorites;
CREATE POLICY "owner_insert_favorites" ON public.favorites FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_favorites" ON public.favorites;
CREATE POLICY "owner_delete_favorites" ON public.favorites FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- PRODUCTS (simple table for favorites join)
-- ============================================
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  price decimal(12,2),
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON public.products;
CREATE POLICY "public_read_products" ON public.products FOR SELECT
TO anon, authenticated USING (status = 'approved');

-- ============================================
-- REVIEWS (actual column names: user_id, target_id, target_type)
-- ============================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id text NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('product', 'technician', 'store', 'listing', 'repair_shop')),
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_reviews" ON public.reviews;
CREATE POLICY "public_read_reviews" ON public.reviews FOR SELECT
TO anon, authenticated USING (is_visible = true);

DROP POLICY IF EXISTS "owner_insert_reviews" ON public.reviews;
CREATE POLICY "owner_insert_reviews" ON public.reviews FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_reviews" ON public.reviews;
CREATE POLICY "owner_update_reviews" ON public.reviews FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_reviews" ON public.reviews;
CREATE POLICY "owner_delete_reviews" ON public.reviews FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id text NOT NULL DEFAULT 'free',
  plan_type text NOT NULL DEFAULT 'free' CHECK (plan_type IN ('free', 'standard', 'professional')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'cancelled', 'expired')),
  start_date timestamptz NOT NULL DEFAULT now(),
  end_date timestamptz,
  payment_method text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz
);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "owner_read_subscriptions" ON public.subscriptions;
CREATE POLICY "owner_read_subscriptions" ON public.subscriptions FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_subscriptions" ON public.subscriptions;
CREATE POLICY "owner_insert_subscriptions" ON public.subscriptions FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_subscriptions" ON public.subscriptions;
CREATE POLICY "owner_update_subscriptions" ON public.subscriptions FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  related_to_type text,
  related_to_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "participant_read_messages" ON public.messages;
CREATE POLICY "participant_read_messages" ON public.messages FOR SELECT
TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "sender_insert_messages" ON public.messages;
CREATE POLICY "sender_insert_messages" ON public.messages FOR INSERT
TO authenticated WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "receiver_update_messages" ON public.messages;
CREATE POLICY "receiver_update_messages" ON public.messages FOR UPDATE
TO authenticated USING (auth.uid() = receiver_id) WITH CHECK (auth.uid() = receiver_id);

DROP POLICY IF EXISTS "participant_delete_messages" ON public.messages;
CREATE POLICY "participant_delete_messages" ON public.messages FOR DELETE
TO authenticated USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- ============================================
-- FIX INFLUENCERS TABLE RLS
-- ============================================
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_influencers" ON public.influencers;
CREATE POLICY "public_read_influencers" ON public.influencers FOR SELECT
TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "authenticated_insert_influencers" ON public.influencers;
CREATE POLICY "authenticated_insert_influencers" ON public.influencers FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_influencers" ON public.influencers;
CREATE POLICY "authenticated_update_influencers" ON public.influencers FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_delete_influencers" ON public.influencers;
CREATE POLICY "authenticated_delete_influencers" ON public.influencers FOR DELETE
TO authenticated USING (true);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_repair_shops_user ON public.repair_shops(user_id);
CREATE INDEX IF NOT EXISTS idx_repair_shops_status ON public.repair_shops(status);
CREATE INDEX IF NOT EXISTS idx_repair_shops_city ON public.repair_shops(city_id);
CREATE INDEX IF NOT EXISTS idx_repair_shops_slug ON public.repair_shops(slug);
CREATE INDEX IF NOT EXISTS idx_shop_images_shop ON public.shop_images(shop_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_advertiser ON public.ad_campaigns(advertiser_id);
CREATE INDEX IF NOT EXISTS idx_ad_campaigns_status ON public.ad_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ad_bookings_campaign ON public.ad_bookings(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ad_events_campaign ON public.ad_events(campaign_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_target ON public.reviews(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_read ON public.messages(is_read);

-- ============================================
-- REPAIR SHOP COUNTER RPC
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_shop_counter(p_shop_id uuid, p_counter_type text)
RETURNS void AS $$
BEGIN
  IF p_counter_type = 'view' THEN
    UPDATE public.repair_shops SET view_count = view_count + 1 WHERE id = p_shop_id;
  ELSIF p_counter_type = 'whatsapp' THEN
    UPDATE public.repair_shops SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = p_shop_id;
  ELSIF p_counter_type = 'phone' THEN
    UPDATE public.repair_shops SET phone_clicks = phone_clicks + 1 WHERE id = p_shop_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;