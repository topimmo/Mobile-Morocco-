-- Insert sample users (these would normally be created through auth.users)
-- For demo purposes, we'll insert directly into profiles

-- Sample Customer
INSERT INTO profiles (id, email, user_type, first_name, last_name, phone, city, subscription_type, is_verified)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'customer@example.com', 'customer', 'Client', 'Demo', '+212600000000', 'Casablanca', 'standard', true)
ON CONFLICT (id) DO NOTHING;

-- Sample Importer
INSERT INTO profiles (id, email, user_type, first_name, last_name, phone, city, subscription_type, is_verified, store_ids)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'importer@example.com', 'importer', 'Importateur', 'Demo', '+212600000001', 'Rabat', 'professional', true, '["store-1", "store-2"]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Sample Technician
INSERT INTO profiles (id, email, user_type, first_name, last_name, phone, city, subscription_type, is_verified, services_offered, specialties, availability, rating, review_count)
VALUES 
  ('00000000-0000-0000-0000-000000000003', 'technician@example.com', 'technician', 'Technicien', 'Demo', '+212600000002', 'Marrakech', 'standard', true, 
   '["Réparation d''écran", "Remplacement de batterie", "Récupération de données", "Déblocage de téléphone"]'::jsonb,
   '["Apple", "Samsung", "Xiaomi"]'::jsonb,
   '{"monday":true,"tuesday":true,"wednesday":true,"thursday":true,"friday":true,"saturday":true,"sunday":false}'::jsonb,
   4.9, 56)
ON CONFLICT (id) DO NOTHING;

-- Insert sample stores
INSERT INTO stores (id, owner_id, name, description, city, phone)
VALUES 
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000002', 'TechStore Casablanca', 'Spécialiste en téléphones et accessoires', 'Casablanca', '+212600000010'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000002', 'Mobile Center Rabat', 'Importateur officiel de plusieurs marques', 'Rabat', '+212600000011')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, seller_id, title, description, price, condition, category, subcategory, brand, model, city, images)
VALUES 
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000002', 'iPhone 13 Pro - 128GB', 'Nouveau iPhone 13 Pro avec garantie', 9500, 'new', 'phones', 'smartphones', 'Apple', 'iPhone 13 Pro', 'Casablanca', 
   '[{"url": "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=80"}]'::jsonb),
  
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000002', 'Samsung Galaxy S21 Ultra', 'Samsung Galaxy S21 Ultra en parfait état', 7800, 'used', 'phones', 'smartphones', 'Samsung', 'Galaxy S21 Ultra', 'Rabat',
   '[{"url": "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80"}]'::jsonb),
   
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000002', 'AirPods Pro', 'AirPods Pro avec boîtier de charge sans fil', 2200, 'new', 'accessories', 'audio', 'Apple', 'AirPods Pro', 'Casablanca',
   '[{"url": "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&q=80"}]'::jsonb),
   
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000002', 'Xiaomi Redmi Note 10', 'Xiaomi Redmi Note 10 avec 128GB de stockage', 2500, 'new', 'phones', 'smartphones', 'Xiaomi', 'Redmi Note 10', 'Rabat',
   '[{"url": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80"}]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Insert sample technician services
INSERT INTO technician_services (id, technician_id, service_name, description, price, price_type)
VALUES 
  ('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000003', 'Réparation d''écran', 'Remplacement d''écran pour smartphones', 500, 'fixed'),
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000003', 'Remplacement de batterie', 'Installation d''une nouvelle batterie', 300, 'fixed'),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000003', 'Récupération de données', 'Récupération de données perdues', 400, 'hourly'),
  ('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000003', 'Déblocage de téléphone', 'Déblocage de téléphone verrouillé', 200, 'fixed')
ON CONFLICT (id) DO NOTHING;

-- Insert sample service requests
INSERT INTO service_requests (id, customer_id, technician_id, service_id, status, description, device_details, scheduled_date)
VALUES 
  ('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000030', 'pending', 'Écran cassé après une chute', 
   '{"brand": "iPhone", "model": "12", "color": "blue"}'::jsonb, NOW() + INTERVAL '2 days'),
   
  ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000031', 'accepted', 'Batterie ne tient plus la charge', 
   '{"brand": "Samsung", "model": "Galaxy S21", "color": "black"}'::jsonb, NOW() + INTERVAL '1 day'),
   
  ('00000000-0000-0000-0000-000000000042', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000033', 'completed', 'Téléphone bloqué avec opérateur étranger', 
   '{"brand": "Xiaomi", "model": "Redmi Note 10", "color": "white"}'::jsonb, NOW() - INTERVAL '3 days')
ON CONFLICT (id) DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (id, reviewer_id, subject_type, subject_id, rating, comment)
VALUES 
  ('00000000-0000-0000-0000-000000000050', '00000000-0000-0000-0000-000000000001', 'product', '00000000-0000-0000-0000-000000000020', 5, 'Excellent produit, livraison rapide!'),
  ('00000000-0000-0000-0000-000000000051', '00000000-0000-0000-0000-000000000001', 'technician', '00000000-0000-0000-0000-000000000003', 5, 'Service rapide et professionnel'),
  ('00000000-0000-0000-0000-000000000052', '00000000-0000-0000-0000-000000000001', 'store', '00000000-0000-0000-0000-000000000010', 4, 'Bon magasin avec beaucoup de choix')
ON CONFLICT (id) DO NOTHING;

-- Update favorite products for customer
UPDATE profiles 
SET favorite_products = '["00000000-0000-0000-0000-000000000020", "00000000-0000-0000-0000-000000000022"]'::jsonb
WHERE id = '00000000-0000-0000-0000-000000000001';

-- Update purchase history for customer
UPDATE profiles 
SET purchase_history = '[
  {"productId": "00000000-0000-0000-0000-000000000022", "date": "2024-07-01", "price": 2200},
  {"productId": "00000000-0000-0000-0000-000000000021", "date": "2024-06-15", "price": 7800}
]'::jsonb
WHERE id = '00000000-0000-0000-0000-000000000001';