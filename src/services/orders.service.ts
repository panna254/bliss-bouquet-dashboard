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

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  throw new Error("Not implemented");
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  throw new Error("Not implemented");
}

export async function listOrders(): Promise<Order[]> {
  throw new Error("Not implemented");
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
  throw new Error("Not implemented");
}
