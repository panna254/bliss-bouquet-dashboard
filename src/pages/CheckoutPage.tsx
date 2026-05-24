import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import {
  createCheckoutSession,
  submitOrder,
  toCheckoutErrorMessages,
  type PaymentMethod,
} from "@/services/checkout.service";
import { confirmPayment } from "@/services/payment.service";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(price);

const buildIdempotencyKey = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { items, getCartTotal, clearCart } = useCart();
  const [idempotencyKey] = useState(buildIdempotencyKey);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Nairobi");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash_on_delivery");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkoutItems = useMemo(
    () => items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    [items],
  );

  useEffect(() => {
    if (profile?.fullName && !customerName) {
      setCustomerName(profile.fullName);
    } else if (user?.name && !customerName) {
      setCustomerName(user.name);
    }

    if (user?.email && !customerEmail) {
      setCustomerEmail(user.email);
    }
  }, [customerEmail, customerName, profile?.fullName, user?.email, user?.name]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessages([]);

    if (items.length === 0) {
      setErrorMessages(["Your cart is empty. Add something to your cart before placing your order."]);
      return;
    }

    try {
      setIsSubmitting(true);
      const request = {
        idempotencyKey,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        delivery: {
          recipientName,
          recipientPhone,
          address,
          city,
          deliveryNotes,
        },
        items: checkoutItems,
        paymentMethod,
      };

      const checkoutSession = await createCheckoutSession(request);
      const payment = await confirmPayment({
        idempotencyKey,
        paymentMethod,
        totals: checkoutSession.totals,
      });

      if (payment.success === false) {
        setErrorMessages([payment.message]);
        return;
      }

      const submission = await submitOrder(request);

      if (submission.success === false) {
        if (import.meta.env.DEV) {
          console.error("[checkout] submitOrder failed", submission);
        }

        setErrorMessages(
          submission.errors.length
            ? submission.errors
            : ["We couldn't place your order. Please review the details and try again."],
        );
        return;
      }

      clearCart();
      navigate(`/order-success?orderId=${encodeURIComponent(submission.result.order.id)}&checkoutId=${encodeURIComponent(submission.result.checkoutId)}`, {
        replace: true,
      });
    } catch (error) {
      setErrorMessages(toCheckoutErrorMessages(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Checkout | Bliss Bouquet Kenya" description="Complete your Bliss Bouquet delivery order." />
      <Header />
      <main className="container py-10">
        <div className="mb-6">
          <h1 className="font-heading text-3xl font-semibold">Checkout</h1>
          <p className="mt-1 text-sm text-muted-foreground">Confirm delivery details and payment method.</p>
        </div>

        <form className="grid gap-6 lg:grid-cols-[1fr_340px]" onSubmit={handleSubmit}>
          <div className="space-y-6">
            {errorMessages.length > 0 && (
              <Alert variant="destructive">
                <AlertTitle>Checkout needs attention</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errorMessages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <section className="space-y-4 rounded-lg border p-4">
              <h2 className="font-heading text-lg font-semibold">Contact Details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Your Name</Label>
                  <Input id="customer-name" value={customerName} onChange={(event) => setCustomerName(event.target.value)} disabled={isSubmitting} required autoComplete="name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email</Label>
                  <Input id="customer-email" type="email" value={customerEmail} onChange={(event) => setCustomerEmail(event.target.value)} disabled={isSubmitting} required autoComplete="email" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="customer-phone">Phone</Label>
                  <Input id="customer-phone" value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} disabled={isSubmitting} required autoComplete="tel" />
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-lg border p-4">
              <h2 className="font-heading text-lg font-semibold">Delivery Details</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="recipient-name">Recipient Name</Label>
                  <Input id="recipient-name" value={recipientName} onChange={(event) => setRecipientName(event.target.value)} disabled={isSubmitting} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="recipient-phone">Recipient Phone</Label>
                  <Input id="recipient-phone" value={recipientPhone} onChange={(event) => setRecipientPhone(event.target.value)} disabled={isSubmitting} required autoComplete="tel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="delivery-city">City</Label>
                  <Input id="delivery-city" value={city} onChange={(event) => setCity(event.target.value)} disabled={isSubmitting} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="delivery-address">Delivery Address</Label>
                  <Textarea id="delivery-address" value={address} onChange={(event) => setAddress(event.target.value)} disabled={isSubmitting} required />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="delivery-notes">Delivery Notes</Label>
                  <Textarea id="delivery-notes" value={deliveryNotes} onChange={(event) => setDeliveryNotes(event.target.value)} disabled={isSubmitting} />
                </div>
              </div>
            </section>

            <section className="space-y-4 rounded-lg border p-4">
              <h2 className="font-heading text-lg font-semibold">Payment</h2>
              <div className="grid gap-3">
                <label className="flex items-center gap-3 rounded-md border p-3">
                  <input type="radio" name="payment" checked={paymentMethod === "cash_on_delivery"} onChange={() => setPaymentMethod("cash_on_delivery")} disabled={isSubmitting} />
                  <span>Cash on delivery</span>
                </label>
                <label className="flex items-center gap-3 rounded-md border p-3 text-muted-foreground">
                  <input type="radio" name="payment" checked={paymentMethod === "mpesa"} onChange={() => setPaymentMethod("mpesa")} disabled={isSubmitting} />
                  <span>M-Pesa handoff coming soon</span>
                </label>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-lg border p-4">
            <h2 className="font-heading text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between gap-3 text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <span className="font-medium">Total</span>
              <span className="font-heading text-xl font-semibold text-primary">{formatPrice(getCartTotal())}</span>
            </div>
            <Button className="mt-4 w-full" type="submit" disabled={isSubmitting || items.length === 0}>
              {isSubmitting ? "Placing order..." : "Place Order"}
            </Button>
          </aside>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
