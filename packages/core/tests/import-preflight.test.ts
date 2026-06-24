import { describe, expect, it } from "vitest";

import { formatImportPreflightLog, preflightScraperRows, selectDefaultSearchImage } from "../src/import/preflight.js";

describe("preflightScraperRows", () => {
  it("accepts a minimal uploader-compatible AliExpress scraper sheet", () => {
    const rows = [
      makeHeaderRow(),
      makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/red-s.jpg" }),
      makeDataRow({ parentSku: "P1", sku: "P1-red-m", variantImage: "https://img.example.com/red-m.jpg" }),
      makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/blue-s.jpg" })
    ];

    expect(preflightScraperRows(rows)).toMatchObject({
      ok: true,
      parentSkuCount: 2,
      rowCount: 3,
      skuCount: 3,
      issues: []
    });
  });

  it("fails when the sheet has fewer than the required uploader columns", () => {
    const rows = [Array.from({ length: 40 }, (_, index) => `H${index + 1}`)];

    expect(preflightScraperRows(rows)).toMatchObject({
      ok: false,
      issues: [{ code: "missing-columns", severity: "error" }]
    });
  });

  it("reports empty ParentSKU rows and malformed URL/image fields", () => {
    const row = makeDataRow({
      parentSku: "",
      sku: "NO-PARENT",
      sourceUrl: "not-a-url",
      mainImage: "ftp://img.example.com/main.jpg",
      variantImage: "bad-image"
    });

    const report = preflightScraperRows([makeHeaderRow(), row]);

    expect(report.ok).toBe(false);
    expect(report.issues.map((issue) => issue.code)).toEqual([
      "empty-parent-sku",
      "invalid-source-url",
      "invalid-source-main-image",
      "invalid-child-variant-image"
    ]);
  });

  it("reports non-contiguous ParentSKU groups", () => {
    const rows = [
      makeHeaderRow(),
      makeDataRow({ parentSku: "P1", sku: "P1-a" }),
      makeDataRow({ parentSku: "P2", sku: "P2-a" }),
      makeDataRow({ parentSku: "P1", sku: "P1-b" })
    ];

    expect(preflightScraperRows(rows).issues).toContainEqual({
      code: "non-contiguous-parent-sku",
      severity: "warning",
      rowNumber: 4,
      message: "ParentSKU P1 appears after another ParentSKU group."
    });
  });

  it("formats a readable failure log with workbook and issue details", () => {
    const report = preflightScraperRows([
      makeHeaderRow(),
      makeDataRow({
        parentSku: "",
        sku: "NO-PARENT",
        sourceUrl: "not-a-url",
        mainImage: "ftp://img.example.com/main.jpg",
        variantImage: "bad-image"
      })
    ]);

    const log = formatImportPreflightLog({
      workbookPath: "E:/imports/bad.xlsx",
      sheetName: "Products",
      report
    });

    expect(log).toContain("Cannot import scraper workbook");
    expect(log).toContain("Workbook: E:/imports/bad.xlsx");
    expect(log).toContain("Sheet: Products");
    expect(log).toContain("Rows: 1");
    expect(log).toContain("Issues: 4");
    expect(log).toContain("[error] row 2 empty-parent-sku: ParentSKU is empty.");
    expect(log).toContain("[error] row 2 invalid-source-url: Source URL is not a valid http(s) URL: not-a-url");
  });
});

describe("selectDefaultSearchImage", () => {
  it("uses the first child SKU variant image when available", () => {
    const rows = [
      makeDataRow({ parentSku: "P1", variantImage: "" }),
      makeDataRow({ parentSku: "P1", variantImage: "https://img.example.com/variant.jpg" })
    ];

    expect(selectDefaultSearchImage(rows)).toEqual({
      source: "childVariantImage",
      url: "https://img.example.com/variant.jpg"
    });
  });

  it("falls back to the source main image when no child variant image exists", () => {
    const rows = [makeDataRow({ parentSku: "P1", mainImage: "https://img.example.com/main.jpg", variantImage: "" })];

    expect(selectDefaultSearchImage(rows)).toEqual({
      source: "sourceMainImage",
      url: "https://img.example.com/main.jpg"
    });
  });

  it("uses the source main image first for Shein imports", () => {
    const rows = [
      makeDataRow({
        parentSku: "P1",
        mainImage: "https://img.example.com/shein-main.jpg",
        variantImage: "https://img.example.com/variant.jpg"
      })
    ];

    expect(selectDefaultSearchImage(rows, "shein")).toEqual({
      source: "sourceMainImage",
      url: "https://img.example.com/shein-main.jpg"
    });
  });
});

function makeHeaderRow(): string[] {
  return Array.from({ length: 86 }, (_, index) => `H${index + 1}`);
}

function makeDataRow(overrides: {
  parentSku: string;
  sku?: string;
  sourceUrl?: string;
  price?: string;
  mainImage?: string;
  variantImage?: string;
}): string[] {
  const row = Array.from({ length: 86 }, () => "");
  row[0] = overrides.parentSku;
  row[1] = overrides.sku ?? `${overrides.parentSku}-SKU`;
  row[9] = "Black";
  row[10] = "S";
  row[11] = overrides.sourceUrl ?? "https://www.aliexpress.com/item/100500.html";
  row[12] = overrides.price ?? "10000";
  row[17] = overrides.mainImage ?? "https://img.example.com/main.jpg";
  row[40] = overrides.variantImage ?? "https://img.example.com/variant.jpg";
  row[66] = "https://img.example.com/detail-1.jpg";
  return row;
}
