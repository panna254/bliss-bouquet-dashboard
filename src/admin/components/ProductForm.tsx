import { FormEvent, useEffect, useMemo, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AdminProduct, CreateProductInput } from "@/services/products.service";

interface ProductFormProps {
  mode?: "create" | "edit";
  initialProduct?: AdminProduct | null;
  onSubmit: (input: CreateProductInput) => Promise<AdminProduct>;
  onCancel?: () => void;
}

interface ProductFormValues {
  name: string;
  description: string;
  category: string;
  price: string;
  stockQuantity: string;
  imageUrl: string;
}

type ProductFormErrors = Partial<Record<keyof ProductFormValues, string>>;

const initialValues: ProductFormValues = {
  name: "",
  description: "",
  category: "",
  price: "",
  stockQuantity: "",
  imageUrl: "",
};

const isValidImageReference = (value: string): boolean => {
  const imageReference = value.trim();

  if (!imageReference) {
    return false;
  }

  return /^(https?:\/\/|\/|\.\/|\.\.\/|[A-Za-z0-9_\-/]+?\.(jpe?g|png|webp|gif|avif)(\?.*)?$)/i.test(imageReference);
};

const validateValues = (values: ProductFormValues): ProductFormErrors => {
  const errors: ProductFormErrors = {};
  const price = Number(values.price);
  const stockQuantity = Number(values.stockQuantity);

  if (!values.name.trim()) {
    errors.name = "Product name is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!values.category.trim()) {
    errors.category = "Category is required.";
  }

  if (!values.imageUrl.trim()) {
    errors.imageUrl = "Image path or URL is required.";
  } else if (!isValidImageReference(values.imageUrl)) {
    errors.imageUrl = "Use a local image path or a Supabase Storage URL.";
  }

  if (!values.price.trim()) {
    errors.price = "Price is required.";
  } else if (!Number.isFinite(price) || price <= 0) {
    errors.price = "Price must be a number greater than 0.";
  }

  if (!values.stockQuantity.trim()) {
    errors.stockQuantity = "Stock is required.";
  } else if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    errors.stockQuantity = "Stock must be a whole number of 0 or more.";
  }

  return errors;
};

const valuesFromProduct = (product: AdminProduct | null | undefined): ProductFormValues => {
  if (!product) {
    return initialValues;
  }

  return {
    name: product.name,
    description: product.description,
    category: product.category,
    price: String(product.price),
    stockQuantity: String(product.stockQuantity),
    imageUrl: product.image,
  };
};

const ProductForm = ({ mode = "create", initialProduct, onSubmit, onCancel }: ProductFormProps) => {
  const [values, setValues] = useState<ProductFormValues>(() => valuesFromProduct(initialProduct));
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);
  const isEditMode = mode === "edit";

  useEffect(() => {
    setValues(valuesFromProduct(initialProduct));
    setErrors({});
    setSubmitError(null);
  }, [initialProduct]);

  const updateValue = (field: keyof ProductFormValues, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = validateValues(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      await onSubmit({
        name: values.name,
        description: values.description,
        category: values.category,
        imageUrl: values.imageUrl,
        price: Number(values.price),
        stockQuantity: Number(values.stockQuantity),
      });

      if (isEditMode) {
        setValues(valuesFromProduct(initialProduct));
      } else {
        setValues(initialValues);
      }
      setErrors({});
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Product could not be created.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5 rounded-md border bg-background p-4" onSubmit={handleSubmit}>
      <div>
          <h3 className="font-heading text-lg font-semibold">
            {isEditMode ? "Edit Product" : "Create Product"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode ? "Update the selected Supabase catalog product." : "Add a product to the Supabase catalog."}
        </p>
      </div>

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="product-name">Name</Label>
          <Input
            id="product-name"
            value={values.name}
            onChange={(event) => updateValue("name", event.target.value)}
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-category">Category</Label>
          <Input
            id="product-category"
            value={values.category}
            onChange={(event) => updateValue("category", event.target.value)}
            disabled={isSubmitting}
          />
          {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-price">Price</Label>
          <Input
            id="product-price"
            inputMode="decimal"
            value={values.price}
            onChange={(event) => updateValue("price", event.target.value)}
            disabled={isSubmitting}
          />
          {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="product-stock">Stock</Label>
          <Input
            id="product-stock"
            inputMode="numeric"
            value={values.stockQuantity}
            onChange={(event) => updateValue("stockQuantity", event.target.value)}
            disabled={isSubmitting}
          />
          {errors.stockQuantity && <p className="text-xs text-destructive">{errors.stockQuantity}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-image">Image Path or URL</Label>
        <Input
          id="product-image"
          value={values.imageUrl}
          placeholder="/images/rose-box.jpg or https://..."
          onChange={(event) => updateValue("imageUrl", event.target.value)}
          disabled={isSubmitting}
        />
        {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="product-description">Description</Label>
        <Textarea
          id="product-description"
          value={values.description}
          onChange={(event) => updateValue("description", event.target.value)}
          disabled={isSubmitting}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          Images may use local public paths or Supabase Storage URLs.
        </p>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (isEditMode ? "Saving..." : "Creating...") : (isEditMode ? "Save Changes" : "Create Product")}
        </Button>
        {isEditMode && onCancel && (
          <Button type="button" variant="outline" disabled={isSubmitting} onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      {hasErrors && (
        <p className="text-xs text-destructive">Fix the highlighted fields before submitting.</p>
      )}
    </form>
  );
};

export default ProductForm;
