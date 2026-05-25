import { products as localProducts, type Product } from "@/data/products";

export type { Product };

export interface ProductRow {
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

const PLACEHOLDER_IMAGE_PATTERN = /placehold\.co/i;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LEGACY_LOCAL_ID_PATTERN = /^\d+$/;

const CATEGORY_ALIASES: Record<string, string> = {
  bouquet: "bouquets",
  bouquets: "bouquets",
  rose: "roses",
  roses: "roses",
  "gift-set": "gift-sets",
  "gift-sets": "gift-sets",
  giftsets: "gift-sets",
  "money-bouquet": "money-bouquets",
  "money-bouquets": "money-bouquets",
  moneybouquets: "money-bouquets",
};

const toNumber = (value: number | string | null | undefined, fallback = 0): number => {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const isUuid = (value: string): boolean => UUID_PATTERN.test(value);

export const isLegacyLocalProductId = (value: string): boolean => LEGACY_LOCAL_ID_PATTERN.test(value);

export const normalizeCategory = (category: string): string => {
  const normalized = category.trim().toLowerCase().replace(/_/g, "-").replace(/\s+/g, "-");
  return CATEGORY_ALIASES[normalized] ?? normalized;
};

export const buildProductMatchKey = (name: string, category: string): string =>
  `${normalizeCategory(category)}::${name.trim().toLowerCase()}`;

const buildLegacyCatalogMaps = () => {
  const assetByLegacyId = new Map<string, string>();
  const legacyIdByMatchKey = new Map<string, string>();
  const localByLegacyId = new Map<string, Product>();

  for (const product of localProducts) {
    assetByLegacyId.set(product.id, product.image);
    legacyIdByMatchKey.set(buildProductMatchKey(product.name, product.category), product.id);
    localByLegacyId.set(product.id, product);
  }

  return { assetByLegacyId, legacyIdByMatchKey, localByLegacyId };
};

const { assetByLegacyId, legacyIdByMatchKey, localByLegacyId } = buildLegacyCatalogMaps();

export const getLocalProductByLegacyId = (legacyLocalId: string): Product | undefined =>
  localByLegacyId.get(legacyLocalId);

export const resolveLegacyLocalId = (
  name: string,
  category: string,
  explicitLegacyId?: string | null,
): string | undefined => {
  if (explicitLegacyId && localByLegacyId.has(explicitLegacyId)) {
    return explicitLegacyId;
  }

  return legacyIdByMatchKey.get(buildProductMatchKey(name, category));
};

export const resolveProductImage = (
  imageUrl: string | null | undefined,
  options?: {
    legacyLocalId?: string;
    localImage?: string;
  },
): string => {
  const trimmed = imageUrl?.trim() ?? "";
  const legacyAsset = options?.legacyLocalId ? assetByLegacyId.get(options.legacyLocalId) : undefined;
  const localFallback = options?.localImage ?? legacyAsset;

  if (trimmed && /^https?:\/\//i.test(trimmed) && !PLACEHOLDER_IMAGE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  if (localFallback && (!trimmed || PLACEHOLDER_IMAGE_PATTERN.test(trimmed))) {
    return localFallback;
  }

  if (trimmed && !PLACEHOLDER_IMAGE_PATTERN.test(trimmed)) {
    return trimmed;
  }

  return localFallback ?? trimmed;
};

export const normalizeSupabaseProduct = (row: ProductRow): Product => {
  const category = normalizeCategory(row.category);
  const legacyLocalId = resolveLegacyLocalId(row.name, category);
  const localProduct = legacyLocalId ? localByLegacyId.get(legacyLocalId) : undefined;

  return {
    id: row.id,
    name: row.name.trim(),
    price: toNumber(row.price),
    originalPrice: row.original_price ? toNumber(row.original_price) : localProduct?.originalPrice,
    image: resolveProductImage(row.image_url, {
      legacyLocalId,
      localImage: localProduct?.image,
    }),
    rating: row.rating !== null && row.rating !== undefined ? toNumber(row.rating, localProduct?.rating ?? 0) : (localProduct?.rating ?? 0),
    reviewCount: row.review_count ?? localProduct?.reviewCount ?? 0,
    isPopular: row.is_popular ?? row.featured ?? localProduct?.isPopular,
    isSameDay: row.is_same_day ?? localProduct?.isSameDay,
    description: row.description.trim(),
    category,
  };
};

export const normalizeLocalProduct = (product: Product): Product => ({
  ...product,
  name: product.name.trim(),
  category: normalizeCategory(product.category),
  image: resolveProductImage(product.image, {
    legacyLocalId: product.id,
    localImage: product.image,
  }),
});

export const productsMatch = (left: Product, right: Product): boolean =>
  buildProductMatchKey(left.name, left.category) === buildProductMatchKey(right.name, right.category);

export const findSupabaseProductForLocal = (
  localProduct: Product,
  candidates: Product[],
): Product | null => {
  const normalizedLocal = normalizeLocalProduct(localProduct);
  const matchKey = buildProductMatchKey(normalizedLocal.name, normalizedLocal.category);

  const exactMatch = candidates.find(
    (candidate) => buildProductMatchKey(candidate.name, candidate.category) === matchKey,
  );

  return exactMatch ?? null;
};

export const resolveCheckoutProductId = (productId: string): "uuid" | "legacy" | "unknown" => {
  if (isUuid(productId)) {
    return "uuid";
  }

  if (isLegacyLocalProductId(productId)) {
    return "legacy";
  }

  return "unknown";
};
