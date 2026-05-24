import { getSupabaseClient } from "@/lib/supabaseClient";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

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
  listOrders(): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
}

interface OrderRow {
  id: string;
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
    .select("id,status,total_amount,created_at")
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
      console.error("Order item insert failed and order cleanup also failed", cleanupError);
    }

    throw normalizeOrderError("Unable to create order items", itemsError);
  }

  return toOrder(orderRow as OrderRow, input.items, input.customer, input.delivery);
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const supabase = getSupabaseClient();

  const { data: orderRow, error: orderError } = await supabase
    .from("orders")
    .select("id,status,total_amount,created_at")
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

export async function listOrders(): Promise<Order[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .select("id,status,total_amount,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw normalizeOrderError("Unable to fetch orders", error);
  }

  return ((data ?? []) as OrderRow[]).map((row) => toOrder(row, []));
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("id,status,total_amount,created_at")
    .single();

  if (error || !data) {
    throw normalizeOrderError(`Unable to update order ${orderId}`, error);
  }

  return toOrder(data as OrderRow, []);
}
