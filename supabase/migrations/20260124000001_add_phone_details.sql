-- Add phone-specific details to items table
-- This migration adds a JSONB column to store phone-specific information

-- Add phone_details JSONB column to items table
ALTER TABLE items
ADD COLUMN IF NOT EXISTS phone_details JSONB DEFAULT '{}'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN items.phone_details IS 'Phone-specific details including color, storage, RAM, battery_health, warranty, accessories, sim_type, network';

-- Create an index on the JSONB column for better query performance
CREATE INDEX IF NOT EXISTS idx_items_phone_details ON items USING GIN (phone_details);

-- Example structure:
-- {
--   "color": "Blue",
--   "storage": "256GB",
--   "ram": "8GB",
--   "battery_health": 92,
--   "warranty": true,
--   "accessories": ["box", "charger", "cable", "earphones"],
--   "sim_type": "dual",
--   "network": "5G"
-- }
