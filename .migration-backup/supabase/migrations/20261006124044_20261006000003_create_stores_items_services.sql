/*
# Create Stores, Items, Images, Services, and Reviews Tables

## Summary
Creates the unified store/item/review schema for the marketplace platform.
Stores are per-user profiles. Items (phones, computers, parts, equipment) belong to stores.
Repair services also belong to stores. Store reviews are public reviews of stores.

## New Tables

### stores
- One store per user (UNIQUE user_id)
- name_fr/ar, slug, description, store_type (shop|individual)
- Location: address, city_id, neighborhood_id, lat, lng
- Contact: phone, whatsapp, email, website
- Hours: working_hours (jsonb), working_days (text[])
- Stats: view_count, whatsapp_clicks, phone_clicks, rating_avg, rating_count
- Status: pending|approved|rejected|hidden
- meta_title, meta_description for SEO

### store_images
- Images for a store (is_cover flag, sort_order)
- CASCADE on store delete

### items
- Belongs to a store (store_id FK)
- item_type: phone|spare_part|equipment|computer|computer_part
- condition: new|used
- title_fr/ar, slug, description_fr/ar
- price, price_text, currency, brand, model
- city_id, neighborhood_id, phone, whatsapp
- computer_details (jsonb for computer specs)
- Stats and status like stores
- is_demo flag

### item_images
- Images for items, CASCADE on item delete

### repair_services
- Services offered by a store
- service_name_fr/ar, slug, description
- device_types (text[] - phone, computer, laptop, pc, tablet)
- price, price_on_request, estimated_duration
- Location and contact fields
- Stats and status

### store_reviews
- Reviews for a store (reviewer_name, rating 1-5, comment)
- status: pending|approved|rejected
- Trigger updates store rating_avg/rating_count on insert/update

## Security
- RLS on all tables
- stores: owner CRUD, public read approved
- store_images, items, item_images, repair_services: ownership via store.user_id
- store_reviews: public read approved, authenticated insert

## Important Notes
1. stores has UNIQUE(user_id) - one store per user
2. Slug auto-generation triggers on stores, items, repair_services
3. update_store_rating trigger recalculates rating on review changes
4. items supports computer/computer_part types added in later migrations
*/

-- ============================================
-- STORES
-- ============================================
CREATE TABLE IF NOT EXISTS public.stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  description_fr text,
  description_ar text,
  store_type text NOT NULL DEFAULT 'individual' CHECK (store_type IN ('shop', 'individual')),
  address_fr text,
  address_ar text,
  city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  neighborhood_id uuid REFERENCES public.neighborhoods(id) ON DELETE SET NULL,
  neighborhood_custom text,
  lat decimal(10,8),
  lng decimal(11,8),
  phone text,
  whatsapp text,
  email text,
  website text,
  working_hours jsonb NOT NULL DEFAULT '{}',
  working_days text[] NOT NULL DEFAULT '{}',
  emergency_service boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp_clicks integer NOT NULL DEFAULT 0,
  phone_clicks integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  rating_avg decimal(2,1) NOT NULL DEFAULT 0,
  rating_count integer NOT NULL DEFAULT 0,
  is_demo boolean NOT NULL DEFAULT false,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_approved_stores" ON public.stores;
CREATE POLICY "public_read_approved_stores" ON public.stores FOR SELECT
TO anon, authenticated USING (status = 'approved');

DROP POLICY IF EXISTS "owner_read_stores" ON public.stores;
CREATE POLICY "owner_read_stores" ON public.stores FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_insert_stores" ON public.stores;
CREATE POLICY "owner_insert_stores" ON public.stores FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_update_stores" ON public.stores;
CREATE POLICY "owner_update_stores" ON public.stores FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owner_delete_stores" ON public.stores;
CREATE POLICY "owner_delete_stores" ON public.stores FOR DELETE
TO authenticated USING (auth.uid() = user_id);

-- ============================================
-- STORE_IMAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.store_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text_fr text,
  alt_text_ar text,
  is_cover boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_store_images" ON public.store_images;
CREATE POLICY "public_read_store_images" ON public.store_images FOR SELECT
TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = store_images.store_id AND stores.status = 'approved')
);

DROP POLICY IF EXISTS "owner_read_store_images" ON public.store_images;
CREATE POLICY "owner_read_store_images" ON public.store_images FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = store_images.store_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_insert_store_images" ON public.store_images;
CREATE POLICY "owner_insert_store_images" ON public.store_images FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = store_images.store_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_delete_store_images" ON public.store_images;
CREATE POLICY "owner_delete_store_images" ON public.store_images FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = store_images.store_id AND stores.user_id = auth.uid())
);

-- ============================================
-- ITEMS
-- ============================================
CREATE TABLE IF NOT EXISTS public.items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('phone', 'spare_part', 'equipment', 'computer', 'computer_part')),
  condition text NOT NULL CHECK (condition IN ('new', 'used')),
  title_fr text NOT NULL,
  title_ar text NOT NULL,
  slug text NOT NULL,
  description_fr text,
  description_ar text,
  price decimal(12,2),
  price_text text,
  currency text NOT NULL DEFAULT 'MAD',
  brand text,
  model text,
  city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  neighborhood_id uuid REFERENCES public.neighborhoods(id) ON DELETE SET NULL,
  neighborhood_custom text,
  phone text,
  whatsapp text,
  computer_details jsonb,
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

ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_approved_items" ON public.items;
CREATE POLICY "public_read_approved_items" ON public.items FOR SELECT
TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = items.store_id AND stores.status = 'approved' AND items.status = 'approved')
);

DROP POLICY IF EXISTS "owner_read_items" ON public.items;
CREATE POLICY "owner_read_items" ON public.items FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = items.store_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_insert_items" ON public.items;
CREATE POLICY "owner_insert_items" ON public.items FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = items.store_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_update_items" ON public.items;
CREATE POLICY "owner_update_items" ON public.items FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = items.store_id AND stores.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = items.store_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_delete_items" ON public.items;
CREATE POLICY "owner_delete_items" ON public.items FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = items.store_id AND stores.user_id = auth.uid())
);

-- ============================================
-- ITEM_IMAGES
-- ============================================
CREATE TABLE IF NOT EXISTS public.item_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  alt_text_fr text,
  alt_text_ar text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.item_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_item_images" ON public.item_images;
CREATE POLICY "public_read_item_images" ON public.item_images FOR SELECT
TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.items
   JOIN public.stores ON stores.id = items.store_id
   WHERE items.id = item_images.item_id AND stores.status = 'approved' AND items.status = 'approved')
);

DROP POLICY IF EXISTS "owner_read_item_images" ON public.item_images;
CREATE POLICY "owner_read_item_images" ON public.item_images FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.items
   JOIN public.stores ON stores.id = items.store_id
   WHERE items.id = item_images.item_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_insert_item_images" ON public.item_images;
CREATE POLICY "owner_insert_item_images" ON public.item_images FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.items
   JOIN public.stores ON stores.id = items.store_id
   WHERE items.id = item_images.item_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_delete_item_images" ON public.item_images;
CREATE POLICY "owner_delete_item_images" ON public.item_images FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.items
   JOIN public.stores ON stores.id = items.store_id
   WHERE items.id = item_images.item_id AND stores.user_id = auth.uid())
);

-- ============================================
-- REPAIR_SERVICES
-- ============================================
CREATE TABLE IF NOT EXISTS public.repair_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  service_name_fr text NOT NULL,
  service_name_ar text NOT NULL,
  slug text NOT NULL,
  description_fr text,
  description_ar text,
  device_types text[] NOT NULL DEFAULT '{}',
  price decimal(12,2),
  price_on_request boolean NOT NULL DEFAULT false,
  estimated_duration text,
  city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  neighborhood_id uuid REFERENCES public.neighborhoods(id) ON DELETE SET NULL,
  neighborhood_custom text,
  phone text,
  whatsapp text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'hidden')),
  whatsapp_clicks integer NOT NULL DEFAULT 0,
  phone_clicks integer NOT NULL DEFAULT 0,
  view_count integer NOT NULL DEFAULT 0,
  is_demo boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.repair_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_approved_services" ON public.repair_services;
CREATE POLICY "public_read_approved_services" ON public.repair_services FOR SELECT
TO anon, authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = repair_services.store_id AND stores.status = 'approved' AND repair_services.status = 'approved')
);

DROP POLICY IF EXISTS "owner_read_services" ON public.repair_services;
CREATE POLICY "owner_read_services" ON public.repair_services FOR SELECT
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = repair_services.store_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_insert_services" ON public.repair_services;
CREATE POLICY "owner_insert_services" ON public.repair_services FOR INSERT
TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = repair_services.store_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_update_services" ON public.repair_services;
CREATE POLICY "owner_update_services" ON public.repair_services FOR UPDATE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = repair_services.store_id AND stores.user_id = auth.uid())
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = repair_services.store_id AND stores.user_id = auth.uid())
);

DROP POLICY IF EXISTS "owner_delete_services" ON public.repair_services;
CREATE POLICY "owner_delete_services" ON public.repair_services FOR DELETE
TO authenticated USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = repair_services.store_id AND stores.user_id = auth.uid())
);

-- ============================================
-- STORE_REVIEWS
-- ============================================
CREATE TABLE IF NOT EXISTS public.store_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  reviewer_name text NOT NULL,
  reviewer_phone text,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.store_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_approved_reviews" ON public.store_reviews;
CREATE POLICY "public_read_approved_reviews" ON public.store_reviews FOR SELECT
TO anon, authenticated USING (status = 'approved');

DROP POLICY IF EXISTS "authenticated_insert_reviews" ON public.store_reviews;
CREATE POLICY "authenticated_insert_reviews" ON public.store_reviews FOR INSERT
TO authenticated WITH CHECK (true);

-- ============================================
-- SLUG GENERATION FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION public.generate_store_slug(p_name text)
RETURNS text AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 0;
BEGIN
  base_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9\u0600-\u06FF]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  new_slug := base_slug;
  
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.stores WHERE slug = new_slug);
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generate_item_slug(p_title text)
RETURNS text AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 0;
BEGIN
  base_slug := lower(regexp_replace(p_title, '[^a-zA-Z0-9\u0600-\u06FF]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  new_slug := base_slug;
  
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.items WHERE slug = new_slug);
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.generate_service_slug(p_name text)
RETURNS text AS $$
DECLARE
  base_slug text;
  new_slug text;
  counter integer := 0;
BEGIN
  base_slug := lower(regexp_replace(p_name, '[^a-zA-Z0-9\u0600-\u06FF]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  new_slug := base_slug;
  
  LOOP
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.repair_services WHERE slug = new_slug);
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN new_slug;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SLUG TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.set_store_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_store_slug(COALESCE(NEW.name_ar, NEW.name_fr));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS store_slug_trigger ON public.stores;
CREATE TRIGGER store_slug_trigger
  BEFORE INSERT OR UPDATE ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.set_store_slug();

CREATE OR REPLACE FUNCTION public.set_item_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_item_slug(COALESCE(NEW.title_ar, NEW.title_fr));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS item_slug_trigger ON public.items;
CREATE TRIGGER item_slug_trigger
  BEFORE INSERT OR UPDATE ON public.items
  FOR EACH ROW EXECUTE FUNCTION public.set_item_slug();

CREATE OR REPLACE FUNCTION public.set_service_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := public.generate_service_slug(COALESCE(NEW.service_name_ar, NEW.service_name_fr));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS service_slug_trigger ON public.repair_services;
CREATE TRIGGER service_slug_trigger
  BEFORE INSERT OR UPDATE ON public.repair_services
  FOR EACH ROW EXECUTE FUNCTION public.set_service_slug();

-- ============================================
-- STORE RATING TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.update_store_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.stores SET
    rating_avg = (SELECT COALESCE(AVG(rating), 0) FROM public.store_reviews WHERE store_id = NEW.store_id AND status = 'approved'),
    rating_count = (SELECT COUNT(*) FROM public.store_reviews WHERE store_id = NEW.store_id AND status = 'approved')
  WHERE id = NEW.store_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_rating_trigger ON public.store_reviews;
CREATE TRIGGER update_rating_trigger
  AFTER INSERT OR UPDATE ON public.store_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_store_rating();

-- ============================================
-- COUNTER RPCs
-- ============================================
CREATE OR REPLACE FUNCTION public.increment_store_counter(p_store_id uuid, p_counter_type text)
RETURNS void AS $$
BEGIN
  IF p_counter_type = 'view' THEN
    UPDATE public.stores SET view_count = view_count + 1 WHERE id = p_store_id;
  ELSIF p_counter_type = 'whatsapp' THEN
    UPDATE public.stores SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = p_store_id;
  ELSIF p_counter_type = 'phone' THEN
    UPDATE public.stores SET phone_clicks = phone_clicks + 1 WHERE id = p_store_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_item_counter(p_item_id uuid, p_counter_type text)
RETURNS void AS $$
BEGIN
  IF p_counter_type = 'view' THEN
    UPDATE public.items SET view_count = view_count + 1 WHERE id = p_item_id;
  ELSIF p_counter_type = 'whatsapp' THEN
    UPDATE public.items SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = p_item_id;
  ELSIF p_counter_type = 'phone' THEN
    UPDATE public.items SET phone_clicks = phone_clicks + 1 WHERE id = p_item_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_service_counter(p_service_id uuid, p_counter_type text)
RETURNS void AS $$
BEGIN
  IF p_counter_type = 'view' THEN
    UPDATE public.repair_services SET view_count = view_count + 1 WHERE id = p_service_id;
  ELSIF p_counter_type = 'whatsapp' THEN
    UPDATE public.repair_services SET whatsapp_clicks = whatsapp_clicks + 1 WHERE id = p_service_id;
  ELSIF p_counter_type = 'phone' THEN
    UPDATE public.repair_services SET phone_clicks = phone_clicks + 1 WHERE id = p_service_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_stores_user ON public.stores(user_id);
CREATE INDEX IF NOT EXISTS idx_stores_status ON public.stores(status);
CREATE INDEX IF NOT EXISTS idx_stores_type ON public.stores(store_type);
CREATE INDEX IF NOT EXISTS idx_stores_city ON public.stores(city_id);
CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);
CREATE INDEX IF NOT EXISTS idx_store_images_store ON public.store_images(store_id);
CREATE INDEX IF NOT EXISTS idx_items_store ON public.items(store_id);
CREATE INDEX IF NOT EXISTS idx_items_type ON public.items(item_type);
CREATE INDEX IF NOT EXISTS idx_items_status ON public.items(status);
CREATE INDEX IF NOT EXISTS idx_items_city ON public.items(city_id);
CREATE INDEX IF NOT EXISTS idx_items_slug ON public.items(slug);
CREATE INDEX IF NOT EXISTS idx_item_images_item ON public.item_images(item_id);
CREATE INDEX IF NOT EXISTS idx_repair_services_store ON public.repair_services(store_id);
CREATE INDEX IF NOT EXISTS idx_repair_services_status ON public.repair_services(status);
CREATE INDEX IF NOT EXISTS idx_repair_services_city ON public.repair_services(city_id);
CREATE INDEX IF NOT EXISTS idx_store_reviews_store ON public.store_reviews(store_id);
CREATE INDEX IF NOT EXISTS idx_store_reviews_status ON public.store_reviews(status);

-- ============================================
-- LINK profiles.store_id TO stores
-- ============================================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'profiles_store_id_fkey' AND table_name = 'profiles') THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_store_id_fkey
      FOREIGN KEY (store_id) REFERENCES public.stores(id) ON DELETE SET NULL;
  END IF;
END $$;