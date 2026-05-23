# Supabase Integration Codex Prompt

Use this prompt with a code-generation agent (Codex) to implement Supabase backend integration for the admin dashboard and checkout.

Project: Bliss-Bouquet-Kenya (Vite + React + TypeScript)
Goal: Integrate Supabase as the backend for admin dashboard data (products, orders, customers, settings) and implement a safe checkout flow that persists orders to Supabase. Keep the storefront UI unchanged and avoid bundling admin-only code into public builds.

---

## Top-level requirements (must follow)

- Do not modify or remove public header/footer or their imports; admin UI must be isolated.
- Admin code must be lazy-loaded and behind `/admin` routes and `RequireAdmin` guard.
- Never store Supabase service role key in client bundle. Use serverless functions (Netlify Functions) for privileged operations.
- Use environment flags to enable agent or admin features (example: `VITE_ENABLE_BOLT_AGENT` and `VITE_ENABLE_ADMIN=true`).
- Use `@supabase/supabase-js` with TypeScript types and `react-query` for data fetching.
- Provide robust error handling and clear console/server logs; return user-friendly errors to UI.
- Keep changes minimal and well-scoped to the suggested files below.

---

## Supabase setup instructions (for human / operator)

1. Create a Supabase project.
2. In Supabase Settings > API note the `SUPABASE_URL` and `SUPABASE_ANON_KEY` for client, and create a `SERVICE_ROLE_KEY` for server functions.
3. Create a storage bucket `product-images` (public=false; use signed URLs).
4. Run the SQL below in Supabase SQL editor to create database schema:

```sql
-- products table
create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sku text,
  description text,
  price numeric not null,
  original_price numeric,
  category text,
  image_url text,
  stock int default 0,
  status text default 'active',
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- customers table
create table customers (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  created_at timestamptz default now()
);

-- orders table
create table orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete set null,
  total numeric not null,
  status text default 'pending',
  instructions text,
  placed_at timestamptz default now(),
  metadata jsonb
);

-- order_items table
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  quantity int not null,
  unit_price numeric not null
);

-- admin_users table (basic)
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text default 'admin',
  created_at timestamptz default now()
);
```

### RLS/Policies (recommended)

- Allow anon selects on `products` (for storefront).
- Restrict inserts on `orders` to authenticated requests or allow via serverless `placeOrder` endpoint that uses service role.
- Admin operations (products CRUD) must be accessible only to authenticated admin users or via server-side endpoints using `SERVICE_ROLE_KEY`.

---

## Env variables

- For client: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ENABLE_BOLT_AGENT=false`
- For serverless: `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_URL`

---

## Packages to add

- `npm install @supabase/supabase-js`
- (if not present) `npm install @tanstack/react-query`

---

## Files to create or update (exact paths)

- Add:
  - `src/services/supabaseClient.ts` — export a client initialized with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  - `src/services/adminApi.ts` — frontend wrapper using `supabaseClient` and `react-query` hooks to fetch products/orders/customers (read-only for client; mutations should use server endpoints)
  - `src/pages/checkout/Checkout.tsx` — new checkout form page that collects customer details
  - `src/pages/checkout/CheckoutReview.tsx` — review + submit page
  - `src/pages/checkout/Confirmation.tsx` — display order confirmation
  - `netlify/functions/placeOrder.ts` — Netlify serverless function to create an order transactionally using `SERVICE_ROLE_KEY`
  - `netlify/functions/supabaseAdmin.ts` — serverless admin handler for product creation/update/delete requiring auth (use a simple API key env or JWT verification)
  - `src/agents/bolt/BoltAgent.tsx` — agent component (lazy-load in admin only)
- Modify:
  - `src/contexts/CartContext.tsx` — add a `placeOrder` method that calls `/api/placeOrder` serverless function; keep existing cart behavior otherwise
  - `src/App.tsx` — add admin route subtree entrypoint only (example route `<Route path="/admin" element={<RequireAdmin><AdminLayout/></RequireAdmin>}>`), ensure added above `*` route
  - `src/pages/admin/AdminProducts.tsx` — update to fetch products from `adminApi` instead of local `src/data` when `VITE_ENABLE_ADMIN` is true; otherwise fall back.

---

## Implementation details and code snippets (must include)

### 1. `src/services/supabaseClient.ts` (TS)

```ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 2. `netlify/functions/placeOrder.ts` (Node, use ESM or CommonJS per Netlify config)

- Use `@supabase/supabase-js`
- Use `SUPABASE_SERVICE_ROLE_KEY` to instantiate server-side client
- Accept POST JSON: { customer: {name,email,phone}, address?, items: [{productId, quantity, unit_price}], instructions }
- Transactionally:
  - Upsert customer
  - Insert order record
  - Insert order_items
  - Optionally decrease product stock (careful: require service role)
- Return `{ orderId, status }` or error

Example skeleton (Node/TS):

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405 };
  try {
    const payload = JSON.parse(event.body);
    // validate payload
    // upsert customer -> get customer_id
    // begin transaction via RPC or sequential inserts (Supabase supports rpc or using Postgres function)
    // insert order, items
    // return success
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
```

### 3. `src/contexts/CartContext.tsx` changes (outline)

- Add `placeOrder = async (customerInfo) => { POST /api/placeOrder with cart items & customer; on success clearCart(); return orderId }`
- Keep existing methods and UI flows intact.

### 4. `src/services/adminApi.ts` (client wrapper)

- Example functions: `fetchProducts()`, `fetchOrders()`, `fetchCustomers()`
- Use `react-query` `useQuery` wrappers for caching and refetch.

### 5. Lazy-loading admin pages:

```tsx
const AdminLayout = React.lazy(() => import('@/components/admin/AdminLayout'));
...
<Route path="/admin" element={<RequireAdmin><Suspense fallback={<div>Loading...</div>}><AdminLayout/></Suspense></RequireAdmin>}>
```

### 6. Serverless Admin endpoint `netlify/functions/supabaseAdmin.ts`

- Use `SUPABASE_SERVICE_ROLE_KEY`
- Authenticate using a simple admin API key passed in header `x-admin-key` which you validate against env `ADMIN_API_KEY` (or validate JWT)
- Expose limited actions: `createProduct`, `updateProduct`, `deleteProduct`, `uploadImage` (generate signed upload URL), `updateOrderStatus`
- Ensure strict input validation and logging.

---

## Security and non-breaking considerations

- Avoid direct client-side product writes. Use serverless `supabaseAdmin` or authenticated supabase calls with users that have admin rights.
- Do not change any public imports or user-facing components; only add new files and the admin route subtree.
- Ensure new packages are added to `package.json` only if needed (`@supabase/supabase-js`).
- Add env-based feature gating so production builds do not enable admin unless vars are set.

---

## Testing and verification steps (for Codex to perform)

- Add unit tests or quickly run the dev server to sanity-check build: `npm run dev`
- Confirm `supabaseClient` builds and imports are tree-shaken away from the storefront if `VITE_ENABLE_ADMIN` is false (admin imports only in lazy routes).
- Simulate placing an order with a mocked serverless function (or local env service role) and verify cart clears and confirmation page works.
- Verify that `netlify/functions/placeOrder.ts` does not return supabase service role in responses.

---

## Acceptance criteria (what success looks like)

- Frontend builds and runs without runtime errors.
- Admin routes are only loaded when visiting `/admin` and are not bundled into the main storefront chunk.
- Orders placed via `/checkout` are persisted to Supabase via `netlify/functions/placeOrder`.
- Admin CRUD operations for products use server-side endpoints and require `ADMIN_API_KEY` to change data.
- No Supabase service keys appear in client bundle or console logs.
- Provide minimal README update describing required environment variables and migration SQL.

---

## Deliverables expected from Codex

- All new files listed above with working TypeScript/JS code (or clear notes if serverless target requires JS).
- `netlify/functions/placeOrder.ts` and `netlify/functions/supabaseAdmin.ts` serverless functions.
- Example changes to `src/contexts/CartContext.tsx` and new checkout page files.
- A short `README.md` section addition showing how to set env vars and run migrations.

---

## Constraints & style

- Use TypeScript for frontend files (TSX) and Node/JS for Netlify functions unless project already uses TypeScript serverless handlers.
- Keep code conservative, well-commented, and minimal.
- Do not change existing `src/components/Header.tsx` or other public components.
- Add console.error logs on serverless failures and return HTTP 500 with safe messages.
- Keep functions idempotent and validate inputs.

---

## If you encounter missing information

- Ask for Supabase project URL and admin API key storage location.
- Ask whether you should implement serverless in Netlify Functions or a different provider (default to Netlify because `netlify.toml` exists).

---

End of prompt
