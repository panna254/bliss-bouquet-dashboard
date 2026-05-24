# Supabase setup (Bliss Bouquet Kenya)

Apply migrations **in filename order** in the Supabase SQL Editor (or `supabase db push`).

| Order | File | Purpose |
|------|------|---------|
| 1 | `20260524000000_initial_storefront_admin_schema.sql` | Tables, enums, RLS enabled |
| 2 | `20260524120000_add_order_customer_delivery_columns.sql` | `orders.customer`, `orders.delivery` |
| 3 | `20260524130000_checkout_support.sql` | Profile insert policy + product catalog seed |

If you already created tables or policies manually:

- Ensure `orders` has `customer` and `delivery` jsonb columns (migration 2).
- Your existing RLS policies are fine if customers can **read products**, **insert/read own orders**, and **insert/read own order_items**.
- Run migration 3 anyway for the **profile insert** policy and **product seed** (skips duplicates).

## Checkout test checklist

1. `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Migrations 1–3 applied.
3. Customer account signed in (checkout requires login).
4. Cart item exists in Supabase with matching **name + category** (seed handles this).
5. Checkout form filled; payment = **Cash on delivery**.

Verify order:

```sql
select id, user_id, status, total_amount, customer, delivery, created_at
from public.orders
order by created_at desc
limit 3;
```
