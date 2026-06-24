import { mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import ExcelJS from "exceljs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { writeRowsWorkbook } from "../src/export/xlsx.js";

describe("writeRowsWorkbook", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "yaowo-xlsx-export-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  it("writes headers and rows to an xlsx workbook", async () => {
    const outputPath = join(tempDir, "sourced.xlsx");

    await writeRowsWorkbook({
      outputPath,
      worksheetName: "有货源",
      headers: ["ParentSKU", "SKU", "价格", "1688链接"],
      rows: [
        ["P1", "P1-red-s", "12900", "https://detail.1688.com/offer/123.html"],
        ["P1", "P1-red-m", "13900", "https://detail.1688.com/offer/123.html"]
      ]
    });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(outputPath);
    const worksheet = workbook.getWorksheet("有货源");

    expect(worksheet?.getRow(1).values).toEqual([, "ParentSKU", "SKU", "价格", "1688链接"]);
    expect(worksheet?.getRow(2).values).toEqual([
      ,
      "P1",
      "P1-red-s",
      "12900",
      "https://detail.1688.com/offer/123.html"
    ]);
  });
});
