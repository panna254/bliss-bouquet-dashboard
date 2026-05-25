import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

test("product normalization layer is centralized in services", () => {
  const normalization = read("src/services/productNormalization.ts");
  const productsService = read("src/services/products.service.ts");
  const indexPage = read("src/pages/Index.tsx");
  const checkoutService = read("src/services/checkout.service.ts");

  assert.match(normalization, /normalizeSupabaseProduct/);
  assert.match(normalization, /resolveProductImage/);
  assert.match(normalization, /buildProductMatchKey/);
  assert.match(normalization, /normalizeCategory/);
  assert.match(normalization, /findSupabaseProductForLocal/);

  assert.match(productsService, /from "@\/services\/productNormalization"/);
  assert.match(productsService, /getCatalogSource|usesLocalCatalogOnly|allowsLocalFallback/);
  assert.match(productsService, /loadHomepageCatalog/);
  assert.match(productsService, /normalizeSupabaseProduct/);
  assert.match(productsService, /findSupabaseProductForLocal/);
  assert.match(productsService, /buildLiveCatalogResult/);
  assert.match(
    productsService,
    /export async function loadCategoryPageCatalog[\s\S]*return buildLiveCatalogResult\(liveProducts\)/,
  );

  const categoryPage = read("src/pages/CategoryPage.tsx");

  assert.match(indexPage, /loadHomepageCatalog/);
  assert.match(indexPage, /from "@\/services\/products.service"/);
  assert.doesNotMatch(indexPage, /from "@\/adapters\/productAdapter"/);

  assert.match(categoryPage, /loadCategoryPageCatalog/);
  assert.match(categoryPage, /from "@\/services\/products.service"/);
  assert.doesNotMatch(categoryPage, /from "@\/adapters\/productAdapter"/);

  const featuredCarousel = read("src/components/FeaturedCarousel.tsx");
  assert.match(featuredCarousel, /loadFeaturedProducts/);
  assert.doesNotMatch(featuredCarousel, /from "@\/adapters\/productAdapter"/);
  assert.doesNotMatch(indexPage, /getSupabaseClient/);

  assert.match(checkoutService, /getCheckoutProductByCartId/);
  assert.match(checkoutService, /from "@\/services\/products.service"/);
});

test("checkout still resolves cart products through products.service", () => {
  const productsService = read("src/services/products.service.ts");

  assert.match(productsService, /getCheckoutProductByCartId/);
  assert.match(productsService, /resolveCheckoutProductId/);
  assert.match(productsService, /getLocalProductByLegacyId/);
});
