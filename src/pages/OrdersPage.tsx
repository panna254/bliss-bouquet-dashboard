import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { listCurrentUserOrders, type Order } from "@/services/orders.service";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
  }).format(price);

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        const loadedOrders = await listCurrentUserOrders();
        if (isMounted) {
          setOrders(loadedOrders);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Orders could not be loaded.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="My Orders | Bliss Bouquet Kenya" description="Review your Bliss Bouquet order history." />
      <Header />
      <main className="container py-10">
        <h1 className="font-heading text-3xl font-semibold">My Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track your recent Bliss Bouquet orders.</p>

        {isLoading && <p className="mt-8 text-sm text-muted-foreground">Loading orders...</p>}

        {!isLoading && errorMessage && (
          <Alert variant="destructive" className="mt-6">
            <AlertTitle>Orders could not be loaded</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !errorMessage && orders.length === 0 && (
          <div className="mt-6 rounded-lg border border-dashed p-8 text-center">
            <h2 className="font-medium">No orders yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your completed orders will appear here.</p>
          </div>
        )}

        {!isLoading && !errorMessage && orders.length > 0 && (
          <div className="mt-6 space-y-3">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="font-medium">Order {order.id.slice(0, 8)}</h2>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-sm sm:text-right">
                    <p className="capitalize">{order.status.replace(/_/g, " ")}</p>
                    <p className="font-semibold text-primary">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default OrdersPage;
