import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { listAdminCustomers, type AdminCustomer } from "@/services/customers.service";

const formatDate = (value: string | null) => {
  if (!value) {
    return "No orders";
  }

  return new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

const getCustomerLabel = (customer: AdminCustomer) => customer.fullName ?? "Unknown customer";

const AdminCustomersPage = () => {
  const isMountedRef = useRef(true);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCustomers = useCallback(async () => {
    try {
      setErrorMessage(null);
      setIsLoading(true);

      const loadedCustomers = await listAdminCustomers();

      if (!isMountedRef.current) {
        return;
      }

      setCustomers(loadedCustomers);
    } catch (error) {
      if (!isMountedRef.current) {
        return;
      }

      setErrorMessage(error instanceof Error ? error.message : "Unable to load customers.");
    } finally {
      if (!isMountedRef.current) {
        return;
      }

      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    void loadCustomers();
  }, [loadCustomers]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Admin Customers</h2>
        <p className="mt-1 text-sm text-muted-foreground">Manage customer accounts and review their order history.</p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid gap-4 rounded-md border p-4 md:grid-cols-[1.6fr_1.8fr_1fr_0.8fr_1.2fr]">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Customers could not be loaded</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
          <div className="mt-4 flex justify-end">
            <Button onClick={loadCustomers}>Retry</Button>
          </div>
        </Alert>
      )}

      {!isLoading && !errorMessage && customers.length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="font-medium text-foreground">No customers found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Customer profiles will appear here after orders are created.</p>
        </div>
      )}

      {!isLoading && !errorMessage && customers.length > 0 && (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Latest order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="font-medium">{getCustomerLabel(customer)}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{customer.id.slice(0, 8)}</div>
                  </TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground capitalize">
                      {customer.role}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">{customer.orderCount}</TableCell>
                  <TableCell className="text-right">{formatDate(customer.latestOrderAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
};

export default AdminCustomersPage;
