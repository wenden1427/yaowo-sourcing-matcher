export type ExportPriceSource = "childOverride" | "parentManual" | "original";

export interface ResolveExportPriceInput {
  originalPrice: string;
  parentManualPrice?: string | null;
  childOverridePrice?: string | null;
}

export interface ResolveExportPriceResult {
  appliedPrice: string;
  source: ExportPriceSource;
  changed: boolean;
  warning: "missing-manual-price" | null;
}

export function resolveExportPrice(input: ResolveExportPriceInput): ResolveExportPriceResult {
  const originalPrice = normalizePrice(input.originalPrice);
  const childOverridePrice = normalizeOptionalPrice(input.childOverridePrice);
  if (childOverridePrice !== null) {
    return result(childOverridePrice, "childOverride", originalPrice, null);
  }

  const parentManualPrice = normalizeOptionalPrice(input.parentManualPrice);
  if (parentManualPrice !== null) {
    return result(parentManualPrice, "parentManual", originalPrice, null);
  }

  return result(originalPrice, "original", originalPrice, "missing-manual-price");
}

function result(
  appliedPrice: string,
  source: ExportPriceSource,
  originalPrice: string,
  warning: ResolveExportPriceResult["warning"]
): ResolveExportPriceResult {
  return {
    appliedPrice,
    source,
    changed: appliedPrice !== originalPrice,
    warning
  };
}

function normalizeOptionalPrice(value: string | null | undefined): string | null {
  const normalized = normalizePrice(value ?? "");
  return normalized === "" ? null : normalized;
}

function normalizePrice(value: string): string {
  return value.trim();
}
