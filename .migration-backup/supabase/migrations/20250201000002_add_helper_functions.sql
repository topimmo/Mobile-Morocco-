-- Helper function to increment counters
CREATE OR REPLACE FUNCTION increment_counter(
  table_name TEXT,
  column_name TEXT,
  row_id UUID
)
RETURNS VOID AS $$
BEGIN
  EXECUTE format(
    'UPDATE %I SET %I = %I + 1 WHERE id = $1',
    table_name, column_name, column_name
  ) USING row_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies for stores
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public stores are viewable by everyone" ON stores;
CREATE POLICY "Public stores are viewable by everyone"
  ON stores FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view their own store" ON stores;
CREATE POLICY "Users can view their own store"
  ON stores FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own store" ON stores;
CREATE POLICY "Users can insert their own store"
  ON stores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own store" ON stores;
CREATE POLICY "Users can update their own store"
  ON stores FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for items
ALTER TABLE items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public items are viewable by everyone" ON items;
CREATE POLICY "Public items are viewable by everyone"
  ON items FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view their own items" ON items;
CREATE POLICY "Users can view their own items"
  ON items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = items.store_id AND stores.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert items to their store" ON items;
CREATE POLICY "Users can insert items to their store"
  ON items FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = items.store_id AND stores.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update their own items" ON items;
CREATE POLICY "Users can update their own items"
  ON items FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = items.store_id AND stores.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete their own items" ON items;
CREATE POLICY "Users can delete their own items"
  ON items FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = items.store_id AND stores.user_id = auth.uid()
  ));

-- RLS Policies for repair_services
ALTER TABLE repair_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public services are viewable by everyone" ON repair_services;
CREATE POLICY "Public services are viewable by everyone"
  ON repair_services FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Users can view their own services" ON repair_services;
CREATE POLICY "Users can view their own services"
  ON repair_services FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = repair_services.store_id AND stores.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can insert services to their store" ON repair_services;
CREATE POLICY "Users can insert services to their store"
  ON repair_services FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = repair_services.store_id AND stores.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can update their own services" ON repair_services;
CREATE POLICY "Users can update their own services"
  ON repair_services FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = repair_services.store_id AND stores.user_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Users can delete their own services" ON repair_services;
CREATE POLICY "Users can delete their own services"
  ON repair_services FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = repair_services.store_id AND stores.user_id = auth.uid()
  ));

-- RLS Policies for store_images
ALTER TABLE store_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public store images are viewable by everyone" ON store_images;
CREATE POLICY "Public store images are viewable by everyone"
  ON store_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = store_images.store_id AND stores.status = 'approved'
  ));

DROP POLICY IF EXISTS "Users can manage their store images" ON store_images;
CREATE POLICY "Users can manage their store images"
  ON store_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM stores WHERE stores.id = store_images.store_id AND stores.user_id = auth.uid()
  ));

-- RLS Policies for item_images
ALTER TABLE item_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public item images are viewable by everyone" ON item_images;
CREATE POLICY "Public item images are viewable by everyone"
  ON item_images FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM items WHERE items.id = item_images.item_id AND items.status = 'approved'
  ));

DROP POLICY IF EXISTS "Users can manage their item images" ON item_images;
CREATE POLICY "Users can manage their item images"
  ON item_images FOR ALL
  USING (EXISTS (
    SELECT 1 FROM items 
    JOIN stores ON stores.id = items.store_id 
    WHERE items.id = item_images.item_id AND stores.user_id = auth.uid()
  ));

-- RLS Policies for store_reviews
ALTER TABLE store_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Approved reviews are viewable by everyone" ON store_reviews;
CREATE POLICY "Approved reviews are viewable by everyone"
  ON store_reviews FOR SELECT
  USING (status = 'approved');

DROP POLICY IF EXISTS "Anyone can submit a review" ON store_reviews;
CREATE POLICY "Anyone can submit a review"
  ON store_reviews FOR INSERT
  WITH CHECK (true);
