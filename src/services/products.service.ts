import type { Product } from "@/adapters/productAdapter";

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
  getProductById(productId: string): Promise<Product | null>;
  getProductsByCategory(category: string): Promise<Product[]>;
}

export async function listProducts(query?: ProductListQuery): Promise<ProductListResult> {
  throw new Error("Not implemented");
}

export async function getProductById(productId: string): Promise<Product | null> {
  throw new Error("Not implemented");
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  throw new Error("Not implemented");
}
