import { describe, expect, it } from "vitest";

import { resolveExportPrice } from "../src/export/price.js";

describe("resolveExportPrice", () => {
  it("uses child SKU override before ParentSKU manual price", () => {
    expect(
      resolveExportPrice({
        originalPrice: "10000",
        parentManualPrice: "12000",
        childOverridePrice: "13000"
      })
    ).toEqual({
      appliedPrice: "13000",
      source: "childOverride",
      changed: true,
      warning: null
    });
  });

  it("uses ParentSKU manual price when child override is empty", () => {
    expect(
      resolveExportPrice({
        originalPrice: "10000",
        parentManualPrice: "12000",
        childOverridePrice: " "
      })
    ).toEqual({
      appliedPrice: "12000",
      source: "parentManual",
      changed: true,
      warning: null
    });
  });

  it("keeps original price and warns when no manual price exists", () => {
    expect(resolveExportPrice({ originalPrice: "10000" })).toEqual({
      appliedPrice: "10000",
      source: "original",
      changed: false,
      warning: "missing-manual-price"
    });
  });

  it("treats equal manual price as not changed while preserving source", () => {
    expect(resolveExportPrice({ originalPrice: "10000", parentManualPrice: "10000" })).toEqual({
      appliedPrice: "10000",
      source: "parentManual",
      changed: false,
      warning: null
    });
  });
});
