import type { Order, OrderCustomer, OrderDeliveryDetails } from "@/services/orders.service";

export type PaymentMethod = "mpesa" | "card" | "cash_on_delivery";
export type CheckoutEndpoint = "/.netlify/functions/checkout";
export type CartClearancePolicy = "confirmed_order_only";

export interface CheckoutTotals {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
}

export interface CheckoutLineItem {
  productId: string;
  quantity: number;
}

export interface CheckoutCartSnapshot {
  cartId: string;
  persistedAt: string;
  itemCount: number;
}

export interface CheckoutRequest {
  idempotencyKey: string;
  customer: OrderCustomer;
  delivery: OrderDeliveryDetails;
  items: CheckoutLineItem[];
  paymentMethod: PaymentMethod;
  promoCode?: string;
  cartSnapshot?: CheckoutCartSnapshot;
}

export interface CheckoutSession {
  checkoutId: string;
  expiresAt: string;
  totals: CheckoutTotals;
  paymentMethod: PaymentMethod;
}

export interface CheckoutValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface CheckoutResult {
  order: Order;
  checkoutId: string;
  confirmedAt: string;
  cartClearance: {
    canClearCart: true;
    policy: CartClearancePolicy;
  };
  paymentReference?: string;
}

export interface CheckoutCartPersistencePolicy {
  storage: "localStorage";
  key: "bliss-bouquet:cart:v1";
  ttlHours: 24;
  clearOn: CartClearancePolicy;
}

export interface CheckoutService {
  validateCheckout(request: CheckoutRequest): Promise<CheckoutValidationResult>;
  createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession>;
  submitCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
}

export const checkoutEndpoint: CheckoutEndpoint = "/.netlify/functions/checkout";

export const checkoutCartPersistencePolicy: CheckoutCartPersistencePolicy = {
  storage: "localStorage",
  key: "bliss-bouquet:cart:v1",
  ttlHours: 24,
  clearOn: "confirmed_order_only",
};

export async function validateCheckout(request: CheckoutRequest): Promise<CheckoutValidationResult> {
  throw new Error("Not implemented");
}

export async function createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
  throw new Error("Not implemented");
}

export async function submitCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
  throw new Error("Not implemented");
}
