import { Pencil, Trash2 } from "lucide-react";
import type { AdminProduct } from "@/services/products.service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AdminProductTableProps {
  products: AdminProduct[];
  deletingProductId?: string | null;
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (product: AdminProduct) => void;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    maximumFractionDigits: 0,
  }).format(price);

const stockTone = (stockQuantity: number) => {
  if (stockQuantity <= 0) {
    return "border-destructive/30 bg-destructive/10 text-destructive";
  }

  if (stockQuantity <= 5) {
    return "border-accent/30 bg-accent/10 text-accent-foreground";
  }

  return "border-primary/20 bg-primary/10 text-primary";
};

const ProductImage = ({ image, name }: Pick<AdminProduct, "image" | "name">) => (
  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border bg-muted">
    <img src={image} alt={name} className="h-full w-full object-cover" loading="lazy" />
  </div>
);

const StockBadge = ({ stockQuantity }: Pick<AdminProduct, "stockQuantity">) => (
  <span
    className={[
      "inline-flex min-w-14 justify-center rounded-md border px-2 py-1 text-xs font-medium",
      stockTone(stockQuantity),
    ].join(" ")}
  >
    {stockQuantity}
  </span>
);

const AdminProductTable = ({
  products,
  deletingProductId,
  onEditProduct,
  onDeleteProduct,
}: AdminProductTableProps) => {
  return (
    <>
      <div className="hidden overflow-hidden rounded-md border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[72px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <ProductImage image={product.image} name={product.name} />
                </TableCell>
                <TableCell>
                  <div className="font-medium text-foreground">{product.name}</div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">{product.description}</div>
                </TableCell>
                <TableCell className="capitalize text-muted-foreground">
                  {product.category.replace(/-/g, " ")}
                </TableCell>
                <TableCell className="text-right font-medium">{formatPrice(product.price)}</TableCell>
                <TableCell className="text-right">
                  <StockBadge stockQuantity={product.stockQuantity} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEditProduct(product)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteProduct(product)}
                      disabled={deletingProductId === product.id}
                    >
                      <Trash2 className="h-4 w-4" />
                      {deletingProductId === product.id ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 md:hidden">
        {products.map((product) => (
          <article key={product.id} className="rounded-md border bg-background p-3">
            <div className="flex gap-3">
              <ProductImage image={product.image} name={product.name} />
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-medium text-foreground">{product.name}</h3>
                <p className="mt-1 text-xs capitalize text-muted-foreground">
                  {product.category.replace(/-/g, " ")}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
              <span className="text-sm font-medium text-primary">{formatPrice(product.price)}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Stock</span>
                <StockBadge stockQuantity={product.stockQuantity} />
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => onEditProduct(product)}>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDeleteProduct(product)}
                disabled={deletingProductId === product.id}
              >
                <Trash2 className="h-4 w-4" />
                {deletingProductId === product.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
};

export default AdminProductTable;
