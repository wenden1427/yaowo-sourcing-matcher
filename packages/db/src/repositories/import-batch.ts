import type { DatabaseConnection } from "../sqlite.js";
import { preflightScraperRows, selectDefaultSearchImage, type SourcePlatform } from "@yaowo/core";
import { CURRENT_UPLOADER_CONTRACT } from "@yaowo/shared";

export interface ImportScraperRowsInput {
  batchName: string;
  sourcePath: string;
  rows: unknown[][];
  sourcePlatform?: SourcePlatform;
  importMode?: "replace" | "append";
  targetBatchId?: number | null;
}

export interface ImportScraperRowsResult {
  batchId: number;
  parentSkuCount: number;
  childSkuCount: number;
}

interface ParentGroup {
  parentSku: string;
  rows: Array<{ row: unknown[]; originalRowNumber: number }>;
}

export function importScraperRows(db: DatabaseConnection, input: ImportScraperRowsInput): ImportScraperRowsResult {
  const preflight = preflightScraperRows(input.rows);
  if (!preflight.ok) {
    throw new Error(`Cannot import scraper workbook: preflight failed with ${preflight.issues.length} issue(s).`);
  }

  const runImport = db.transaction(() => {
    const mode = input.importMode ?? "append";
    if (mode === "replace") {
      db.prepare("delete from batches").run();
    }

    const targetBatch =
      mode === "append" && input.targetBatchId
        ? (db.prepare("select id from batches where id = ?").get(input.targetBatchId) as { id: number } | undefined)
        : undefined;
    const batch =
      targetBatch ??
      (db
        .prepare("insert into batches (name, source_path, original_header_json, status) values (?, ?, ?, ?) returning id")
        .get(input.batchName, input.sourcePath, JSON.stringify(input.rows[0] ?? []), "imported") as { id: number });
    const originalRowOffset =
      targetBatch && mode === "append"
        ? ((db
            .prepare("select coalesce(max(original_row_index), 1) as maxRow from child_skus where batch_id = ?")
            .get(batch.id) as { maxRow: number }).maxRow ?? 1)
        : 0;

    const dataRows = input.rows.slice(1);
    const parentGroups = groupRowsByParentSku(dataRows, originalRowOffset);
    let childSkuCount = 0;

    for (const group of parentGroups) {
      const sourceRow = group.rows[0]?.row ?? [];
      const defaultSearchImage = selectDefaultSearchImage(group.rows.map((entry) => entry.row), input.sourcePlatform);
      const existingParent = db
        .prepare("select id from parent_skus where batch_id = ? and parent_sku = ?")
        .get(batch.id, group.parentSku) as { id: number } | undefined;
      const parent =
        existingParent ??
        (db
          .prepare(
            `insert into parent_skus (
            batch_id, parent_sku, source_title, source_product_tag, source_url, source_main_image_url,
            default_search_image_url, default_search_image_source,
            original_row_start, original_row_end
          ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) returning id`
          )
          .get(
            batch.id,
            group.parentSku,
            cell(sourceRow, CURRENT_UPLOADER_CONTRACT.columns.sourceTitle),
            cell(sourceRow, CURRENT_UPLOADER_CONTRACT.columns.productTag),
            cell(sourceRow, CURRENT_UPLOADER_CONTRACT.columns.sourceUrl),
            cell(sourceRow, CURRENT_UPLOADER_CONTRACT.columns.sourceMainImage),
            defaultSearchImage?.url ?? null,
            defaultSearchImage?.source ?? null,
            group.rows[0]?.originalRowNumber ?? null,
            group.rows[group.rows.length - 1]?.originalRowNumber ?? null
          ) as { id: number });

      if (existingParent) {
        db.prepare("update parent_skus set original_row_end = max(coalesce(original_row_end, 0), ?) where id = ?").run(
          group.rows[group.rows.length - 1]?.originalRowNumber ?? null,
          parent.id
        );
      }

      for (const rowEntry of group.rows) {
        const row = rowEntry.row;
        db.prepare(
          `insert into child_skus (
            batch_id, parent_sku_id, sku, color, size, source_price,
            variant_image_url, original_row_index, original_row_json
          ) values (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).run(
          batch.id,
          parent.id,
          cell(row, CURRENT_UPLOADER_CONTRACT.columns.sku),
          cell(row, CURRENT_UPLOADER_CONTRACT.columns.color),
          cell(row, CURRENT_UPLOADER_CONTRACT.columns.size),
          cell(row, CURRENT_UPLOADER_CONTRACT.columns.price),
          cell(row, CURRENT_UPLOADER_CONTRACT.columns.childVariantImage),
          rowEntry.originalRowNumber,
          JSON.stringify(row)
        );
        childSkuCount += 1;
      }
    }

    return {
      batchId: batch.id,
      parentSkuCount: parentGroups.length,
      childSkuCount
    };
  });

  return runImport();
}

function groupRowsByParentSku(dataRows: unknown[][], originalRowOffset = 0): ParentGroup[] {
  const groups: ParentGroup[] = [];
  const groupsByParentSku = new Map<string, ParentGroup>();
  let currentGroup: ParentGroup | null = null;

  dataRows.forEach((row, index) => {
    const parentSku = cell(row, CURRENT_UPLOADER_CONTRACT.columns.parentSku);
    if (!currentGroup || currentGroup.parentSku !== parentSku) {
      currentGroup = groupsByParentSku.get(parentSku) ?? null;
      if (!currentGroup) {
        currentGroup = { parentSku, rows: [] };
        groupsByParentSku.set(parentSku, currentGroup);
        groups.push(currentGroup);
      }
    }
    currentGroup.rows.push({ row, originalRowNumber: originalRowOffset + index + 2 });
  });

  return groups;
}

function cell(row: unknown[], oneBasedColumn: number): string {
  const value = row[oneBasedColumn - 1];
  if (value === null || value === undefined) {
    return "";
  }
  return String(value).trim();
}

