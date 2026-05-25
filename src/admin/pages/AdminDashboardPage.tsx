import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminDashboardMetrics, type AdminDashboardMetrics } from "@/services/dashboard.service";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value);

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

const metricsConfig: Array<{ key: keyof AdminDashboardMetrics; label: string }> = [
  { key: "totalProducts", label: "Total products" },
  { key: "totalCustomers", label: "Total customers" },
  { key: "totalOrders", label: "Total orders" },
  { key: "pendingOrders", label: "Pending orders" },
  { key: "confirmedOrders", label: "Confirmed orders" },
  { key: "deliveredOrders", label: "Delivered orders" },
  { key: "lowStockProducts", label: "Low stock products" },
];

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState<AdminDashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadMetrics = useCallback(async () => {
    try {
      setErrorMessage(null);
      setIsLoading(true);

      const dashboardMetrics = await getAdminDashboardMetrics();
      setMetrics(dashboardMetrics);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Unable to load dashboard analytics.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMetrics();
  }, [loadMetrics]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Admin Dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground">Operational insights for products, customers, and recent orders.</p>
      </div>

      {isLoading && (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="mt-3 h-10 w-32" />
                </CardHeader>
              </Card>
            ))}
          </div>
          <div className="rounded-lg border bg-card p-6">
            <Skeleton className="h-6 w-48" />
            <div className="mt-6 space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
      )}

      {!isLoading && errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Dashboard analytics failed</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
          <div className="mt-4 flex justify-end">
            <Button onClick={loadMetrics}>Retry</Button>
          </div>
        </Alert>
      )}

      {!isLoading && !errorMessage && metrics && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {metricsConfig.map((metric) => (
              <Card key={metric.key}>
                <CardHeader>
                  <CardTitle>{metrics[metric.key] ?? 0}</CardTitle>
                  <CardDescription>{metric.label}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Recent orders</CardTitle>
                <CardDescription>Latest activity from customer orders.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {metrics.recentOrders.length === 0 ? (
                <div className="rounded-md border border-dashed p-6 text-center">
                  <p className="font-medium text-foreground">No recent orders found</p>
                  <p className="mt-1 text-sm text-muted-foreground">Orders will appear here once customers start ordering.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {metrics.recentOrders.map((order) => (
                    <div key={order.id} className="rounded-md border bg-background p-4 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium">Order {order.id.slice(0, 8)}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{order.customerName}</p>
                      </div>
                      <div className="mt-3 space-y-2 text-right sm:mt-0">
                        <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                        <p className="font-medium">{formatCurrency(order.total)}</p>
                        <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium capitalize text-muted-foreground">
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </section>
  );
};

export default AdminDashboardPage;
