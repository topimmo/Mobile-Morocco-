-- Add atomic view counter for products table

CREATE OR REPLACE FUNCTION increment_product_view(p_product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET view_count = COALESCE(view_count, 0) + 1,
      updated_at = NOW()
  WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_product_view(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_product_view(UUID) TO anon;
