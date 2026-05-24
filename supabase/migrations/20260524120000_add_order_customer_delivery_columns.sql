alter table public.orders
  add column if not exists customer jsonb not null default '{}'::jsonb,
  add column if not exists delivery jsonb not null default '{}'::jsonb;

comment on column public.orders.customer is 'Serialized customer contact details for order history.';
comment on column public.orders.delivery is 'Serialized delivery details for order history.';
