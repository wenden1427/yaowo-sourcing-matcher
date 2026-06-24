import { CURRENT_UPLOADER_CONTRACT } from "@yaowo/shared";

export type ImportPreflightIssueCode =
  | "missing-columns"
  | "empty-parent-sku"
  | "invalid-source-url"
  | "invalid-source-main-image"
  | "invalid-child-variant-image"
  | "non-contiguous-parent-sku";

export interface ImportPreflightIssue {
  code: ImportPreflightIssueCode;
  severity: "error" | "warning";
  rowNumber?: number;
  message: string;
}

export interface ImportPreflightReport {
  ok: boolean;
  rowCount: number;
  parentSkuCount: number;
  skuCount: number;
  requiredColumnCount: number;
  actualColumnCount: number;
  issues: ImportPreflightIssue[];
}

export interface DefaultSearchImage {
  source: "childVariantImage" | "sourceMainImage";
  url: string;
}

export type SourcePlatform = "aliexpress" | "shein";

export interface ImportPreflightLogInput {
  workbookPath: string;
  sheetName: string;
  report: ImportPreflightReport;
}

const REQUIRED_COLUMN_COUNT = CURRENT_UPLOADER_CONTRACT.ranges.aliexpressDescriptionImages.end;

export function preflightScraperRows(rows: unknown[][]): ImportPreflightReport {
  const actualColumnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
  const dataRows = rows.slice(1);
  const issues: ImportPreflightIssue[] = [];

  if (actualColumnCount < REQUIRED_COLUMN_COUNT) {
    issues.push({
      code: "missing-columns",
      severity: "error",
      message: `Workbook has ${actualColumnCount} columns; expected at least ${REQUIRED_COLUMN_COUNT}.`
    });
  }

  const parentSkus = new Set<string>();
  const skuValues = new Set<string>();
  const closedParentSkus = new Set<string>();
  let currentParentSku: string | null = null;

  dataRows.forEach((row, index) => {
    const rowNumber = index + 2;
    const parentSku = stringCell(row, CURRENT_UPLOADER_CONTRACT.columns.parentSku);
    const sku = stringCell(row, CURRENT_UPLOADER_CONTRACT.columns.sku);
    const sourceUrl = stringCell(row, CURRENT_UPLOADER_CONTRACT.columns.sourceUrl);
    const sourceMainImage = stringCell(row, CURRENT_UPLOADER_CONTRACT.columns.sourceMainImage);
    const childVariantImage = stringCell(row, CURRENT_UPLOADER_CONTRACT.columns.childVariantImage);

    if (!parentSku) {
      issues.push({
        code: "empty-parent-sku",
        severity: "error",
        rowNumber,
        message: "ParentSKU is empty."
      });
    } else {
      parentSkus.add(parentSku);
      if (currentParentSku !== parentSku) {
        if (currentParentSku) {
          closedParentSkus.add(currentParentSku);
        }
        if (closedParentSkus.has(parentSku)) {
          issues.push({
            code: "non-contiguous-parent-sku",
            severity: "warning",
            rowNumber,
            message: `ParentSKU ${parentSku} appears after another ParentSKU group.`
          });
        }
        currentParentSku = parentSku;
      }
    }

    if (sku) {
      skuValues.add(sku);
    }

    if (sourceUrl && !isHttpUrl(sourceUrl)) {
      issues.push({
        code: "invalid-source-url",
        severity: "error",
        rowNumber,
        message: `Source URL is not a valid http(s) URL: ${sourceUrl}`
      });
    }

    if (sourceMainImage && !isHttpUrl(sourceMainImage)) {
      issues.push({
        code: "invalid-source-main-image",
        severity: "error",
        rowNumber,
        message: `Source main image is not a valid http(s) URL: ${sourceMainImage}`
      });
    }

    if (childVariantImage && !isHttpUrl(childVariantImage)) {
      issues.push({
        code: "invalid-child-variant-image",
        severity: "error",
        rowNumber,
        message: `Child variant image is not a valid http(s) URL: ${childVariantImage}`
      });
    }
  });

  return {
    ok: !issues.some((issue) => issue.severity === "error"),
    rowCount: dataRows.length,
    parentSkuCount: parentSkus.size,
    skuCount: skuValues.size,
    requiredColumnCount: REQUIRED_COLUMN_COUNT,
    actualColumnCount,
    issues
  };
}

export function selectDefaultSearchImage(
  dataRows: unknown[][],
  sourcePlatform: SourcePlatform = "aliexpress"
): DefaultSearchImage | null {
  const priority: DefaultSearchImage["source"][] =
    sourcePlatform === "shein" ? ["sourceMainImage", "childVariantImage"] : ["childVariantImage", "sourceMainImage"];

  for (const source of priority) {
    const column =
      source === "childVariantImage"
        ? CURRENT_UPLOADER_CONTRACT.columns.childVariantImage
        : CURRENT_UPLOADER_CONTRACT.columns.sourceMainImage;
    for (const row of dataRows) {
      const imageUrl = stringCell(row, column);
      if (imageUrl && isHttpUrl(imageUrl)) {
        return { source, url: imageUrl };
      }
    }
  }

  return null;
}

export function formatImportPreflightLog(input: ImportPreflightLogInput): string {
  const { report } = input;
  const lines = [
    "Cannot import scraper workbook: preflight failed.",
    `Time: ${new Date().toISOString()}`,
    `Workbook: ${input.workbookPath}`,
    `Sheet: ${input.sheetName}`,
    `Rows: ${report.rowCount}`,
    `Parent SKUs: ${report.parentSkuCount}`,
    `Child SKUs: ${report.skuCount}`,
    `Columns: ${report.actualColumnCount}/${report.requiredColumnCount}`,
    `Issues: ${report.issues.length}`,
    "",
    "Issue details:"
  ];

  if (report.issues.length === 0) {
    lines.push("- No issues reported.");
  } else {
    for (const issue of report.issues) {
      const row = issue.rowNumber ? ` row ${issue.rowNumber}` : "";
      lines.push(`- [${issue.severity}]${row} ${issue.code}: ${issue.message}`);
    }
  }

  return `${lines.join("\n")}\n`;
}

function stringCell(row: unknown[], oneBasedColumn: number): string {
  const value = row[oneBasedColumn - 1];
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
