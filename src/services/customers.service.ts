import { getSupabaseClient } from "@/lib/supabaseClient";
import { requireAdminSession, type AuthRole } from "@/services/auth.service";

export interface AdminCustomer {
  id: string;
  fullName: string | null;
  email: string;
  role: AuthRole;
  orderCount: number;
  latestOrderAt: string | null;
}

interface ProfileRow {
  id: string;
  full_name: string | null;
  email: string;
  role: AuthRole;
  orders?: Array<{ created_at: string } | null> | null;
}

const normalizeCustomerError = (message: string, error: unknown): Error => {
  if (error instanceof Error) {
    return new Error(`${message}: ${error.message}`);
  }

  return new Error(message);
};

const toAdminCustomer = (row: ProfileRow): AdminCustomer => {
  const orders = row.orders ?? [];
  const orderCount = orders.length;
  const latestOrderAt = orders.reduce<string | null>((latest, order) => {
    if (!order?.created_at) {
      return latest;
    }

    if (latest === null) {
      return order.created_at;
    }

    return new Date(order.created_at) > new Date(latest) ? order.created_at : latest;
  }, null);

  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    role: row.role,
    orderCount,
    latestOrderAt,
  };
};

export async function listAdminCustomers(): Promise<AdminCustomer[]> {
  await requireAdminSession();

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id,full_name,email,role,orders!left(created_at)")
    .eq("role", "customer")
    .order("full_name", { ascending: true });

  if (error) {
    throw normalizeCustomerError("Unable to load customer profiles", error);
  }

  return ((data ?? []) as ProfileRow[]).map(toAdminCustomer);
}
