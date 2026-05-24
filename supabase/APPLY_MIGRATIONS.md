# Bliss Bouquet Kenya — Supabase migration procedure

Apply migrations **in numeric order**. Do not skip steps if this is a new database.

| Step | File | Required when |
|------|------|----------------|
| 1 | `20260524000000_initial_storefront_admin_schema.sql` | Fresh project or missing core tables |
| 2 | `20260524120000_add_order_customer_delivery_columns.sql` | `orders` lacks `customer` / `delivery` columns |
| 3 | `20260524130000_checkout_support.sql` | Need profile insert + product catalog seed |
| 4 | `20260524140000_rls_policies.sql` | **Always** for canonical RLS (`bbk_*` policies) |

---

## Before you start

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project.
2. Confirm app env vars match this project:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. (Recommended) Export current policies:

```sql
select schemaname, tablename, policyname, cmd, roles
from pg_policies
where schemaname in ('public', 'storage')
order by schemaname, tablename, policyname;
```

Copy/save the result before changing policies.

---

## Method A — SQL Editor (recommended)

Repeat for **each** migration file, **one file per query**, in order.

### Step 1 — Open SQL Editor

1. Dashboard → **SQL** → **New query**.

### Step 2 — Run migration 1 (schema)

1. Open `supabase/migrations/20260524000000_initial_storefront_admin_schema.sql` in your repo.
2. Copy **the entire file** into the SQL Editor.
3. Click **Run** (or Ctrl+Enter).
4. Expect: **Success** (warnings about extensions/types are OK if objects already exist).

**Verify:**

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in ('profiles', 'products', 'orders', 'order_items', 'newsletter_subscribers');
```

You should see **5 tables**.

### Step 3 — Run migration 2 (order JSON columns)

1. New query.
2. Paste full contents of `20260524120000_add_order_customer_delivery_columns.sql`.
3. **Run**.

**Verify:**

```sql
select column_name
from information_schema.columns
where table_schema = 'public' and table_name = 'orders'
  and column_name in ('customer', 'delivery');
```

You should see **2 rows**.

### Step 4 — Run migration 3 (profile insert + product seed)

1. New query.
2. Paste full contents of `20260524130000_checkout_support.sql`.
3. If the editor warns about **destructive operations** (`DROP POLICY`) or a false **“creates table”** warning → confirm **Run** (this file does not create tables).
4. **Run**.

**Verify:**

```sql
select count(*) as product_count from public.products;
select policyname from pg_policies where tablename = 'profiles' and policyname ilike '%insert%';
```

`product_count` should be **> 0** (up to 18 if seed ran).

### Step 5 — Run migration 4 (public RLS only)

1. New query.
2. Paste full contents of `20260524140000_rls_policies.sql`.
3. Editor may warn:
   - **Destructive operations** — from `DROP POLICY IF EXISTS` on **public** `bbk_*` names only. **Safe to run.**
   - **False “creates table”** — ignore; this file does not create app tables.
4. Click **Run**. Should complete without touching `storage.*` (hosted Supabase blocks that in SQL Editor).

**Verify immediately:**

```sql
select routine_name from information_schema.routines
where routine_schema = 'public' and routine_name = 'is_admin';

select tablename, policyname, cmd
from pg_policies
where schemaname = 'public' and policyname like 'bbk_%'
order by tablename, policyname;
```

Expect **~17** rows on `public` tables. Storage is **not** in this migration.

### Step 5b — Storage (optional, admin image upload only)

Only if you need admin product image upload. See **[STORAGE_POLICIES.md](./STORAGE_POLICIES.md)** (Dashboard; do not run storage SQL in migration 4 on Cloud).

### Step 6 — Create admin user (if needed)

1. **Authentication** → **Users** → create user or use existing.
2. Set admin role in SQL (replace email):

```sql
update public.profiles
set role = 'admin'
where email = 'your-admin@example.com';
```

If no profile row exists, sign in once via the app as that user, then run the `UPDATE` again.

### Step 7 — Auth settings

1. **Authentication** → **Providers** → **Email** → enabled.
2. For local testing you may disable **Confirm email** (re-enable for production).

### Step 8 — App smoke test

```bash
npm run dev
```

| Test | Steps | Expected |
|------|--------|----------|
| Customer checkout | Sign up/in → add to cart → `/checkout` → fill form → COD → Place order | `/order-success?orderId=...` |
| My orders | `/orders` | Lists placed order |
| Admin | Sign in as admin → `/admin` | Dashboard loads |
| Admin products | `/admin/products` | List + image upload works |
| Admin orders | `/admin/orders` | List + status update |

### Step 9 — Confirm order in database

```sql
select id, user_id, status, total_amount, customer, delivery, created_at
from public.orders
order by created_at desc
limit 5;
```

---

## Method B — Supabase CLI

Only if the project is linked (`supabase link`).

```bash
cd /path/to/Bliss-Bouquet-Kenya
supabase db push
```

Then run the **verification queries** from Step 5 above in SQL Editor.

---

## If migration 4 fails on `app_role` / `is_admin()`

**Error:** `type "public.app_role" does not exist`  
**Cause:** Migration 1 not applied. **Fix:** Run migration 1, then re-run migration 4 from the **latest** repo file.

**Error:** `operator does not exist: text = app_role` at `role = 'admin'::public.app_role`  
**Cause:** (1) `profiles.role` is still **text** from an older manual table; migration 1 used `CREATE TABLE IF NOT EXISTS` and did not change the column. (2) You may be running an **old copy** of migration 4 that still casts to `app_role` inside `is_admin()`.

**Fix:**

1. Pull/open the latest `20260524140000_rls_policies.sql` — `is_admin()` must use `role::text = 'admin'` (not `'admin'::public.app_role`).
2. Run migration 4 again (full file). It converts `profiles.role` from text → `app_role` when needed.
3. Or run this once in SQL Editor, then re-run migration 4:

```sql
alter table public.profiles alter column role drop default;
alter table public.profiles
  alter column role type public.app_role
  using lower(trim(role::text))::public.app_role;
alter table public.profiles
  alter column role set default 'customer'::public.app_role;
alter table public.profiles alter column role set not null;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role::text = 'admin'
  );
$$;
```

**Verify:**

```sql
select column_name, udt_name
from information_schema.columns
where table_schema = 'public' and table_name = 'profiles' and column_name = 'role';

select pg_get_functiondef('public.is_admin()'::regprocedure);
```

---

## If migration 4 fails on storage / `supabase_storage_admin`

**Errors:** `must be owner of table objects` or `supabase_storage_admin role memberships are reserved`

**Cause:** On Supabase Cloud, `storage.objects` is platform-owned. SQL Editor cannot `ALTER` that table, `CREATE POLICY` on it, or `GRANT supabase_storage_admin` to `postgres`.

**Fix:** Use the latest migration 4 file — it ends at `public` policies and **does not include storage SQL**. Re-run the full file. Then, only if you need admin uploads, follow **[STORAGE_POLICIES.md](./STORAGE_POLICIES.md)** in the Dashboard.

Checkout and the storefront do **not** depend on storage migration SQL.

---

## Optional: remove duplicate dashboard policies (after tests pass)

If you still have old policy names *and* `bbk_*` policies, access is OR’d (usually fine). To avoid confusion, drop legacy names **only after** checkout and admin tests pass. Example:

```sql
-- Example only — adjust names to match your pg_policies list
-- drop policy if exists "Public products read" on public.products;
-- drop policy if exists "Users create own orders" on public.orders;
```

---

## Rollback migration 4 only

```sql
drop policy if exists "bbk_profiles_select_own_or_admin" on public.profiles;
drop policy if exists "bbk_profiles_insert_own" on public.profiles;
drop policy if exists "bbk_profiles_update_own" on public.profiles;
drop policy if exists "bbk_products_select_public" on public.products;
drop policy if exists "bbk_products_insert_admin" on public.products;
drop policy if exists "bbk_products_update_admin" on public.products;
drop policy if exists "bbk_products_delete_admin" on public.products;
drop policy if exists "bbk_orders_select_own_or_admin" on public.orders;
drop policy if exists "bbk_orders_insert_own" on public.orders;
drop policy if exists "bbk_orders_update_admin" on public.orders;
drop policy if exists "bbk_orders_delete_own_or_admin" on public.orders;
drop policy if exists "bbk_order_items_select_own_or_admin" on public.order_items;
drop policy if exists "bbk_order_items_insert_own" on public.order_items;
drop policy if exists "bbk_order_items_update_admin" on public.order_items;
drop policy if exists "bbk_order_items_delete_admin" on public.order_items;
drop policy if exists "bbk_newsletter_insert_public" on public.newsletter_subscribers;
drop policy if exists "bbk_newsletter_select_admin" on public.newsletter_subscribers;
drop policy if exists "bbk_storage_product_images_select_public" on storage.objects;
drop policy if exists "bbk_storage_product_images_insert_admin" on storage.objects;
drop policy if exists "bbk_storage_product_images_update_admin" on storage.objects;
drop policy if exists "bbk_storage_product_images_delete_admin" on storage.objects;
drop function if exists public.is_admin();
```

Restore previous policies from your backup export if needed.

---

## Quick checklist

- [ ] Migrations 1 → 2 → 3 → 4 run in order  
- [ ] `is_admin()` exists  
- [ ] `bbk_%` policies present on `profiles`, `products`, `orders`, `order_items`, `newsletter_subscribers`  
- [ ] (Optional) `product-images` bucket + policies per [STORAGE_POLICIES.md](./STORAGE_POLICIES.md)  
- [ ] At least one `profiles.role = 'admin'` user  
- [ ] Customer checkout completes  
- [ ] Admin CRUD works  
