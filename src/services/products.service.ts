import type { Product } from "@/adapters/productAdapter";
import { getSupabaseClient } from "@/lib/supabaseClient";

export interface ProductListQuery {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ProductListResult {
  products: Product[];
  total: number;
}

export interface ProductsService {
  listProducts(query?: ProductListQuery): Promise<ProductListResult>;
  getProducts(): Promise<Product[]>;
  getProductById(productId: string): Promise<Product | null>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image_url: string;
  category: string;
  original_price?: number | string | null;
  rating?: number | string | null;
  review_count?: number | null;
  is_popular?: boolean | null;
  is_same_day?: boolean | null;
  featured?: boolean | null;
}

const toNumber = (value: number | string | null | undefined, fallback = 0): number => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toProduct = (row: ProductRow): Product => ({
  id: row.id,
  name: row.name,
  price: toNumber(row.price),
  originalPrice: row.original_price ? toNumber(row.original_price) : undefined,
  image: row.image_url,
  rating: toNumber(row.rating),
  reviewCount: row.review_count ?? 0,
  isPopular: row.is_popular ?? row.featured ?? undefined,
  isSameDay: row.is_same_day ?? undefined,
  description: row.description,
  category: row.category,
});

const normalizeProductError = (message: string, error: unknown): Error => {
  if (error instanceof Error) {
    return new Error(`${message}: ${error.message}`);
  }

  return new Error(message);
};

export async function listProducts(query?: ProductListQuery): Promise<ProductListResult> {
  const supabase = getSupabaseClient();
  const offset = Math.max(query?.offset ?? 0, 0);

  let request = supabase
    .from("products")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (query?.category && query.category !== "all") {
    request = request.eq("category", query.category);
  }

  const search = query?.search?.trim();

  if (search) {
    const escapedSearch = search.replace(/[%_]/g, "\\$&");
    request = request.or(`name.ilike.%${escapedSearch}%,description.ilike.%${escapedSearch}%`);
  }

  if (query?.limit !== undefined) {
    const limit = Math.max(query.limit, 0);
    request = limit === 0 ? request.limit(0) : request.range(offset, offset + limit - 1);
  }

  const { data, count, error } = await request;

  if (error) {
    throw normalizeProductError("Unable to fetch products", error);
  }

  return {
    products: ((data ?? []) as ProductRow[]).map(toProduct),
    total: count ?? data?.length ?? 0,
  };
}

export async function getProducts(): Promise<Product[]> {
  const { products } = await listProducts();
  return products;
}

export async function getProductById(productId: string): Promise<Product | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    throw normalizeProductError(`Unable to fetch product ${productId}`, error);
  }

  return data ? toProduct(data as ProductRow) : null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { products } = await listProducts({ category });
  return products;
}
