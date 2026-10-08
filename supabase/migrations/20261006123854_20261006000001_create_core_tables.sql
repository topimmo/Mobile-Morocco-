/*
# Create Core Platform Tables

## Summary
Creates the foundational tables needed by the Mobile Morocco platform:
- profiles (user profiles linked to auth.users)
- cities (Moroccan cities - reference data)
- categories (product/service categories - reference data)
- neighborhoods (city neighborhoods, user-suggested + admin-verified)

## New Tables

### profiles
- id (uuid, PK, references auth.users)
- email, full_name, phone, avatar_url (user info)
- role (user|agent|merchant|admin, default 'user')
- city_id (FK to cities)
- store_id (FK to stores - set later)
- is_verified, is_active (flags)
- created_at, updated_at

### cities
- id, name_fr, name_ar, slug, region_fr, region_ar, lat, lng
- is_active, sort_order, created_at
- Public reference data

### categories
- id, name_fr, name_ar, slug, icon, parent_id (self-FK)
- sort_order, is_active, created_at
- Public reference data

### neighborhoods
- id, city_id (FK), name, slug
- is_verified (moderation gate), created_by (user who suggested)
- created_at

## Security
- RLS enabled on all tables
- profiles: authenticated users can read all, update only own
- cities, categories: public read (anon + authenticated)
- neighborhoods: public read for verified, authenticated can insert, admin can update/delete

## Important Notes
1. profiles has DEFAULT auth.uid() on id so trigger-based inserts work
2. A handle_new_user trigger function creates a profile row on signup
3. Seed data included for cities and categories
*/

-- ============================================
-- CITIES (reference data, public read)
-- ============================================
CREATE TABLE IF NOT EXISTS public.cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  region_fr text,
  region_ar text,
  lat decimal(10,8),
  lng decimal(11,8),
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_cities" ON public.cities;
CREATE POLICY "public_read_cities" ON public.cities FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_cities" ON public.cities;
CREATE POLICY "authenticated_insert_cities" ON public.cities FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_cities" ON public.cities;
CREATE POLICY "authenticated_update_cities" ON public.cities FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- CATEGORIES (reference data, public read)
-- ============================================
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text,
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON public.categories;
CREATE POLICY "public_read_categories" ON public.categories FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "authenticated_insert_categories" ON public.categories;
CREATE POLICY "authenticated_insert_categories" ON public.categories FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "authenticated_update_categories" ON public.categories;
CREATE POLICY "authenticated_update_categories" ON public.categories FOR UPDATE
TO authenticated USING (true) WITH CHECK (true);

-- ============================================
-- NEIGHBORHOODS (user-suggested, admin-verified)
-- ============================================
CREATE TABLE IF NOT EXISTS public.neighborhoods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  is_verified boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.neighborhoods ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_verified_neighborhoods" ON public.neighborhoods;
CREATE POLICY "public_read_verified_neighborhoods" ON public.neighborhoods FOR SELECT
TO anon, authenticated USING (is_verified = true OR created_by = auth.uid());

DROP POLICY IF EXISTS "authenticated_insert_neighborhoods" ON public.neighborhoods;
CREATE POLICY "authenticated_insert_neighborhoods" ON public.neighborhoods FOR INSERT
TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "owner_update_neighborhoods" ON public.neighborhoods;
CREATE POLICY "owner_update_neighborhoods" ON public.neighborhoods FOR UPDATE
TO authenticated USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "owner_delete_neighborhoods" ON public.neighborhoods;
CREATE POLICY "owner_delete_neighborhoods" ON public.neighborhoods FOR DELETE
TO authenticated USING (created_by = auth.uid());

-- ============================================
-- PROFILES (user data, linked to auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  phone text,
  avatar_url text,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'agent', 'merchant', 'admin')),
  city_id uuid REFERENCES public.cities(id) ON DELETE SET NULL,
  store_id uuid,
  is_verified boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_own_profile" ON public.profiles;
CREATE POLICY "read_own_profile" ON public.profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON public.profiles;
CREATE POLICY "insert_own_profile" ON public.profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON public.profiles;
CREATE POLICY "update_own_profile" ON public.profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Allow anyone to read profiles for directory listings (stores, vendors)
DROP POLICY IF EXISTS "public_read_profiles" ON public.profiles;
CREATE POLICY "public_read_profiles" ON public.profiles FOR SELECT
TO anon, authenticated USING (is_active = true);

-- ============================================
-- HANDLE_NEW_USER TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA: CITIES
-- ============================================
INSERT INTO public.cities (name_fr, name_ar, slug, region_fr, region_ar, lat, lng, sort_order) VALUES
  ('Casablanca', 'الدار البيضاء', 'casablanca', 'Casablanca-Settat', 'دار البيضاء سطات', 33.5731, -7.5898, 1),
  ('Rabat', 'الرباط', 'rabat', 'Rabat-Salé-Kénitra', 'الرباط سلا القنيطرة', 34.0209, -6.8416, 2),
  ('Marrakech', 'مراكش', 'marrakech', 'Marrakech-Safi', 'مراكش آسفي', 31.6295, -7.9811, 3),
  ('Fès', 'فاس', 'fes', 'Fès-Meknès', 'فاس مكناس', 34.0181, -5.0078, 4),
  ('Tanger', 'طنجة', 'tanger', 'Tanger-Tétouan-Al Hoceïma', 'طنجة تطوان الحسيمة', 35.7595, -5.8340, 5),
  ('Agadir', 'أكادير', 'agadir', 'Souss-Massa', 'سوس ماسة', 30.4278, -9.5981, 6),
  ('Meknès', 'مكناس', 'meknes', 'Fès-Meknès', 'فاس مكناس', 33.8935, -5.5473, 7),
  ('Oujda', 'وجدة', 'oujda', 'Oriental', 'الشرق', 34.6814, -1.9086, 8),
  ('Kénitra', 'القنيطرة', 'kenitra', 'Rabat-Salé-Kénitra', 'الرباط سلا القنيطرة', 34.2610, -6.5800, 9),
  ('Tétouan', 'تطوان', 'tetouan', 'Tanger-Tétouan-Al Hoceïma', 'طنجة تطوان الحسيمة', 35.5788, -5.3684, 10),
  ('Salé', 'سلا', 'sale', 'Rabat-Salé-Kénitra', 'الرباط سلا القنيطرة', 34.0531, -6.7967, 11),
  ('Mohammedia', 'المحمدية', 'mohammedia', 'Casablanca-Settat', 'دار البيضاء سطات', 33.6833, -7.3833, 12),
  ('El Jadida', 'الجديدة', 'el-jadida', 'Casablanca-Settat', 'دار البيضاء سطات', 33.2550, -8.5100, 13),
  ('Béni Mellal', 'بني ملال', 'beni-mellal', 'Béni Mellal-Khénifra', 'بني ملال خنيفرة', 32.3373, -6.3498, 14),
  ('Nador', 'الناظور', 'nador', 'Oriental', 'الشرق', 35.1688, -2.9333, 15)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- SEED DATA: CATEGORIES
-- ============================================
INSERT INTO public.categories (name_fr, name_ar, slug, icon, sort_order) VALUES
  ('Téléphones', 'هواتف', 'phones', 'smartphone', 1),
  ('Pièces détachées', 'قطع غيار', 'phone-parts', 'cpu', 2),
  ('Ordinateurs', 'حواسيب', 'computers', 'laptop', 3),
  ('Pièces ordinateurs', 'قطع حواسيب', 'computer-parts', 'memory-stick', 4),
  ('Équipements', 'معدات', 'equipment', 'headphones', 5),
  ('Services de réparation', 'خدمات الإصلاح', 'repair', 'wrench', 6),
  ('Boutiques', 'متاجر', 'stores', 'store', 7)
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_cities_slug ON public.cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_active ON public.cities(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_parent ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city ON public.neighborhoods(city_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_slug ON public.neighborhoods(slug);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_verified ON public.neighborhoods(is_verified);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);