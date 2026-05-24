import { getSupabaseClient } from "@/lib/supabaseClient";

export interface StorageUploadResult {
  bucket: string;
  path: string;
  publicUrl: string;
}

const PRODUCT_IMAGES_BUCKET = "product-images";

const sanitizeFileName = (fileName: string): string =>
  fileName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9._-]/g, "")
    .toLowerCase();

const generateStorageKey = (file: File): string => {
  const fileName = sanitizeFileName(file.name) || "product-image";
  const uniqueId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

  return `products/${uniqueId}-${fileName}`;
};

const getStorageKeyFromPublicUrl = (imageUrl: string): string | null => {
  const match = imageUrl.match(
    new RegExp(`^https?://[^/]+/storage/v1/object/public/${PRODUCT_IMAGES_BUCKET}/(.+?)(?:\\?.*)?$`, "i"),
  );

  if (!match || !match[1]) {
    return null;
  }

  return decodeURIComponent(match[1]);
};

const getPublicUrl = (path: string): string => {
  const supabase = getSupabaseClient();
  const { data, error } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);

  if (error) {
    throw new Error(`Unable to resolve public storage URL: ${error.message}`);
  }

  if (!data.publicUrl) {
    throw new Error("Unable to resolve public storage URL.");
  }

  return data.publicUrl;
};

export const isSupabaseStorageUrl = (imageUrl: string): boolean =>
  Boolean(getStorageKeyFromPublicUrl(imageUrl));

export const uploadProductImage = async (file: File): Promise<StorageUploadResult> => {
  const supabase = getSupabaseClient();
  const path = generateStorageKey(file);
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    throw new Error(`Unable to upload product image: ${error.message}`);
  }

  return {
    bucket: PRODUCT_IMAGES_BUCKET,
    path,
    publicUrl: getPublicUrl(path),
  };
};

export const deleteStorageAsset = async (imageUrl: string): Promise<void> => {
  const path = getStorageKeyFromPublicUrl(imageUrl);

  if (!path) {
    return;
  }

  const supabase = getSupabaseClient();
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path]);

  if (error) {
    throw new Error(`Unable to delete storage asset: ${error.message}`);
  }
};

export const replaceProductImage = async (
  existingImageUrl: string | null | undefined,
  file: File,
): Promise<StorageUploadResult> => {
  const uploadResult = await uploadProductImage(file);

  if (existingImageUrl && isSupabaseStorageUrl(existingImageUrl)) {
    const currentPath = getStorageKeyFromPublicUrl(existingImageUrl);

    if (currentPath && currentPath !== uploadResult.path) {
      try {
        await deleteStorageAsset(existingImageUrl);
      } catch {
        // Ignore cleanup failures; the upload result is still valid.
      }
    }
  }

  return uploadResult;
};
