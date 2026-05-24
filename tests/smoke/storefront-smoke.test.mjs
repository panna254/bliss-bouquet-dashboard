import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

const root = process.cwd();

const read = (path) => readFileSync(join(root, path), "utf8");

const walkFiles = (dir) =>
  readdirSync(join(root, dir)).flatMap((entry) => {
    const path = join(dir, entry);
    const absolutePath = join(root, path);

    if (statSync(absolutePath).isDirectory()) {
      return walkFiles(path);
    }

    return path;
  });

test("routing keeps static pages before the dynamic category route", () => {
  const app = read("src/App.tsx");
  const staticRoutes = [
    'path="/contact-us"',
    'path="/delivery-info"',
    'path="/care-guide"',
    'path="/returns"',
  ];
  const adminRoute = 'path="/admin"';
  const categoryRoute = 'path="/:category"';
  const catchAllRoute = 'path="*"';

  assert.equal((app.match(new RegExp(categoryRoute, "g")) ?? []).length, 1);
  assert.equal((app.match(new RegExp(adminRoute, "g")) ?? []).length, 1);

  for (const route of staticRoutes) {
    assert.ok(app.indexOf(route) > -1, `${route} should exist`);
    assert.ok(app.indexOf(route) < app.indexOf(categoryRoute), `${route} should be before /:category`);
  }

  assert.ok(app.indexOf(adminRoute) < app.indexOf(categoryRoute), "/admin should be before /:category");
  assert.ok(app.indexOf(categoryRoute) < app.indexOf(catchAllRoute), "category route should be before catch-all");
});

test("category navigation uses validated SEO-friendly slugs", () => {
  const categoryPage = read("src/pages/CategoryPage.tsx");
  const header = read("src/components/Header.tsx");
  const categoryTiles = read("src/components/CategoryTiles.tsx");
  const expectedSlugs = ["roses", "bouquets", "birthday-flowers", "wedding-flowers"];

  assert.match(categoryPage, /const categorySlug = category\?\.toLowerCase\(\) \?\? ""/);
  assert.match(categoryPage, /const config = categoryConfigs\[categorySlug\]/);
  assert.match(categoryPage, /if \(!config\)/);
  assert.match(categoryPage, /return <NotFound \/>/);

  for (const slug of expectedSlugs) {
    assert.match(categoryPage, new RegExp(`'${slug}'`), `${slug} should be configured`);
    assert.match(header, new RegExp(`href="/${slug}"`), `${slug} should be linked from header`);
  }

  assert.match(categoryTiles, /href: "\/roses"/);
  assert.match(categoryTiles, /href: "\/bouquets"/);
});

test("product access flows through the adapter boundary", () => {
  const adapter = read("src/adapters/productAdapter.ts");
  const sourceFiles = walkFiles("src").filter((file) => /\.(ts|tsx)$/.test(file));
  const directProductImports = sourceFiles.filter((file) => {
    const source = read(file);
    return source.includes("@/data/products") && file !== "src/adapters/productAdapter.ts";
  });

  assert.deepEqual(directProductImports, []);
  assert.match(adapter, /export const getProducts = \(\): Product\[\] => products/);
  assert.match(adapter, /export const getProductById = \(productId: string\): Product \| undefined/);
  assert.match(adapter, /export const getProductsByCategory = \(category: string\): Product\[\]/);
});

test("product cards keep render-critical product fields visible", () => {
  const productCard = read("src/components/ProductCard.tsx");
  const indexPage = read("src/pages/Index.tsx");
  const featuredCarousel = read("src/components/FeaturedCarousel.tsx");

  assert.match(productCard, /src={image}/);
  assert.match(productCard, /alt={name}/);
  assert.match(productCard, /{name}/);
  assert.match(productCard, /Ksh {price}/);
  assert.match(productCard, /Add to Cart/);
  assert.match(productCard, /addToCart\(product\)/);

  assert.match(indexPage, /getProducts\(\)/);
  assert.match(indexPage, /getProductsByCategory\(selectedCategory\)/);
  assert.match(featuredCarousel, /getProducts\(\)/);
  assert.match(featuredCarousel, /filter\(p => p\.isPopular\)/);
});

test("cart totals are calculated from item price times quantity", () => {
  const cartContext = read("src/contexts/CartContext.tsx");
  const cartPanel = read("src/components/CartPanel.tsx");

  assert.match(
    cartContext,
    /items\.reduce\(\(total, item\) => total \+ \(item\.price \* item\.quantity\), 0\)/,
  );
  assert.match(cartPanel, /formatPrice\(item\.price \* item\.quantity\)/);
  assert.match(cartPanel, /formatPrice\(getCartTotal\(\)\)/);
  assert.match(cartPanel, /currency:\s*'KES'/);
});

test("newsletter submission remains wired for Netlify Forms", () => {
  const newsletter = read("src/components/Newsletter.tsx");
  const indexHtml = read("index.html");

  assert.match(newsletter, /name="newsletter"/);
  assert.match(newsletter, /method="POST"/);
  assert.match(newsletter, /action="\/"/);
  assert.match(newsletter, /data-netlify="true"/);
  assert.match(newsletter, /data-netlify-honeypot="bot-field"/);
  assert.match(newsletter, /name="form-name" value="newsletter"/);
  assert.match(newsletter, /fetch\('\/'/);

  assert.match(indexHtml, /<form name="newsletter" netlify netlify-honeypot="bot-field" hidden>/);
  assert.match(indexHtml, /<input type="email" name="email" \/>/);
});
