import { getSupabaseClient } from "@/lib/supabaseClient";
import { requireAdminSession } from "@/services/auth.service";
import type { OrderStatus } from "@/services/orders.service";

export interface RecentOrderSummary {
  id: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  customerName: string;
}

export interface AdminDashboardMetrics {
  totalProducts: number;
  totalCustomers: number;
  totalOrders: number;
  pendingOrders: number;
  confirmedOrders: number;
  deliveredOrders: number;
  lowStockProducts: number;
  recentOrders: RecentOrderSummary[];
}

const normalizeDashboardError = (message: string, error: unknown): Error => {
  if (error instanceof Error) {
    return new Error(`${message}: ${error.message}`);
  }

  return new Error(message);
};

const countRows = async (table: string, filter?: (request: any) => any): Promise<number> => {
  const supabase = getSupabaseClient();
  let request = supabase.from(table).select("id", { count: "exact", head: true });

  if (filter) {
    request = filter(request);
  }

  const { count, error } = await request;

  if (error) {
    throw normalizeDashboardError(`Unable to count rows in ${table}`, error);
  }

  return count ?? 0;
};

const fetchRecentOrders = async (): Promise<RecentOrderSummary[]> => {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("orders")
    .select("id,status,total_amount,created_at,customer")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    throw normalizeDashboardError("Unable to load recent orders", error);
  }

  return ((data ?? []) as Array<{
    id: string;
    status: OrderStatus;
    total_amount: number | string;
    created_at: string;
    customer: { name?: string | null; email?: string | null } | null;
  }>).map((order) => ({
    id: order.id,
    status: order.status,
    total: typeof order.total_amount === "string" ? Number(order.total_amount) : order.total_amount,
    createdAt: order.created_at,
    customerName: order.customer?.name ?? order.customer?.email ?? "Guest",
  }));
};

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  await requireAdminSession();

  try {
    const [totalProducts, totalCustomers, totalOrders, pendingOrders, confirmedOrders, deliveredOrders, lowStockProducts, recentOrders] =
      await Promise.all([
        countRows("products"),
        countRows("profiles", (request) => request.eq("role", "customer")),
        countRows("orders"),
        countRows("orders", (request) => request.eq("status", "pending")),
        countRows("orders", (request) => request.eq("status", "confirmed")),
        countRows("orders", (request) => request.eq("status", "delivered")),
        countRows("products", (request) => request.lt("stock_quantity", 5)),
        fetchRecentOrders(),
      ]);

    return {
      totalProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      confirmedOrders,
      deliveredOrders,
      lowStockProducts,
      recentOrders,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unable to load dashboard metrics.");
  }
}
