import { products, type Product } from "@/data/products";

export type { Product } from "@/data/products";

export interface ProductCategory {
  id: string;
  name: string;
  count: number;
}

const categoryLabels: Record<string, string> = {
  bouquets: "Bouquets",
  "gift-sets": "Gift Sets",
  roses: "Roses",
  "money-bouquets": "Money Bouquets",
};

export const getProducts = (): Product[] => products;

export const getProductById = (productId: string): Product | undefined =>
  products.find((product) => product.id === productId);

export const getProductsByCategory = (category: string): Product[] => {
  if (category === "all") {
    return getProducts();
  }

  return products.filter((product) => product.category === category);
};

export const getProductCategories = (): ProductCategory[] => [
  {
    id: "all",
    name: "All Products",
    count: products.length,
  },
  ...Object.entries(categoryLabels).map(([id, name]) => ({
    id,
    name,
    count: getProductsByCategory(id).length,
  })),
];
