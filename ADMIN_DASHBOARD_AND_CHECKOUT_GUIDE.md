# Admin Dashboard & Checkout Integration Guide

This guide describes how to add a seamless admin dashboard and a fully functioning cart checkout workflow to the Bliss Bouquet Kenya application.

It is written conservatively and precisely for a frontend engineer working in the existing Vite + React + TypeScript codebase.

---

## 1. Goals

- Build a protected admin dashboard under `/admin`
- Keep public storefront routes unchanged
- Reuse existing UI primitives and state patterns
- Add a robust cart checkout flow for customers
- Enable admin management of products, orders, and customers

---

## 2. Existing App Context

The current app has:

- `src/App.tsx` using `react-router-dom` v6
- public pages under `src/pages/*`
- reusable UI components under `src/components/ui/*`
- static catalog data under `src/data/products.ts`
- cart state in `src/contexts/CartContext.tsx`
- public layout and header in `src/components/Header.tsx`

The dashboard should be added as a separate route subtree and should not interfere with the public storefront experience.

---

## 3. Admin Dashboard Architecture

### 3.1 Recommended route structure

Add admin routes in `src/App.tsx` after the public routes and before the catch-all route:

- `/admin` → `AdminLayout`
- `/admin/dashboard` → `AdminDashboard`
- `/admin/products` → `AdminProducts`
- `/admin/orders` → `AdminOrders`
- `/admin/customers` → `AdminCustomers`
- `/admin/settings` → `AdminSettings`

### 3.2 Folder structure

Create:

- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/admin/AdminProducts.tsx`
- `src/pages/admin/AdminOrders.tsx`
- `src/pages/admin/AdminCustomers.tsx`
- `src/pages/admin/AdminSettings.tsx`
- `src/components/admin/AdminLayout.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/contexts/AdminAuthContext.tsx`
- `src/services/adminApi.ts`

This isolates the admin UI and keeps it separate from public pages.

### 3.3 Layout responsibilities

`AdminLayout` should contain:

- a left sidebar or top navigation for admin sections
- header with admin breadcrumbs and user actions
- an `Outlet` for nested admin routes
- layout styling distinct from the storefront but consistent with the app’s theme

`AdminSidebar` should expose links for:

- Dashboard
- Products
- Orders
- Customers
- Settings

### 3.4 Admin route guard

Protect admin routes with an auth context.

Create `AdminAuthContext` to manage:

- login status
- authentication token or session state
- login/logout actions
- route protection logic

Create a wrapper component `RequireAdmin` that redirects to a login page if the user is not authenticated.

Example route pattern:

```tsx
<Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
  <Route index element={<AdminDashboard />} />
  <Route path="products" element={<AdminProducts />} />
  <Route path="orders" element={<AdminOrders />} />
  <Route path="customers" element={<AdminCustomers />} />
  <Route path="settings" element={<AdminSettings />} />
</Route>
```

### 3.5 Admin authentication options

For a conservative first version, use one of these options:

- a local login page with credentials stored in environment variables or a simple API
- a mock admin token stored in `localStorage`
- a backend-authenticated token when available

Do not expose admin actions to unauthenticated users.

---

## 4. Admin Data Model

### 4.1 Product model extension

The existing `Product` type is a good base. Extend it for admin needs:

- `sku?: string`
- `stock?: number`
- `status?: 'active' | 'inactive' | 'archived'`
- `tags?: string[]`
- `variant?: string`
- `featured?: boolean`
- `image?: string`

### 4.2 Orders model

Add an `Order` type with fields like:

- `id: string`
- `customerName: string`
- `customerEmail: string`
- `phone: string`
- `deliveryAddress: string`
- `items: Array<{ productId: string; quantity: number; price: number }>`
- `total: number`
- `status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'`
- `placedAt: string`
- `notes?: string`

### 4.3 Customer model

Add `Customer` data for admin insights:

- `id: string`
- `name: string`
- `email: string`
- `phone: string`
- `orders: string[]`
- `createdAt: string`

### 4.4 Admin API service

Create `src/services/adminApi.ts` with functions like:

- `fetchProducts()`
- `createProduct(product)`
- `updateProduct(product)`
- `deleteProduct(productId)`
- `fetchOrders()`
- `updateOrderStatus(orderId, status)`
- `fetchCustomers()`
- `fetchSettings()`
- `updateSettings(payload)`

Use `react-query` for data fetching and caching in admin pages.

---

## 5. Admin Pages Checklist

### 5.1 `AdminDashboard`

Should show:

- product count
- order count
- pending orders
- total revenue estimate
- low stock alerts
- latest orders table
- quick links to product and order management

### 5.2 `AdminProducts`

Should support:

- list of products
- product search and filtering
- edit product details
- create a new product
- delete or archive a product
- toggle same-day and popular flags
- update pricing and description

### 5.3 `AdminOrders`

Should support:

- list of orders
- search by order ID, email, phone, status
- filter by status
- edit status and add notes
- view order details, items, totals, and delivery instructions

### 5.4 `AdminCustomers`

Should support:

- list of customer profiles
- search by name or email
- view order history per customer
- optionally store contact notes

### 5.5 `AdminSettings`

Should support:

- business information
- delivery hours and pricing rules
- payment methods
- admin account settings

---

## 6. Checkout & Cart Flow

A fully functioning checkout workflow should be built incrementally and conservatively.

### 6.1 Cart state review

Current cart is managed in `src/contexts/CartContext.tsx` with:

- `items`
- `addToCart`
- `removeFromCart`
- `updateQuantity`
- `clearCart`
- `isCartOpen`
- `toggleCart`

This is a solid base. The checkout flow should extend it with customer details and order submission.

### 6.2 Required checkout pages

Add or extend pages for:

- `/checkout` — input customer details and delivery instructions
- `/checkout/review` — review items and totals before payment
- `/checkout/confirmation` — order success screen

### 6.3 Checkout form fields

Collect the minimum required checkout information:

- customer name
- email
- phone number
- delivery address
- optional delivery instructions
- selected delivery date or time slot if needed

### 6.4 Payment integration strategy

For a frontend-only MVP, choose one of these conservative paths:

- collect checkout data and show an order confirmation screen without real payment
- integrate a local or backend payment endpoint later
- add a “Payment pending” / “Complete payment offline” flow for cash/mobile money

If payment is added later, keep the checkout flow modular so payment can be inserted between review and confirmation.

### 6.5 Order submission workflow

The checkout process should:

1. Read cart items from `CartContext`
2. Show product totals and shipping options
3. Collect customer details
4. Validate required fields
5. Send the order payload to the backend or local order storage
6. Clear the cart after successful submission
7. Redirect to `OrderConfirmation`

### 6.6 Example order payload

```ts
const orderPayload = {
  customerName,
  email,
  phone,
  address,
  instructions,
  items: cartItems.map(item => ({
    productId: item.id,
    quantity: item.quantity,
    price: item.price,
  })),
  subtotal,
  total,
  status: 'pending',
  placedAt: new Date().toISOString(),
};
```

### 6.7 Cart UX improvements

Improve the cart experience by adding:

- persisted cart between reloads using `localStorage`
- quantity controls on the cart panel
- a clear “Checkout” CTA in the cart
- order summary with subtotal and item counts
- cart validation before checkout

---

## 7. Implementation Prompts

Use these prompts while implementing the feature.

### 7.1 Admin components

- “Create a dedicated admin layout component with sidebar navigation and nested route support.”
- “Build a guarded admin section under `/admin` using `react-router-dom` nested routes.”
- “Implement an `AdminAuthContext` to manage login state and restrict access to admin pages.”

### 7.2 Admin pages

- “Create `AdminProducts` with a table view that supports searching, filtering, and editing products.”
- “Create `AdminOrders` with order status updates, order details, and quick filters.”
- “Create `AdminCustomers` to inspect customer profiles and purchase history.”

### 7.3 Checkout

- “Extend the cart system into a full checkout flow with customer details, order review, and post-confirmation page.”
- “Keep payment integration optional by first building a mock order submission with success confirmation.”
- “Persist cart state in `localStorage` so the customer does not lose their order while navigating.”

### 7.4 Data management

- “Use `react-query` in admin pages to load and update product and order data cleanly.”
- “Create a shared `adminApi` service that returns product, order, and customer data.”
- “Use a common `Product` interface and extend it for admin-specific fields.”

### 7.5 UX and security

- “Hide admin navigation from the public storefront and do not include admin links in the public header.”
- “Use a separate admin color scheme or layout style so the dashboard is visually distinct.”
- “Protect admin pages with authentication, even if the first version uses a simple token.”

### 7.6 Bolt AI (JSX) Agent Integration
If you want a safe, maintainable Bolt-style JSX agent for admin workflows, add a small, strictly-isolated integration that cannot break the storefront. The goal: provide AI-assisted suggestions (product copy, SEO keywords, quick edits) while requiring explicit admin confirmation for any changes.

Key principles
- Isolation: agent UI and runtime code must live under `src/agents/bolt/` and be lazy-loaded by admin routes only. The public storefront must not import or bundle agent modules.
- No client-side secrets: never place provider API keys in browser code. Use a server-side proxy (`/api/bolt`) or serverless function that holds keys and forwards requests.
- No direct global mutations: the agent returns suggestions. Any write operations must call existing `adminApi` endpoints or be applied by the admin through controlled handlers.
- Defensive UX: the agent should display network errors, retries, and a clear "Apply" confirmation step. It must be feature-flagged (disabled by default) until backend proxies and monitoring are in place.

Minimal file layout
- `src/agents/bolt/BoltAgent.tsx` — lazy-loaded UI component (JSX/TSX) with internal error handling
- `src/agents/bolt/index.ts` — exports and small helpers
- `src/agents/bolt/types.ts` — types for prompts and responses
- `src/pages/admin/AdminAgent.tsx` — optional admin route wrapper or modal launcher

Safe integration pattern
1. Add a server-side proxy endpoint `POST /api/bolt` that accepts `{ prompt }`, calls the external provider with server-held credentials, and returns a sanitized response. Implement rate-limiting and request logging server-side.
2. Create `BoltAgent` as a self-contained component that posts prompts to `/api/bolt`. Show loading, error, and result states. Do not import app globals directly.
3. Lazy-load `BoltAgent` in admin pages using `React.lazy` + `Suspense` so it is not part of the public bundle.
4. When an admin chooses to apply a suggestion, call `adminApi.updateProduct(...)` or another explicit mutation endpoint; do not mutate `CartContext` or other global client-only contexts directly.
5. Wrap agent features in an environment toggle such as `VITE_ENABLE_BOLT_AGENT` and keep it `false` in production until backend proxy and monitoring are validated.

Robust TSX sketch (safe, minimal, with error handling)

```tsx
// src/agents/bolt/BoltAgent.tsx
import React, { useState } from 'react';
import type { SuggestionResponse } from './types';

export default function BoltAgent({ onApply }: { onApply?: (payload: any) => Promise<void> }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SuggestionResponse | null>(null);

  const run = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/bolt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const json = await res.json();
      setResult(json as SuggestionResponse);
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <label className="block text-sm font-medium mb-1">Prompt</label>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-36 p-2 border rounded"
        aria-label="Bolt prompt"
      />

      <div className="mt-3 flex gap-2">
        <button onClick={run} disabled={loading || !prompt} className="btn">
          {loading ? 'Running...' : 'Run'}
        </button>
        {result && onApply && (
          <button
            onClick={() => onApply(result.suggestion)}
            className="btn-outline"
          >
            Apply suggestion
          </button>
        )}
      </div>

      {error && <div className="mt-3 text-destructive">Error: {error}</div>}

      {result && (
        <div className="mt-4 bg-muted p-3 rounded">
          <h4 className="font-semibold">Suggestion</h4>
          <pre className="whitespace-pre-wrap">{result.text}</pre>
        </div>
      )}
    </div>
  );
}
```

Operational safety checklist
- Keep the agent files out of public imports and lazy-load them.
- Use a secure server-side proxy for provider calls; log, monitor, and rate-limit.
- Require explicit admin confirmation before any data mutation; always call `adminApi` endpoints for writes.
- Add UI fallbacks: show friendly error messages, allow retry, and avoid silent failures.
- Use an env toggle to disable the agent instantly if something goes wrong in production.

This approach provides a useful Bolt-style agent while preserving the storefront's stability and minimizing the risk of shipping runtime errors or leaking secrets.
---

## 8. Recommended Minimal Implementation Sequence

1. Add the admin route subtree in `src/App.tsx`.
2. Add `src/components/admin/AdminLayout.tsx` and `src/components/admin/AdminSidebar.tsx`.
3. Add a protected dummy admin page at `/admin/dashboard`.
4. Add `src/contexts/AdminAuthContext.tsx` and wire `RequireAdmin`.
5. Add checkout pages and connect them to `CartContext`.
6. Add order submission logic with a confirmation screen.
7. Replace mock admin data with real API calls once backend endpoints exist.

---

## 9. Developer Notes

- Keep admin and storefront state separate where possible.
- Reuse existing `Button`, `Badge`, `Card`, `Table`, `Dialog`, and `Form` UI components.
- Keep route additions isolated and add admin routes above the global `*` fallback.
- Keep product metadata, order data, and settings data well organized in a dedicated `services` or `data` folder.
- Treat the checkout flow as user-critical; validate all required fields before order submission.

---

## 10. Suggested File Names

- `src/components/admin/AdminLayout.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/pages/admin/AdminDashboard.tsx`
- `src/pages/admin/AdminProducts.tsx`
- `src/pages/admin/AdminOrders.tsx`
- `src/pages/admin/AdminCustomers.tsx`
- `src/pages/admin/AdminSettings.tsx`
- `src/contexts/AdminAuthContext.tsx`
- `src/services/adminApi.ts`
- `src/pages/checkout/Checkout.tsx`
- `src/pages/checkout/CheckoutReview.tsx`
- `src/pages/checkout/Confirmation.tsx`

<!-- Bolt agent files -->
- `src/agents/bolt/BoltAgent.tsx`
- `src/agents/bolt/index.ts`
- `src/agents/bolt/types.ts`
- `src/pages/admin/AdminAgent.tsx`

---

## 11. Final Summary

A clean admin dashboard integration should:

- remain isolated from the public store routes
- use a dedicated admin layout and route protection
- manage admin product, order, and customer data separately
- reuse the current UI system and `react-query`
- extend the cart context into a checkout workflow with validation, order submission, and confirmation

By following this guide, the app will gain a maintainable admin experience and a customer-facing checkout flow without destabilizing the existing storefront.
