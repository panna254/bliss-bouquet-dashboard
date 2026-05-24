import { Link } from "react-router-dom";
import type { Order } from "@/services/orders.service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminOrderTableProps {
  orders: Order[];
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

const statusTone = (status: Order["status"]) => {
  switch (status) {
    case "delivered":
      return "border-primary/20 bg-primary/10 text-primary";
    case "cancelled":
      return "border-destructive/30 bg-destructive/10 text-destructive";
    case "out_for_delivery":
    case "preparing":
      return "border-accent/30 bg-accent/10 text-accent-foreground";
    default:
      return "border-muted bg-muted text-muted-foreground";
  }
};

const StatusBadge = ({ status }: Pick<Order, "status">) => (
  <span className={["inline-flex rounded-md border px-2 py-1 text-xs font-medium capitalize", statusTone(status)].join(" ")}>
    {formatStatus(status)}
  </span>
);

const AdminOrderTable = ({ orders }: AdminOrderTableProps) => {
  return (
    <>
      <div className="hidden overflow-hidden rounded-md border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer/User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  <Link className="text-primary underline-offset-4 hover:underline" to={`/admin/orders/${order.id}`}>
                    {order.id.slice(0, 8)}
                  </Link>
                </TableCell>
                <TableCell>{getUserLabel(order)}</TableCell>
                <TableCell>
                  <StatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right font-medium">{formatPrice(order.total)}</TableCell>
                <TableCell className="text-right text-muted-foreground">{formatDate(order.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {orders.map((order) => (
          <article key={order.id} className="rounded-md border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  className="font-mono text-xs text-primary underline-offset-4 hover:underline"
                  to={`/admin/orders/${order.id}`}
                >
                  {order.id.slice(0, 8)}
                </Link>
                <h3 className="mt-1 text-sm font-medium">{getUserLabel(order)}</h3>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3 text-sm">
              <span className="text-muted-foreground">{formatDate(order.createdAt)}</span>
              <span className="font-semibold text-primary">{formatPrice(order.total)}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default AdminOrderTable;
