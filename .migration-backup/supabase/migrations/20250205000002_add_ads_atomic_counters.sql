-- Add atomic counter for ads impressions and clicks

CREATE OR REPLACE FUNCTION increment_ad_impression(p_ad_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE ads 
  SET impressions = COALESCE(impressions, 0) + 1,
      updated_at = NOW()
  WHERE id = p_ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION increment_ad_click(p_ad_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE ads 
  SET clicks = COALESCE(clicks, 0) + 1,
      updated_at = NOW()
  WHERE id = p_ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_ad_impression(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_ad_impression(UUID) TO anon;
GRANT EXECUTE ON FUNCTION increment_ad_click(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_ad_click(UUID) TO anon;
