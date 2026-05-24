import type { AdminOrderStatus, Order } from "@/services/orders.service";
import {
  ADMIN_ORDER_STATUSES,
  canTransitionOrderStatus,
  getAvailableOrderStatusUpdates,
  isSupportedAdminOrderStatus,
} from "@/services/orders.service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminOrderDetailsProps {
  order: Order;
  isUpdatingStatus?: boolean;
  statusFeedback?: string | null;
  statusFeedbackType?: "success" | "error";
  onStatusChange?: (status: AdminOrderStatus) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price);

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-KE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const formatStatus = (status: Order["status"]) => status.replace(/_/g, " ");

const getUserLabel = (order: Order) => {
  if (order.customer.email) {
    return order.customer.email;
  }

  if (order.customer.name) {
    return order.customer.name;
  }

  if (order.userId) {
    return `User ${order.userId.slice(0, 8)}`;
  }

  return "Guest";
};

const orderItemTotal = (item: Order["items"][number]) => item.unitPrice * item.quantity;

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
    <dd className="mt-1 break-words text-sm text-foreground">{value}</dd>
  </div>
);

const AdminOrderDetails = ({
  order,
  isUpdatingStatus = false,
  statusFeedback,
  statusFeedbackType = "success",
  onStatusChange,
}: AdminOrderDetailsProps) => {
  const availableStatusUpdates = getAvailableOrderStatusUpdates(order.status);
  const canUpdateStatus = availableStatusUpdates.some((status) => status !== order.status);

  const handleStatusSelect = (value: string) => {
    if (isSupportedAdminOrderStatus(value)) {
      onStatusChange?.(value);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md border bg-background p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{order.id}</p>
            <h2 className="mt-1 text-xl font-heading font-semibold">Order details</h2>
          </div>
          <div className="w-full space-y-2 sm:w-56">
            {onStatusChange && isSupportedAdminOrderStatus(order.status) ? (
              <Select value={order.status} onValueChange={handleStatusSelect} disabled={isUpdatingStatus || !canUpdateStatus}>
                <SelectTrigger aria-label="Order status">
                  <SelectValue placeholder="Order status" />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_ORDER_STATUSES.map((status) => (
                    <SelectItem key={status} value={status} disabled={!canTransitionOrderStatus(order.status, status)}>
                      {formatStatus(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <span className="inline-flex w-fit rounded-md border border-muted bg-muted px-2 py-1 text-xs font-medium capitalize text-muted-foreground">
                {formatStatus(order.status)}
              </span>
            )}
            {statusFeedback && (
              <p className={statusFeedbackType === "error" ? "text-xs text-destructive" : "text-xs text-primary"}>
                {statusFeedback}
              </p>
            )}
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DetailItem label="Customer/User" value={getUserLabel(order)} />
          <DetailItem label="Created" value={formatDate(order.createdAt)} />
          <DetailItem label="Order total" value={formatPrice(order.total)} />
          <DetailItem label="Items" value={String(order.items.length)} />
        </dl>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-heading font-semibold">Order items</h3>

        {order.items.length === 0 ? (
          <div className="rounded-md border border-dashed p-8 text-center">
            <h4 className="font-medium text-foreground">No order items found</h4>
            <p className="mt-1 text-sm text-muted-foreground">This order has no item rows available.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-hidden rounded-md border md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={`${item.productId}-${item.unitPrice}`}>
                      <TableCell>
                        <div className="font-medium">{item.name || "Unnamed product"}</div>
                        <div className="mt-1 font-mono text-xs text-muted-foreground">{item.productId}</div>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatPrice(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(orderItemTotal(item))}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid gap-3 md:hidden">
              {order.items.map((item) => (
                <article key={`${item.productId}-${item.unitPrice}`} className="rounded-md border bg-background p-4">
                  <h4 className="font-medium">{item.name || "Unnamed product"}</h4>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">{item.productId}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3 border-t pt-3 text-sm">
                    <DetailItem label="Qty" value={String(item.quantity)} />
                    <DetailItem label="Unit" value={formatPrice(item.unitPrice)} />
                    <DetailItem label="Total" value={formatPrice(orderItemTotal(item))} />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <section className="rounded-md border bg-background p-5">
        <h3 className="text-lg font-heading font-semibold">Totals</h3>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-medium">{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4">
            <dt className="text-muted-foreground">Delivery fee</dt>
            <dd className="font-medium">{formatPrice(order.deliveryFee)}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t pt-3">
            <dt className="font-medium">Total</dt>
            <dd className="font-semibold text-primary">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
};

export default AdminOrderDetails;
