import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminProductTable, ProductForm } from "@/admin/components";
import {
  createProduct,
  deleteProduct,
  listAdminProducts,
  updateProduct,
  type AdminProduct,
  type CreateProductInput,
} from "@/services/products.service";

const AdminProductsPage = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const result = await listAdminProducts();
      setProducts(result.products);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadInitialProducts = async () => {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const result = await listAdminProducts();

        if (isMounted) {
          setProducts(result.products);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error instanceof Error ? error.message : "Unable to load products.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadInitialProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCreateProduct = async (input: CreateProductInput) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const createdProduct = await createProduct(input);
    setProducts((currentProducts) => [createdProduct, ...currentProducts]);
    setSuccessMessage(`${createdProduct.name} was created successfully.`);

    try {
      await loadProducts();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Product list could not be refreshed.");
    }

    return createdProduct;
  };

  const handleUpdateProduct = async (input: CreateProductInput) => {
    if (!editingProduct) {
      throw new Error("Select a product before editing.");
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    const previousProducts = products;
    const optimisticProduct: AdminProduct = {
      ...editingProduct,
      name: input.name.trim(),
      description: input.description.trim(),
      category: input.category.trim(),
      price: input.price,
      image: input.imageUrl.trim(),
      stockQuantity: input.stockQuantity,
      isPopular: input.isPopular ?? false,
    };

    setProducts((currentProducts) =>
      currentProducts.map((product) => (product.id === editingProduct.id ? optimisticProduct : product)),
    );

    try {
      const updatedProduct = await updateProduct(editingProduct.id, input);
      setProducts((currentProducts) =>
        currentProducts.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)),
      );
      setEditingProduct(null);
      setSuccessMessage(`${updatedProduct.name} was updated successfully.`);
      return updatedProduct;
    } catch (error) {
      setProducts(previousProducts);
      throw error;
    }
  };

  const handleDeleteProduct = async (product: AdminProduct) => {
    const confirmed = window.confirm(`Delete ${product.name}? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    setDeletingProductId(product.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    const previousProducts = products;
    setProducts((currentProducts) => currentProducts.filter((currentProduct) => currentProduct.id !== product.id));

    try {
      await deleteProduct(product.id);

      if (editingProduct?.id === product.id) {
        setEditingProduct(null);
      }

      setSuccessMessage(`${product.name} was deleted successfully.`);
    } catch (error) {
      setProducts(previousProducts);
      setErrorMessage(error instanceof Error ? error.message : "Product could not be deleted.");
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-semibold">Admin Products</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review the Supabase product catalog.</p>
      </div>

      {editingProduct ? (
        <ProductForm
          mode="edit"
          initialProduct={editingProduct}
          onSubmit={handleUpdateProduct}
          onCancel={() => setEditingProduct(null)}
        />
      ) : (
        <ProductForm onSubmit={handleCreateProduct} />
      )}

      {successMessage && (
        <Alert>
          <AlertTitle>Product created</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 rounded-md border p-4">
              <Skeleton className="h-14 w-14 shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="hidden h-4 w-20 sm:block" />
              <Skeleton className="hidden h-7 w-14 sm:block" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && errorMessage && (
        <Alert variant="destructive">
          <AlertTitle>Products could not be loaded</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !errorMessage && products.length === 0 && (
        <div className="rounded-md border border-dashed p-8 text-center">
          <h3 className="font-medium text-foreground">No products found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Products added to Supabase will appear here.
          </p>
        </div>
      )}

      {!isLoading && !errorMessage && products.length > 0 && (
        <AdminProductTable
          products={products}
          deletingProductId={deletingProductId}
          onEditProduct={setEditingProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      )}
    </section>
  );
};

export default AdminProductsPage;
