import { useEffect, useState } from "react";
import { AdminOrderTable } from "@/admin/components";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { listOrders, type Order } from "@/services/orders.service";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const loadedOrders = await listOrders();

        if (isMounted) {
          setOrders(loadedOrders);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load orders.");
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
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Admin Orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review recent customer orders.</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid gap-3 rounded-md border p-4 md:grid-cols-[120px_1fr_120px_120px_180px]">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-20 md:justify-self-end" />
              <Skeleton className="h-4 w-32 md:justify-self-end" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Orders could not be loaded</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !errorMessage && orders.length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="font-medium text-foreground">No orders found</h3>
          <p className="mt-1 text-sm text-muted-foreground">New Supabase orders will appear here.</p>
        </div>
      )}

      {!isLoading && !errorMessage && orders.length > 0 && <AdminOrderTable orders={orders} />}
    </section>
  );
};

export default AdminOrdersPage;
