# Storage setup (hosted Supabase)

Migration `20260524140000_rls_policies.sql` applies **public schema RLS only**. It does not touch `storage.*` because Supabase Cloud reserves ownership of those objects.

| Feature | Needs storage policies? |
|---------|-------------------------|
| Browse products, checkout, orders | **No** (uses `public.products`, `public.orders`, …) |
| Display product images (public URLs) | **Public bucket** is enough for read |
| Admin upload/delete product images | **Yes** — configure below |

Do **not** drop existing storage policies unless you know what they do. Add policies only if uploads fail.

---

## Step 1 — Bucket

1. Dashboard → **Storage** → **Buckets**.
2. If `product-images` is missing: **New bucket**
   - Name: `product-images`
   - **Public bucket**: ON
3. If it already exists, leave it as-is.

---

## Step 2 — Policies (product-images)

Dashboard → **Storage** → **Policies** → bucket **product-images** → **New policy**.

Use **For full customization** (SQL) when offered. Requires `public.is_admin()` from migration 4.

Copy-paste reference (one policy at a time):  
[`scripts/storage_policies_for_dashboard.sql`](./scripts/storage_policies_for_dashboard.sql)

### 1. Public read (SELECT)

- **Policy name:** `bbk_storage_product_images_select_public` (or any clear name)
- **Allowed operation:** SELECT
- **Target roles:** `public` (or anon + authenticated, matching your project UI)
- **USING expression:**

```sql
bucket_id = 'product-images'
```

### 2. Admin upload (INSERT)

- **Allowed operation:** INSERT
- **Target roles:** `authenticated`
- **WITH CHECK:**

```sql
bucket_id = 'product-images' AND (SELECT public.is_admin())
```

### 3. Admin update (UPDATE)

- **USING** and **WITH CHECK** (same expression):

```sql
bucket_id = 'product-images' AND (SELECT public.is_admin())
```

### 4. Admin delete (DELETE)

- **USING:**

```sql
bucket_id = 'product-images' AND (SELECT public.is_admin())
```

---

## Verify

**Automated (bucket + anon upload check):**

```bash
npm run verify:storage
```

**SQL Editor (policies + bucket row):** run  
[`scripts/verify_storage_setup.sql`](./scripts/verify_storage_setup.sql)

```sql
select id, name, public from storage.buckets where id = 'product-images';

select policyname, cmd
from pg_policies
where schemaname = 'storage' and tablename = 'objects'
  and policyname ilike '%product%'
order by policyname;
```

**Checklist**

- [ ] Bucket `product-images` exists, **Public** ON
- [ ] Policy SELECT for `bucket_id = 'product-images'`
- [ ] Policy INSERT with `public.is_admin()`
- [ ] Policy UPDATE with `public.is_admin()`
- [ ] Policy DELETE with `public.is_admin()`
- [ ] `npm run verify:storage` passes bucket checks
- [ ] Admin: edit product → upload image succeeds

**App test:** sign in as admin → edit product → upload image. Customer checkout should work without this if images already use public URLs.

---

## Self-hosted / CLI with storage ownership

If your database allows policy SQL on `storage.objects`, you may apply the reference statements in comments at the bottom of this file’s historical migration block — not required for Supabase Cloud.
