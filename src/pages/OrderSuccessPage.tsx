import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUserOrderById, type Order } from "@/services/orders.service";

const OrderSuccessPage = () => {
  const location = useLocation();
  const { initialized, isAuthenticated } = useAuth();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(orderId));

  useEffect(() => {
    if (!orderId) {
      setErrorMessage("Order reference missing. Please visit your orders page or continue shopping.");
      setIsLoading(false);
      return;
    }

    if (!initialized) {
      return;
    }

    if (!isAuthenticated) {
      setErrorMessage("Please sign in to view this order confirmation.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadOrder = async () => {
      try {
        const loadedOrder = await getCurrentUserOrderById(orderId);

        if (!isMounted) {
          return;
        }

        if (!loadedOrder) {
          setErrorMessage("Unable to verify this order. Please visit your orders page for details.");
          setOrder(null);
          return;
        }

        setOrder(loadedOrder);
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage("We couldn't load your order confirmation right now. Please visit your orders page or try again later.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [initialized, isAuthenticated, orderId]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Order Confirmed | Bliss Bouquet Kenya" description="Your Bliss Bouquet order has been confirmed." />
      <Header />
      <main className="container py-12">
        <section className="mx-auto max-w-2xl rounded-lg border p-6 text-center">
          <h1 className="font-heading text-3xl font-semibold">Order Confirmed</h1>
          <p className="mt-2 text-muted-foreground">Thank you. We have received your order and will contact you with delivery updates.</p>

          {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading order details...</p>}

          {errorMessage && (
            <Alert variant="destructive" className="mt-6 text-left">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {orderId && (
            <div className="mt-6 rounded-md bg-muted p-4 text-left text-sm">
              <p><span className="font-medium">Reference:</span> {orderId}</p>
              {order && <p><span className="font-medium">Status:</span> {order.status.replace(/_/g, " ")}</p>}
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild><Link to="/orders">View Orders</Link></Button>
            <Button variant="outline" asChild><Link to="/">Continue Shopping</Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OrderSuccessPage;
