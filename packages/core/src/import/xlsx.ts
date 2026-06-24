import { extname } from "node:path";

import ExcelJS from "exceljs";

import { type ImportPreflightReport, preflightScraperRows } from "./preflight.js";

export interface ScraperWorkbookPreflightInput {
  path: string;
  sheetName: string;
  rows: unknown[][];
  preflight: ImportPreflightReport;
}

export async function loadScraperWorkbookForPreflight(workbookPath: string): Promise<ScraperWorkbookPreflightInput> {
  if (extname(workbookPath).toLowerCase() !== ".xlsx") {
    throw new Error("Only .xlsx scraper workbooks are supported in Phase 1.");
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);

  const worksheet = workbook.worksheets[0];
  if (!worksheet) {
    throw new Error("Workbook does not contain a worksheet.");
  }

  const rows = worksheetToRows(worksheet);

  return {
    path: workbookPath,
    sheetName: worksheet.name,
    rows,
    preflight: preflightScraperRows(rows)
  };
}

function worksheetToRows(worksheet: ExcelJS.Worksheet): unknown[][] {
  const rows: unknown[][] = [];
  const columnCount = Math.max(worksheet.columnCount, worksheet.actualColumnCount);

  worksheet.eachRow({ includeEmpty: true }, (row) => {
    const values: unknown[] = [];
    for (let column = 1; column <= columnCount; column += 1) {
      values.push(normalizeCellValue(row.getCell(column).value));
    }
    rows.push(values);
  });

  return rows;
}

function normalizeCellValue(value: ExcelJS.CellValue): unknown {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value === "object") {
    if ("text" in value && typeof value.text === "string") {
      return value.text;
    }
    if ("hyperlink" in value && typeof value.hyperlink === "string") {
      return value.hyperlink;
    }
    if ("result" in value) {
      return value.result ?? "";
    }
    if ("richText" in value && Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text).join("");
    }
  }

  return value;
}
