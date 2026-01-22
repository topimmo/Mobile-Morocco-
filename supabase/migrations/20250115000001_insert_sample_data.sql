-- Insert Sample Data for Mobile Morocco Platform
-- This migration ONLY inserts data, does not modify schema

-- Cities are already populated by previous migration (20250101000001_cities_neighborhoods_complete.sql)
-- Skip city insertion

-- Insert Categories
INSERT INTO categories (name_fr, name_ar, slug, icon, parent_id, sort_order, is_active) VALUES
('Smartphones', 'هواتف ذكية', 'smartphones', 'smartphone', NULL, 1, true),
('Accessoires', 'إكسسوارات', 'accessories', 'package', NULL, 2, true),
('Pièces Détachées', 'قطع الغيار', 'spare-parts', 'wrench', NULL, 3, true),
('Tablettes', 'أجهزة لوحية', 'tablets', 'tablet', NULL, 4, true),
('Réparation', 'إصلاح', 'repair', 'tool', NULL, 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for subcategories
DO $$
DECLARE
  smartphone_cat_id UUID;
  accessory_cat_id UUID;
  spare_cat_id UUID;
BEGIN
  SELECT id INTO smartphone_cat_id FROM categories WHERE slug = 'smartphones' LIMIT 1;
  SELECT id INTO accessory_cat_id FROM categories WHERE slug = 'accessories' LIMIT 1;
  SELECT id INTO spare_cat_id FROM categories WHERE slug = 'spare-parts' LIMIT 1;

  -- Insert Subcategories
  INSERT INTO categories (name_fr, name_ar, slug, icon, parent_id, sort_order, is_active) VALUES
  ('iPhone', 'آيفون', 'iphone', 'apple', smartphone_cat_id, 1, true),
  ('Samsung', 'سامسونج', 'samsung', 'smartphone', smartphone_cat_id, 2, true),
  ('Xiaomi', 'شاومي', 'xiaomi', 'smartphone', smartphone_cat_id, 3, true),
  ('Huawei', 'هواوي', 'huawei', 'smartphone', smartphone_cat_id, 4, true),
  ('Écrans', 'شاشات', 'screens', 'monitor', spare_cat_id, 1, true),
  ('Batteries', 'بطاريات', 'batteries', 'battery', spare_cat_id, 2, true),
  ('Coques', 'أغطية', 'cases', 'box', accessory_cat_id, 1, true),
  ('Chargeurs', 'شواحن', 'chargers', 'plug', accessory_cat_id, 2, true)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- Insert Sample Users with different roles
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@mobilemorocco.ma', '$2a$10$dummyhash1', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Admin User"}', false, 'authenticated'),
  ('22222222-2222-2222-2222-222222222222', 'importer1@example.ma', '$2a$10$dummyhash2', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Hassan ElImporteur"}', false, 'authenticated'),
  ('33333333-3333-3333-3333-333333333333', 'importer2@example.ma', '$2a$10$dummyhash3', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Fatima Mobile"}', false, 'authenticated'),
  ('44444444-4444-4444-4444-444444444444', 'tech1@example.ma', '$2a$10$dummyhash4', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Mohammed Tech"}', false, 'authenticated'),
  ('55555555-5555-5555-5555-555555555555', 'tech2@example.ma', '$2a$10$dummyhash5', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Youssef Repair"}', false, 'authenticated'),
  ('66666666-6666-6666-6666-666666666666', 'user1@example.ma', '$2a$10$dummyhash6', NOW(), NOW(), NOW(), '{"provider":"email","providers":["email"]}', '{"full_name":"Amina User"}', false, 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Get city IDs for profiles
DO $$
DECLARE
  casa_id UUID;
  rabat_id UUID;
  marrakech_id UUID;
  laayoune_id UUID;
  dakhla_id UUID;
  agadir_id UUID;
BEGIN
  SELECT id INTO casa_id FROM cities WHERE slug = 'casablanca' LIMIT 1;
  SELECT id INTO rabat_id FROM cities WHERE slug = 'rabat' LIMIT 1;
  SELECT id INTO marrakech_id FROM cities WHERE slug = 'marrakech' LIMIT 1;
  SELECT id INTO laayoune_id FROM cities WHERE slug = 'laayoune' LIMIT 1;
  SELECT id INTO dakhla_id FROM cities WHERE slug = 'dakhla' LIMIT 1;
  SELECT id INTO agadir_id FROM cities WHERE slug = 'agadir' LIMIT 1;

  -- Insert Profiles (use only 'admin' and 'advertiser' roles based on current schema)
  INSERT INTO profiles (id, email, full_name, phone, role, city_id, is_verified, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin@mobilemorocco.ma', 'Admin User', '+212600000000', 'admin', casa_id, true, true),
  ('22222222-2222-2222-2222-222222222222', 'importer1@example.ma', 'Hassan ElImporteur', '+212601111111', 'advertiser', casa_id, true, true),
  ('33333333-3333-3333-3333-333333333333', 'importer2@example.ma', 'Fatima Mobile', '+212602222222', 'advertiser', rabat_id, true, true),
  ('44444444-4444-4444-4444-444444444444', 'tech1@example.ma', 'Mohammed Tech', '+212603333333', 'advertiser', marrakech_id, true, true),
  ('55555555-5555-5555-5555-555555555555', 'tech2@example.ma', 'Youssef Repair', '+212604444444', 'advertiser', laayoune_id, true, true),
  ('66666666-6666-6666-6666-666666666666', 'user1@example.ma', 'Amina User', '+212605555555', 'advertiser', agadir_id, true, true)
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Insert Listings (Products)
DO $$
DECLARE
  casa_id UUID;
  rabat_id UUID;
  marrakech_id UUID;
  laayoune_id UUID;
  dakhla_id UUID;
  agadir_id UUID;
  fes_id UUID;
  tanger_id UUID;
  smartphone_cat UUID;
  iphone_cat UUID;
  samsung_cat UUID;
  xiaomi_cat UUID;
  accessory_cat UUID;
  spare_cat UUID;
  importer1_id UUID := '22222222-2222-2222-2222-222222222222';
  importer2_id UUID := '33333333-3333-3333-3333-333333333333';
BEGIN
  SELECT id INTO casa_id FROM cities WHERE slug = 'casablanca' LIMIT 1;
  SELECT id INTO rabat_id FROM cities WHERE slug = 'rabat' LIMIT 1;
  SELECT id INTO marrakech_id FROM cities WHERE slug = 'marrakech' LIMIT 1;
  SELECT id INTO laayoune_id FROM cities WHERE slug = 'laayoune' LIMIT 1;
  SELECT id INTO dakhla_id FROM cities WHERE slug = 'dakhla' LIMIT 1;
  SELECT id INTO agadir_id FROM cities WHERE slug = 'agadir' LIMIT 1;
  SELECT id INTO fes_id FROM cities WHERE slug = 'fes' LIMIT 1;
  SELECT id INTO tanger_id FROM cities WHERE slug = 'tanger' LIMIT 1;
  
  SELECT id INTO smartphone_cat FROM categories WHERE slug = 'smartphones' LIMIT 1;
  SELECT id INTO iphone_cat FROM categories WHERE slug = 'iphone' LIMIT 1;
  SELECT id INTO samsung_cat FROM categories WHERE slug = 'samsung' LIMIT 1;
  SELECT id INTO xiaomi_cat FROM categories WHERE slug = 'xiaomi' LIMIT 1;
  SELECT id INTO accessory_cat FROM categories WHERE slug = 'accessories' LIMIT 1;
  SELECT id INTO spare_cat FROM categories WHERE slug = 'spare-parts' LIMIT 1;

  -- Insert 20 realistic listings (using title_fr and description_fr based on schema)
  INSERT INTO listings (user_id, title_fr, title_ar, slug, description_fr, description_ar, price, category_id, city_id, condition, brand, model, status, whatsapp, phone, view_count) VALUES
  
  -- iPhones
  (importer1_id, 'iPhone 15 Pro Max 256GB Titane Naturel', 'آيفون 15 برو ماكس 256 جيجابايت تيتانيوم', 'iphone-15-pro-max-256gb-titane-naturel', 'iPhone 15 Pro Max neuf avec garantie internationale. Écran Super Retina XDR 6.7", puce A17 Pro, triple caméra 48MP. Livraison disponible dans tout le Maroc.', 'آيفون 15 برو ماكس جديد بضمان دولي', 14999.00, iphone_cat, casa_id, 'new', 'Apple', 'iPhone 15 Pro Max', 'approved', '+212600111111', '+212600111111', 145),
  (importer1_id, 'iPhone 14 128GB Bleu - État Excellent', 'آيفون 14 128 جيجابايت أزرق', 'iphone-14-128gb-bleu-excellent', 'iPhone 14 occasion en excellent état. Aucune rayure, batterie à 95%. Vendu avec chargeur et boîte d''origine.', 'آيفون 14 مستعمل بحالة ممتازة', 6999.00, iphone_cat, casa_id, 'used', 'Apple', 'iPhone 14', 'approved', '+212600111111', '+212600111111', 89),
  (importer2_id, 'iPhone 13 Pro 512GB Graphite', 'آيفون 13 برو 512 جيجابايت', 'iphone-13-pro-512gb-graphite', 'iPhone 13 Pro reconditionné grade A+. Garantie 6 mois. ProMotion 120Hz, triple caméra, batterie neuve.', 'آيفون 13 برو مجدد', 8499.00, iphone_cat, rabat_id, 'refurbished', 'Apple', 'iPhone 13 Pro', 'approved', '+212602222222', '+212602222222', 67),
  (importer1_id, 'iPhone SE 2022 64GB Minuit', 'آيفون إس إي 2022', 'iphone-se-2022-64gb-minuit', 'iPhone SE 3ème génération neuf. Design compact avec puce A15 Bionic. Parfait pour un premier iPhone.', 'آيفون إس إي الجيل الثالث', 3799.00, iphone_cat, marrakech_id, 'new', 'Apple', 'iPhone SE', 'approved', '+212600111111', '+212600111111', 123),
  
  -- Samsung
  (importer2_id, 'Samsung Galaxy S24 Ultra 512GB Titane Noir', 'سامسونج جالكسي إس 24 ألترا', 'samsung-s24-ultra-512gb-titane-noir', 'Dernier flagship Samsung avec S Pen. Écran AMOLED 6.8", caméra 200MP, batterie 5000mAh. Garantie officielle Samsung Maroc.', 'سامسونج جالاكسي إس 24 ألترا', 13499.00, samsung_cat, rabat_id, 'new', 'Samsung', 'Galaxy S24 Ultra', 'approved', '+212602222222', '+212602222222', 178),
  (importer1_id, 'Samsung Galaxy A54 5G 256GB Violet', 'سامسونج جالاكسي إيه 54', 'samsung-a54-5g-256gb-violet', 'Excellent rapport qualité-prix. Écran Super AMOLED 120Hz, triple caméra 50MP, charge rapide 25W.', 'سامسونج جالاكسي إيه 54', 3299.00, samsung_cat, laayoune_id, 'new', 'Samsung', 'Galaxy A54', 'approved', '+212600111111', '+212600111111', 201),
  (importer2_id, 'Samsung Galaxy Z Flip5 256GB Lavande', 'سامسونج جالاكسي زد فليب 5', 'samsung-z-flip5-256gb-lavande', 'Smartphone pliable dernière génération. Écran externe 3.4" utile. Design unique et élégant.', 'سامسونج جالاكسي زد فليب 5', 10999.00, samsung_cat, casa_id, 'new', 'Samsung', 'Galaxy Z Flip5', 'approved', '+212602222222', '+212602222222', 94),
  (importer1_id, 'Samsung Galaxy A34 128GB Noir', 'سامسونج جالاكسي إيه 34', 'samsung-a34-128gb-noir', 'Smartphone milieu de gamme performant. 5G, batterie longue durée, étanche IP67.', 'سامسونج جالاكسي إيه 34', 2599.00, samsung_cat, dakhla_id, 'new', 'Samsung', 'Galaxy A34', 'approved', '+212600111111', '+212600111111', 76),
  
  -- Xiaomi
  (importer2_id, 'Xiaomi 13T Pro 512GB Noir', 'شاومي 13 تي برو', 'xiaomi-13t-pro-512gb-noir', 'Flagship killer avec caméra Leica. MediaTek Dimensity 9200+, charge 120W ultra rapide, écran AMOLED 144Hz.', 'شاومي 13 تي برو', 6299.00, xiaomi_cat, agadir_id, 'new', 'Xiaomi', '13T Pro', 'approved', '+212602222222', '+212602222222', 134),
  (importer1_id, 'Xiaomi Redmi Note 13 Pro 256GB Bleu', 'شاومي ريدمي نوت 13 برو', 'xiaomi-redmi-note-13-pro-256gb-bleu', 'Best-seller Xiaomi. Caméra 200MP, charge rapide 67W, écran AMOLED. Excellent rapport qualité-prix.', 'شاومي ريدمي نوت 13 برو', 2999.00, xiaomi_cat, fes_id, 'new', 'Xiaomi', 'Redmi Note 13 Pro', 'approved', '+212600111111', '+212600111111', 267),
  (importer2_id, 'Xiaomi Poco X6 Pro 512GB Jaune', 'شاومي بوكو إكس 6 برو', 'xiaomi-poco-x6-pro-512gb-jaune', 'Gaming phone abordable. Snapdragon 8 Gen 2, écran 120Hz, système de refroidissement avancé.', 'شاومي بوكو إكس 6 برو', 3799.00, xiaomi_cat, tanger_id, 'new', 'Xiaomi', 'Poco X6 Pro', 'approved', '+212602222222', '+212602222222', 156),
  (importer1_id, 'Xiaomi Redmi 12 128GB Argent', 'شاومي ريدمي 12', 'xiaomi-redmi-12-128gb-argent', 'Smartphone entrée de gamme fiable. Grande batterie 5000mAh, écran 90Hz, triple caméra 50MP.', 'شاومي ريدمي 12', 1599.00, xiaomi_cat, laayoune_id, 'new', 'Xiaomi', 'Redmi 12', 'approved', '+212600111111', '+212600111111', 189),
  
  -- Accessories
  (importer1_id, 'AirPods Pro 2ème génération USB-C', 'إيربودز برو 2', 'airpods-pro-2-usbc', 'Écouteurs Apple avec réduction de bruit active. Autonomie jusqu''à 6h. Boîtier de charge MagSafe USB-C. Garantie Apple.', 'إيربودز برو الجيل الثاني', 2799.00, accessory_cat, casa_id, 'new', 'Apple', 'AirPods Pro', 'approved', '+212600111111', '+212600111111', 98),
  (importer2_id, 'Samsung Galaxy Buds2 Pro Graphite', 'سامسونج جالاكسي بادز 2 برو', 'samsung-galaxy-buds2-pro-graphite', 'Écouteurs sans fil premium Samsung. ANC intelligent, son 360°, étanches IPX7. Parfaits pour Galaxy.', 'سامسونج جالاكسي بادز 2 برو', 1599.00, accessory_cat, rabat_id, 'new', 'Samsung', 'Galaxy Buds2 Pro', 'approved', '+212602222222', '+212602222222', 67),
  (importer1_id, 'Chargeur Rapide 65W USB-C Universel', 'شاحن سريع 65 واط', 'chargeur-rapide-65w-usbc-universel', 'Chargeur GaN compact 65W. Compatible iPhone, Samsung, Xiaomi. 2 ports USB-C + 1 USB-A. Protection surtension.', 'شاحن سريع 65 واط', 249.00, accessory_cat, marrakech_id, 'new', 'Generic', 'Fast Charger', 'approved', '+212600111111', '+212600111111', 234),
  (importer2_id, 'Lot 10 Coques iPhone Protection Transparente', 'مجموعة 10 أغطية آيفون', 'lot-10-coques-iphone-transparente', 'Pack de 10 coques transparentes pour iPhone 13/14/15. Anti-choc, anti-rayures, bords surélevés. Prix grossiste.', 'مجموعة 10 أغطية آيفون', 199.00, accessory_cat, casa_id, 'new', 'Generic', 'iPhone Cases', 'approved', '+212602222222', '+212602222222', 312),
  
  -- Spare Parts
  (importer1_id, 'Écran OLED iPhone 14 Pro Qualité Original', 'شاشة أوليد آيفون 14 برو', 'ecran-oled-iphone-14-pro-original', 'Écran de remplacement qualité premium pour iPhone 14 Pro. OLED True Tone compatible. Garantie 6 mois. Installation disponible.', 'شاشة استبدال آيفون 14 برو', 1899.00, spare_cat, casa_id, 'new', 'Apple', 'iPhone 14 Pro Screen', 'approved', '+212600111111', '+212600111111', 87),
  (importer2_id, 'Batterie Samsung Galaxy S23 Haute Capacité', 'بطارية سامسونج جالاكسي إس 23', 'batterie-samsung-galaxy-s23-haute', 'Batterie de remplacement 4000mAh pour Galaxy S23. Cellules Li-ion grade A. Kit outils inclus.', 'بطارية سامسونج جالاكسي إس 23', 349.00, spare_cat, rabat_id, 'new', 'Samsung', 'S23 Battery', 'approved', '+212602222222', '+212602222222', 145),
  (importer1_id, 'Connecteur Charge iPhone 12/13 Lightning', 'موصل شحن آيفون', 'connecteur-charge-iphone-12-13-lightning', 'Connecteur de charge + microphone pour iPhone 12 et 13. Pièce d''origine Apple reconditionnée. Facile à installer.', 'موصل شحن آيفون', 299.00, spare_cat, agadir_id, 'new', 'Apple', 'Lightning Port', 'approved', '+212600111111', '+212600111111', 167),
  (importer2_id, 'Vitre Arrière Xiaomi Redmi Note 12 Pro', 'زجاج خلفي شاومي', 'vitre-arriere-xiaomi-redmi-note-12-pro', 'Vitre arrière de remplacement pour Redmi Note 12 Pro. Plusieurs couleurs disponibles. Adhésif pré-installé.', 'زجاج خلفي شاومي ريدمي', 149.00, spare_cat, fes_id, 'new', 'Xiaomi', 'Back Glass', 'approved', '+212602222222', '+212602222222', 93);

END $$;

-- Insert Listing Images
DO $$
DECLARE
  listing_rec RECORD;
BEGIN
  FOR listing_rec IN SELECT id FROM listings LIMIT 20
  LOOP
    INSERT INTO listing_images (listing_id, image_url, sort_order) VALUES
    (listing_rec.id, 'https://images.unsplash.com/photo-1592286927505-2fd0d113b3fe?w=800&q=80', 0),
    (listing_rec.id, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', 1),
    (listing_rec.id, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', 2);
  END LOOP;
END $$;

-- Insert Repair Shops
DO $$
DECLARE
  casa_id UUID;
  rabat_id UUID;
  marrakech_id UUID;
  laayoune_id UUID;
  dakhla_id UUID;
  agadir_id UUID;
  fes_id UUID;
  tech1_id UUID := '44444444-4444-4444-4444-444444444444';
  tech2_id UUID := '55555555-5555-5555-5555-555555555555';
BEGIN
  SELECT id INTO casa_id FROM cities WHERE slug = 'casablanca' LIMIT 1;
  SELECT id INTO rabat_id FROM cities WHERE slug = 'rabat' LIMIT 1;
  SELECT id INTO marrakech_id FROM cities WHERE slug = 'marrakech' LIMIT 1;
  SELECT id INTO laayoune_id FROM cities WHERE slug = 'laayoune' LIMIT 1;
  SELECT id INTO dakhla_id FROM cities WHERE slug = 'dakhla' LIMIT 1;
  SELECT id INTO agadir_id FROM cities WHERE slug = 'agadir' LIMIT 1;
  SELECT id INTO fes_id FROM cities WHERE slug = 'fes' LIMIT 1;

  INSERT INTO repair_shops (user_id, name_fr, name_ar, slug, description_fr, description_ar, city_id, address_fr, phone, whatsapp, specialties, status) VALUES
  
  (tech1_id, 'Tech Mobile Casablanca - Réparation Express', 'تيك موبايل الدار البيضاء', 'tech-mobile-casa-express', 'Centre de réparation agréé spécialisé iPhone et Samsung. Réparation en 30 minutes, pièces d''origine, garantie 6 mois. Plus de 10 ans d''expérience.', 'مركز تصليح معتمد متخصص في آيفون وسامسونج', casa_id, '45 Boulevard Zerktouni, Maarif, Casablanca', '+212603333333', '+212603333333', ARRAY['Remplacement écran', 'Changement batterie', 'Réparation carte mère', 'Déblocage réseau'], 'approved'),
  
  (tech2_id, 'Laayoune Mobile Service', 'خدمة موبايل العيون', 'laayoune-mobile-service', 'Atelier de réparation toutes marques au sud du Maroc. Service rapide et prix compétitifs. Vente de pièces détachées.', 'ورشة تصليح لجميع الماركات', laayoune_id, 'Avenue Hassan II, Laayoune', '+212604444444', '+212604444444', ARRAY['Remplacement écran', 'Changement batterie', 'Désoxydation', 'Installation logiciels'], 'approved'),
  
  (tech1_id, 'iPhone Doctor Marrakech', 'دكتور آيفون مراكش', 'iphone-doctor-marrakech', 'Spécialiste iPhone certifié. Diagnostic gratuit, réparation garantie. Nous utilisons uniquement des pièces certifiées Apple.', 'متخصص معتمد في آيفون', marrakech_id, '12 Rue de la Liberté, Guéliz, Marrakech', '+212603333334', '+212603333334', ARRAY['Réparation iPhone', 'Remplacement Face ID', 'Micro-soudure'], 'approved'),
  
  (tech2_id, 'Dakhla Phone Repair', 'تصليح هواتف الداخلة', 'dakhla-phone-repair', 'Centre de réparation moderne à Dakhla. Service à domicile disponible. Réparation tablettes et smartphones.', 'مركز تصليح حديث بالداخلة', dakhla_id, 'Avenue Mohammed V, Dakhla', '+212604444445', '+212604444445', ARRAY['Remplacement écran', 'Changement batterie', 'Réparation boutons'], 'approved'),
  
  (tech1_id, 'GSM Pro Rabat', 'جي إس إم برو الرباط', 'gsm-pro-rabat', 'Réparation professionnelle toutes marques. Équipement de pointe, techniciens certifiés. Devis gratuit en ligne.', 'تصليح احترافي لجميع الماركات', rabat_id, '78 Avenue Al Andalous, Agdal, Rabat', '+212603333335', '+212603333335', ARRAY['Remplacement écran LCD/OLED', 'Changement batterie', 'Réparation caméra'], 'approved'),
  
  (tech2_id, 'Mobile Care Agadir', 'موبايل كير أكادير', 'mobile-care-agadir', 'Centre de réparation et maintenance smartphone. Service express pour écrans et batteries. Accessoires disponibles.', 'مركز تصليح وصيانة الهواتف', agadir_id, 'Boulevard Hassan II, Talborjt, Agadir', '+212604444446', '+212604444446', ARRAY['Remplacement écran', 'Changement batterie', 'Protection verre trempé'], 'approved'),
  
  (tech1_id, 'Smart Fix Fès', 'سمارت فيكس فاس', 'smart-fix-fes', 'Atelier de réparation expert. Formation internationale, équipement professionnel. Garantie pièces et main d''oeuvre.', 'ورشة تصليح خبيرة', fes_id, '23 Avenue Hassan II, Fès', '+212603333336', '+212603333336', ARRAY['Diagnostic complet', 'Remplacement écran', 'Récupération données'], 'approved'),
  
  (tech2_id, 'Phone Hospital Casa', 'مستشفى الهاتف كازا', 'phone-hospital-casa', 'Clinique du smartphone. Réparation tous dégâts : eau, choc, oxydation. Micro-soudure spécialisée.', 'عيادة الهواتف الذكية', casa_id, '156 Boulevard Bourgogne, Casablanca', '+212604444447', '+212604444447', ARRAY['Désoxydation', 'Micro-soudure', 'Data recovery'], 'approved');

END $$;

-- Insert Shop Images (based on actual schema)
DO $$
DECLARE
  shop_rec RECORD;
BEGIN
  FOR shop_rec IN SELECT id FROM repair_shops
  LOOP
    INSERT INTO shop_images (shop_id, image_url, is_cover, sort_order) VALUES
    (shop_rec.id, 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800&q=80', true, 0),
    (shop_rec.id, 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80', false, 1);
  END LOOP;
END $$;

-- Skip reviews section (table may not exist or have different structure)

-- Insert Ad Campaigns (using advertiser_id and exact schema columns including end_date)
DO $$
DECLARE
  importer1_id UUID := '22222222-2222-2222-2222-222222222222';
  importer2_id UUID := '33333333-3333-3333-3333-333333333333';
BEGIN
  INSERT INTO ad_campaigns (advertiser_id, title, description, target_url, banner_desktop_url, banner_mobile_url, slot, duration_days, start_date, end_date, status) VALUES
  (importer1_id, 'Promo iPhone 15 - Mars 2025', 'Promotion spéciale iPhone 15 Pro Max', 'https://mobilemorocco.ma/listings/iphone-15-pro-max', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c7?w=1200&q=80', 'https://images.unsplash.com/photo-1632661674596-df8be070a5c7?w=800&q=80', 'top', 30, CURRENT_DATE - 5, CURRENT_DATE + 25, 'approved'),
  (importer2_id, 'Samsung Galaxy S24 Launch', 'Lancement du nouveau Samsung Galaxy S24 Ultra', 'https://mobilemorocco.ma/listings/samsung-s24-ultra', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=1200&q=80', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80', 'bottom', 30, CURRENT_DATE - 3, CURRENT_DATE + 27, 'approved');
END $$;
