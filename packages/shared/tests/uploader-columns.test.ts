import { describe, expect, it } from "vitest";

import {
  CURRENT_UPLOADER_CONTRACT,
  excelColumnName,
  getImportColumnByRole
} from "../src/uploader/columns.js";

describe("current uploader-compatible column contract", () => {
  it("matches the inspected scraper/uploader fixed columns", () => {
    expect(CURRENT_UPLOADER_CONTRACT.columns.parentSku).toBe(1);
    expect(CURRENT_UPLOADER_CONTRACT.columns.sku).toBe(2);
    expect(CURRENT_UPLOADER_CONTRACT.columns.sourceTitle).toBe(3);
    expect(CURRENT_UPLOADER_CONTRACT.columns.productTag).toBe(5);
    expect(CURRENT_UPLOADER_CONTRACT.columns.color).toBe(10);
    expect(CURRENT_UPLOADER_CONTRACT.columns.size).toBe(11);
    expect(CURRENT_UPLOADER_CONTRACT.columns.sourceUrl).toBe(12);
    expect(CURRENT_UPLOADER_CONTRACT.columns.price).toBe(13);
    expect(CURRENT_UPLOADER_CONTRACT.columns.sourceMainImage).toBe(18);
    expect(CURRENT_UPLOADER_CONTRACT.columns.childVariantImage).toBe(41);
  });

  it("captures both uploader image ranges without merging their meanings", () => {
    expect(CURRENT_UPLOADER_CONTRACT.ranges.sourceExtraImages).toEqual({ start: 18, end: 38 });
    expect(CURRENT_UPLOADER_CONTRACT.ranges.aliexpressDescriptionImages).toEqual({ start: 67, end: 86 });
  });

  it("returns one-based Excel columns by role", () => {
    expect(getImportColumnByRole("price")).toBe(13);
    expect(getImportColumnByRole("childVariantImage")).toBe(41);
  });

  it("formats Excel column names for diagnostics", () => {
    expect(excelColumnName(1)).toBe("A");
    expect(excelColumnName(26)).toBe("Z");
    expect(excelColumnName(27)).toBe("AA");
    expect(excelColumnName(86)).toBe("CH");
  });
});
