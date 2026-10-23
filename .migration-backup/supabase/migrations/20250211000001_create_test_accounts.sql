-- Demo Content Migration for Mobile Morocco Platform
-- =============================================
-- 
-- TEST ACCOUNTS - Create via Supabase Dashboard:
-- Go to Authentication > Users > Add User
-- 
-- 1. Advertiser: advertiser@mobilemaroc.test / Password: Test123!
-- 2. Shop/Importer: shop@mobilemaroc.test / Password: Test123!
-- 3. Technician: technician@mobilemaroc.test / Password: Test123!
-- 4. Individual Seller: individual@mobilemaroc.test / Password: Test123!

-- Add is_demo column where it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'stores' AND column_name = 'is_demo') THEN
    ALTER TABLE stores ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'items' AND column_name = 'is_demo') THEN
    ALTER TABLE items ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'repair_services' AND column_name = 'is_demo') THEN
    ALTER TABLE repair_services ADD COLUMN is_demo BOOLEAN DEFAULT FALSE;
  END IF;
END $$;
