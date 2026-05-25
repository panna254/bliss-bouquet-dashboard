export type CatalogSourceMode = "local" | "hybrid" | "supabase";

const VALID_CATALOG_SOURCES: CatalogSourceMode[] = ["local", "hybrid", "supabase"];

const DEFAULT_CATALOG_SOURCE: CatalogSourceMode = "hybrid";

const normalizeEnvValue = (value: string | undefined): string =>
  value?.trim().toLowerCase() ?? "";

export const parseCatalogSourceMode = (value: string | undefined): CatalogSourceMode => {
  const normalized = normalizeEnvValue(value);

  if (VALID_CATALOG_SOURCES.includes(normalized as CatalogSourceMode)) {
    return normalized as CatalogSourceMode;
  }

  return DEFAULT_CATALOG_SOURCE;
};

let resolvedCatalogSource: CatalogSourceMode | null = null;

export const getCatalogSource = (): CatalogSourceMode => {
  if (!resolvedCatalogSource) {
    resolvedCatalogSource = parseCatalogSourceMode(import.meta.env.VITE_CATALOG_SOURCE);
  }

  return resolvedCatalogSource;
};

export const resetCatalogSourceForTests = (): void => {
  resolvedCatalogSource = null;
};

export const usesLocalCatalogOnly = (): boolean => getCatalogSource() === "local";

export const usesLiveCatalog = (): boolean => getCatalogSource() !== "local";

export const allowsLocalFallback = (): boolean => getCatalogSource() === "hybrid";
