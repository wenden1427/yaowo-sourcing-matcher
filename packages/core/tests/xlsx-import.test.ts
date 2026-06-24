import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import ExcelJS from "exceljs";
import { afterEach, describe, expect, it } from "vitest";

import { loadScraperWorkbookForPreflight } from "../src/import/xlsx.js";

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { recursive: true, force: true })));
});

describe("loadScraperWorkbookForPreflight", () => {
  it("reads the first worksheet into row values and runs scraper preflight", async () => {
    const workbookPath = await writeWorkbook([
      makeHeaderRow(),
      makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/red-s.jpg" }),
      makeDataRow({ parentSku: "P1", sku: "P1-red-m", variantImage: "https://img.example.com/red-m.jpg" }),
      makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/blue-s.jpg" })
    ]);

    const result = await loadScraperWorkbookForPreflight(workbookPath);

    expect(result.sheetName).toBe("Products");
    expect(result.rows).toHaveLength(4);
    expect(result.preflight).toMatchObject({
      ok: true,
      rowCount: 3,
      parentSkuCount: 2,
      skuCount: 3
    });
  });

  it("rejects non-xlsx files before trying to parse them", async () => {
    await expect(loadScraperWorkbookForPreflight("input.xls")).rejects.toThrow(".xlsx");
  });

  it("surfaces preflight errors from malformed workbooks", async () => {
    const workbookPath = await writeWorkbook([makeHeaderRow(40)]);

    const result = await loadScraperWorkbookForPreflight(workbookPath);

    expect(result.preflight.ok).toBe(false);
    expect(result.preflight.issues[0]).toMatchObject({ code: "missing-columns" });
  });
});

async function writeWorkbook(rows: string[][]): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "yaowo-xlsx-"));
  tempDirs.push(dir);
  const workbookPath = join(dir, "scraper.xlsx");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Products");

  for (const row of rows) {
    sheet.addRow(row);
  }

  await workbook.xlsx.writeFile(workbookPath);
  return workbookPath;
}

function makeHeaderRow(length = 86): string[] {
  return Array.from({ length }, (_, index) => `H${index + 1}`);
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
