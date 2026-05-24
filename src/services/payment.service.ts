import type { CheckoutTotals, PaymentMethod } from "@/services/checkout.service";

export type PaymentStatus = "confirmed" | "requires_provider" | "failed";

export interface PaymentRequest {
  idempotencyKey: string;
  paymentMethod: PaymentMethod;
  totals: CheckoutTotals;
}

export interface PaymentSuccess {
  success: true;
  status: PaymentStatus;
  reference?: string;
}

export interface PaymentFailure {
  success: false;
  status: "failed";
  message: string;
}

export type PaymentResult = PaymentSuccess | PaymentFailure;

export async function confirmPayment(request: PaymentRequest): Promise<PaymentResult> {
  if (!request.idempotencyKey.trim()) {
    return {
      success: false,
      status: "failed",
      message: "Payment request is missing an idempotency key.",
    };
  }

  if (!Number.isFinite(request.totals.total) || request.totals.total <= 0) {
    return {
      success: false,
      status: "failed",
      message: "Payment total is invalid.",
    };
  }

  if (request.paymentMethod === "cash_on_delivery") {
    return {
      success: true,
      status: "confirmed",
      reference: `cod_${request.idempotencyKey}`,
    };
  }

  return {
    success: false,
    status: "failed",
    message: "Online payments are not configured yet. Please choose cash on delivery.",
  };
}
