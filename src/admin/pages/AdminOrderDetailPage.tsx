import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AdminOrderDetails } from "@/admin/components";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { getAdminOrderById, updateOrderStatus, type AdminOrderStatus, type Order } from "@/services/orders.service";

const AdminOrderDetailPage = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFeedback, setStatusFeedback] = useState<string | null>(null);
  const [statusFeedbackType, setStatusFeedbackType] = useState<"success" | "error">("success");

  useEffect(() => {
    let isMounted = true;

    const loadOrder = async () => {
      if (!orderId) {
        setErrorMessage("Order ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage(null);

        const loadedOrder = await getAdminOrderById(orderId);

        if (isMounted) {
          setOrder(loadedOrder);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load order details.");
        }
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
  }, [orderId]);

  const handleStatusChange = async (nextStatus: AdminOrderStatus) => {
    if (!order || order.status === nextStatus) {
      return;
    }

    const previousOrder = order;

    setIsUpdatingStatus(true);
    setStatusFeedback(null);
    setOrder({ ...previousOrder, status: nextStatus });

    try {
      const updatedOrder = await updateOrderStatus(previousOrder.id, nextStatus);

      setOrder({
        ...previousOrder,
        status: updatedOrder.status,
        updatedAt: updatedOrder.updatedAt,
      });
      setStatusFeedback("Order status updated.");
      setStatusFeedbackType("success");
      toast({
        title: "Order status updated",
        description: `Order is now ${updatedOrder.status.replace(/_/g, " ")}.`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to update order status.";

      setOrder(previousOrder);
      setStatusFeedback(message);
      setStatusFeedbackType("error");
      toast({
        title: "Status update failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-heading font-semibold">Order Detail</h2>
          <p className="mt-1 text-sm text-muted-foreground">Review order metadata, items, and totals.</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/admin/orders">Back to orders</Link>
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <div className="rounded-md border p-5">
            <Skeleton className="h-4 w-56" />
            <Skeleton className="mt-3 h-7 w-40" />
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
            </div>
          </div>
          <div className="rounded-md border p-5">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-5 h-16" />
            <Skeleton className="mt-3 h-16" />
          </div>
        </div>
      )}

      {!isLoading && errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Order could not be loaded</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !errorMessage && !order && (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="font-medium text-foreground">Order not found</h3>
          <p className="mt-1 text-sm text-muted-foreground">The requested order may have been removed.</p>
        </div>
      )}

      {!isLoading && !errorMessage && order && (
        <AdminOrderDetails
          order={order}
          isUpdatingStatus={isUpdatingStatus}
          statusFeedback={statusFeedback}
          statusFeedbackType={statusFeedbackType}
          onStatusChange={handleStatusChange}
        />
      )}
    </section>
  );
};

export default AdminOrderDetailPage;
