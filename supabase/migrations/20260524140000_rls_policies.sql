-- Bliss Bouquet Kenya — Row Level Security policies (idempotent).
-- Does NOT create or alter application tables/columns (except types below when missing).
-- Admin checks use public.is_admin() → profiles.role = 'admin' (never JWT metadata).
--
-- Safe to re-run: drops only policies with the "bbk_" names defined below, then recreates them.
-- Existing dashboard policies with other names are left in place (see supabase/README.md).
--
-- If migration 1 was skipped (manual tables), app_role may be missing — create it here so
-- is_admin() and any enum-typed profiles.role columns work. Run migration 1 when possible.

do $$
begin
  create type public.app_role as enum ('customer', 'admin');
exception
  when duplicate_object then null;
end $$;

-- profiles.role as text (manual setup) → app_role (migration 1 may have skipped via IF NOT EXISTS).
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'profiles'
      and column_name = 'role'
      and data_type in ('text', 'character varying')
  ) then
    alter table public.profiles alter column role drop default;
    alter table public.profiles
      alter column role type public.app_role
      using (
        case
          when role is null or trim(role::text) = '' then 'customer'
          else lower(trim(role::text))
        end
      )::public.app_role;
    alter table public.profiles
      alter column role set default 'customer'::public.app_role;
    alter table public.profiles alter column role set not null;
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Helper: admin role from profiles (SECURITY DEFINER avoids RLS recursion on profiles)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role::text = 'admin'
  );
$$;

comment on function public.is_admin() is
  'True when the current auth user has profiles.role = admin. Used by RLS policies only.';

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_admin() to service_role;

-- ---------------------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------------------
drop policy if exists "bbk_profiles_select_own_or_admin" on public.profiles;
create policy "bbk_profiles_select_own_or_admin"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "bbk_profiles_insert_own" on public.profiles;
create policy "bbk_profiles_insert_own"
  on public.profiles
  for insert
  to authenticated
  with check (id = auth.uid());

drop policy if exists "bbk_profiles_update_own" on public.profiles;
create policy "bbk_profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- PRODUCTS (storefront read + admin catalog management)
-- ---------------------------------------------------------------------------
drop policy if exists "bbk_products_select_public" on public.products;
create policy "bbk_products_select_public"
  on public.products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "bbk_products_insert_admin" on public.products;
create policy "bbk_products_insert_admin"
  on public.products
  for insert
  to authenticated
  with check (public.is_admin());

drop policy if exists "bbk_products_update_admin" on public.products;
create policy "bbk_products_update_admin"
  on public.products
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "bbk_products_delete_admin" on public.products;
create policy "bbk_products_delete_admin"
  on public.products
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- ORDERS (customer checkout + admin order management)
-- ---------------------------------------------------------------------------
drop policy if exists "bbk_orders_select_own_or_admin" on public.orders;
create policy "bbk_orders_select_own_or_admin"
  on public.orders
  for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "bbk_orders_insert_own" on public.orders;
create policy "bbk_orders_insert_own"
  on public.orders
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "bbk_orders_update_admin" on public.orders;
create policy "bbk_orders_update_admin"
  on public.orders
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Required by orders.service createOrder rollback when order_items insert fails.
drop policy if exists "bbk_orders_delete_own_or_admin" on public.orders;
create policy "bbk_orders_delete_own_or_admin"
  on public.orders
  for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------------
-- ORDER_ITEMS (line items tied to owning order)
-- ---------------------------------------------------------------------------
drop policy if exists "bbk_order_items_select_own_or_admin" on public.order_items;
create policy "bbk_order_items_select_own_or_admin"
  on public.order_items
  for select
  to authenticated
  using (
    public.is_admin()
    or exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists "bbk_order_items_insert_own" on public.order_items;
create policy "bbk_order_items_insert_own"
  on public.order_items
  for insert
  to authenticated
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
    )
  );

drop policy if exists "bbk_order_items_update_admin" on public.order_items;
create policy "bbk_order_items_update_admin"
  on public.order_items
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "bbk_order_items_delete_admin" on public.order_items;
create policy "bbk_order_items_delete_admin"
  on public.order_items
  for delete
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- NEWSLETTER_SUBSCRIBERS
-- ---------------------------------------------------------------------------
drop policy if exists "bbk_newsletter_insert_public" on public.newsletter_subscribers;
create policy "bbk_newsletter_insert_public"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "bbk_newsletter_select_admin" on public.newsletter_subscribers;
create policy "bbk_newsletter_select_admin"
  on public.newsletter_subscribers
  for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- STORAGE (intentionally omitted — hosted Supabase)
-- storage.objects / storage.buckets are platform-owned. SQL Editor cannot:
--   - ALTER TABLE storage.objects
--   - CREATE/DROP POLICY on storage.objects
--   - GRANT supabase_storage_admin (reserved; only platform superusers)
-- Checkout and storefront use public.* tables only — they do not need this section.
-- Admin product image upload needs bucket + policies via Dashboard:
--   see supabase/STORAGE_POLICIES.md
-- ---------------------------------------------------------------------------
