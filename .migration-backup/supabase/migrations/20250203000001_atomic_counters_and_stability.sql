-- Migration: Atomic Counters and Stability Improvements
-- Purpose: Fix race conditions in view/click counters with atomic operations

-- Drop existing increment function if it exists
DROP FUNCTION IF EXISTS increment_counter(text, text, uuid);

-- Create atomic increment counter function
CREATE OR REPLACE FUNCTION increment_counter(
  p_table_name TEXT,
  p_column_name TEXT,
  p_row_id UUID
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'UPDATE %I SET %I = COALESCE(%I, 0) + 1, updated_at = NOW() WHERE id = $1',
    p_table_name,
    p_column_name,
    p_column_name
  ) USING p_row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create atomic increment for listings table specifically
CREATE OR REPLACE FUNCTION increment_listing_view(p_listing_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE listings 
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = NOW()
  WHERE id = p_listing_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create atomic increment for items table
CREATE OR REPLACE FUNCTION increment_item_counter(
  p_item_id UUID,
  p_counter_type TEXT
)
RETURNS VOID AS $$
BEGIN
  CASE p_counter_type
    WHEN 'view' THEN
      UPDATE items SET view_count = COALESCE(view_count, 0) + 1, updated_at = NOW() WHERE id = p_item_id;
    WHEN 'whatsapp' THEN
      UPDATE items SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1, updated_at = NOW() WHERE id = p_item_id;
    WHEN 'phone' THEN
      UPDATE items SET phone_clicks = COALESCE(phone_clicks, 0) + 1, updated_at = NOW() WHERE id = p_item_id;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create atomic increment for stores table
CREATE OR REPLACE FUNCTION increment_store_counter(
  p_store_id UUID,
  p_counter_type TEXT
)
RETURNS VOID AS $$
BEGIN
  CASE p_counter_type
    WHEN 'view' THEN
      UPDATE stores SET view_count = COALESCE(view_count, 0) + 1, updated_at = NOW() WHERE id = p_store_id;
    WHEN 'whatsapp' THEN
      UPDATE stores SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1, updated_at = NOW() WHERE id = p_store_id;
    WHEN 'phone' THEN
      UPDATE stores SET phone_clicks = COALESCE(phone_clicks, 0) + 1, updated_at = NOW() WHERE id = p_store_id;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create atomic increment for repair_shops table
CREATE OR REPLACE FUNCTION increment_shop_counter(
  p_shop_id UUID,
  p_counter_type TEXT
)
RETURNS VOID AS $$
BEGIN
  CASE p_counter_type
    WHEN 'view' THEN
      UPDATE repair_shops SET view_count = COALESCE(view_count, 0) + 1, updated_at = NOW() WHERE id = p_shop_id;
    WHEN 'whatsapp' THEN
      UPDATE repair_shops SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1, updated_at = NOW() WHERE id = p_shop_id;
    WHEN 'phone' THEN
      UPDATE repair_shops SET phone_clicks = COALESCE(phone_clicks, 0) + 1, updated_at = NOW() WHERE id = p_shop_id;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create atomic increment for repair_services table
CREATE OR REPLACE FUNCTION increment_service_counter(
  p_service_id UUID,
  p_counter_type TEXT
)
RETURNS VOID AS $$
BEGIN
  CASE p_counter_type
    WHEN 'view' THEN
      UPDATE repair_services SET view_count = COALESCE(view_count, 0) + 1, updated_at = NOW() WHERE id = p_service_id;
    WHEN 'whatsapp' THEN
      UPDATE repair_services SET whatsapp_clicks = COALESCE(whatsapp_clicks, 0) + 1, updated_at = NOW() WHERE id = p_service_id;
    WHEN 'phone' THEN
      UPDATE repair_services SET phone_clicks = COALESCE(phone_clicks, 0) + 1, updated_at = NOW() WHERE id = p_service_id;
  END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions for anonymous and authenticated users
GRANT EXECUTE ON FUNCTION increment_counter(TEXT, TEXT, UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_listing_view(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_item_counter(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_store_counter(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_shop_counter(UUID, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_service_counter(UUID, TEXT) TO anon, authenticated;

-- Add index on slug for items table if not exists
CREATE INDEX IF NOT EXISTS idx_items_slug ON items(slug);

-- Add index on slug for stores table if not exists
CREATE INDEX IF NOT EXISTS idx_stores_slug ON stores(slug);
