-- Mobile Morocco Production Seed Data
-- Realistic marketplace data for demo and testing
-- This migration adds realistic Moroccan marketplace data

-- First, DELETE all existing categories and listings for clean insert
DELETE FROM listing_images;
DELETE FROM shop_images;
DELETE FROM listings;
DELETE FROM repair_shops;
DELETE FROM categories;

-- Now insert categories with fixed UUIDs
INSERT INTO categories (id, name_fr, name_ar, slug, icon, sort_order, is_active) VALUES
  ('11111111-1111-1111-1111-111111111101', 'Téléphones', 'الهواتف', 'telephones', 'smartphone', 1, true),
  ('11111111-1111-1111-1111-111111111102', 'Accessoires', 'الإكسسوارات', 'accessoires', 'headphones', 2, true),
  ('11111111-1111-1111-1111-111111111103', 'Pièces détachées', 'قطع الغيار', 'pieces-detachees', 'settings', 3, true),
  ('11111111-1111-1111-1111-111111111104', 'Équipement de réparation', 'معدات الإصلاح', 'equipement-reparation', 'wrench', 4, true),
  ('11111111-1111-1111-1111-111111111105', 'Téléphones neufs', 'هواتف جديدة', 'telephones-neufs', 'smartphone', 5, true),
  ('11111111-1111-1111-1111-111111111106', 'Téléphones d''occasion', 'هواتف مستعملة', 'telephones-occasion', 'smartphone', 6, true);

-- First, temporarily disable foreign key checks by altering the tables
-- We need to allow NULL user_id for seed data

-- Alter listings table to allow NULL user_id temporarily
ALTER TABLE listings ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE repair_shops ALTER COLUMN user_id DROP NOT NULL;

-- Create sample user IDs for listings (these will be referenced)
-- Using fixed UUIDs for demo purposes
DO $$
DECLARE
  casablanca_id UUID;
  rabat_id UUID;
  marrakech_id UUID;
  tanger_id UUID;
  agadir_id UUID;
  fes_id UUID;
  meknes_id UUID;
  oujda_id UUID;
  laayoune_id UUID;
  dakhla_id UUID;
  kenitra_id UUID;
  tetouan_id UUID;
  
  cat_phones UUID := '11111111-1111-1111-1111-111111111101';
  cat_accessories UUID := '11111111-1111-1111-1111-111111111102';
  cat_parts UUID := '11111111-1111-1111-1111-111111111103';
  cat_equipment UUID := '11111111-1111-1111-1111-111111111104';
  cat_new_phones UUID := '11111111-1111-1111-1111-111111111105';
  cat_used_phones UUID := '11111111-1111-1111-1111-111111111106';
  
  neighborhood1_id UUID;
  neighborhood2_id UUID;
  neighborhood3_id UUID;
  neighborhood4_id UUID;
  neighborhood5_id UUID;
  
  listing_id UUID;
  shop_id UUID;
BEGIN
  -- Get city IDs
  SELECT id INTO casablanca_id FROM cities WHERE slug = 'casablanca' LIMIT 1;
  SELECT id INTO rabat_id FROM cities WHERE slug = 'rabat' LIMIT 1;
  SELECT id INTO marrakech_id FROM cities WHERE slug = 'marrakech' LIMIT 1;
  SELECT id INTO tanger_id FROM cities WHERE slug = 'tanger' LIMIT 1;
  SELECT id INTO agadir_id FROM cities WHERE slug = 'agadir' LIMIT 1;
  SELECT id INTO fes_id FROM cities WHERE slug = 'fes' LIMIT 1;
  SELECT id INTO meknes_id FROM cities WHERE slug = 'meknes' LIMIT 1;
  SELECT id INTO oujda_id FROM cities WHERE slug = 'oujda' LIMIT 1;
  SELECT id INTO laayoune_id FROM cities WHERE slug = 'laayoune' LIMIT 1;
  SELECT id INTO dakhla_id FROM cities WHERE slug = 'dakhla' LIMIT 1;
  SELECT id INTO kenitra_id FROM cities WHERE slug = 'kenitra' LIMIT 1;
  SELECT id INTO tetouan_id FROM cities WHERE slug = 'tetouan' LIMIT 1;

  -- Insert sample neighborhoods (use existing schema columns)
  -- First check if is_verified exists, otherwise just delete and insert
  DELETE FROM neighborhoods n WHERE n.city_id IN (casablanca_id, rabat_id, marrakech_id, tanger_id, agadir_id, fes_id, laayoune_id, dakhla_id);
  
  INSERT INTO neighborhoods (id, city_id, name, slug, is_verified) VALUES
    (gen_random_uuid(), casablanca_id, 'المعاريف / Maarif', 'maarif', true),
    (gen_random_uuid(), casablanca_id, 'أنفا / Anfa', 'anfa', true),
    (gen_random_uuid(), casablanca_id, 'عين الذياب / Ain Diab', 'ain-diab', true),
    (gen_random_uuid(), casablanca_id, 'درب السلطان / Derb Sultan', 'derb-sultan', true),
    (gen_random_uuid(), casablanca_id, 'حي الحسني / Hay Hassani', 'hay-hassani', true),
    (gen_random_uuid(), rabat_id, 'أكدال / Agdal', 'agdal', true),
    (gen_random_uuid(), rabat_id, 'حسان / Hassan', 'hassan', true),
    (gen_random_uuid(), rabat_id, 'السويسي / Souissi', 'souissi', true),
    (gen_random_uuid(), marrakech_id, 'جليز / Gueliz', 'gueliz', true),
    (gen_random_uuid(), marrakech_id, 'المدينة / Medina', 'medina', true),
    (gen_random_uuid(), marrakech_id, 'الحيفرناج / Hivernage', 'hivernage', true),
    (gen_random_uuid(), tanger_id, 'وسط المدينة / Centre Ville', 'centre-ville', true),
    (gen_random_uuid(), tanger_id, 'ملاباطا / Malabata', 'malabata', true),
    (gen_random_uuid(), agadir_id, 'تالبرجت / Talborjt', 'talborjt', true),
    (gen_random_uuid(), agadir_id, 'حي المحمدي / Hay Mohammadi', 'hay-mohammadi', true),
    (gen_random_uuid(), fes_id, 'المدينة الجديدة / Ville Nouvelle', 'ville-nouvelle', true),
    (gen_random_uuid(), fes_id, 'فاس البالي / Fes El Bali', 'fes-el-bali', true),
    (gen_random_uuid(), laayoune_id, 'المسيرة / El Massira', 'el-massira', true),
    (gen_random_uuid(), dakhla_id, 'المركز / Centre', 'centre', true)
  ON CONFLICT (city_id, slug) DO UPDATE SET
    name = EXCLUDED.name,
    is_verified = EXCLUDED.is_verified;

  -- Get neighborhood IDs for use in listings
  SELECT id INTO neighborhood1_id FROM neighborhoods WHERE slug = 'maarif' AND city_id = casablanca_id LIMIT 1;
  SELECT id INTO neighborhood2_id FROM neighborhoods WHERE slug = 'agdal' AND city_id = rabat_id LIMIT 1;
  SELECT id INTO neighborhood3_id FROM neighborhoods WHERE slug = 'gueliz' AND city_id = marrakech_id LIMIT 1;
  SELECT id INTO neighborhood4_id FROM neighborhoods WHERE slug = 'centre-ville' AND city_id = tanger_id LIMIT 1;
  SELECT id INTO neighborhood5_id FROM neighborhoods WHERE slug = 'talborjt' AND city_id = agadir_id LIMIT 1;

  -- ============================================
  -- INSERT LISTINGS (30+ products)
  -- user_id is NULL for seed data (allowed by our ALTER)
  -- ============================================
  
  -- Listing 1: iPhone 15 Pro Max - Casablanca
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'iPhone 15 Pro Max 256GB Titanium Noir', 'آيفون 15 برو ماكس 256 جيجابايت تيتانيوم أسود', 'iphone-15-pro-max-256gb-noir', 
    'iPhone 15 Pro Max neuf, encore sous garantie Apple. Livré avec tous les accessoires originaux. Possibilité de livraison à Casablanca.',
    'آيفون 15 برو ماكس جديد، لا يزال تحت ضمان أبل. يتم تسليمه مع جميع الملحقات الأصلية. إمكانية التوصيل في الدار البيضاء.',
    16500, 'MAD', cat_new_phones, casablanca_id, neighborhood1_id, 'new', 'Apple', 'iPhone 15 Pro Max', 'approved', '+212661234567', '+212522334455', true, 245);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', 0),
    (listing_id, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', 1);

  -- Listing 2: Samsung Galaxy S24 Ultra - Rabat
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'Samsung Galaxy S24 Ultra 512GB Noir', 'سامسونج جالكسي S24 ألترا 512 جيجابايت أسود', 'samsung-galaxy-s24-ultra-512gb',
    'Samsung Galaxy S24 Ultra flambant neuf. Double SIM, 512GB de stockage. Caméra 200MP exceptionnelle.',
    'سامسونج جالكسي S24 ألترا جديد تماماً. بطاقتي SIM، سعة تخزين 512 جيجابايت. كاميرا 200 ميجابكسل استثنائية.',
    14800, 'MAD', cat_new_phones, rabat_id, neighborhood2_id, 'new', 'Samsung', 'Galaxy S24 Ultra', 'approved', '+212662345678', '+212537112233', true, 189);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', 0);

  -- Listing 3: iPhone 13 Pro occasion - Marrakech
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'iPhone 13 Pro 128GB Bleu Sierra - Excellent état', 'آيفون 13 برو 128 جيجا أزرق سييرا - حالة ممتازة', 'iphone-13-pro-128gb-bleu-sierra',
    'iPhone 13 Pro en excellent état, batterie à 89%. Aucune rayure, fonctionne parfaitement. Vendu avec chargeur.',
    'آيفون 13 برو في حالة ممتازة، البطارية 89%. لا خدوش، يعمل بشكل مثالي. يباع مع الشاحن.',
    7500, 'MAD', cat_used_phones, marrakech_id, neighborhood3_id, 'used', 'Apple', 'iPhone 13 Pro', 'approved', '+212663456789', '+212524223344', false, 156);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1632661674596-df8be59a8db3?w=800&q=80', 0);

  -- Listing 4: Xiaomi 14 Pro - Tanger
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'Xiaomi 14 Pro 256GB Noir', 'شاومي 14 برو 256 جيجابايت أسود', 'xiaomi-14-pro-256gb',
    'Xiaomi 14 Pro avec Leica Camera. Écran AMOLED 120Hz. Version globale avec toutes les langues.',
    'شاومي 14 برو مع كاميرا لايكا. شاشة AMOLED بمعدل 120 هرتز. النسخة العالمية مع جميع اللغات.',
    8900, 'MAD', cat_new_phones, tanger_id, neighborhood4_id, 'new', 'Xiaomi', '14 Pro', 'approved', '+212664567890', '+212539334455', true, 134);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', 0);

  -- Listing 5: AirPods Pro 2 - Agadir
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'Apple AirPods Pro 2ème génération', 'أبل إيربودز برو الجيل الثاني', 'airpods-pro-2-generation',
    'AirPods Pro 2 neufs avec boîtier MagSafe. Réduction de bruit active exceptionnelle. Garantie Apple.',
    'إيربودز برو 2 جديدة مع علبة MagSafe. عزل الضوضاء الفعال استثنائي. ضمان أبل.',
    2400, 'MAD', cat_accessories, agadir_id, neighborhood5_id, 'new', 'Apple', 'AirPods Pro 2', 'approved', '+212665678901', '+212528445566', false, 98);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80', 0);

  -- Listing 6: Écran iPhone 14 - Fès
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Écran LCD iPhone 14 Original', 'شاشة آيفون 14 LCD أصلية', 'ecran-lcd-iphone-14-original',
    'Écran iPhone 14 original Apple. Qualité OEM, parfait pour les réparations professionnelles.',
    'شاشة آيفون 14 أصلية من أبل. جودة OEM، مثالية للإصلاحات الاحترافية.',
    1200, 'MAD', cat_parts, fes_id, 'new', 'Apple', 'iPhone 14 Screen', 'approved', '+212666789012', '+212535556677', 67);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80', 0);

  -- Listing 7: Station de soudure - Casablanca
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'Station de soudure professionnelle Quick 861DW', 'محطة لحام احترافية Quick 861DW', 'station-soudure-quick-861dw',
    'Station de soudure à air chaud Quick 861DW. Idéale pour les réparations de cartes mères. Température réglable.',
    'محطة لحام بالهواء الساخن Quick 861DW. مثالية لإصلاح اللوحات الأم. درجة حرارة قابلة للتعديل.',
    2800, 'MAD', cat_equipment, casablanca_id, neighborhood1_id, 'new', 'Quick', '861DW', 'approved', '+212667890123', '+212522667788', true, 112);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', 0);

  -- Listing 8: Samsung Galaxy A54 - Oujda
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Samsung Galaxy A54 5G 128GB', 'سامسونج جالكسي A54 5G 128 جيجابايت', 'samsung-galaxy-a54-5g',
    'Galaxy A54 neuf, 5G, 128GB. Excellent rapport qualité-prix. Livraison disponible Oriental.',
    'جالكسي A54 جديد، 5G، 128 جيجابايت. نسبة جودة سعر ممتازة. التوصيل متاح في الشرق.',
    3800, 'MAD', cat_new_phones, oujda_id, 'new', 'Samsung', 'Galaxy A54', 'approved', '+212668901234', '+212536778899', 78);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', 0);

  -- Listing 9: Câble Lightning original - Laâyoune
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Câble Lightning Apple Original 2m', 'كابل لايتنينج أبل أصلي 2 متر', 'cable-lightning-apple-2m',
    'Câble Lightning Apple original 2 mètres. Compatible tous iPhone et iPad. Stock disponible.',
    'كابل لايتنينج أبل أصلي 2 متر. متوافق مع جميع أجهزة آيفون وآيباد. المخزون متوفر.',
    180, 'MAD', cat_accessories, laayoune_id, 'new', 'Apple', 'Lightning Cable', 'approved', '+212669012345', '+212528889900', 45);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', 0);

  -- Listing 10: Batterie iPhone 12 - Dakhla
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Batterie iPhone 12/12 Pro haute capacité', 'بطارية آيفون 12/12 برو سعة عالية', 'batterie-iphone-12-haute-capacite',
    'Batterie de remplacement pour iPhone 12 et 12 Pro. Capacité originale, installation facile.',
    'بطارية بديلة لآيفون 12 و12 برو. السعة الأصلية، تركيب سهل.',
    350, 'MAD', cat_parts, dakhla_id, 'new', 'Compatible', 'iPhone 12 Battery', 'approved', '+212670123456', '+212528990011', 34);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80', 0);

  -- Listing 11: OnePlus 12 - Kenitra
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'OnePlus 12 256GB Flowy Emerald', 'ون بلس 12 256 جيجابايت أخضر زمردي', 'oneplus-12-256gb-emerald',
    'OnePlus 12 avec Hasselblad Camera. Snapdragon 8 Gen 3. Charge 100W ultra-rapide.',
    'ون بلس 12 مع كاميرا Hasselblad. معالج Snapdragon 8 Gen 3. شحن سريع 100 واط.',
    9500, 'MAD', cat_new_phones, kenitra_id, 'new', 'OnePlus', '12', 'approved', '+212671234567', '+212537001122', true, 156);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80', 0);

  -- Listing 12: Coque iPhone 15 - Tétouan
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Coque MagSafe iPhone 15 Pro Max Cuir', 'غلاف MagSafe آيفون 15 برو ماكس جلد', 'coque-magsafe-iphone-15-pro-max',
    'Coque en cuir véritable avec MagSafe. Protection premium pour votre iPhone 15 Pro Max.',
    'غلاف من الجلد الحقيقي مع MagSafe. حماية ممتازة لجهاز آيفون 15 برو ماكس.',
    450, 'MAD', cat_accessories, tetouan_id, 'new', 'Apple', 'Leather Case', 'approved', '+212672345678', '+212539112233', 67);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&q=80', 0);

  -- Listing 13: Google Pixel 8 Pro - Casablanca
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Google Pixel 8 Pro 256GB Obsidian', 'جوجل بكسل 8 برو 256 جيجابايت أسود', 'google-pixel-8-pro-256gb',
    'Pixel 8 Pro avec AI photo. 7 ans de mises à jour. La meilleure caméra Android.',
    'بكسل 8 برو مع AI للصور. 7 سنوات من التحديثات. أفضل كاميرا أندرويد.',
    11500, 'MAD', cat_new_phones, casablanca_id, neighborhood1_id, 'new', 'Google', 'Pixel 8 Pro', 'approved', '+212673456789', '+212522112244', 123);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', 0);

  -- Listing 14: Microscope réparation - Rabat
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'Microscope trinoculaire pour réparation microsoudure', 'مجهر ثلاثي العينيات للحام الدقيق', 'microscope-trinoculaire-reparation',
    'Microscope trinoculaire professionnel avec LED. Grossissement 7X-45X. Idéal pour microsoudure.',
    'مجهر ثلاثي العينيات احترافي مع LED. تكبير 7X-45X. مثالي للحام الدقيق.',
    4500, 'MAD', cat_equipment, rabat_id, neighborhood2_id, 'new', 'AmScope', 'SM-4TZ-144A', 'approved', '+212674567890', '+212537223344', true, 89);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80', 0);

  -- Listing 15: iPhone SE 2022 - Marrakech
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'iPhone SE 2022 64GB Rouge', 'آيفون SE 2022 64 جيجابايت أحمر', 'iphone-se-2022-64gb-rouge',
    'iPhone SE 2022 compact et puissant. Puce A15 Bionic. Parfait comme premier iPhone.',
    'آيفون SE 2022 صغير وقوي. شريحة A15 Bionic. مثالي كأول آيفون.',
    4200, 'MAD', cat_new_phones, marrakech_id, neighborhood3_id, 'new', 'Apple', 'iPhone SE 2022', 'approved', '+212675678901', '+212524334455', 91);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', 0);

  -- Listing 16: Chargeur Samsung 45W - Tanger
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Chargeur Samsung Super Fast 45W', 'شاحن سامسونج سوبر فاست 45 واط', 'chargeur-samsung-45w',
    'Chargeur rapide Samsung 45W original. Compatible Galaxy S24, S23, Note. Avec câble USB-C.',
    'شاحن سامسونج سريع 45 واط أصلي. متوافق مع Galaxy S24, S23, Note. مع كابل USB-C.',
    380, 'MAD', cat_accessories, tanger_id, neighborhood4_id, 'new', 'Samsung', '45W Charger', 'approved', '+212676789012', '+212539445566', 56);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', 0);

  -- Listing 17: Connecteur de charge iPhone X - Agadir
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Nappe connecteur de charge iPhone X', 'شريط موصل الشحن آيفون X', 'nappe-connecteur-charge-iphone-x',
    'Nappe de charge complète iPhone X avec micro et moteur vibration. Pièce de qualité.',
    'شريط شحن كامل آيفون X مع ميكروفون ومحرك اهتزاز. قطعة عالية الجودة.',
    250, 'MAD', cat_parts, agadir_id, neighborhood5_id, 'new', 'OEM', 'iPhone X Charging Port', 'approved', '+212677890123', '+212528556677', 43);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80', 0);

  -- Listing 18: Redmi Note 13 Pro - Fès
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Xiaomi Redmi Note 13 Pro 256GB', 'شاومي ريدمي نوت 13 برو 256 جيجابايت', 'redmi-note-13-pro-256gb',
    'Redmi Note 13 Pro avec caméra 200MP. AMOLED 120Hz. Le meilleur rapport qualité-prix.',
    'ريدمي نوت 13 برو مع كاميرا 200 ميجابكسل. شاشة AMOLED 120 هرتز. أفضل نسبة جودة سعر.',
    3200, 'MAD', cat_new_phones, fes_id, 'new', 'Xiaomi', 'Redmi Note 13 Pro', 'approved', '+212678901234', '+212535667788', 134);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', 0);

  -- Listing 19: Kit outils réparation pro - Meknès
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Kit complet outils réparation smartphones 80 pièces', 'طقم أدوات إصلاح الهواتف الذكية 80 قطعة', 'kit-outils-reparation-80-pieces',
    'Kit professionnel 80 pièces pour réparation mobile. Tournevis, spatules, ventouses, pinces antistatiques.',
    'طقم احترافي 80 قطعة لإصلاح الهواتف. مفكات، ملاعق، ممصات، ملاقط مضادة للكهرباء الساكنة.',
    650, 'MAD', cat_equipment, meknes_id, 'new', 'iFixit', 'Pro Tech Toolkit', 'approved', '+212679012345', '+212535778899', 78);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', 0);

  -- Listing 20: iPhone 14 occasion - Casablanca
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'iPhone 14 128GB Midnight - Comme neuf', 'آيفون 14 128 جيجا ميدنايت - كالجديد', 'iphone-14-128gb-midnight',
    'iPhone 14 en parfait état. Batterie 95%, aucune rayure. Vendu avec facture et accessoires.',
    'آيفون 14 في حالة ممتازة. البطارية 95%، لا خدوش. يباع مع الفاتورة والملحقات.',
    8200, 'MAD', cat_used_phones, casablanca_id, neighborhood1_id, 'used', 'Apple', 'iPhone 14', 'approved', '+212680123456', '+212522889911', 167);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=800&q=80', 0);

  -- Listing 21: Power Bank 20000mAh - Rabat
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Power Bank Anker 20000mAh charge rapide', 'باور بانك أنكر 20000 ملي أمبير شحن سريع', 'power-bank-anker-20000mah',
    'Power Bank Anker PowerCore 20000. Charge rapide 22.5W. 2 ports USB + 1 USB-C.',
    'باور بانك أنكر PowerCore 20000. شحن سريع 22.5 واط. منفذين USB + USB-C.',
    450, 'MAD', cat_accessories, rabat_id, neighborhood2_id, 'new', 'Anker', 'PowerCore 20000', 'approved', '+212681234567', '+212537990011', 89);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80', 0);

  -- Listing 22: Écran Samsung S23 - Marrakech
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Écran complet Samsung Galaxy S23 AMOLED', 'شاشة كاملة سامسونج جالكسي S23 AMOLED', 'ecran-samsung-s23-amoled',
    'Écran AMOLED Samsung S23 avec châssis. Installation professionnelle possible.',
    'شاشة AMOLED سامسونج S23 مع الإطار. التركيب الاحترافي ممكن.',
    1800, 'MAD', cat_parts, marrakech_id, neighborhood3_id, 'new', 'Samsung', 'Galaxy S23 Screen', 'approved', '+212682345678', '+212524001122', 56);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80', 0);

  -- Listing 23: Samsung Galaxy Z Fold 5 - Casablanca
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'Samsung Galaxy Z Fold 5 512GB Noir', 'سامسونج جالكسي Z فولد 5 512 جيجابايت أسود', 'samsung-galaxy-z-fold-5-512gb',
    'Galaxy Z Fold 5 pliable. Écran intérieur 7.6". État impeccable, peu utilisé.',
    'جالكسي Z فولد 5 قابل للطي. شاشة داخلية 7.6 بوصة. حالة ممتازة، استخدام قليل.',
    18500, 'MAD', cat_new_phones, casablanca_id, neighborhood1_id, 'new', 'Samsung', 'Galaxy Z Fold 5', 'approved', '+212683456789', '+212522112233', true, 234);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', 0);

  -- Listing 24: Écouteurs Sony - Tanger
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Sony WH-1000XM5 Casque antibruit', 'سوني WH-1000XM5 سماعات عزل الضوضاء', 'sony-wh-1000xm5-casque',
    'Sony WH-1000XM5 neuf. Meilleure réduction de bruit. 30h d''autonomie. Bluetooth multipoint.',
    'سوني WH-1000XM5 جديد. أفضل عزل للضوضاء. 30 ساعة بطارية. بلوتوث متعدد النقاط.',
    3200, 'MAD', cat_accessories, tanger_id, neighborhood4_id, 'new', 'Sony', 'WH-1000XM5', 'approved', '+212684567890', '+212539223344', 112);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&q=80', 0);

  -- Listing 25: Nappe Face ID iPhone 13 - Agadir
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Module Face ID iPhone 13 Pro Original', 'وحدة Face ID آيفون 13 برو أصلية', 'module-face-id-iphone-13-pro',
    'Module Face ID Apple original pour iPhone 13/13 Pro. Installation délicate, réservé aux pros.',
    'وحدة Face ID أبل أصلية لآيفون 13/13 برو. تركيب دقيق، مخصص للمحترفين.',
    800, 'MAD', cat_parts, agadir_id, neighborhood5_id, 'new', 'Apple', 'iPhone 13 Face ID', 'approved', '+212685678901', '+212528334455', 34);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80', 0);

  -- Listing 26: Huawei P60 Pro - Fès
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Huawei P60 Pro 256GB Perle', 'هواوي P60 برو 256 جيجابايت لؤلؤي', 'huawei-p60-pro-256gb',
    'Huawei P60 Pro caméra exceptionnelle. Design élégant. Sans services Google mais AppGallery complet.',
    'هواوي P60 برو كاميرا استثنائية. تصميم أنيق. بدون خدمات جوجل لكن AppGallery كامل.',
    9800, 'MAD', cat_new_phones, fes_id, 'new', 'Huawei', 'P60 Pro', 'approved', '+212686789012', '+212535889900', 98);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', 0);

  -- Listing 27: Testeur de batterie - Casablanca
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Testeur de batterie iPhone professionnel', 'جهاز اختبار بطارية آيفون احترافي', 'testeur-batterie-iphone-pro',
    'Testeur de batterie pour tous modèles iPhone. Affiche cycles, capacité, état. Indispensable en atelier.',
    'جهاز اختبار البطارية لجميع موديلات آيفون. يعرض الدورات والسعة والحالة. ضروري في الورشة.',
    550, 'MAD', cat_equipment, casablanca_id, neighborhood1_id, 'new', 'QIANLI', 'iCopy Plus', 'approved', '+212687890123', '+212522445566', 67);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', 0);

  -- Listing 28: Samsung Galaxy S21 occasion - Rabat
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Samsung Galaxy S21 128GB Phantom Gray', 'سامسونج جالكسي S21 128 جيجا رمادي', 'samsung-galaxy-s21-128gb',
    'Galaxy S21 très bon état. Écran parfait, batterie excellente. Mise à jour One UI récente.',
    'جالكسي S21 حالة جيدة جداً. شاشة مثالية، بطارية ممتازة. تحديث One UI حديث.',
    4500, 'MAD', cat_used_phones, rabat_id, neighborhood2_id, 'used', 'Samsung', 'Galaxy S21', 'approved', '+212688901234', '+212537556677', 145);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', 0);

  -- Listing 29: Support réparation - Marrakech
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, view_count)
  VALUES (listing_id, NULL, 'Support de maintien téléphone pour réparation', 'حامل تثبيت الهاتف للإصلاح', 'support-maintien-telephone-reparation',
    'Support universel rotatif pour réparation smartphone. Bras articulé, ventouse forte.',
    'حامل عالمي دوار لإصلاح الهاتف الذكي. ذراع مفصلي، ممصة قوية.',
    320, 'MAD', cat_equipment, marrakech_id, neighborhood3_id, 'new', 'Generic', 'Phone Holder Stand', 'approved', '+212689012345', '+212524112233', 45);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', 0);

  -- Listing 30: Nothing Phone 2 - Casablanca
  listing_id := gen_random_uuid();
  INSERT INTO listings (id, user_id, title_fr, title_ar, slug, description_fr, description_ar, price, currency, category_id, city_id, neighborhood_id, condition, brand, model, status, whatsapp, phone, is_featured, view_count)
  VALUES (listing_id, NULL, 'Nothing Phone 2 256GB Blanc', 'ناثينج فون 2 256 جيجابايت أبيض', 'nothing-phone-2-256gb',
    'Nothing Phone 2 avec Glyph Interface unique. Design transparent iconique. Android stock.',
    'ناثينج فون 2 مع واجهة Glyph الفريدة. تصميم شفاف أيقوني. أندرويد نقي.',
    7800, 'MAD', cat_new_phones, casablanca_id, neighborhood1_id, 'new', 'Nothing', 'Phone 2', 'approved', '+212690123456', '+212522667788', true, 189);
  INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_id, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', 0);

  -- ============================================
  -- INSERT REPAIR SHOPS (15+ shops)
  -- ============================================

  -- Shop 1: Casablanca
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, neighborhood_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'TechFix Pro Casablanca', 'تيك فيكس برو الدار البيضاء', 'techfix-pro-casablanca',
    'Centre de réparation Apple agréé. Réparation iPhone, iPad, MacBook. Service rapide et garantie.',
    'مركز إصلاح أبل معتمد. إصلاح آيفون، آيباد، ماك بوك. خدمة سريعة وضمان.',
    '123 Rue Moulay Youssef, Maarif', '123 شارع مولاي يوسف، المعاريف',
    casablanca_id, neighborhood1_id, '+212522334455', '+212661234567',
    ARRAY['iPhone', 'iPad', 'MacBook', 'Microsoudure', 'Récupération données'],
    '{"lundi": "9h-19h", "mardi": "9h-19h", "mercredi": "9h-19h", "jeudi": "9h-19h", "vendredi": "9h-12h 14h-19h", "samedi": "9h-17h", "dimanche": "Fermé"}'::jsonb,
    'approved', 456);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', true, 0);

  -- Shop 2: Rabat
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, neighborhood_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Mobile Expert Rabat', 'موبايل إكسبرت الرباط', 'mobile-expert-rabat',
    'Réparation tous smartphones Samsung, Xiaomi, Huawei. Déblocage et flash. 10 ans d''expérience.',
    'إصلاح جميع الهواتف الذكية سامسونج، شاومي، هواوي. فك وفلاش. 10 سنوات خبرة.',
    '45 Avenue Mohammed V, Agdal', '45 شارع محمد الخامس، أكدال',
    rabat_id, neighborhood2_id, '+212537112233', '+212662345678',
    ARRAY['Samsung', 'Xiaomi', 'Huawei', 'Déblocage', 'Flash', 'Root'],
    '{"lundi": "9h-18h", "mardi": "9h-18h", "mercredi": "9h-18h", "jeudi": "9h-18h", "vendredi": "9h-12h 14h-18h", "samedi": "9h-16h", "dimanche": "Fermé"}'::jsonb,
    'approved', 312);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1563770660941-10a8b18bf087?w=800&q=80', true, 0);

  -- Shop 3: Marrakech
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, neighborhood_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'iRepair Marrakech', 'آي ريبير مراكش', 'irepair-marrakech',
    'Spécialiste iPhone et iPad. Remplacement écran en 30 min. Pièces originales Apple.',
    'متخصص في آيفون وآيباد. استبدال الشاشة في 30 دقيقة. قطع غيار أبل أصلية.',
    '78 Rue de la Liberté, Gueliz', '78 شارع الحرية، جليز',
    marrakech_id, neighborhood3_id, '+212524223344', '+212663456789',
    ARRAY['iPhone', 'iPad', 'Écrans', 'Batteries', 'Connecteurs'],
    '{"lundi": "9h30-19h30", "mardi": "9h30-19h30", "mercredi": "9h30-19h30", "jeudi": "9h30-19h30", "vendredi": "9h30-12h 15h-19h30", "samedi": "10h-18h", "dimanche": "Fermé"}'::jsonb,
    'approved', 278);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', true, 0);

  -- Shop 4: Tanger
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, neighborhood_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'PhoneLab Tanger', 'فون لاب طنجة', 'phonelab-tanger',
    'Laboratoire de réparation mobile. Microsoudure niveau carte mère. Récupération données.',
    'مختبر إصلاح الموبايل. لحام دقيق على مستوى اللوحة الأم. استعادة البيانات.',
    '34 Boulevard Pasteur, Centre Ville', '34 شارع باستور، وسط المدينة',
    tanger_id, neighborhood4_id, '+212539334455', '+212664567890',
    ARRAY['Microsoudure', 'Récupération données', 'iPhone', 'Samsung', 'Carte mère'],
    '{"lundi": "9h-19h", "mardi": "9h-19h", "mercredi": "9h-19h", "jeudi": "9h-19h", "vendredi": "9h-12h 14h-19h", "samedi": "9h-17h", "dimanche": "Fermé"}'::jsonb,
    'approved', 234);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80', true, 0);

  -- Shop 5: Agadir
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, neighborhood_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Digital Repair Agadir', 'ديجيتال ريبير أكادير', 'digital-repair-agadir',
    'Réparation rapide smartphones et tablettes. Prix compétitifs. Garantie 6 mois.',
    'إصلاح سريع للهواتف الذكية والأجهزة اللوحية. أسعار تنافسية. ضمان 6 أشهر.',
    '12 Avenue Hassan II, Talborjt', '12 شارع الحسن الثاني، تالبرجت',
    agadir_id, neighborhood5_id, '+212528445566', '+212665678901',
    ARRAY['Smartphones', 'Tablettes', 'Écrans', 'Batteries', 'Connecteurs'],
    '{"lundi": "9h-18h30", "mardi": "9h-18h30", "mercredi": "9h-18h30", "jeudi": "9h-18h30", "vendredi": "9h-12h 14h30-18h30", "samedi": "9h-16h", "dimanche": "Fermé"}'::jsonb,
    'approved', 189);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1563770660941-10a8b18bf087?w=800&q=80', true, 0);

  -- Shop 6: Fès
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Fès Mobile Service', 'فاس موبايل سيرفيس', 'fes-mobile-service',
    'Service de réparation mobile à Fès. Toutes marques. Devis gratuit.',
    'خدمة إصلاح الموبايل في فاس. جميع الماركات. تقدير مجاني.',
    '56 Avenue Allal Ben Abdellah, Ville Nouvelle', '56 شارع علال بن عبد الله، المدينة الجديدة',
    fes_id, '+212535556677', '+212666789012',
    ARRAY['Toutes marques', 'Écrans', 'Batteries', 'Software'],
    '{"lundi": "9h-18h", "mardi": "9h-18h", "mercredi": "9h-18h", "jeudi": "9h-18h", "vendredi": "9h-12h 14h-18h", "samedi": "9h-15h", "dimanche": "Fermé"}'::jsonb,
    'approved', 156);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', true, 0);

  -- Shop 7: Oujda
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Oriental Phone Repair', 'أورينتال فون ريبير', 'oriental-phone-repair',
    'Le spécialiste de la réparation mobile dans l''Oriental. Service à domicile disponible.',
    'متخصص إصلاح الموبايل في الشرق. خدمة منزلية متوفرة.',
    '23 Rue Mohamed V, Centre', '23 شارع محمد الخامس، المركز',
    oujda_id, '+212536778899', '+212668901234',
    ARRAY['iPhone', 'Samsung', 'Xiaomi', 'Service domicile'],
    '{"lundi": "9h-18h", "mardi": "9h-18h", "mercredi": "9h-18h", "jeudi": "9h-18h", "vendredi": "9h-12h 14h-18h", "samedi": "9h-14h", "dimanche": "Fermé"}'::jsonb,
    'approved', 123);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1563770660941-10a8b18bf087?w=800&q=80', true, 0);

  -- Shop 8: Meknès
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Meknès Tech Solutions', 'مكناس تيك سولوشنز', 'meknes-tech-solutions',
    'Solutions de réparation mobile et informatique. Formation réparation disponible.',
    'حلول إصلاح الموبايل والكمبيوتر. تدريب على الإصلاح متوفر.',
    '89 Avenue Mohammed V', '89 شارع محمد الخامس',
    meknes_id, '+212535889900', '+212669012345',
    ARRAY['Smartphones', 'Ordinateurs', 'Formation', 'Vente pièces'],
    '{"lundi": "9h-19h", "mardi": "9h-19h", "mercredi": "9h-19h", "jeudi": "9h-19h", "vendredi": "9h-12h 14h-19h", "samedi": "9h-17h", "dimanche": "Fermé"}'::jsonb,
    'approved', 145);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', true, 0);

  -- Shop 9: Laâyoune
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Sahara Mobile Laâyoune', 'صحراء موبايل العيون', 'sahara-mobile-laayoune',
    'Premier centre de réparation mobile à Laâyoune. Service professionnel garanti.',
    'أول مركز لإصلاح الموبايل في العيون. خدمة احترافية مضمونة.',
    '15 Avenue de la Marche Verte', '15 شارع المسيرة الخضراء',
    laayoune_id, '+212528889900', '+212670123456',
    ARRAY['Smartphones', 'Tablettes', 'Écrans', 'Batteries'],
    '{"lundi": "9h-18h", "mardi": "9h-18h", "mercredi": "9h-18h", "jeudi": "9h-18h", "vendredi": "9h-12h 14h-18h", "samedi": "9h-14h", "dimanche": "Fermé"}'::jsonb,
    'approved', 89);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1563770660941-10a8b18bf087?w=800&q=80', true, 0);

  -- Shop 10: Dakhla
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Dakhla Phone Center', 'الداخلة فون سنتر', 'dakhla-phone-center',
    'Centre de réparation et vente de téléphones à Dakhla. Accessoires et pièces détachées.',
    'مركز إصلاح وبيع الهواتف في الداخلة. إكسسوارات وقطع غيار.',
    '8 Boulevard Mohammed V', '8 شارع محمد الخامس',
    dakhla_id, '+212528990011', '+212671234567',
    ARRAY['Vente', 'Réparation', 'Accessoires', 'Pièces détachées'],
    '{"lundi": "9h-18h", "mardi": "9h-18h", "mercredi": "9h-18h", "jeudi": "9h-18h", "vendredi": "9h-12h 14h-18h", "samedi": "9h-13h", "dimanche": "Fermé"}'::jsonb,
    'approved', 67);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', true, 0);

  -- Shop 11: Kenitra
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Quick Fix Kenitra', 'كويك فيكس القنيطرة', 'quick-fix-kenitra',
    'Réparation express en 1 heure. Spécialiste écrans et batteries. Garantie 1 an.',
    'إصلاح سريع في ساعة واحدة. متخصص في الشاشات والبطاريات. ضمان سنة.',
    '67 Avenue Mohammed V', '67 شارع محمد الخامس',
    kenitra_id, '+212537001122', '+212672345678',
    ARRAY['Réparation express', 'Écrans', 'Batteries', 'Garantie 1 an'],
    '{"lundi": "8h30-19h30", "mardi": "8h30-19h30", "mercredi": "8h30-19h30", "jeudi": "8h30-19h30", "vendredi": "8h30-12h 14h-19h30", "samedi": "9h-18h", "dimanche": "Fermé"}'::jsonb,
    'approved', 178);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1563770660941-10a8b18bf087?w=800&q=80', true, 0);

  -- Shop 12: Tétouan
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Tetouan Mobile Center', 'تطوان موبايل سنتر', 'tetouan-mobile-center',
    'Centre multimarque de réparation. Pièces de qualité. Techniciens certifiés.',
    'مركز إصلاح متعدد الماركات. قطع عالية الجودة. تقنيون معتمدون.',
    '45 Avenue Hassan II', '45 شارع الحسن الثاني',
    tetouan_id, '+212539112233', '+212673456789',
    ARRAY['Multimarque', 'iPhone', 'Samsung', 'Huawei', 'Xiaomi'],
    '{"lundi": "9h-19h", "mardi": "9h-19h", "mercredi": "9h-19h", "jeudi": "9h-19h", "vendredi": "9h-12h 14h-19h", "samedi": "9h-17h", "dimanche": "Fermé"}'::jsonb,
    'approved', 134);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', true, 0);

  -- Shop 13: Casablanca - Ain Diab
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'iDoctor Casa', 'آي دكتور كازا', 'idoctor-casa',
    'Le docteur de vos appareils Apple. Certification Apple. Pièces 100% originales.',
    'طبيب أجهزتك من أبل. شهادة أبل. قطع غيار 100% أصلية.',
    '234 Boulevard de la Corniche, Ain Diab', '234 شارع الكورنيش، عين الذياب',
    casablanca_id, '+212522998877', '+212674567890',
    ARRAY['Apple Certified', 'iPhone', 'iPad', 'Mac', 'Apple Watch'],
    '{"lundi": "10h-20h", "mardi": "10h-20h", "mercredi": "10h-20h", "jeudi": "10h-20h", "vendredi": "10h-13h 15h-20h", "samedi": "10h-19h", "dimanche": "Fermé"}'::jsonb,
    'approved', 289);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=800&q=80', true, 0);

  -- Shop 14: Rabat - Hassan
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'SmartRepair Rabat', 'سمارت ريبير الرباط', 'smartrepair-rabat',
    'Réparation intelligente et rapide. Diagnostic gratuit. Livraison possible.',
    'إصلاح ذكي وسريع. تشخيص مجاني. إمكانية التوصيل.',
    '12 Rue Patrice Lumumba, Hassan', '12 شارع باتريس لومومبا، حسان',
    rabat_id, '+212537223344', '+212675678901',
    ARRAY['Diagnostic gratuit', 'Livraison', 'Toutes marques', 'Réparation rapide'],
    '{"lundi": "9h-19h", "mardi": "9h-19h", "mercredi": "9h-19h", "jeudi": "9h-19h", "vendredi": "9h-12h30 14h30-19h", "samedi": "9h-17h", "dimanche": "Fermé"}'::jsonb,
    'approved', 198);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1563770660941-10a8b18bf087?w=800&q=80', true, 0);

  -- Shop 15: Marrakech - Medina
  shop_id := gen_random_uuid();
  INSERT INTO repair_shops (id, user_id, name_fr, name_ar, slug, description_fr, description_ar, address_fr, address_ar, city_id, phone, whatsapp, specialties, working_hours, status, view_count)
  VALUES (shop_id, NULL, 'Médina Phone Repair', 'إصلاح هواتف المدينة', 'medina-phone-repair',
    'Artisan réparateur au cœur de la médina. Tradition et technologie. Prix locaux.',
    'حرفي إصلاح في قلب المدينة القديمة. التقليد والتكنولوجيا. أسعار محلية.',
    '156 Derb Dabachi, Médina', '156 درب الدباشي، المدينة',
    marrakech_id, '+212524445566', '+212676789012',
    ARRAY['Prix locaux', 'Toutes marques', 'Accessoires', 'Déverrouillage'],
    '{"lundi": "9h-18h", "mardi": "9h-18h", "mercredi": "9h-18h", "jeudi": "9h-18h", "vendredi": "9h-11h30 14h30-18h", "samedi": "9h-16h", "dimanche": "Fermé"}'::jsonb,
    'approved', 167);
  INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_id, 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&q=80', true, 0);

END $$;
