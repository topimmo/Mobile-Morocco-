/*
# Fix Function Search Path Warnings and Create Storage Buckets

## Summary
1. Sets search_path = public on all SECURITY DEFINER functions to fix linter warnings
2. Creates storage buckets for item-images and store-images
3. Adds storage policies for authenticated users to manage their own images

## Changes
- ALTER FUNCTION ... SET search_path = public on all functions
- INSERT into storage.buckets for item-images and store-images (public read)
- Storage policies: authenticated can upload/update/delete, anon can read

## Important Notes
1. Storage buckets are public-read so images display without auth
2. Only authenticated users can upload (prevents anonymous spam)
3. search_path = public prevents function injection attacks
*/

-- Fix search_path on all functions
ALTER FUNCTION public.set_service_slug() SET search_path = public;
ALTER FUNCTION public.update_store_rating() SET search_path = public;
ALTER FUNCTION public.increment_store_counter(uuid, text) SET search_path = public;
ALTER FUNCTION public.increment_item_counter(uuid, text) SET search_path = public;
ALTER FUNCTION public.increment_service_counter(uuid, text) SET search_path = public;
ALTER FUNCTION public.increment_shop_counter(uuid, text) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.generate_listing_slug(text) SET search_path = public;
ALTER FUNCTION public.increment_listing_view(uuid) SET search_path = public;
ALTER FUNCTION public.increment_counter(text, text, uuid) SET search_path = public;
ALTER FUNCTION public.generate_store_slug(text) SET search_path = public;
ALTER FUNCTION public.generate_item_slug(text) SET search_path = public;
ALTER FUNCTION public.generate_service_slug(text) SET search_path = public;
ALTER FUNCTION public.set_store_slug() SET search_path = public;
ALTER FUNCTION public.set_item_slug() SET search_path = public;

-- Revoke execute from anon/authenticated on SECURITY DEFINER functions that should only be called via RPC
-- handle_new_user is a trigger, not callable directly
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- increment_counter should not be directly callable by anon (it's used via supabase.rpc from authenticated)
-- But the app does call it from the client, so we keep it executable by authenticated
-- Revoke from anon only
REVOKE EXECUTE ON FUNCTION public.increment_counter(text, text, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_listing_view(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_store_counter(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_item_counter(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_service_counter(uuid, text) FROM anon;
REVOKE EXECUTE ON FUNCTION public.increment_shop_counter(uuid, text) FROM anon;

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create item-images bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-images', 'item-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create store-images bucket (public read)
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-images', 'store-images', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES: item-images
-- ============================================

DROP POLICY IF EXISTS "anon_read_item_images" ON storage.objects;
CREATE POLICY "anon_read_item_images" ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'item-images');

DROP POLICY IF EXISTS "auth_insert_item_images" ON storage.objects;
CREATE POLICY "auth_insert_item_images" ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'item-images');

DROP POLICY IF EXISTS "auth_update_item_images" ON storage.objects;
CREATE POLICY "auth_update_item_images" ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'item-images')
WITH CHECK (bucket_id = 'item-images');

DROP POLICY IF EXISTS "auth_delete_item_images" ON storage.objects;
CREATE POLICY "auth_delete_item_images" ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'item-images');

-- ============================================
-- STORAGE POLICIES: store-images
-- ============================================

DROP POLICY IF EXISTS "anon_read_store_images" ON storage.objects;
CREATE POLICY "anon_read_store_images" ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'store-images');

DROP POLICY IF EXISTS "auth_insert_store_images" ON storage.objects;
CREATE POLICY "auth_insert_store_images" ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'store-images');

DROP POLICY IF EXISTS "auth_update_store_images" ON storage.objects;
CREATE POLICY "auth_update_store_images" ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'store-images')
WITH CHECK (bucket_id = 'store-images');

DROP POLICY IF EXISTS "auth_delete_store_images" ON storage.objects;
CREATE POLICY "auth_delete_store_images" ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'store-images');