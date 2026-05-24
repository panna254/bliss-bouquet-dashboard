import { getCheckoutProductByCartId } from "@/services/products.service";
import { createOrder, type Order, type OrderCustomer, type OrderDeliveryDetails, type OrderItem } from "@/services/orders.service";

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
  totals?: CheckoutTotals;
  orderItems?: OrderItem[];
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

export type CheckoutFailureCode =
  | "validation_failed"
  | "duplicate_submission"
  | "order_persistence_failed";

export interface CheckoutSubmissionSuccess {
  success: true;
  result: CheckoutResult;
}

export interface CheckoutSubmissionFailure {
  success: false;
  code: CheckoutFailureCode;
  errors: string[];
  cartClearance: {
    canClearCart: false;
    policy: CartClearancePolicy;
  };
}

export type CheckoutSubmissionResult = CheckoutSubmissionSuccess | CheckoutSubmissionFailure;

export interface CheckoutCartPersistencePolicy {
  storage: "localStorage";
  key: "bliss-bouquet:cart:v1";
  ttlHours: 24;
  clearOn: CartClearancePolicy;
}

export interface CheckoutService {
  validateCheckout(request: CheckoutRequest): Promise<CheckoutValidationResult>;
  createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession>;
  submitOrder(request: CheckoutRequest): Promise<CheckoutSubmissionResult>;
  submitCheckout(request: CheckoutRequest): Promise<CheckoutResult>;
}

export const checkoutEndpoint: CheckoutEndpoint = "/.netlify/functions/checkout";

export const checkoutCartPersistencePolicy: CheckoutCartPersistencePolicy = {
  storage: "localStorage",
  key: "bliss-bouquet:cart:v1",
  ttlHours: 24,
  clearOn: "confirmed_order_only",
};

const checkoutSubmissionsInFlight = new Map<string, Promise<CheckoutSubmissionResult>>();
const completedCheckoutSubmissions = new Map<string, CheckoutSubmissionSuccess>();

export class CheckoutValidationError extends Error {
  readonly errors: string[];

  constructor(errors: string[]) {
    super(errors.join(" "));
    this.name = "CheckoutValidationError";
    this.errors = errors;
  }
}

export const toCheckoutErrorMessages = (error: unknown): string[] => {
  if (error instanceof CheckoutValidationError) {
    return error.errors;
  }

  if (error instanceof Error) {
    const message = error.message;

    if (message.includes("Supabase environment is not configured")) {
      return ["Store connection is not configured. Please try again later."];
    }

    if (
      message.includes(" is required.") ||
      message.includes(" required.") ||
      message.includes("no longer available") ||
      message.includes("could not be verified") ||
      message.includes("invalid")
    ) {
      return message.split(/(?<=\.)\s+/).filter((part) => part.trim().length > 0);
    }
  }

  return ["We couldn't complete your checkout right now. Please try again in a moment."];
};

const customerSafeOrderMessages = [
  "We couldn't save your order",
  "One or more items in your cart",
  "Order setup is incomplete",
  "Your account profile",
  "Please sign in to place your order",
] as const;

export const sanitizeOrderPersistenceError = (message: string): string => {
  if (customerSafeOrderMessages.some((prefix) => message.startsWith(prefix))) {
    return message;
  }

  const normalized = message.toLowerCase();
  const detail = message.includes(":") ? message.split(":").slice(1).join(":").trim() : message;
  const normalizedDetail = detail.toLowerCase();

  const classify = (text: string): string | null => {
    const value = text.toLowerCase();

    if (
      value.includes("row-level security") ||
      value.includes("permission denied") ||
      value.includes("not authorized") ||
      value.includes("42501")
    ) {
      return "We couldn't save your order. Please sign in again and try once more.";
    }

    if (
      value.includes("orders_user_id_fkey") ||
      (value.includes("profiles") && value.includes("foreign key")) ||
      (value.includes("profiles") && value.includes("is not present"))
    ) {
      return "Your account profile is not set up yet. Sign out, sign in again, then retry checkout.";
    }

    if (
      value.includes("order_items") &&
      (value.includes("foreign key") || value.includes("product_id") || value.includes("products"))
    ) {
      return "One or more items in your cart are no longer available. Update your cart and try again.";
    }

    if (value.includes("foreign key") || value.includes("product_id")) {
      return "One or more items in your cart are no longer available. Update your cart and try again.";
    }

    if (
      (value.includes("customer") || value.includes("delivery")) &&
      (value.includes("column") || value.includes("does not exist"))
    ) {
      return "Order setup is incomplete on the server. Apply the latest Supabase migrations, then try again.";
    }

    if (value.includes("order_status") || value.includes("invalid input value for enum")) {
      return "Order status configuration is invalid on the server. Please contact support.";
    }

    if (value.includes("jwt") || value.includes("session") || value.includes("not authenticated")) {
      return "Your session expired. Please sign in again and retry checkout.";
    }

    return null;
  };

  const fromDetail = classify(normalizedDetail);
  if (fromDetail) {
    return fromDetail;
  }

  const fromMessage = classify(normalized);
  if (fromMessage) {
    return fromMessage;
  }

  if (normalized.includes("please sign in to place your order")) {
    return "Please sign in to place your order.";
  }

  if (normalized.includes("unable to create order") || normalized.includes("unable to create order items")) {
    return "We couldn't save your order right now. Please try again in a moment.";
  }

  return "We couldn't save your order right now. Please try again in a moment.";
};

const validPaymentMethods: PaymentMethod[] = ["mpesa", "card", "cash_on_delivery"];

const requiredText = (value: string | undefined): boolean => Boolean(value?.trim());

const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

const isValidQuantity = (quantity: number): boolean =>
  Number.isInteger(quantity) && quantity > 0 && quantity <= 99;

const buildCheckoutId = (): string => {
  const randomId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `checkout_${randomId}`;
};

const calculateTotals = (items: OrderItem[]): CheckoutTotals => {
  const subtotal = items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const deliveryFee = 0;
  const discount = 0;
  const total = subtotal + deliveryFee - discount;

  return {
    subtotal,
    deliveryFee,
    discount,
    total,
  };
};

const failedSubmission = (
  code: CheckoutFailureCode,
  errors: string[],
): CheckoutSubmissionFailure => ({
  success: false,
  code,
  errors,
  cartClearance: {
    canClearCart: false,
    policy: checkoutCartPersistencePolicy.clearOn,
  },
});

export async function validateCheckout(request: CheckoutRequest): Promise<CheckoutValidationResult> {
  const errors: string[] = [];

  if (!requiredText(request.idempotencyKey)) {
    errors.push("Checkout request is missing an idempotency key.");
  }

  if (!requiredText(request.customer.name)) {
    errors.push("Customer name is required.");
  }

  if (!requiredText(request.customer.email) || !isValidEmail(request.customer.email)) {
    errors.push("A valid customer email is required.");
  }

  if (!requiredText(request.customer.phone)) {
    errors.push("Customer phone is required.");
  }

  if (!requiredText(request.delivery.recipientName)) {
    errors.push("Recipient name is required.");
  }

  if (!requiredText(request.delivery.recipientPhone)) {
    errors.push("Recipient phone is required.");
  }

  if (!requiredText(request.delivery.address)) {
    errors.push("Delivery address is required.");
  }

  if (!requiredText(request.delivery.city)) {
    errors.push("Delivery city is required.");
  }

  if (!validPaymentMethods.includes(request.paymentMethod)) {
    errors.push("Selected payment method is not supported.");
  }

  if (request.items.length === 0) {
    errors.push("Cart must contain at least one item.");
  }

  const productIds = new Set<string>();
  const orderItems: OrderItem[] = [];

  await Promise.all(
    request.items.map(async (item, index) => {
      if (!requiredText(item.productId)) {
        errors.push(`Cart item ${index + 1} is missing a product ID.`);
        return;
      }

      if (productIds.has(item.productId)) {
        errors.push(`Cart item ${index + 1} duplicates product ${item.productId}.`);
        return;
      }

      productIds.add(item.productId);

      if (!isValidQuantity(item.quantity)) {
        errors.push(`Cart item ${index + 1} has an invalid quantity.`);
        return;
      }

      try {
        const product = await getCheckoutProductByCartId(item.productId);

        if (!product) {
          errors.push(`Product ${item.productId} is no longer available.`);
          return;
        }

        if (!Number.isFinite(product.price) || product.price < 0) {
          errors.push(`Product ${product.name} has an invalid price.`);
          return;
        }

        orderItems.push({
          productId: product.id,
          name: product.name,
          unitPrice: product.price,
          quantity: item.quantity,
        });
      } catch {
        errors.push(`Product ${item.productId} could not be verified.`);
      }
    }),
  );

  const totals = calculateTotals(orderItems);

  if (orderItems.length !== request.items.length) {
    errors.push("Cart contents could not be fully verified.");
  }

  if (!Number.isFinite(totals.subtotal) || totals.subtotal <= 0) {
    errors.push("Cart subtotal is invalid.");
  }

  if (!Number.isFinite(totals.total) || totals.total <= 0) {
    errors.push("Checkout total is invalid.");
  }

  return {
    isValid: errors.length === 0,
    errors,
    totals: errors.length === 0 ? totals : undefined,
    orderItems: errors.length === 0 ? orderItems : undefined,
  };
}

export async function createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
  const validation = await validateCheckout(request);

  if (!validation.isValid || !validation.totals) {
    throw new CheckoutValidationError(validation.errors);
  }

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  return {
    checkoutId: buildCheckoutId(),
    expiresAt,
    totals: validation.totals,
    paymentMethod: request.paymentMethod,
  };
}

export async function submitOrder(request: CheckoutRequest): Promise<CheckoutSubmissionResult> {
  const submissionKey = request.idempotencyKey.trim();

  if (!submissionKey) {
    return failedSubmission("validation_failed", ["Checkout request is missing an idempotency key."]);
  }

  const completedSubmission = completedCheckoutSubmissions.get(submissionKey);

  if (completedSubmission) {
    return completedSubmission;
  }

  const inFlightSubmission = checkoutSubmissionsInFlight.get(submissionKey);

  if (inFlightSubmission) {
    return inFlightSubmission;
  }

  const submission = submitOrderOnce(request, submissionKey);
  checkoutSubmissionsInFlight.set(submissionKey, submission);

  try {
    const result = await submission;

    if (result.success) {
      completedCheckoutSubmissions.set(submissionKey, result);
    }

    return result;
  } finally {
    checkoutSubmissionsInFlight.delete(submissionKey);
  }
}

export async function submitCheckout(request: CheckoutRequest): Promise<CheckoutResult> {
  const submission = await submitOrder(request);

  if (submission.success) {
    return submission.result;
  }

  throw new Error(("errors" in submission ? submission.errors : ["Checkout failed."]).join(" "));
}

async function submitOrderOnce(
  request: CheckoutRequest,
  submissionKey: string,
): Promise<CheckoutSubmissionResult> {
  const validation = await validateCheckout(request);

  if (!validation.isValid || !validation.orderItems) {
    return failedSubmission("validation_failed", validation.errors);
  }

  try {
    const order = await createOrder({
      customer: request.customer,
      delivery: request.delivery,
      items: validation.orderItems,
    });

    return {
      success: true,
      result: {
        order,
        checkoutId: `checkout_${submissionKey}`,
        confirmedAt: new Date().toISOString(),
        cartClearance: {
          canClearCart: true,
          policy: checkoutCartPersistencePolicy.clearOn,
        },
      },
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("[checkout] createOrder failed", error);
    }

    const message = error instanceof Error ? error.message : "Unable to submit order.";
    return failedSubmission("order_persistence_failed", [sanitizeOrderPersistenceError(message)]);
  }
}
