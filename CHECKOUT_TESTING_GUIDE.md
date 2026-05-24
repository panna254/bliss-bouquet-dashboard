# Checkout Flow Testing Guide

This guide provides a comprehensive step-by-step approach to testing the checkout flow in Bliss Bouquet Kenya e-commerce application.

## Overview

The checkout flow involves multiple components working together:
- **Cart Context** (`CartContext.tsx`) - Manages cart state and persistence
- **Checkout Page** (`CheckoutPage.tsx`) - Main checkout UI
- **Checkout Service** (`checkout.service.ts`) - Validation and order submission
- **Payment Service** (`payment.service.ts`) - Payment confirmation
- **Order Service** (`orders.service.ts`) - Order creation and management

---

## Step-by-Step Testing Guide

### Step 1: Prerequisites Setup

**What to do:**
1. Ensure the development server is running: `npm run dev`
2. Verify Supabase connection is configured in `.env`
3. Clear browser localStorage to start fresh: `localStorage.clear()`

**Why this matters:**
- A clean state ensures no stale cart data interferes with testing
- Supabase connection is required for order persistence
- Development server must be running to serve the application

---

### Step 2: Add Products to Cart

**What to do:**
1. Navigate to the homepage (`/`)
2. Browse products in any category (Roses, Bouquets, etc.)
3. Click "Add to Cart" on at least one product
4. Open the cart panel (click cart icon in header)

**Expected behavior:**
- Toast notification appears: "Added to cart" with product name
- Cart count badge updates in header
- Cart panel shows the added item with correct name, price, and quantity

**What's happening under the hood:**
```typescript
// CartContext.tsx - addToCart function
const addToCart = (product: Product, quantity = 1) => {
  setItems(currentItems => {
    // Check if item exists, update quantity or add new
    return [...currentItems, { ...product, quantity }];
  });
  // Cart is persisted to localStorage automatically via useEffect
};
```

**Verification points:**
- [ ] Product appears in cart with correct details
- [ ] Quantity can be adjusted using +/- buttons
- [ ] Cart total updates when quantity changes
- [ ] Cart persists after page refresh (localStorage)

---

### Step 3: Navigate to Checkout

**What to do:**
1. With items in cart, click "Checkout" button in cart panel
2. Or navigate directly to `/checkout`

**Expected behavior:**
- User is redirected to checkout page
- Order summary shows all cart items
- Total price is displayed in KES currency

**What's happening under the hood:**
```typescript
// CheckoutPage.tsx - Order summary displays cart items
{items.map((item) => (
  <div key={item.id} className="flex justify-between">
    <span>{item.name} x {item.quantity}</span>
    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
  </div>
))}
```

**Verification points:**
- [ ] All cart items are displayed
- [ ] Quantities match cart
- [ ] Prices are correctly calculated
- [ ] Total matches sum of all items

---

### Step 4: Fill Contact Details

**What to do:**
Fill in the following fields:
- **Your Name**: Enter customer's full name
- **Email**: Enter a valid email address
- **Phone**: Enter phone number (e.g., 0712345678)

**Validation rules (from checkout.service.ts):**
```typescript
// Customer name is required and must not be empty
if (!requiredText(request.customer.name)) {
  errors.push("Customer name is required.");
}

// Email must match standard email format
const isValidEmail = (email: string): boolean => 
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

// Phone is required
if (!requiredText(request.customer.phone)) {
  errors.push("Customer phone is required.");
}
```

**Verification points:**
- [ ] Empty name shows error on submit
- [ ] Invalid email format shows error
- [ ] All fields accept input correctly

---

### Step 5: Fill Delivery Details

**What to do:**
Fill in the following fields:
- **Recipient Name**: Who will receive the delivery
- **Recipient Phone**: Recipient's contact number
- **City**: Delivery city (default: Nairobi)
- **Delivery Address**: Full delivery address
- **Delivery Notes** (optional): Special instructions

**Validation rules:**
```typescript
// All delivery fields are required
if (!requiredText(request.delivery.recipientName)) {
  errors.push("Recipient name is required.");
}
if (!requiredText(request.delivery.address)) {
  errors.push("Delivery address is required.");
}
if (!requiredText(request.delivery.city)) {
  errors.push("Delivery city is required.");
}
```

**Verification points:**
- [ ] Each empty required field shows appropriate error
- [ ] City defaults to "Nairobi"
- [ ] Delivery notes are optional

---

### Step 6: Select Payment Method

**What to do:**
Choose a payment method:
- **Cash on Delivery** (currently available)
- **M-Pesa** (coming soon - disabled)

**Payment confirmation logic (payment.service.ts):**
```typescript
export async function confirmPayment(request: PaymentRequest): Promise<PaymentResult> {
  if (request.paymentMethod === "cash_on_delivery") {
    return {
      success: true,
      status: "confirmed",
      reference: `cod_${request.idempotencyKey}`,
    };
  }
  // Other methods return not configured
  return {
    success: false,
    status: "failed",
    message: "Online payments are not configured yet.",
  };
}
```

**Verification points:**
- [ ] Cash on Delivery is selectable
- [ ] M-Pesa option is disabled/grayed out
- [ ] Payment method is captured in form state

---

### Step 7: Submit Order (Happy Path)

**What to do:**
1. Ensure all required fields are filled correctly
2. Click "Place Order" button

**What happens under the hood:**

The checkout process follows this sequence:

```typescript
// CheckoutPage.tsx - handleSubmit function
const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  
  // Step 1: Create checkout session (validates everything)
  const checkoutSession = await createCheckoutSession(request);
  
  // Step 2: Confirm payment
  const payment = await confirmPayment({
    idempotencyKey,
    paymentMethod,
    totals: checkoutSession.totals,
  });
  
  // Step 3: Submit order to database
  const submission = await submitOrder(request);
  
  // Step 4: Clear cart and redirect to success page
  clearCart();
  navigate(`/order-success?orderId=${submission.result.order.id}`);
};
```

**Detailed flow explanation:**

1. **createCheckoutSession()** - Validates entire checkout:
   - Checks all required fields
   - Verifies product availability via `getCheckoutProductByCartId()`
   - Calculates totals (subtotal, delivery fee, discount)
   - Generates unique checkout ID
   - Sets 15-minute expiration

2. **confirmPayment()** - Processes payment:
   - For cash_on_delivery: immediately confirms
   - Generates payment reference: `cod_{idempotencyKey}`

3. **submitOrder()** - Creates order in database:
   - Uses idempotency key to prevent duplicate orders
   - Calls `createOrder()` which:
     - Inserts order record into Supabase
     - Inserts order items
     - Returns complete order object

4. **clearCart()** - Empties cart:
   - Clears localStorage
   - Resets cart state

5. **navigate()** - Redirects to success page

**Verification points:**
- [ ] Button shows "Placing order..." during submission
- [ ] No errors appear in console
- [ ] Redirects to `/order-success` page
- [ ] Order success page shows order ID
- [ ] Cart is emptied after successful order

---

### Step 8: Verify Order Creation

**What to do:**
1. After successful checkout, note the order ID
2. Check Supabase dashboard → orders table
3. Check order_items table for line items

**Expected database state:**

`orders` table:
```
id: "uuid"
user_id: "supabase_user_id" (or null if guest)
status: "pending"
total_amount: <calculated total>
customer: { name, email, phone }
delivery: { recipientName, recipientPhone, address, city, deliveryNotes }
created_at: "timestamp"
```

`order_items` table:
```
order_id: "matches orders.id"
product_id: "product uuid"
quantity: <ordered quantity>
price_at_purchase: <product price at time of order>
```

**Verification points:**
- [ ] Order record exists with correct status "pending"
- [ ] Customer details match form input
- [ ] Delivery details match form input
- [ ] Order items match cart contents
- [ ] Total amount is correctly calculated

---

### Step 9: Test Validation Errors

**What to do:**
Intentionally submit invalid data to test validation:

**Test Case 1: Empty cart**
- Clear cart completely
- Navigate to checkout
- Try to submit

**Expected:** Error message: "Your cart is empty. Add something to your cart before placing your order."

**Test Case 2: Missing customer name**
- Leave "Your Name" field empty
- Submit form

**Expected:** Alert with error: "Customer name is required."

**Test Case 3: Invalid email**
- Enter email without @ symbol (e.g., "testemail.com")
- Submit form

**Expected:** Alert with error: "A valid customer email is required."

**Test Case 4: Missing delivery address**
- Leave "Delivery Address" empty
- Submit form

**Expected:** Alert with error: "Delivery address is required."

**Verification points:**
- [ ] Each validation error is clearly displayed
- [ ] Errors appear in alert box at top of form
- [ ] Form does not submit with invalid data
- [ ] User can correct errors and resubmit

---

### Step 10: Test Idempotency (Duplicate Prevention)

**What to do:**
1. Fill checkout form completely
2. Click "Place Order"
3. Before redirect, quickly click "Place Order" again (if possible)

**What happens under the hood:**
```typescript
// checkout.service.ts - Idempotency protection
const checkoutSubmissionsInFlight = new Map<string, Promise<...>>();
const completedCheckoutSubmissions = new Map<string, CheckoutSubmissionSuccess>();

export async function submitOrder(request: CheckoutRequest): Promise<CheckoutSubmissionResult> {
  const submissionKey = request.idempotencyKey.trim();
  
  // Check if already completed
  const completedSubmission = completedCheckoutSubmissions.get(submissionKey);
  if (completedSubmission) {
    return completedSubmission; // Return cached result
  }
  
  // Check if in progress
  const inFlightSubmission = checkoutSubmissionsInFlight.get(submissionKey);
  if (inFlightSubmission) {
    return inFlightSubmission; // Return same promise
  }
  
  // First submission - process normally
  const submission = submitOrderOnce(request, submissionKey);
  checkoutSubmissionsInFlight.set(submissionKey, submission);
  // ...
}
```

**Verification points:**
- [ ] Only one order is created despite multiple clicks
- [ ] Same order ID is returned for duplicate attempts
- [ ] No duplicate orders in database

---

### Step 11: Test Cart Persistence

**What to do:**
1. Add items to cart
2. Close browser tab completely
3. Reopen browser and navigate back to site
4. Check cart

**What happens under the hood:**
```typescript
// CartContext.tsx - Persistence logic
const restoreCartItems = (): CartItem[] => {
  const persistedCart = window.localStorage.getItem(
    checkoutCartPersistencePolicy.key // "bliss-bouquet:cart:v1"
  );
  
  // Check if cart is within TTL (24 hours)
  const persistedAt = Date.parse(parsedCart.persistedAt);
  const maxAgeMs = checkoutCartPersistencePolicy.ttlHours * 60 * 60 * 1000;
  
  if (Date.now() - persistedAt > maxAgeMs) {
    // Cart expired, clear it
    window.localStorage.removeItem(checkoutCartPersistencePolicy.key);
    return [];
  }
  
  return parsedCart.items.filter(isCartItem);
};
```

**Verification points:**
- [ ] Cart items persist after browser restart
- [ ] Cart expires after 24 hours (TTL)
- [ ] Cart is cleared after successful order

---

### Step 12: Test Order Success Page

**What to do:**
1. Complete a successful checkout
2. Observe the order success page

**Expected content:**
- Order confirmation message
- Order ID display
- Order details summary
- Link to view orders (if logged in)
- Continue shopping button

**Verification points:**
- [ ] Order ID matches database record
- [ ] Customer details are displayed
- [ ] Order items are listed correctly
- [ ] Total amount is shown
- [ ] Navigation options work correctly

---

## Testing Checklist Summary

Use this checklist to verify the complete checkout flow:

### Pre-Checkout
- [ ] Can browse products
- [ ] Can add products to cart
- [ ] Cart displays correct items and totals
- [ ] Cart persists across page refreshes

### Checkout Form
- [ ] Contact details section works
- [ ] Delivery details section works
- [ ] Payment method selection works
- [ ] Order summary displays correctly

### Validation
- [ ] Empty cart shows error
- [ ] Missing name shows error
- [ ] Invalid email shows error
- [ ] Missing phone shows error
- [ ] Missing delivery details show errors

### Order Submission
- [ ] Valid form submits successfully
- [ ] Loading state shows during submission
- [ ] Order is created in database
- [ ] Cart is cleared after success
- [ ] Redirect to success page works

### Post-Order
- [ ] Order appears in database with correct data
- [ ] Order success page shows correct information
- [ ] No duplicate orders from double-clicks

### Edge Cases
- [ ] Cart expires after 24 hours
- [ ] Idempotency prevents duplicate orders
- [ ] Network errors are handled gracefully

---

## Common Issues and Debugging

### Issue: Cart doesn't persist
**Check:** Browser localStorage for key `bliss-bouquet:cart:v1`
**Fix:** Ensure no localStorage errors in console

### Issue: Order creation fails
**Check:** Supabase RLS policies on `orders` and `order_items` tables
**Fix:** Verify user has INSERT permissions

### Issue: Validation errors don't show
**Check:** Error state in CheckoutPage component
**Fix:** Ensure `setErrorMessages()` is called with errors array

### Issue: Payment confirmation fails
**Check:** Payment service returns `success: false`
**Fix:** Use "cash_on_delivery" payment method (only one configured)

---

## Automated Testing

The project includes smoke tests that verify checkout-related functionality:

```bash
# Run smoke tests
npm test -- tests/smoke/storefront-smoke.test.mjs
```

Key tests include:
- Cart totals calculation
- Routing verification
- Product data flow

---

## Additional Resources

- **Checkout Service**: `src/services/checkout.service.ts`
- **Payment Service**: `src/services/payment.service.ts`
- **Order Service**: `src/services/orders.service.ts`
- **Cart Context**: `src/contexts/CartContext.tsx`
- **Checkout Page**: `src/pages/CheckoutPage.tsx`
- **Order Success Page**: `src/pages/OrderSuccessPage.tsx`