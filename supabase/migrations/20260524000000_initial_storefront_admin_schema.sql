-- Bliss Bouquet Kenya storefront + admin database foundation.
-- Safe to run in Supabase SQL editor or through Supabase migrations.

create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists "citext" with schema extensions;

do $$
begin
  create type public.app_role as enum ('customer', 'admin');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum (
    'pending',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email extensions.citext not null unique,
  role public.app_role not null default 'customer',
  created_at timestamptz not null default now()
);

-- Dashboard/manual profiles often have role as text; align with app_role when re-running migration 1.
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

create table if not exists public.products (
  id uuid primary key default extensions.gen_random_uuid(),
  name text not null,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  image_url text not null,
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default extensions.gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  total_amount numeric(12, 2) not null check (total_amount >= 0),
  status public.order_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default extensions.gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  price_at_purchase numeric(12, 2) not null check (price_at_purchase >= 0)
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default extensions.gen_random_uuid(),
  email extensions.citext not null unique,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_created_at on public.profiles(created_at desc);

create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_created_at on public.products(created_at desc);
create index if not exists idx_products_category_created_at on public.products(category, created_at desc);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_created_at on public.orders(created_at desc);
create index if not exists idx_orders_user_created_at on public.orders(user_id, created_at desc);

create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_product_id on public.order_items(product_id);

create index if not exists idx_newsletter_subscribers_created_at
  on public.newsletter_subscribers(created_at desc);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_subscribers enable row level security;

comment on table public.profiles is 'Application profile records keyed to Supabase auth.users.';
comment on table public.products is 'Storefront/admin product catalog.';
comment on table public.orders is 'Order headers. user_id is nullable to preserve order history if a profile is removed.';
comment on table public.order_items is 'Order line items with purchase-time pricing.';
comment on table public.newsletter_subscribers is 'Newsletter opt-in emails collected from the storefront.';
