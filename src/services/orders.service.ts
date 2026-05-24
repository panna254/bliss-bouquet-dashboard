import { getSupabaseClient } from "@/lib/supabaseClient";
import { requireAdminSession } from "@/services/auth.service";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type AdminOrderStatus = Extract<OrderStatus, "pending" | "confirmed" | "delivered">;

export const ADMIN_ORDER_STATUSES: readonly AdminOrderStatus[] = ["pending", "confirmed", "delivered"];

const adminOrderStatusTransitions: Record<AdminOrderStatus, readonly AdminOrderStatus[]> = {
  pending: ["confirmed"],
  confirmed: ["delivered"],
  delivered: [],
};

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
}

export interface OrderDeliveryDetails {
  recipientName: string;
  recipientPhone: string;
  address: string;
  city: string;
  deliveryDate?: string;
  deliveryNotes?: string;
}

export interface Order {
  id: string;
  userId?: string | null;
  status: OrderStatus;
  customer: OrderCustomer;
  delivery: OrderDeliveryDetails;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderInput {
  customer: OrderCustomer;
  delivery: OrderDeliveryDetails;
  items: OrderItem[];
}

export interface OrdersService {
  createOrder(input: CreateOrderInput): Promise<Order>;
  getOrderById(orderId: string): Promise<Order | null>;
  getAdminOrderById(orderId: string): Promise<Order | null>;
  listOrders(): Promise<Order[]>;
  listCurrentUserOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: AdminOrderStatus): Promise<Order>;
}

interface OrderRow {
  id: string;
  user_id?: string | null;
  status: OrderStatus;
  total_amount: number | string;
  created_at: string;
}

interface OrderItemRow {
  product_id: string;
  quantity: number;
  price_at_purchase: number | string;
  products?: {
    name?: string | null;
  } | null;
}

const emptyCustomer: OrderCustomer = {
  name: "",
  email: "",
  phone: "",
};

const emptyDelivery: OrderDeliveryDetails = {
  recipientName: "",
  recipientPhone: "",
  address: "",
  city: "",
};

const toNumber = (value: number | string | null | undefined, fallback = 0): number => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const calculateSubtotal = (items: OrderItem[]): number =>
  items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

const toOrder = (
  row: OrderRow,
  items: OrderItem[],
  customer: OrderCustomer = emptyCustomer,
  delivery: OrderDeliveryDetails = emptyDelivery,
): Order => {
  const subtotal = calculateSubtotal(items);
  const total = toNumber(row.total_amount, subtotal);
  const deliveryFee = Math.max(total - subtotal, 0);

  return {
    id: row.id,
    userId: row.user_id ?? null,
    status: row.status,
    customer,
    delivery,
    items,
    subtotal,
    deliveryFee,
    total,
    createdAt: row.created_at,
    updatedAt: row.created_at,
  };
};

const normalizeOrderError = (message: string, error: unknown): Error => {
  if (error instanceof Error) {
    return new Error(`${message}: ${error.message}`);
  }

  return new Error(message);
};

export const isSupportedAdminOrderStatus = (status: string): status is AdminOrderStatus =>
  ADMIN_ORDER_STATUSES.includes(status as AdminOrderStatus);

export const canTransitionOrderStatus = (currentStatus: OrderStatus, nextStatus: OrderStatus): boolean => {
  if (currentStatus === nextStatus) {
    return isSupportedAdminOrderStatus(currentStatus);
  }

  if (!isSupportedAdminOrderStatus(currentStatus) || !isSupportedAdminOrderStatus(nextStatus)) {
    return false;
  }

  return adminOrderStatusTransitions[currentStatus].includes(nextStatus);
};

export const getAvailableOrderStatusUpdates = (currentStatus: OrderStatus): AdminOrderStatus[] => {
  if (!isSupportedAdminOrderStatus(currentStatus)) {
    return [];
  }

  return ADMIN_ORDER_STATUSES.filter((status) => canTransitionOrderStatus(currentStatus, status));
};

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const supabase = getSupabaseClient();
  const subtotal = calculateSubtotal(input.items);
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id ?? null;

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: total,
      status: "pending",
    })
    .select("id,user_id,status,total_amount,created_at")
    .single();

  if (orderError || !orderRow) {
    throw normalizeOrderError("Unable to create order", orderError);
  }

  const orderItems = input.items.map((item) => ({
    order_id: orderRow.id,
    product_id: item.productId,
    quantity: item.quantity,
    price_at_purchase: item.unitPrice,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

  if (itemsError) {
    const { error: cleanupError } = await supabase.from("orders").delete().eq("id", orderRow.id);

    if (cleanupError) {
      // RLS/database failures are surfaced through the original order-items error below.
    }

    throw normalizeOrderError("Unable to create order items", itemsError);
  }

  return toOrder(orderRow as OrderRow, input.items, input.customer, input.delivery);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = getSupabaseClient();

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select("id,user_id,status,total_amount,created_at")
    .eq("id", orderId)
    .maybeSingle();

  if (orderError) {
    throw normalizeOrderError(`Unable to fetch order ${orderId}`, orderError);
  }

  if (!orderRow) {
    return null;
  }

  const { data: itemRows, error: itemsError } = await supabase
    .from("order_items")
    .select("product_id,quantity,price_at_purchase,products(name)")
    .eq("order_id", orderId);

  if (itemsError) {
    throw normalizeOrderError(`Unable to fetch order items for ${orderId}`, itemsError);
  }

  const items = ((itemRows ?? []) as OrderItemRow[]).map((item) => ({
    productId: item.product_id,
    name: item.products?.name ?? "",
    unitPrice: toNumber(item.price_at_purchase),
    quantity: item.quantity,
  }));

  return toOrder(orderRow as OrderRow, items);
}

export async function getAdminOrderById(orderId: string): Promise<Order | null> {
  await requireAdminSession();

  return getOrderById(orderId);
}

export async function listOrders(): Promise<Order[]> {
  await requireAdminSession();

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id,user_id,status,total_amount,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw normalizeOrderError("Unable to fetch orders", error);
  }

  return ((data ?? []) as OrderRow[]).map((row) => toOrder(row, []));
}

export async function listCurrentUserOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw normalizeOrderError("Unable to load customer orders", userError);
  }

  const { data, error } = await supabase
    .from("orders")
    .select("id,user_id,status,total_amount,created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw normalizeOrderError("Unable to fetch customer orders", error);
  }

  return ((data ?? []) as OrderRow[]).map((row) => toOrder(row, []));
}

export async function updateOrderStatus(orderId: string, status: AdminOrderStatus): Promise<Order> {
  await requireAdminSession();

  const supabase = getSupabaseClient();

  const { data: currentOrderRow, error: currentOrderError } = await supabase
    .from("orders")
    .select("id,user_id,status,total_amount,created_at")
    .eq("id", orderId)
    .maybeSingle();

  if (currentOrderError) {
    throw normalizeOrderError(`Unable to verify order ${orderId}`, currentOrderError);
  }

  if (!currentOrderRow) {
    throw new Error("Order not found.");
  }

  const currentOrder = currentOrderRow as OrderRow;

  if (!canTransitionOrderStatus(currentOrder.status, status)) {
    throw new Error(`Cannot change order status from ${currentOrder.status} to ${status}.`);
  }

  if (currentOrder.status === status) {
    return toOrder(currentOrder, []);
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("status", currentOrder.status)
    .select("id,user_id,status,total_amount,created_at")
    .maybeSingle();

  if (error) {
    throw normalizeOrderError(`Unable to update order ${orderId}`, error);
  }

  if (!data) {
    throw new Error("Order status changed before this update could be saved. Refresh and try again.");
  }

  return toOrder(data as OrderRow, []);
}
