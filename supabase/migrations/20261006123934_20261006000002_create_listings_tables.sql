/*
# Create Listings and Listing Images Tables

## Summary
Creates tables for marketplace listings (phones, parts, equipment posted by users)
and their associated images.

## New Tables

### listings
- id (uuid PK)
- user_id (uuid, FK auth.users, DEFAULT auth.uid())
- title_fr, title_ar, slug, description_fr, description_ar
- price, currency, category_id (FK), city_id (FK), neighborhood_id (FK)
- condition (new|used|refurbished), brand, model
- status (pending|approved|rejected|hidden) - moderation gate
- whatsapp, phone, whatsapp_clicks, phone_clicks, view_count
- phone_details (jsonb - additional phone specs)
- meta_title, meta_description, is_featured
- created_at, updated_at

### listing_images
- id (uuid PK)
- listing_id (FK to listings, CASCADE)
- image_url, alt_text_fr, alt_text_ar, sort_order
- created_at

## Security
- RLS on both tables
- listings: owner can CRUD own rows; public can read approved rows
- listing_images: owner can insert/delete via listing ownership; public can read via approved listing

## Important Notes
1. user_id defaults to auth.uid() so inserts work without passing it
2. status defaults to 'pending' - all new listings need admin approval
3. Public SELECT allows anon to view approved listings
*/

-- ============================================
-- LISTINGS
-- ============================================
CREATE TABLE IF NOT EXISTS public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title_fr text NOT NULL,
  title_ar text NOT NULL,
  slug text NOT NULL,
  description_fr text,
  description_ar text,
  price decimal(12,2),
  currency text NOT NULL DEFAULT 'MAD',
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  neighborhood_id uuid REFERENCES public.neighborhoods(id) ON DELETE SET NULL,
  condition text CHECK (condition IN ('new', 'used', 'refurbished')),
  brand text,
  model text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp text,
  phone text,
  phone_details jsonb,
  whatsapp_clicks integer NOT NULL DEFAULT 0,
  phone_clicks integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  meta_title text,
  meta_description text,
  is_featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Public can read approved listings
DROP POLICY IF EXISTS "public_read_approved_listings" ON public.listings;
CREATE POLICY "public_read_approved_listings" ON public.listings FOR SELECT
TO anon, authenticated USING (status = 'approved');

-- Owner can read own listings (any status)
DROP POLICY IF EXISTS "owner_read_listings" ON public.listings;
CREATE POLICY "owner_read_listings" ON public.listings FOR SELECT
TO authenticated USING (auth.uid() = user_id);

-- Owner can insert own listings
DROP POLICY IF EXISTS "owner_insert_listings" ON public.listings;
CREATE POLICY "owner_insert_listings" ON public.listings FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

-- Owner can update own listings
DROP POLICY IF EXISTS "owner_update_listings" ON public.listings;
CREATE POLICY "owner_update_listings" ON public.listings FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Owner can delete own listings
DROP POLICY IF EXISTS "owner_delete_listings" ON public.listings;
CREATE POLICY "owner_delete_listings" ON public.listings FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- LISTING_IMAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.listing_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text_fr text,
  alt_text_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.listing_images ENABLE ROW LEVEL SECURITY;

-- Public can read images of approved listings
DROP POLICY IF EXISTS "public_read_listing_images" ON public.listing_images;
CREATE POLICY "public_read_listing_images" ON public.listing_images FOR SELECT
TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_images.listing_id AND listings.status = 'approved')
);

-- Owner can read, insert, delete images of own listings
DROP POLICY IF EXISTS "owner_read_listing_images" ON public.listing_images;
CREATE POLICY "owner_read_listing_images" ON public.listing_images FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_images.listing_id AND listings.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_insert_listing_images" ON public.listing_images;
CREATE POLICY "owner_insert_listing_images" ON public.listing_images FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_images.listing_id AND listings.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_delete_listing_images" ON public.listing_images;
CREATE POLICY "owner_delete_listing_images" ON public.listing_images FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.listings WHERE listings.id = listing_images.listing_id AND listings.user_id = auth.uid())
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_listings_user ON public.listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_category ON public.listings(category_id);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city_id);
CREATE INDEX IF NOT EXISTS idx_listings_slug ON public.listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_condition ON public.listings(condition);
CREATE INDEX IF NOT EXISTS idx_listings_featured ON public.listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_listings_created ON public.listings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_listing_images_listing ON public.listing_images(listing_id);

-- ============================================
-- SLUG GENERATION FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_listing_slug(p_title text)
RETURNS text AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 0;
BEGIN
  base_slug := lower(regexp_replace(p_title, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  new_slug := base_slug;
  
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.listings WHERE slug = new_slug);
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COUNTER FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_listing_view(p_listing_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.listings SET view_count = view_count + 1 WHERE id = p_listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_counter(
  p_table_name text,
  p_column_name text,
  p_row_id uuid
)
RETURNS void AS $$
BEGIN
  IF p_table_name = 'listings' AND p_column_name IN ('whatsapp_clicks', 'phone_clicks', 'view_count') THEN
    EXECUTE format('UPDATE public.listings SET %I = %I + 1 WHERE id = $1', p_column_name, p_column_name)
    USING p_row_id;
  ELSIF p_table_name = 'repair_shops' AND p_column_name IN ('whatsapp_clicks', 'phone_clicks', 'view_count') THEN
    EXECUTE format('UPDATE public.repair_shops SET %I = %I + 1 WHERE id = $1', p_column_name, p_column_name)
    USING p_row_id;
  ELSIF p_table_name = 'stores' AND p_column_name IN ('whatsapp_clicks', 'phone_clicks', 'view_count') THEN
    EXECUTE format('UPDATE public.stores SET %I = %I + 1 WHERE id = $1', p_column_name, p_column_name)
    USING p_row_id;
  ELSIF p_table_name = 'items' AND p_column_name IN ('whatsapp_clicks', 'phone_clicks', 'view_count') THEN
    EXECUTE format('UPDATE public.items SET %I = %I + 1 WHERE id = $1', p_column_name, p_column_name)
    USING p_row_id;
  ELSIF p_table_name = 'repair_services' AND p_column_name IN ('whatsapp_clicks', 'phone_clicks', 'view_count') THEN
    EXECUTE format('UPDATE public.repair_services SET %I = %I + 1 WHERE id = $1', p_column_name, p_column_name)
    USING p_row_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;