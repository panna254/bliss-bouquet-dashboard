import { getProductById as getLocalProductById, type Product } from "@/adapters/productAdapter";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { requireAdminSession } from "@/services/auth.service";

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

export interface AdminProduct extends Product {
  stockQuantity: number;
}

export interface AdminProductListResult {
  products: AdminProduct[];
  total: number;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stockQuantity: number;
}

export type UpdateProductInput = CreateProductInput;

export interface ProductsService {
  listProducts(query?: ProductListQuery): Promise<ProductListResult>;
  listAdminProducts(query?: ProductListQuery): Promise<AdminProductListResult>;
  createProduct(input: CreateProductInput): Promise<AdminProduct>;
  updateProduct(productId: string, input: UpdateProductInput): Promise<AdminProduct>;
  deleteProduct(productId: string): Promise<void>;
  getProducts(): Promise<Product[]>;
  getProductById(productId: string): Promise<Product | null>;
  getCheckoutProductByCartId(productId: string): Promise<Product | null>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

interface ProductRow {
  id: string;
  name: string;
  description: string;
  price: number | string;
  image_url: string;
  category: string;
  stock_quantity?: number | null;
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

const toAdminProduct = (row: ProductRow): AdminProduct => ({
  ...toProduct(row),
  stockQuantity: row.stock_quantity ?? 0,
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

export async function listAdminProducts(query?: ProductListQuery): Promise<AdminProductListResult> {
  await requireAdminSession();

  const supabase = getSupabaseClient();
  const offset = Math.max(query?.offset ?? 0, 0);

  let request = supabase
    .from("products")
    .select("id,name,description,price,image_url,category,stock_quantity,created_at", { count: "exact" })
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
    throw normalizeProductError("Unable to fetch admin products", error);
  }

  return {
    products: ((data ?? []) as ProductRow[]).map(toAdminProduct),
    total: count ?? data?.length ?? 0,
  };
}

export async function createProduct(input: CreateProductInput): Promise<AdminProduct> {
  await requireAdminSession();

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      image_url: input.imageUrl.trim(),
      category: input.category.trim(),
      stock_quantity: input.stockQuantity,
    })
    .select("id,name,description,price,image_url,category,stock_quantity,created_at")
    .single();

  if (error || !data) {
    throw normalizeProductError("Unable to create product", error);
  }

  return toAdminProduct(data as ProductRow);
}

export async function updateProduct(productId: string, input: UpdateProductInput): Promise<AdminProduct> {
  await requireAdminSession();

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      image_url: input.imageUrl.trim(),
      category: input.category.trim(),
      stock_quantity: input.stockQuantity,
    })
    .eq("id", productId)
    .select("id,name,description,price,image_url,category,stock_quantity,created_at")
    .maybeSingle();

  if (error) {
    throw normalizeProductError("Unable to update product", error);
  }

  if (!data) {
    throw new Error("Product could not be found. It may have already been removed.");
  }

  return toAdminProduct(data as ProductRow);
}

export async function deleteProduct(productId: string): Promise<void> {
  await requireAdminSession();

  const supabase = getSupabaseClient();

  const { error } = await supabase.from("products").delete().eq("id", productId);

  if (error) {
    throw normalizeProductError("Unable to delete product", error);
  }
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

export async function getCheckoutProductByCartId(productId: string): Promise<Product | null> {
  let supabaseProduct: Product | null = null;

  try {
    supabaseProduct = await getProductById(productId);
  } catch {
    supabaseProduct = null;
  }

  if (supabaseProduct) {
    return supabaseProduct;
  }

  const localProduct = getLocalProductById(productId);

  if (!localProduct) {
    return null;
  }

  const { products } = await listProducts({ search: localProduct.name, limit: 10 });
  const matchingProduct = products.find(
    (product) =>
      product.name.trim().toLowerCase() === localProduct.name.trim().toLowerCase() &&
      product.category === localProduct.category,
  );

  return matchingProduct ?? null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { products } = await listProducts({ category });
  return products;
}
