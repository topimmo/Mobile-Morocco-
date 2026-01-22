-- Demo Content for Mobile Morocco Platform
-- All demo content is clearly marked with is_demo flag for easy identification and removal
-- This ensures the platform is not empty at launch while making it clear these are examples

-- Add is_demo column to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- Add is_demo column to items table
ALTER TABLE items ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- Add is_demo column to repair_services table
ALTER TABLE repair_services ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- Add is_demo column to repair_shops table if it exists
ALTER TABLE repair_shops ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- Add is_demo column to listings table if it exists
ALTER TABLE listings ADD COLUMN IF NOT EXISTS is_demo BOOLEAN DEFAULT FALSE;

-- First, modify the stores table to allow NULL user_id for demo content
ALTER TABLE stores ALTER COLUMN user_id DROP NOT NULL;

-- Remove unique constraint on user_id to allow demo stores without real users
ALTER TABLE stores DROP CONSTRAINT IF EXISTS stores_user_id_key;

-- Insert Demo Stores (5 stores representing different types)
-- Demo stores have NULL user_id since they don't belong to real users
INSERT INTO stores (
  id, user_id, name_fr, name_ar, slug, description_fr, description_ar,
  store_type, address_fr, address_ar, city_id, phone, whatsapp,
  status, is_demo, rating_avg, rating_count, view_count
) VALUES 
(
  '00000000-0000-0000-0001-000000000001'::uuid,
  NULL,
  '[DEMO] TechMobile Casablanca',
  '[تجريبي] تيك موبايل الدار البيضاء',
  'demo-techmobile-casablanca',
  'Boutique spécialisée dans les téléphones neufs et accessoires de qualité. Large gamme de smartphones Samsung, iPhone et Xiaomi. [CONTENU DEMO]',
  'متجر متخصص في الهواتف الجديدة والإكسسوارات عالية الجودة. مجموعة واسعة من سامسونج وآيفون وشاومي. [محتوى تجريبي]',
  'shop',
  'Boulevard Mohammed V, N°123',
  'شارع محمد الخامس، رقم 123',
  (SELECT id FROM cities WHERE name_fr ILIKE '%casablanca%' OR slug ILIKE '%casablanca%' LIMIT 1),
  '+212600000001',
  '+212600000001',
  'approved',
  TRUE,
  4.5,
  12,
  250
),
(
  '00000000-0000-0000-0001-000000000002'::uuid,
  NULL,
  '[DEMO] Repair Expert Rabat',
  '[تجريبي] خبير الإصلاح الرباط',
  'demo-repair-expert-rabat',
  'Service de réparation professionnel pour tous types de smartphones. Écrans, batteries, composants. [CONTENU DEMO]',
  'خدمة إصلاح احترافية لجميع أنواع الهواتف الذكية. شاشات، بطاريات، مكونات. [محتوى تجريبي]',
  'shop',
  'Avenue Hassan II, N°45',
  'شارع الحسن الثاني، رقم 45',
  (SELECT id FROM cities WHERE name_fr ILIKE '%rabat%' LIMIT 1),
  '+212600000002',
  '+212600000002',
  'approved',
  TRUE,
  4.8,
  24,
  450
),
(
  '00000000-0000-0000-0001-000000000003'::uuid,
  NULL,
  '[DEMO] PhoneParts Marrakech',
  '[تجريبي] قطع الهاتف مراكش',
  'demo-phoneparts-marrakech',
  'Grossiste en pièces détachées pour téléphones. Écrans LCD, batteries, connecteurs, câbles flex. [CONTENU DEMO]',
  'تاجر جملة لقطع غيار الهواتف. شاشات LCD، بطاريات، موصلات، كابلات فليكس. [محتوى تجريبي]',
  'shop',
  'Quartier Industriel, N°78',
  'الحي الصناعي، رقم 78',
  (SELECT id FROM cities WHERE name_fr ILIKE '%marrakech%' LIMIT 1),
  '+212600000003',
  '+212600000003',
  'approved',
  TRUE,
  4.3,
  18,
  380
),
(
  '00000000-0000-0000-0001-000000000004'::uuid,
  NULL,
  '[DEMO] Mobile Occasion Tanger',
  '[تجريبي] موبايل مستعمل طنجة',
  'demo-mobile-occasion-tanger',
  'Spécialiste de la vente de téléphones d''occasion contrôlés et garantis. Meilleurs prix du marché. [CONTENU DEMO]',
  'متخصص في بيع الهواتف المستعملة المفحوصة والمضمونة. أفضل الأسعار في السوق. [محتوى تجريبي]',
  'individual',
  'Rue de Fès, N°12',
  'شارع فاس، رقم 12',
  (SELECT id FROM cities WHERE name_fr ILIKE '%tanger%' LIMIT 1),
  '+212600000004',
  '+212600000004',
  'approved',
  TRUE,
  4.0,
  8,
  150
),
(
  '00000000-0000-0000-0001-000000000005'::uuid,
  NULL,
  '[DEMO] ProTools Agadir',
  '[تجريبي] أدوات احترافية أكادير',
  'demo-protools-agadir',
  'Équipements professionnels pour techniciens de réparation. Stations de soudure, microscopes, outils. [CONTENU DEMO]',
  'معدات احترافية لفنيي الإصلاح. محطات لحام، مجاهر، أدوات. [محتوى تجريبي]',
  'shop',
  'Zone Industrielle, N°56',
  'المنطقة الصناعية، رقم 56',
  (SELECT id FROM cities WHERE name_fr ILIKE '%agadir%' LIMIT 1),
  '+212600000005',
  '+212600000005',
  'approved',
  TRUE,
  4.6,
  15,
  320
)
ON CONFLICT (id) DO NOTHING;

-- Re-create unique constraint but allow NULL (which is fine for demo stores)
-- The constraint only applies to non-null user_ids
CREATE UNIQUE INDEX IF NOT EXISTS idx_stores_user_id_unique ON stores(user_id) WHERE user_id IS NOT NULL;

-- Insert Demo Items (Phones)
INSERT INTO items (
  id, store_id, item_type, condition, title_fr, title_ar, slug,
  description_fr, description_ar, price, brand, model, city_id, phone, whatsapp,
  status, is_demo, view_count
) VALUES
(
  '00000000-0000-0000-0002-000000000001'::uuid,
  '00000000-0000-0000-0001-000000000001'::uuid,
  'phone', 'new',
  '[DEMO] iPhone 15 Pro Max 256GB',
  '[تجريبي] آيفون 15 برو ماكس 256 جيجا',
  'demo-iphone-15-pro-max',
  'iPhone 15 Pro Max neuf, scellé, garantie Apple 1 an. Couleur Titane naturel. [CONTENU DEMO]',
  'آيفون 15 برو ماكس جديد، مختوم، ضمان أبل سنة واحدة. لون تيتانيوم طبيعي. [محتوى تجريبي]',
  18500.00,
  'Apple', 'iPhone 15 Pro Max',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000001'::uuid),
  '+212600000001', '+212600000001',
  'approved', TRUE, 120
),
(
  '00000000-0000-0000-0002-000000000002'::uuid,
  '00000000-0000-0000-0001-000000000001'::uuid,
  'phone', 'new',
  '[DEMO] Samsung Galaxy S24 Ultra 512GB',
  '[تجريبي] سامسونج جالاكسي S24 ألترا 512 جيجا',
  'demo-samsung-s24-ultra',
  'Samsung Galaxy S24 Ultra neuf, garantie Samsung 2 ans. Couleur noir titane. [CONTENU DEMO]',
  'سامسونج جالاكسي S24 ألترا جديد، ضمان سامسونج سنتين. لون أسود تيتانيوم. [محتوى تجريبي]',
  16900.00,
  'Samsung', 'Galaxy S24 Ultra',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000001'::uuid),
  '+212600000001', '+212600000001',
  'approved', TRUE, 95
),
(
  '00000000-0000-0000-0002-000000000003'::uuid,
  '00000000-0000-0000-0001-000000000004'::uuid,
  'phone', 'used',
  '[DEMO] iPhone 14 Pro 128GB - Occasion',
  '[تجريبي] آيفون 14 برو 128 جيجا - مستعمل',
  'demo-iphone-14-pro-occasion',
  'iPhone 14 Pro en excellent état, batterie 92%, aucune rayure. Garantie 3 mois. [CONTENU DEMO]',
  'آيفون 14 برو في حالة ممتازة، البطارية 92%، بدون خدوش. ضمان 3 أشهر. [محتوى تجريبي]',
  9500.00,
  'Apple', 'iPhone 14 Pro',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000004'::uuid),
  '+212600000004', '+212600000004',
  'approved', TRUE, 78
),
(
  '00000000-0000-0000-0002-000000000004'::uuid,
  '00000000-0000-0000-0001-000000000001'::uuid,
  'phone', 'new',
  '[DEMO] Xiaomi 14 Ultra 512GB',
  '[تجريبي] شاومي 14 ألترا 512 جيجا',
  'demo-xiaomi-14-ultra',
  'Xiaomi 14 Ultra avec appareil photo Leica, neuf, garantie 1 an. [CONTENU DEMO]',
  'شاومي 14 ألترا مع كاميرا لايكا، جديد، ضمان سنة واحدة. [محتوى تجريبي]',
  12900.00,
  'Xiaomi', 'Xiaomi 14 Ultra',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000001'::uuid),
  '+212600000001', '+212600000001',
  'approved', TRUE, 65
),
(
  '00000000-0000-0000-0002-000000000005'::uuid,
  '00000000-0000-0000-0001-000000000004'::uuid,
  'phone', 'used',
  '[DEMO] Samsung Galaxy S23 - Très bon état',
  '[تجريبي] سامسونج جالاكسي S23 - حالة ممتازة',
  'demo-samsung-s23-occasion',
  'Samsung Galaxy S23 128GB, batterie 95%, accessoires complets, boîte originale. [CONTENU DEMO]',
  'سامسونج جالاكسي S23 128 جيجا، البطارية 95%، ملحقات كاملة، علبة أصلية. [محتوى تجريبي]',
  5900.00,
  'Samsung', 'Galaxy S23',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000004'::uuid),
  '+212600000004', '+212600000004',
  'approved', TRUE, 52
)
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Items (Spare Parts)
INSERT INTO items (
  id, store_id, item_type, condition, title_fr, title_ar, slug,
  description_fr, description_ar, price, brand, model, city_id, phone, whatsapp,
  status, is_demo, view_count
) VALUES
(
  '00000000-0000-0000-0002-000000000011'::uuid,
  '00000000-0000-0000-0001-000000000003'::uuid,
  'spare_part', 'new',
  '[DEMO] Écran LCD iPhone 14 Pro - Original',
  '[تجريبي] شاشة LCD آيفون 14 برو - أصلية',
  'demo-ecran-iphone-14-pro',
  'Écran LCD complet pour iPhone 14 Pro, qualité originale, garantie 6 mois. [CONTENU DEMO]',
  'شاشة LCD كاملة لآيفون 14 برو، جودة أصلية، ضمان 6 أشهر. [محتوى تجريبي]',
  2500.00,
  'Apple', 'iPhone 14 Pro',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000003'::uuid),
  '+212600000003', '+212600000003',
  'approved', TRUE, 89
),
(
  '00000000-0000-0000-0002-000000000012'::uuid,
  '00000000-0000-0000-0001-000000000003'::uuid,
  'spare_part', 'new',
  '[DEMO] Batterie Samsung Galaxy S24 Ultra',
  '[تجريبي] بطارية سامسونج جالاكسي S24 ألترا',
  'demo-batterie-samsung-s24',
  'Batterie de remplacement pour Samsung S24 Ultra, 5000mAh, garantie 3 mois. [CONTENU DEMO]',
  'بطارية بديلة لسامسونج S24 ألترا، 5000 مللي أمبير، ضمان 3 أشهر. [محتوى تجريبي]',
  450.00,
  'Samsung', 'Galaxy S24 Ultra',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000003'::uuid),
  '+212600000003', '+212600000003',
  'approved', TRUE, 67
),
(
  '00000000-0000-0000-0002-000000000013'::uuid,
  '00000000-0000-0000-0001-000000000003'::uuid,
  'spare_part', 'new',
  '[DEMO] Connecteur de charge iPhone 13/14',
  '[تجريبي] موصل الشحن آيفون 13/14',
  'demo-connecteur-charge-iphone',
  'Nappe connecteur de charge compatible iPhone 13/14, installation facile. [CONTENU DEMO]',
  'كابل موصل الشحن متوافق مع آيفون 13/14، تركيب سهل. [محتوى تجريبي]',
  180.00,
  'Apple', 'iPhone 13/14',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000003'::uuid),
  '+212600000003', '+212600000003',
  'approved', TRUE, 45
),
(
  '00000000-0000-0000-0002-000000000014'::uuid,
  '00000000-0000-0000-0001-000000000003'::uuid,
  'spare_part', 'new',
  '[DEMO] Caméra arrière Xiaomi 13 Pro',
  '[تجريبي] الكاميرا الخلفية شاومي 13 برو',
  'demo-camera-xiaomi-13-pro',
  'Module caméra arrière pour Xiaomi 13 Pro, qualité OEM. [CONTENU DEMO]',
  'وحدة الكاميرا الخلفية لشاومي 13 برو، جودة OEM. [محتوى تجريبي]',
  850.00,
  'Xiaomi', 'Xiaomi 13 Pro',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000003'::uuid),
  '+212600000003', '+212600000003',
  'approved', TRUE, 38
)
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Items (Equipment)
INSERT INTO items (
  id, store_id, item_type, condition, title_fr, title_ar, slug,
  description_fr, description_ar, price, brand, model, city_id, phone, whatsapp,
  status, is_demo, view_count
) VALUES
(
  '00000000-0000-0000-0002-000000000021'::uuid,
  '00000000-0000-0000-0001-000000000005'::uuid,
  'equipment', 'new',
  '[DEMO] Station de soudure JBC CD-2BE',
  '[تجريبي] محطة لحام JBC CD-2BE',
  'demo-station-soudure-jbc',
  'Station de soudure professionnelle JBC, température contrôlée, idéale pour micro-soudure. [CONTENU DEMO]',
  'محطة لحام احترافية JBC، درجة حرارة متحكم بها، مثالية للحام الدقيق. [محتوى تجريبي]',
  4500.00,
  'JBC', 'CD-2BE',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000005'::uuid),
  '+212600000005', '+212600000005',
  'approved', TRUE, 56
),
(
  '00000000-0000-0000-0002-000000000022'::uuid,
  '00000000-0000-0000-0001-000000000005'::uuid,
  'equipment', 'new',
  '[DEMO] Microscope trinoculaire Amscope',
  '[تجريبي] مجهر ثلاثي العينية Amscope',
  'demo-microscope-amscope',
  'Microscope trinoculaire zoom 7X-45X, éclairage LED, parfait pour réparation de carte mère. [CONTENU DEMO]',
  'مجهر ثلاثي العينية تكبير 7X-45X، إضاءة LED، مثالي لإصلاح اللوحة الأم. [محتوى تجريبي]',
  3200.00,
  'Amscope', 'SM-4TZ-144A',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000005'::uuid),
  '+212600000005', '+212600000005',
  'approved', TRUE, 42
),
(
  '00000000-0000-0000-0002-000000000023'::uuid,
  '00000000-0000-0000-0001-000000000005'::uuid,
  'equipment', 'new',
  '[DEMO] Machine de séparation d''écran',
  '[تجريبي] آلة فصل الشاشة',
  'demo-separateur-ecran',
  'Machine professionnelle pour séparation d''écran LCD, température contrôlée. [CONTENU DEMO]',
  'آلة احترافية لفصل شاشة LCD، درجة حرارة متحكم بها. [محتوى تجريبي]',
  1800.00,
  'Generic', 'LCD Separator Pro',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000005'::uuid),
  '+212600000005', '+212600000005',
  'approved', TRUE, 35
),
(
  '00000000-0000-0000-0002-000000000024'::uuid,
  '00000000-0000-0000-0001-000000000005'::uuid,
  'equipment', 'new',
  '[DEMO] Kit d''outils de réparation 120 pcs',
  '[تجريبي] مجموعة أدوات إصلاح 120 قطعة',
  'demo-kit-outils-reparation',
  'Kit complet d''outils pour réparation smartphone: tournevis, pinces, spatules. [CONTENU DEMO]',
  'مجموعة أدوات كاملة لإصلاح الهواتف: مفكات، ملاقط، أدوات فتح. [محتوى تجريبي]',
  350.00,
  'iFixit', 'Pro Tech Toolkit',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000005'::uuid),
  '+212600000005', '+212600000005',
  'approved', TRUE, 78
)
ON CONFLICT (id) DO NOTHING;

-- Insert Demo Repair Services
INSERT INTO repair_services (
  id, store_id, service_name_fr, service_name_ar, slug,
  description_fr, description_ar, device_types, price, estimated_duration,
  city_id, phone, whatsapp, status, is_demo, view_count
) VALUES
(
  '00000000-0000-0000-0003-000000000001'::uuid,
  '00000000-0000-0000-0001-000000000002'::uuid,
  '[DEMO] Remplacement écran iPhone',
  '[تجريبي] استبدال شاشة آيفون',
  'demo-remplacement-ecran-iphone',
  'Remplacement d''écran pour tous modèles iPhone avec pièces originales. Garantie 6 mois. [CONTENU DEMO]',
  'استبدال الشاشة لجميع موديلات آيفون مع قطع أصلية. ضمان 6 أشهر. [محتوى تجريبي]',
  ARRAY['iPhone'],
  850.00,
  '30-60 min',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000002'::uuid),
  '+212600000002', '+212600000002',
  'approved', TRUE, 125
),
(
  '00000000-0000-0000-0003-000000000002'::uuid,
  '00000000-0000-0000-0001-000000000002'::uuid,
  '[DEMO] Réparation carte mère',
  '[تجريبي] إصلاح اللوحة الأم',
  'demo-reparation-carte-mere',
  'Diagnostic et réparation de carte mère pour tous smartphones. Micro-soudure niveau expert. [CONTENU DEMO]',
  'تشخيص وإصلاح اللوحة الأم لجميع الهواتف الذكية. لحام دقيق بمستوى خبير. [محتوى تجريبي]',
  ARRAY['iPhone', 'Samsung', 'Xiaomi', 'Huawei'],
  NULL,
  '1-3 jours',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000002'::uuid),
  '+212600000002', '+212600000002',
  'approved', TRUE, 89
),
(
  '00000000-0000-0000-0003-000000000003'::uuid,
  '00000000-0000-0000-0001-000000000002'::uuid,
  '[DEMO] Remplacement batterie',
  '[تجريبي] استبدال البطارية',
  'demo-remplacement-batterie',
  'Remplacement de batterie avec pièces de qualité. Tous modèles de smartphones. [CONTENU DEMO]',
  'استبدال البطارية مع قطع عالية الجودة. جميع موديلات الهواتف الذكية. [محتوى تجريبي]',
  ARRAY['iPhone', 'Samsung', 'Xiaomi', 'Huawei', 'OnePlus'],
  250.00,
  '15-30 min',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000002'::uuid),
  '+212600000002', '+212600000002',
  'approved', TRUE, 156
),
(
  '00000000-0000-0000-0003-000000000004'::uuid,
  '00000000-0000-0000-0001-000000000002'::uuid,
  '[DEMO] Récupération de données',
  '[تجريبي] استعادة البيانات',
  'demo-recuperation-donnees',
  'Récupération de données depuis téléphones endommagés ou non fonctionnels. [CONTENU DEMO]',
  'استعادة البيانات من الهواتف التالفة أو غير العاملة. [محتوى تجريبي]',
  ARRAY['iPhone', 'Samsung', 'Xiaomi'],
  NULL,
  '1-5 jours',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000002'::uuid),
  '+212600000002', '+212600000002',
  'approved', TRUE, 67
),
(
  '00000000-0000-0000-0003-000000000005'::uuid,
  '00000000-0000-0000-0001-000000000002'::uuid,
  '[DEMO] Déblocage et désimlockage',
  '[تجريبي] فتح القفل وفك الشبكة',
  'demo-deblocage-desimlockage',
  'Service de déblocage réseau et suppression iCloud/FRP. [CONTENU DEMO]',
  'خدمة فتح قفل الشبكة وإزالة iCloud/FRP. [محتوى تجريبي]',
  ARRAY['iPhone', 'Samsung', 'Xiaomi', 'Huawei'],
  350.00,
  '24-48h',
  (SELECT city_id FROM stores WHERE id = '00000000-0000-0000-0001-000000000002'::uuid),
  '+212600000002', '+212600000002',
  'approved', TRUE, 92
)
ON CONFLICT (id) DO NOTHING;

-- Create indexes for is_demo filtering
CREATE INDEX IF NOT EXISTS idx_stores_is_demo ON stores(is_demo);
CREATE INDEX IF NOT EXISTS idx_items_is_demo ON items(is_demo);
CREATE INDEX IF NOT EXISTS idx_repair_services_is_demo ON repair_services(is_demo);

-- Add comment explaining demo content
COMMENT ON COLUMN stores.is_demo IS 'Flag to identify demo/sample content - can be filtered or removed after launch';
COMMENT ON COLUMN items.is_demo IS 'Flag to identify demo/sample content - can be filtered or removed after launch';
COMMENT ON COLUMN repair_services.is_demo IS 'Flag to identify demo/sample content - can be filtered or removed after launch';
