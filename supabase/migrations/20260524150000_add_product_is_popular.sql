-- Featured / popular flag for homepage carousel (admin ProductForm).
alter table public.products
  add column if not exists is_popular boolean not null default false;

comment on column public.products.is_popular is
  'When true, product is prioritized in the storefront featured carousel.';
