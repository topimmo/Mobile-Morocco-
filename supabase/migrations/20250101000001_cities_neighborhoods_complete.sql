-- Cities and Neighborhoods Complete Migration
-- Morocco-wide cities including Sahara + Dynamic neighborhoods

-- Drop existing tables for clean migration
DROP TABLE IF EXISTS neighborhoods CASCADE;

-- Ensure cities table has correct structure
ALTER TABLE cities ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS region_fr TEXT;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS region_ar TEXT;
ALTER TABLE cities ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create indexes on cities if not exist
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);
CREATE INDEX IF NOT EXISTS idx_cities_is_active ON cities(is_active);
CREATE INDEX IF NOT EXISTS idx_cities_sort_order ON cities(sort_order);

-- Neighborhoods Table with dynamic add support
CREATE TABLE IF NOT EXISTS neighborhoods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id UUID NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(city_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_neighborhoods_city ON neighborhoods(city_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_city_slug ON neighborhoods(city_id, slug);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_verified ON neighborhoods(is_verified);

-- Delete existing cities to repopulate with complete list
DELETE FROM cities;

-- Insert ALL Moroccan cities including Sahara regions
INSERT INTO cities (name_fr, name_ar, slug, region_fr, region_ar, sort_order) VALUES
  -- Casablanca-Settat Region
  ('Casablanca', 'الدار البيضاء', 'casablanca', 'Casablanca-Settat', 'الدار البيضاء-سطات', 1),
  ('Mohammedia', 'المحمدية', 'mohammedia', 'Casablanca-Settat', 'الدار البيضاء-سطات', 2),
  ('El Jadida', 'الجديدة', 'el-jadida', 'Casablanca-Settat', 'الدار البيضاء-سطات', 3),
  ('Settat', 'سطات', 'settat', 'Casablanca-Settat', 'الدار البيضاء-سطات', 4),
  ('Berrechid', 'برشيد', 'berrechid', 'Casablanca-Settat', 'الدار البيضاء-سطات', 5),
  ('Azemmour', 'أزمور', 'azemmour', 'Casablanca-Settat', 'الدار البيضاء-سطات', 6),
  ('Mediouna', 'مديونة', 'mediouna', 'Casablanca-Settat', 'الدار البيضاء-سطات', 7),
  ('Nouaceur', 'النواصر', 'nouaceur', 'Casablanca-Settat', 'الدار البيضاء-سطات', 8),
  ('Ben Slimane', 'بن سليمان', 'ben-slimane', 'Casablanca-Settat', 'الدار البيضاء-سطات', 9),

  -- Rabat-Salé-Kénitra Region
  ('Rabat', 'الرباط', 'rabat', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 10),
  ('Salé', 'سلا', 'sale', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 11),
  ('Kénitra', 'القنيطرة', 'kenitra', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 12),
  ('Témara', 'تمارة', 'temara', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 13),
  ('Skhirat', 'الصخيرات', 'skhirat', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 14),
  ('Sidi Kacem', 'سيدي قاسم', 'sidi-kacem', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 15),
  ('Sidi Slimane', 'سيدي سليمان', 'sidi-slimane', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 16),
  ('Mehdya', 'المهدية', 'mehdya', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 17),

  -- Marrakech-Safi Region
  ('Marrakech', 'مراكش', 'marrakech', 'Marrakech-Safi', 'مراكش-آسفي', 18),
  ('Safi', 'آسفي', 'safi', 'Marrakech-Safi', 'مراكش-آسفي', 19),
  ('Essaouira', 'الصويرة', 'essaouira', 'Marrakech-Safi', 'مراكش-آسفي', 20),
  ('El Kelaâ des Sraghna', 'قلعة السراغنة', 'el-kelaa-sraghna', 'Marrakech-Safi', 'مراكش-آسفي', 21),
  ('Chichaoua', 'شيشاوة', 'chichaoua', 'Marrakech-Safi', 'مراكش-آسفي', 22),
  ('Rhamna', 'الرحامنة', 'rhamna', 'Marrakech-Safi', 'مراكش-آسفي', 23),
  ('Youssoufia', 'اليوسفية', 'youssoufia', 'Marrakech-Safi', 'مراكش-آسفي', 24),

  -- Fès-Meknès Region
  ('Fès', 'فاس', 'fes', 'Fès-Meknès', 'فاس-مكناس', 25),
  ('Meknès', 'مكناس', 'meknes', 'Fès-Meknès', 'فاس-مكناس', 26),
  ('Taza', 'تازة', 'taza', 'Fès-Meknès', 'فاس-مكناس', 27),
  ('Ifrane', 'إفران', 'ifrane', 'Fès-Meknès', 'فاس-مكناس', 28),
  ('Azrou', 'أزرو', 'azrou', 'Fès-Meknès', 'فاس-مكناس', 29),
  ('Sefrou', 'صفرو', 'sefrou', 'Fès-Meknès', 'فاس-مكناس', 30),
  ('Moulay Yacoub', 'مولاي يعقوب', 'moulay-yacoub', 'Fès-Meknès', 'فاس-مكناس', 31),
  ('El Hajeb', 'الحاجب', 'el-hajeb', 'Fès-Meknès', 'فاس-مكناس', 32),
  ('Taounate', 'تاونات', 'taounate', 'Fès-Meknès', 'فاس-مكناس', 33),
  ('Boulemane', 'بولمان', 'boulemane', 'Fès-Meknès', 'فاس-مكناس', 34),

  -- Tanger-Tétouan-Al Hoceïma Region
  ('Tanger', 'طنجة', 'tanger', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 35),
  ('Tétouan', 'تطوان', 'tetouan', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 36),
  ('Al Hoceïma', 'الحسيمة', 'al-hoceima', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 37),
  ('Larache', 'العرائش', 'larache', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 38),
  ('Asilah', 'أصيلة', 'asilah', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 39),
  ('Chefchaouen', 'شفشاون', 'chefchaouen', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 40),
  ('Ouazzane', 'وزان', 'ouazzane', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 41),
  ('Fahs-Anjra', 'فحص أنجرة', 'fahs-anjra', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 42),
  ('M''diq-Fnideq', 'المضيق-الفنيدق', 'mdiq-fnideq', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 43),

  -- Oriental Region
  ('Oujda', 'وجدة', 'oujda', 'Oriental', 'الشرق', 44),
  ('Nador', 'الناظور', 'nador', 'Oriental', 'الشرق', 45),
  ('Berkane', 'بركان', 'berkane', 'Oriental', 'الشرق', 46),
  ('Taourirt', 'تاوريرت', 'taourirt', 'Oriental', 'الشرق', 47),
  ('Jerada', 'جرادة', 'jerada', 'Oriental', 'الشرق', 48),
  ('Figuig', 'فكيك', 'figuig', 'Oriental', 'الشرق', 49),
  ('Guercif', 'جرسيف', 'guercif', 'Oriental', 'الشرق', 50),
  ('Driouch', 'الدريوش', 'driouch', 'Oriental', 'الشرق', 51),
  ('Saïdia', 'السعيدية', 'saidia', 'Oriental', 'الشرق', 52),

  -- Souss-Massa Region
  ('Agadir', 'أكادير', 'agadir', 'Souss-Massa', 'سوس-ماسة', 53),
  ('Inezgane', 'إنزكان', 'inezgane', 'Souss-Massa', 'سوس-ماسة', 54),
  ('Ait Melloul', 'أيت ملول', 'ait-melloul', 'Souss-Massa', 'سوس-ماسة', 55),
  ('Taroudant', 'تارودانت', 'taroudant', 'Souss-Massa', 'سوس-ماسة', 56),
  ('Tiznit', 'تيزنيت', 'tiznit', 'Souss-Massa', 'سوس-ماسة', 57),
  ('Chtouka Ait Baha', 'شتوكة أيت باها', 'chtouka-ait-baha', 'Souss-Massa', 'سوس-ماسة', 58),
  ('Ouled Teima', 'أولاد تايمة', 'ouled-teima', 'Souss-Massa', 'سوس-ماسة', 59),
  ('Biougra', 'بيوكرى', 'biougra', 'Souss-Massa', 'سوس-ماسة', 60),
  ('Aglou', 'أغلو', 'aglou', 'Souss-Massa', 'سوس-ماسة', 61),

  -- Béni Mellal-Khénifra Region
  ('Béni Mellal', 'بني ملال', 'beni-mellal', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 62),
  ('Khouribga', 'خريبكة', 'khouribga', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 63),
  ('Khénifra', 'خنيفرة', 'khenifra', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 64),
  ('Fquih Ben Salah', 'الفقيه بن صالح', 'fquih-ben-salah', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 65),
  ('Azilal', 'أزيلال', 'azilal', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 66),
  ('Kasba Tadla', 'قصبة تادلة', 'kasba-tadla', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 67),
  ('Oued Zem', 'وادي زم', 'oued-zem', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 68),

  -- Drâa-Tafilalet Region
  ('Errachidia', 'الراشيدية', 'errachidia', 'Drâa-Tafilalet', 'درعة-تافيلالت', 69),
  ('Ouarzazate', 'ورزازات', 'ouarzazate', 'Drâa-Tafilalet', 'درعة-تافيلالت', 70),
  ('Tinghir', 'تنغير', 'tinghir', 'Drâa-Tafilalet', 'درعة-تافيلالت', 71),
  ('Zagora', 'زاكورة', 'zagora', 'Drâa-Tafilalet', 'درعة-تافيلالت', 72),
  ('Midelt', 'ميدلت', 'midelt', 'Drâa-Tafilalet', 'درعة-تافيلالت', 73),
  ('Merzouga', 'مرزوكة', 'merzouga', 'Drâa-Tafilalet', 'درعة-تافيلالت', 74),
  ('Rissani', 'الريصاني', 'rissani', 'Drâa-Tafilalet', 'درعة-تافيلالت', 75),
  ('Erfoud', 'أرفود', 'erfoud', 'Drâa-Tafilalet', 'درعة-تافيلالت', 76),

  -- Guelmim-Oued Noun Region
  ('Guelmim', 'كلميم', 'guelmim', 'Guelmim-Oued Noun', 'كلميم-واد نون', 77),
  ('Tan-Tan', 'طانطان', 'tan-tan', 'Guelmim-Oued Noun', 'كلميم-واد نون', 78),
  ('Sidi Ifni', 'سيدي إفني', 'sidi-ifni', 'Guelmim-Oued Noun', 'كلميم-واد نون', 79),
  ('Assa-Zag', 'آسا-الزاك', 'assa-zag', 'Guelmim-Oued Noun', 'كلميم-واد نون', 80),

  -- LAÂYOUNE-SAKIA EL HAMRA REGION (SAHARA)
  ('Laâyoune', 'العيون', 'laayoune', 'Laâyoune-Sakia El Hamra', 'العيون-الساقية الحمراء', 81),
  ('Boujdour', 'بوجدور', 'boujdour', 'Laâyoune-Sakia El Hamra', 'العيون-الساقية الحمراء', 82),
  ('Tarfaya', 'طرفاية', 'tarfaya', 'Laâyoune-Sakia El Hamra', 'العيون-الساقية الحمراء', 83),
  ('Es-Semara', 'السمارة', 'es-semara', 'Laâyoune-Sakia El Hamra', 'العيون-الساقية الحمراء', 84),

  -- DAKHLA-OUED ED-DAHAB REGION (SAHARA)
  ('Dakhla', 'الداخلة', 'dakhla', 'Dakhla-Oued Ed-Dahab', 'الداخلة-وادي الذهب', 85),
  ('Aousserd', 'أوسرد', 'aousserd', 'Dakhla-Oued Ed-Dahab', 'الداخلة-وادي الذهب', 86),
  ('Bir Gandouz', 'بئر كندوز', 'bir-gandouz', 'Dakhla-Oued Ed-Dahab', 'الداخلة-وادي الذهب', 87),

  -- Additional Cities
  ('Ksar El Kebir', 'القصر الكبير', 'ksar-el-kebir', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 88),
  ('Khemisset', 'الخميسات', 'khemisset', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 89),
  ('Ouezzane', 'وزان', 'ouezzane', 'Tanger-Tétouan-Al Hoceïma', 'طنجة-تطوان-الحسيمة', 90),
  ('Moulay Idriss Zerhoun', 'مولاي إدريس زرهون', 'moulay-idriss-zerhoun', 'Fès-Meknès', 'فاس-مكناس', 91),
  ('Demnate', 'دمنات', 'demnate', 'Béni Mellal-Khénifra', 'بني ملال-خنيفرة', 92),
  ('Imouzzer Kandar', 'إموزار كندر', 'imouzzer-kandar', 'Fès-Meknès', 'فاس-مكناس', 93),
  ('Had Soualem', 'الحد السوالم', 'had-soualem', 'Casablanca-Settat', 'الدار البيضاء-سطات', 94),
  ('Bouznika', 'بوزنيقة', 'bouznika', 'Casablanca-Settat', 'الدار البيضاء-سطات', 95),
  ('Tiflet', 'تيفلت', 'tiflet', 'Rabat-Salé-Kénitra', 'الرباط-سلا-القنيطرة', 96)
ON CONFLICT (slug) DO UPDATE SET
  name_fr = EXCLUDED.name_fr,
  name_ar = EXCLUDED.name_ar,
  region_fr = EXCLUDED.region_fr,
  region_ar = EXCLUDED.region_ar,
  sort_order = EXCLUDED.sort_order;

-- Enable RLS on neighborhoods
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cities (public read)
DROP POLICY IF EXISTS "Cities are public" ON cities;
CREATE POLICY "Cities are public" ON cities
  FOR SELECT USING (is_active = true);

-- RLS Policies for neighborhoods
DROP POLICY IF EXISTS "Neighborhoods are public" ON neighborhoods;
CREATE POLICY "Neighborhoods are public" ON neighborhoods
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert neighborhoods" ON neighborhoods;
CREATE POLICY "Authenticated users can insert neighborhoods" ON neighborhoods
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Function to sanitize and create neighborhood slug
CREATE OR REPLACE FUNCTION sanitize_neighborhood_name(name_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(TRIM(REGEXP_REPLACE(REGEXP_REPLACE(name_input, '\s+', ' ', 'g'), '[^a-zA-Z0-9\u0600-\u06FF\s\-]', '', 'g')));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION generate_neighborhood_slug(name_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(REGEXP_REPLACE(TRIM(REGEXP_REPLACE(name_input, '\s+', '-', 'g')), '[^a-zA-Z0-9\u0600-\u06FF\-]', '', 'g'));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to add or get neighborhood
CREATE OR REPLACE FUNCTION add_or_get_neighborhood(
  p_city_id UUID,
  p_name TEXT,
  p_user_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_slug TEXT;
  v_sanitized_name TEXT;
  v_neighborhood_id UUID;
BEGIN
  v_sanitized_name := sanitize_neighborhood_name(p_name);
  v_slug := generate_neighborhood_slug(p_name);
  
  SELECT id INTO v_neighborhood_id
  FROM neighborhoods
  WHERE city_id = p_city_id AND slug = v_slug;
  
  IF v_neighborhood_id IS NULL THEN
    INSERT INTO neighborhoods (city_id, name, slug, is_verified, created_by)
    VALUES (p_city_id, v_sanitized_name, v_slug, false, p_user_id)
    ON CONFLICT (city_id, slug) DO UPDATE SET name = EXCLUDED.name
    RETURNING id INTO v_neighborhood_id;
  END IF;
  
  RETURN v_neighborhood_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
