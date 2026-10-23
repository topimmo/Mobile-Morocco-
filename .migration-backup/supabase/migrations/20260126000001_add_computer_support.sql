-- ================================================
-- Computer Support Migration
-- Date: 2026-01-26
-- Purpose: Add support for computers, computer parts, and computer repair services
-- ================================================

-- ================================================
-- PART 1: EXTEND ITEMS TABLE FOR COMPUTERS
-- ================================================

-- Update item_type check constraint to include computer types
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_item_type_check;
ALTER TABLE items ADD CONSTRAINT items_item_type_check 
  CHECK (item_type IN ('phone', 'spare_part', 'equipment', 'computer', 'computer_part'));

-- Add computer_details JSONB column to items table for computer-specific specs
ALTER TABLE items
ADD COLUMN IF NOT EXISTS computer_details JSONB DEFAULT '{}'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN items.computer_details IS 'Computer-specific details including processor, ram_gb, storage_type, storage_gb, gpu, screen_size, os, warranty';

-- Create an index on the JSONB column for better query performance
CREATE INDEX IF NOT EXISTS idx_items_computer_details ON items USING GIN (computer_details);

-- Example structure for computer_details:
-- {
--   "processor": "Intel Core i7-12700H",
--   "ram_gb": 16,
--   "storage_type": "SSD",
--   "storage_gb": 512,
--   "gpu": "NVIDIA RTX 3060",
--   "screen_size": "15.6",
--   "os": "Windows 11",
--   "warranty": true,
--   "warranty_months": 12
-- }

-- Example structure for computer_parts (stored in computer_details):
-- {
--   "part_category": "RAM",
--   "part_type": "DDR4",
--   "capacity": "16GB",
--   "speed": "3200MHz",
--   "compatible_models": ["Dell XPS 15", "HP Pavilion"],
--   "stock_quantity": 10
-- }

-- ================================================
-- PART 2: EXTEND REPAIR SERVICES FOR COMPUTERS
-- ================================================

-- Add repair_type field to categorize repair services
ALTER TABLE repair_services
ADD COLUMN IF NOT EXISTS repair_type TEXT CHECK (repair_type IN ('software', 'hardware', 'both'));

-- Add supported_models array for computer repair services
ALTER TABLE repair_services
ADD COLUMN IF NOT EXISTS supported_models TEXT[] DEFAULT '{}';

-- Add price_range_min and price_range_max for repair services
ALTER TABLE repair_services
ADD COLUMN IF NOT EXISTS price_range_min DECIMAL(12,2),
ADD COLUMN IF NOT EXISTS price_range_max DECIMAL(12,2);

-- Add comment to explain repair types
COMMENT ON COLUMN repair_services.repair_type IS 'Type of repair: software (OS, virus removal), hardware (screen, battery), or both';
COMMENT ON COLUMN repair_services.supported_models IS 'List of computer/phone models supported by this repair service';
COMMENT ON COLUMN repair_services.price_range_min IS 'Minimum price for repair service';
COMMENT ON COLUMN repair_services.price_range_max IS 'Maximum price for repair service';

-- ================================================
-- PART 3: CREATE INDEXES FOR COMPUTER QUERIES
-- ================================================

-- Add indexes for better query performance on computer items
CREATE INDEX IF NOT EXISTS idx_items_brand_model ON items(brand, model) WHERE item_type IN ('computer', 'computer_part');

-- ================================================
-- PART 4: UPDATE RLS POLICIES (extend existing)
-- ================================================

-- Computer items follow the same RLS policies as other items
-- No changes needed - existing policies on items table apply

-- Repair services policies also apply to computer repair services
-- No changes needed - existing policies on repair_services table apply

-- ================================================
-- PART 5: ADD HELPER FUNCTION FOR COMPUTER SEARCH
-- ================================================

-- Function to search computers by specs (can be used in API queries)
CREATE OR REPLACE FUNCTION search_computers(
  search_query TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  min_ram INTEGER DEFAULT NULL,
  processor_brand TEXT DEFAULT NULL,
  storage_type TEXT DEFAULT NULL
)
RETURNS SETOF items AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM items
  WHERE item_type = 'computer'
    AND status = 'approved'
    AND (search_query IS NULL OR 
         title_fr ILIKE '%' || search_query || '%' OR 
         title_ar ILIKE '%' || search_query || '%' OR
         brand ILIKE '%' || search_query || '%' OR
         model ILIKE '%' || search_query || '%')
    AND (min_price IS NULL OR price >= min_price)
    AND (max_price IS NULL OR price <= max_price)
    AND (min_ram IS NULL OR (computer_details->>'ram_gb')::INTEGER >= min_ram)
    AND (processor_brand IS NULL OR computer_details->>'processor' ILIKE '%' || processor_brand || '%')
    AND (storage_type IS NULL OR computer_details->>'storage_type' = storage_type)
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to search computer parts by category
CREATE OR REPLACE FUNCTION search_computer_parts(
  part_category TEXT DEFAULT NULL,
  search_query TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL
)
RETURNS SETOF items AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM items
  WHERE item_type = 'computer_part'
    AND status = 'approved'
    AND (part_category IS NULL OR computer_details->>'part_category' = part_category)
    AND (search_query IS NULL OR 
         title_fr ILIKE '%' || search_query || '%' OR 
         title_ar ILIKE '%' || search_query || '%' OR
         brand ILIKE '%' || search_query || '%')
    AND (min_price IS NULL OR price >= min_price)
    AND (max_price IS NULL OR price <= max_price)
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to search computer repair services
CREATE OR REPLACE FUNCTION search_computer_repairs(
  repair_type_filter TEXT DEFAULT NULL,
  city_id_filter UUID DEFAULT NULL
)
RETURNS SETOF repair_services AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM repair_services
  WHERE status = 'approved'
    AND (repair_type_filter IS NULL OR repair_type = repair_type_filter)
    AND (city_id_filter IS NULL OR city_id = city_id_filter)
    AND (
      'computer' = ANY(device_types) OR
      'laptop' = ANY(device_types) OR
      'pc' = ANY(device_types)
    )
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- ================================================
-- PART 6: ADD SAMPLE COMPUTER CATEGORIES
-- ================================================

-- Insert computer-related categories if categories table exists
-- This is optional and depends on how categories are managed
-- Adding as reference data that can be used in the UI

-- Note: Actual category insertion will depend on the categories table structure
-- For now, we're documenting common computer part categories:
-- Categories: Laptop, Desktop, RAM, SSD, HDD, Battery, Screen, Keyboard, GPU, Motherboard, CPU, Power Supply
