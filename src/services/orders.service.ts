import { getSupabaseClient } from "@/lib/supabaseClient";
import { requireAdminSession } from "@/services/auth.service";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type AdminOrderStatus = OrderStatus;

export const ADMIN_ORDER_STATUSES: readonly AdminOrderStatus[] = [
  "pending",
  "confirmed",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

const adminOrderStatusTransitions: Record<OrderStatus, readonly OrderStatus[]> = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
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
  customer?: OrderCustomer | null;
  delivery?: OrderDeliveryDetails | null;
  order_items?: OrderItemRow[] | null;
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
): Order => {
  const subtotal = calculateSubtotal(items);
  const total = toNumber(row.total_amount, subtotal);
  const deliveryFee = Math.max(total - subtotal, 0);

  return {
    id: row.id,
    userId: row.user_id ?? null,
    status: row.status,
    customer: row.customer ?? emptyCustomer,
    delivery: row.delivery ?? emptyDelivery,
    items,
    subtotal,
    deliveryFee,
    total,
    createdAt: row.created_at,
    updatedAt: row.created_at,
  };
};

const extractErrorDetail = (error: unknown): string => {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const record = error as Record<string, unknown>;
    const parts = [record.message, record.details, record.hint, record.code].filter(
      (part): part is string => typeof part === "string" && part.trim().length > 0,
    );

    if (parts.length > 0) {
      return parts.join(" — ");
    }
  }

  return "Unknown database error";
};

const normalizeOrderError = (message: string, error: unknown): Error => {
  return new Error(`${message}: ${extractErrorDetail(error)}`);
};

const ensureCustomerProfile = async (
  supabase: ReturnType<typeof getSupabaseClient>,
  user: { id: string; email?: string | null },
): Promise<void> => {
  const { data: existingProfile, error: readError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (readError) {
    throw normalizeOrderError("Unable to verify customer profile", readError);
  }

  if (existingProfile) {
    return;
  }

  const { error: insertError } = await supabase.from("profiles").insert({
    id: user.id,
    email: user.email ?? `${user.id}@customers.local`,
    role: "customer",
  });

  if (insertError) {
    throw normalizeOrderError("Unable to create customer profile", insertError);
  }
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
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError) {
    throw normalizeOrderError("Unable to verify signed-in customer", userError);
  }

  if (!userData.user) {
    throw new Error("Unable to create order: Please sign in to place your order.");
  }

  await ensureCustomerProfile(supabase, userData.user);
  const userId = userData.user.id;

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total_amount: total,
      status: "pending",
      customer: input.customer,
      delivery: input.delivery,
    })
    .select("id,user_id,status,total_amount,created_at,customer,delivery")
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

  return toOrder(orderRow as OrderRow, input.items);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = getSupabaseClient();

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select(
      "id,user_id,status,total_amount,created_at,customer,delivery,order_items(product_id,quantity,price_at_purchase,products(name))",
    )
    .eq("id", orderId)
    .maybeSingle();

  if (orderError) {
    throw normalizeOrderError(`Unable to fetch order ${orderId}`, orderError);
  }

  if (!orderRow) {
    return null;
  }

  const row = orderRow as OrderRow;

  const items = ((row.order_items ?? []) as OrderItemRow[]).map((item) => ({
    productId: item.product_id,
    name: item.products?.name ?? "",
    unitPrice: toNumber(item.price_at_purchase),
    quantity: item.quantity,
  }));

  return toOrder(row, items);
}

export async function getCurrentUserOrderById(orderId: string): Promise<Order | null> {
  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw normalizeOrderError("Unable to load current user", userError);
  }

  const userId = userData.user.id;

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select(
      "id,user_id,status,total_amount,created_at,customer,delivery,order_items(product_id,quantity,price_at_purchase,products(name))",
    )
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();

  if (orderError) {
    throw normalizeOrderError(`Unable to fetch order ${orderId}`, orderError);
  }

  if (!orderRow) {
    return null;
  }

  const row = orderRow as OrderRow;

  const items = ((row.order_items ?? []) as OrderItemRow[]).map((item) => ({
    productId: item.product_id,
    name: item.products?.name ?? "",
    unitPrice: toNumber(item.price_at_purchase),
    quantity: item.quantity,
  }));

  return toOrder(row, items);
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
    .select(
      "id,user_id,status,total_amount,created_at,customer,delivery,order_items(product_id,quantity,price_at_purchase,products(name))",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw normalizeOrderError("Unable to fetch orders", error);
  }

  return ((data ?? []) as OrderRow[]).map((row) => {
    const items = ((row.order_items ?? []) as OrderItemRow[]).map((item) => ({
      productId: item.product_id,
      name: item.products?.name ?? "",
      unitPrice: toNumber(item.price_at_purchase),
      quantity: item.quantity,
    }));

    return toOrder(row, items);
  });
}

export async function listCurrentUserOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData.user) {
    throw normalizeOrderError("Unable to load customer orders", userError);
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      "id,user_id,status,total_amount,created_at,customer,delivery,order_items(product_id,quantity,price_at_purchase,products(name))",
    )
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw normalizeOrderError("Unable to fetch customer orders", error);
  }

  return ((data ?? []) as OrderRow[]).map((row) => {
    const items = ((row.order_items ?? []) as OrderItemRow[]).map((item) => ({
      productId: item.product_id,
      name: item.products?.name ?? "",
      unitPrice: toNumber(item.price_at_purchase),
      quantity: item.quantity,
    }));

    return toOrder(row, items);
  });
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
    .select("id,user_id,status,total_amount,created_at,customer,delivery")
    .maybeSingle();

  if (error) {
    throw normalizeOrderError(`Unable to update order ${orderId}`, error);
  }

  if (!data) {
    throw new Error("Order status changed before this update could be saved. Refresh and try again.");
  }

  return toOrder(data as OrderRow, []);
}
