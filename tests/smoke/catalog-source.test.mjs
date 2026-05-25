import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();
const read = (path) => readFileSync(join(root, path), "utf8");

test("catalog source env parsing defaults invalid values to hybrid", async () => {
  const { parseCatalogSourceMode, resetCatalogSourceForTests } = await import(
    "../../src/services/catalogSource.service.ts"
  );

  resetCatalogSourceForTests();
  assert.equal(parseCatalogSourceMode(undefined), "hybrid");
  assert.equal(parseCatalogSourceMode(""), "hybrid");
  assert.equal(parseCatalogSourceMode("invalid"), "hybrid");
  assert.equal(parseCatalogSourceMode("LOCAL"), "local");
  assert.equal(parseCatalogSourceMode(" supabase "), "supabase");
});

test("storefront catalog loaders use centralized catalog source service", () => {
  const productsService = read("src/services/products.service.ts");
  const indexPage = read("src/pages/Index.tsx");
  const categoryPage = read("src/pages/CategoryPage.tsx");
  const featuredCarousel = read("src/components/FeaturedCarousel.tsx");

  assert.match(productsService, /from "@\/services\/catalogSource.service"/);
  assert.match(productsService, /usesLocalCatalogOnly/);
  assert.match(productsService, /allowsLocalFallback/);
  assert.doesNotMatch(indexPage, /VITE_CATALOG_SOURCE/);
  assert.doesNotMatch(categoryPage, /VITE_CATALOG_SOURCE/);
  assert.doesNotMatch(featuredCarousel, /VITE_CATALOG_SOURCE/);
  assert.doesNotMatch(indexPage, /import\.meta\.env/);
});

test("products service wires all three catalog source modes", () => {
  const productsService = read("src/services/products.service.ts");

  assert.match(productsService, /usesLocalCatalogOnly\(\)/);
  assert.match(productsService, /allowsLocalFallback\(\)/);
  assert.match(productsService, /buildLiveCatalogResult/);
  assert.match(productsService, /buildLocalFallbackResult/);
});
