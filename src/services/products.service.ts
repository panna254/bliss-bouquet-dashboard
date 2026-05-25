import {
  getProducts as getLocalCatalogProducts,
  getProductsByCategory as getLocalProductsByCategory,
} from "@/adapters/productAdapter";
import {
  allowsLocalFallback,
  getCatalogSource,
  usesLocalCatalogOnly,
} from "@/services/catalogSource.service";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { requireAdminSession } from "@/services/auth.service";
import {
  findSupabaseProductForLocal,
  getLocalProductByLegacyId,
  isUuid,
  normalizeCategory,
  normalizeSupabaseProduct,
  resolveCheckoutProductId,
  type Product,
  type ProductRow,
} from "@/services/productNormalization";
import {
  uploadProductImage,
  replaceProductImage,
  isSupabaseStorageUrl,
} from "@/services/storage.service";

export type { Product } from "@/services/productNormalization";

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
  imageUrl?: string;
  imageFile?: File | null;
  category: string;
  stockQuantity: number;
  isPopular?: boolean;
}

const ADMIN_PRODUCT_COLUMNS =
  "id,name,description,price,image_url,category,stock_quantity,is_popular,created_at";

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

const toAdminProduct = (row: ProductRow): AdminProduct => ({
  ...normalizeSupabaseProduct(row),
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
    request = request.eq("category", normalizeCategory(query.category));
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
    products: ((data ?? []) as ProductRow[]).map(normalizeSupabaseProduct),
    total: count ?? data?.length ?? 0,
  };
}

export async function listAdminProducts(query?: ProductListQuery): Promise<AdminProductListResult> {
  await requireAdminSession();

  const supabase = getSupabaseClient();
  const offset = Math.max(query?.offset ?? 0, 0);

  let request = supabase
    .from("products")
    .select(`${ADMIN_PRODUCT_COLUMNS}`, { count: "exact" })
    .order("created_at", { ascending: false });

  if (query?.category && query.category !== "all") {
    request = request.eq("category", normalizeCategory(query.category));
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

const resolveProductImageUrl = async (
  input: CreateProductInput,
  existingImageUrl?: string | null,
): Promise<string> => {
  if (input.imageFile) {
    if (existingImageUrl && isSupabaseStorageUrl(existingImageUrl)) {
      return (await replaceProductImage(existingImageUrl, input.imageFile)).publicUrl;
    }

    return (await uploadProductImage(input.imageFile)).publicUrl;
  }

  const imageUrl = input.imageUrl?.trim() ?? "";

  if (!imageUrl) {
    throw new Error("Product image is required.");
  }

  return imageUrl;
};

export async function createProduct(input: CreateProductInput): Promise<AdminProduct> {
  await requireAdminSession();

  const supabase = getSupabaseClient();
  const imageUrl = await resolveProductImageUrl(input);

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      image_url: imageUrl,
      category: input.category.trim(),
      stock_quantity: input.stockQuantity,
      is_popular: input.isPopular ?? false,
    })
    .select(ADMIN_PRODUCT_COLUMNS)
    .single();

  if (error || !data) {
    throw normalizeProductError("Unable to create product", error);
  }

  return toAdminProduct(data as ProductRow);
}

export async function updateProduct(productId: string, input: UpdateProductInput): Promise<AdminProduct> {
  await requireAdminSession();

  const supabase = getSupabaseClient();
  let imageUrl = input.imageUrl?.trim() ?? "";

  if (input.imageFile) {
    const { data: currentProductRow, error: currentProductError } = await supabase
      .from("products")
      .select("image_url")
      .eq("id", productId)
      .maybeSingle();

    if (currentProductError) {
      throw normalizeProductError("Unable to fetch existing product image", currentProductError);
    }

    const currentImageUrl = (currentProductRow as { image_url?: string | null } | null)?.image_url ?? null;
    imageUrl = await resolveProductImageUrl(input, currentImageUrl);
  } else {
    imageUrl = await resolveProductImageUrl(input);
  }

  const { data, error } = await supabase
    .from("products")
    .update({
      name: input.name.trim(),
      description: input.description.trim(),
      price: input.price,
      image_url: imageUrl,
      category: input.category.trim(),
      stock_quantity: input.stockQuantity,
      is_popular: input.isPopular ?? false,
    })
    .eq("id", productId)
    .select(ADMIN_PRODUCT_COLUMNS)
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
  if (!isUuid(productId)) {
    return null;
  }

  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (error) {
    throw normalizeProductError(`Unable to fetch product ${productId}`, error);
  }

  return data ? normalizeSupabaseProduct(data as ProductRow) : null;
}

export async function getCheckoutProductByCartId(productId: string): Promise<Product | null> {
  const idKind = resolveCheckoutProductId(productId);

  if (idKind === "uuid") {
    try {
      return await getProductById(productId);
    } catch {
      return null;
    }
  }

  if (idKind !== "legacy") {
    return null;
  }

  const localProduct = getLocalProductByLegacyId(productId);

  if (!localProduct) {
    return null;
  }

  const { products } = await listProducts({
    category: localProduct.category,
    search: localProduct.name,
    limit: 25,
  });

  return findSupabaseProductForLocal(localProduct, products);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const { products } = await listProducts({ category });
  return products;
}

export type HomepageCatalogSource = "supabase" | "local";

export interface HomepageCatalogResult {
  products: Product[];
  source: HomepageCatalogSource;
  usedFallback: boolean;
}

export interface HomepageProductCategory {
  id: string;
  name: string;
  count: number;
}

const HOMEPAGE_CATEGORY_LABELS: Record<string, string> = {
  bouquets: "Bouquets",
  "gift-sets": "Gift Sets",
  roses: "Roses",
  "money-bouquets": "Money Bouquets",
};

export const filterHomepageProductsByCategory = (
  products: Product[],
  categoryId: string,
): Product[] => {
  if (categoryId === "all") {
    return products;
  }

  return products.filter((product) => product.category === categoryId);
};

export const buildHomepageProductCategories = (products: Product[]): HomepageProductCategory[] => [
  {
    id: "all",
    name: "All Products",
    count: products.length,
  },
  ...Object.entries(HOMEPAGE_CATEGORY_LABELS).map(([id, name]) => ({
    id,
    name,
    count: products.filter((product) => product.category === id).length,
  })),
];

export const FEATURED_PRODUCT_LIMIT = 6;

export const selectFeaturedProducts = (products: Product[]): Product[] => {
  const popular = products.filter((product) => product.isPopular);

  if (popular.length > 0) {
    return popular.slice(0, FEATURED_PRODUCT_LIMIT);
  }

  return products.slice(0, FEATURED_PRODUCT_LIMIT);
};

export interface FeaturedCatalogResult extends HomepageCatalogResult {
  featuredProducts: Product[];
}

export async function loadFeaturedProducts(): Promise<FeaturedCatalogResult> {
  const catalog = await loadHomepageCatalog();

  return {
    ...catalog,
    featuredProducts: selectFeaturedProducts(catalog.products),
  };
}

const loadLocalCategoryCatalog = (config: CategoryPageLoadConfig): HomepageCatalogResult => {
  const products = config.category
    ? getLocalProductsByCategory(config.category)
    : filterCategoryPageProducts(getLocalCatalogProducts(), config);

  return {
    products,
    source: "local",
    usedFallback: false,
  };
};

const loadLocalHomepageCatalog = (): HomepageCatalogResult => ({
  products: getLocalCatalogProducts(),
  source: "local",
  usedFallback: false,
});

const buildLocalFallbackResult = (products: Product[]): HomepageCatalogResult => ({
  products,
  source: "local",
  usedFallback: true,
});

const buildLiveCatalogResult = (products: Product[]): HomepageCatalogResult => ({
  products,
  source: "supabase",
  usedFallback: false,
});

export async function loadHomepageCatalog(): Promise<HomepageCatalogResult> {
  if (usesLocalCatalogOnly()) {
    return loadLocalHomepageCatalog();
  }

  const mode = getCatalogSource();

  try {
    const liveProducts = await getProducts();

    if (mode === "supabase") {
      return buildLiveCatalogResult(liveProducts);
    }

    if (liveProducts.length > 0) {
      return buildLiveCatalogResult(liveProducts);
    }
  } catch {
    if (allowsLocalFallback()) {
      return buildLocalFallbackResult(getLocalCatalogProducts());
    }

    return buildLiveCatalogResult([]);
  }

  if (allowsLocalFallback()) {
    return buildLocalFallbackResult(getLocalCatalogProducts());
  }

  return buildLiveCatalogResult([]);
}

export interface CategoryPageLoadConfig {
  category?: string;
  occasion?: string;
}

export const filterCategoryPageProducts = (
  products: Product[],
  config: CategoryPageLoadConfig,
): Product[] => {
  if (config.category) {
    return filterHomepageProductsByCategory(products, config.category);
  }

  if (config.occasion) {
    const occasion = config.occasion.trim().toLowerCase();

    return products.filter((product) => {
      const searchText = `${product.name} ${product.description}`.toLowerCase();
      return searchText.includes(occasion);
    });
  }

  return [];
};

export async function loadCategoryPageCatalog(
  config: CategoryPageLoadConfig,
): Promise<HomepageCatalogResult> {
  if (usesLocalCatalogOnly()) {
    return loadLocalCategoryCatalog(config);
  }

  try {
    const liveProducts = config.category
      ? await getProductsByCategory(config.category)
      : filterCategoryPageProducts(await getProducts(), config);

    return buildLiveCatalogResult(liveProducts);
  } catch {
    if (allowsLocalFallback()) {
      return buildLocalFallbackResult(
        config.category
          ? getLocalProductsByCategory(config.category)
          : filterCategoryPageProducts(getLocalCatalogProducts(), config),
      );
    }
  }

  return buildLiveCatalogResult([]);
}
