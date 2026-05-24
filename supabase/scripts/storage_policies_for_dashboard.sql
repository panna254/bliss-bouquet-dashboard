-- Paste each block in: Dashboard → Storage → Policies → product-images → New policy
-- → "For full customization" / custom SQL (NOT the main SQL Editor migration runner).
-- One policy per run. Skip any name that already exists.

-- ---------------------------------------------------------------------------
-- 1. SELECT — public read
-- Policy name: bbk_storage_product_images_select_public
-- Operation: SELECT | Roles: public
-- ---------------------------------------------------------------------------
-- USING:
bucket_id = 'product-images'

-- ---------------------------------------------------------------------------
-- 2. INSERT — admin only
-- Policy name: bbk_storage_product_images_insert_admin
-- Operation: INSERT | Roles: authenticated
-- ---------------------------------------------------------------------------
-- WITH CHECK:
bucket_id = 'product-images' AND (SELECT public.is_admin())

-- ---------------------------------------------------------------------------
-- 3. UPDATE — admin only
-- Policy name: bbk_storage_product_images_update_admin
-- Operation: UPDATE | Roles: authenticated
-- ---------------------------------------------------------------------------
-- USING and WITH CHECK (same):
bucket_id = 'product-images' AND (SELECT public.is_admin())

-- ---------------------------------------------------------------------------
-- 4. DELETE — admin only
-- Policy name: bbk_storage_product_images_delete_admin
-- Operation: DELETE | Roles: authenticated
-- ---------------------------------------------------------------------------
-- USING:
bucket_id = 'product-images' AND (SELECT public.is_admin())
