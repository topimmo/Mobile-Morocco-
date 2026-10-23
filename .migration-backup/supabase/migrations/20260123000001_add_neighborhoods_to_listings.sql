-- Add neighborhood support to listings table
-- This migration adds neighborhood_id and neighborhood_custom fields to support
-- fine-grained location targeting in listings

-- Add neighborhood columns to listings table
ALTER TABLE listings 
  ADD COLUMN IF NOT EXISTS neighborhood_id UUID,
  ADD COLUMN IF NOT EXISTS neighborhood_custom TEXT;

-- Add foreign key constraint with explicit name for easier management
ALTER TABLE listings
  ADD CONSTRAINT IF NOT EXISTS listings_neighborhood_id_fkey 
  FOREIGN KEY (neighborhood_id) 
  REFERENCES neighborhoods(id) 
  ON DELETE SET NULL;

-- Create index for neighborhood filtering
CREATE INDEX IF NOT EXISTS idx_listings_neighborhood ON listings(neighborhood_id);
CREATE INDEX IF NOT EXISTS idx_listings_city_neighborhood ON listings(city_id, neighborhood_id);

-- Add comment to explain neighborhood_custom usage
COMMENT ON COLUMN listings.neighborhood_custom IS 'Used when user adds a custom neighborhood not yet in the approved list';

-- Update listing_images to support Arabic alt text (if not already exists)
ALTER TABLE listing_images 
  ADD COLUMN IF NOT EXISTS alt_text_ar TEXT,
  ADD COLUMN IF NOT EXISTS alt_text_fr TEXT;

-- For backward compatibility, copy existing alt_text to alt_text_ar
UPDATE listing_images 
SET alt_text_ar = alt_text 
WHERE alt_text_ar IS NULL AND alt_text IS NOT NULL;
