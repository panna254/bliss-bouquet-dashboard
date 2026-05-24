-- STORAGE_POLICIES.md verification (SQL Editor — SELECT only, safe on hosted Supabase)

-- Assertion 1: bucket exists and is public
select id, name, public
from storage.buckets
where id = 'product-images';
-- Expect 1 row, public = true

-- Assertion 2: storage policies on product-images (names may vary if created in UI)
select policyname, cmd, roles
from pg_policies
where schemaname = 'storage'
  and tablename = 'objects'
  and (
    policyname like 'bbk_storage_product_images_%'
    or qual::text ilike '%product-images%'
    or with_check::text ilike '%product-images%'
  )
order by cmd, policyname;
-- Expect at least:
--   SELECT (public read)
--   INSERT (authenticated + is_admin)
--   UPDATE (authenticated + is_admin)
--   DELETE (authenticated + is_admin)

-- Assertion 3: is_admin() exists (required for admin storage policies)
select routine_name
from information_schema.routines
where routine_schema = 'public' and routine_name = 'is_admin';
