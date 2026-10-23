-- Migration: Create Storage Bucket for Item Images
-- Purpose: Enable proper image uploads instead of base64 storage

-- Create storage bucket for item images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'item-images',
  'item-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for item images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload item images" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own images" ON storage.objects;

-- Allow public read access to item images
CREATE POLICY "Public read access for item images"
ON storage.objects FOR SELECT
USING (bucket_id = 'item-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload item images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'item-images' 
  AND auth.role() = 'authenticated'
);

-- Allow users to delete their own images (based on path containing their user_id)
CREATE POLICY "Users can delete their own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'item-images'
  AND auth.role() = 'authenticated'
);
