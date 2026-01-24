-- Add phone-specific details to listings table
-- This migration adds a JSONB column to store phone-specific information

-- Add phone_details JSONB column to listings table
ALTER TABLE listings
ADD COLUMN IF NOT EXISTS phone_details JSONB DEFAULT '{}'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN listings.phone_details IS 'Phone-specific details including color, storage, RAM, battery_health, warranty, accessories, sim_type, network';

-- Create an index on the JSONB column for better query performance
CREATE INDEX IF NOT EXISTS idx_listings_phone_details ON listings USING GIN (phone_details);

-- Example structure:
-- {
--   "color": "Blue",
--   "storage": "256GB",
--   "ram": "8GB",
--   "battery_health": "92%",
--   "warranty": "yes",
--   "accessories": ["box", "charger", "cable", "earphones"],
--   "sim_type": "Nano SIM",
--   "network": "5G"
-- }
