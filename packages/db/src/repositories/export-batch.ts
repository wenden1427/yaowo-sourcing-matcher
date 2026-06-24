import type { DatabaseConnection } from "../sqlite.js";
import { normalize1688OfferLink, resolveExportPrice } from "@yaowo/core";
import { CURRENT_UPLOADER_CONTRACT } from "@yaowo/shared";

export interface UpsertSearchCandidateInput {
  batchId: number;
  parentSku: string;
  rank: number;
  offerUrl: string;
  title?: string | null;
  imageUrl?: string | null;
  unitPrice?: string | null;
  monthlySales?: number | null;
  shopName?: string | null;
}

export interface UpsertSearchCandidateResult {
  candidateId: number;
  offerId: string;
  normalizedUrl: string;
}

export interface UpsertHumanReviewInput {
  batchId: number;
  parentSku: string;
  reviewStatus: "sourced" | "no_source" | "needs_confirmation" | "re_search_requested" | "unreviewed" | "search_failed";
  selectedCandidateId?: number | null;
  manualOfferUrl?: string | null;
  matchingReason?: string | null;
  reviewer?: string | null;
}

export interface SetParentManualPriceInput {
  batchId: number;
  parentSku: string;
  manualPrice: string | null;
}

export interface SetChildManualPriceInput {
  batchId: number;
  sku: string;
  manualPrice: string | null;
}

export interface SetParentExcludedInput {
  batchId: number;
  parentSku: string;
  excluded: boolean;
}

export interface SetChildExcludedInput {
  batchId: number;
  sku: string;
  excluded: boolean;
}

export interface SourcedScraperExport {
  batchId: number;
  headers: unknown[];
  rows: unknown[][];
  parentSkuCount: number;
  childSkuCount: number;
  warnings: string[];
}

export type FullReviewExport = SourcedScraperExport;

const APPENDED_EXPORT_HEADERS = [
  "1688_match_status",
  "1688_offer_url",
  "1688_offer_id",
  "1688_main_image",
  "1688_title",
  "1688_purchase_price",
  "1688_monthly_sales",
  "1688_shop_name",
  "matching_reason",
  "reviewer",
  "reviewed_at",
  "source_price",
  "parent_manual_price",
  "child_manual_price",
  "applied_export_price",
  "export_price_source",
  "manual_price_changed",
  "首选 1688 链接"
] as const;

export function upsertSearchCandidate(
  db: DatabaseConnection,
  input: UpsertSearchCandidateInput
): UpsertSearchCandidateResult {
  const parentSkuId = requireParentSkuId(db, input.batchId, input.parentSku);
  const normalized = normalize1688OfferLink(input.offerUrl);
  if (!normalized.ok) {
    throw new Error(`Invalid 1688 offer URL: ${normalized.reason}`);
  }

  const inserted = db
    .prepare(
      `insert into search_candidates (
        batch_id, parent_sku_id, rank, offer_id, offer_url, title, image_url,
        unit_price, monthly_sales, shop_name, raw_json
      ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      on conflict(batch_id, parent_sku_id, rank) do update set
        offer_id = excluded.offer_id,
        offer_url = excluded.offer_url,
        title = excluded.title,
        image_url = excluded.image_url,
        unit_price = excluded.unit_price,
        monthly_sales = excluded.monthly_sales,
        shop_name = excluded.shop_name,
        raw_json = excluded.raw_json
      returning id`
    )
    .get(
      input.batchId,
      parentSkuId,
      input.rank,
      normalized.offerId,
      normalized.normalizedUrl,
      input.title ?? null,
      input.imageUrl ?? null,
      input.unitPrice ?? null,
      input.monthlySales ?? null,
      input.shopName ?? null,
      JSON.stringify(input)
    ) as { id: number };

  return {
    candidateId: inserted.id,
    offerId: normalized.offerId,
    normalizedUrl: normalized.normalizedUrl
  };
}

export function upsertHumanReview(db: DatabaseConnection, input: UpsertHumanReviewInput): void {
  const parentSkuId = requireParentSkuId(db, input.batchId, input.parentSku);
  const manualOffer = normalizeOptionalOfferUrl(input.manualOfferUrl);

  db.prepare(
    `insert into human_reviews (
      batch_id, parent_sku_id, review_status, selected_candidate_id,
      manual_1688_offer_id, manual_1688_url, matching_reason, reviewer, reviewed_at
    ) values (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    on conflict(batch_id, parent_sku_id) do update set
      review_status = excluded.review_status,
      selected_candidate_id = excluded.selected_candidate_id,
      manual_1688_offer_id = excluded.manual_1688_offer_id,
      manual_1688_url = excluded.manual_1688_url,
      matching_reason = excluded.matching_reason,
      reviewer = excluded.reviewer,
      reviewed_at = excluded.reviewed_at`
  ).run(
    input.batchId,
    parentSkuId,
    input.reviewStatus,
    input.selectedCandidateId ?? null,
    manualOffer?.offerId ?? null,
    manualOffer?.normalizedUrl ?? null,
    input.matchingReason ?? null,
    input.reviewer ?? null
  );
}

export function setParentManualPrice(db: DatabaseConnection, input: SetParentManualPriceInput): void {
  const result = db
    .prepare("update parent_skus set manual_price = ? where batch_id = ? and parent_sku = ?")
    .run(normalizeNullable(input.manualPrice), input.batchId, input.parentSku);
  if (result.changes === 0) {
    throw new Error(`ParentSKU not found: ${input.parentSku}`);
  }
}

export function setChildManualPrice(db: DatabaseConnection, input: SetChildManualPriceInput): void {
  const result = db
    .prepare("update child_skus set manual_price = ? where batch_id = ? and sku = ?")
    .run(normalizeNullable(input.manualPrice), input.batchId, input.sku);
  if (result.changes === 0) {
    throw new Error(`SKU not found: ${input.sku}`);
  }
}

export function setParentExcluded(db: DatabaseConnection, input: SetParentExcludedInput): void {
  const result = db
    .prepare("update parent_skus set is_excluded = ? where batch_id = ? and parent_sku = ?")
    .run(input.excluded ? 1 : 0, input.batchId, input.parentSku);
  if (result.changes === 0) {
    throw new Error(`ParentSKU not found: ${input.parentSku}`);
  }
}

export function setChildExcluded(db: DatabaseConnection, input: SetChildExcludedInput): void {
  const result = db
    .prepare("update child_skus set is_excluded = ? where batch_id = ? and sku = ?")
    .run(input.excluded ? 1 : 0, input.batchId, input.sku);
  if (result.changes === 0) {
    throw new Error(`SKU not found: ${input.sku}`);
  }
}

export function buildSourcedScraperExport(db: DatabaseConnection, batchId: number): SourcedScraperExport {
  const batch = db
    .prepare("select id, original_header_json from batches where id = ?")
    .get(batchId) as { id: number; original_header_json: string | null } | undefined;
  if (!batch) {
    throw new Error(`Batch not found: ${batchId}`);
  }

  const baseHeaders = parseArray(batch.original_header_json ?? "[]");
  const rows = db
    .prepare(
      `with latest_ai as (
        select r.*
        from ai_reviews r
        join (
          select candidate_id, max(id) as latest_id
          from ai_reviews
          where batch_id = ?
          group by candidate_id
        ) latest on latest.latest_id = r.id
      ),
      best_candidates as (
        select *
        from (
          select
            sc.*,
            row_number() over (
              partition by sc.parent_sku_id
              order by
                case when ar.same_item_probability is null then 1 else 0 end asc,
                ar.same_item_probability desc,
                sc.rank asc
            ) as display_rank
          from search_candidates sc
          left join latest_ai ar on ar.candidate_id = sc.id
          where sc.batch_id = ?
        )
        where display_rank = 1
      )
      select
        p.parent_sku as parentSku,
        p.manual_price as parentManualPrice,
        c.sku,
        c.source_price as sourcePrice,
        c.manual_price as childManualPrice,
        c.original_row_json as originalRowJson,
        coalesce(hr.review_status, 'retained') as reviewStatus,
        hr.manual_1688_offer_id as manualOfferId,
        hr.manual_1688_url as manualOfferUrl,
        hr.matching_reason as matchingReason,
        hr.reviewer,
        hr.reviewed_at as reviewedAt,
        coalesce(sc.offer_id, bc.offer_id) as candidateOfferId,
        coalesce(sc.offer_url, bc.offer_url) as candidateOfferUrl,
        coalesce(sc.title, bc.title) as candidateTitle,
        coalesce(sc.image_url, bc.image_url) as candidateImageUrl,
        coalesce(sc.unit_price, bc.unit_price) as candidateUnitPrice,
        coalesce(sc.monthly_sales, bc.monthly_sales) as candidateMonthlySales,
        coalesce(sc.shop_name, bc.shop_name) as candidateShopName,
        bc.offer_url as firstCandidateOfferUrl
      from child_skus c
      join parent_skus p on p.id = c.parent_sku_id
      left join human_reviews hr on hr.parent_sku_id = p.id and hr.batch_id = c.batch_id
      left join search_candidates sc on sc.id = hr.selected_candidate_id
      left join best_candidates bc on bc.batch_id = c.batch_id and bc.parent_sku_id = p.id
      where c.batch_id = ? and coalesce(p.is_excluded, 0) = 0 and coalesce(c.is_excluded, 0) = 0
      order by c.original_row_index asc`
    )
    .all(batchId, batchId, batchId) as ExportRowSource[];

  const exportedRows = rows.map((row) => {
    const originalRow = parseArray(row.originalRowJson);
    const price = resolveExportPrice({
      originalPrice: row.sourcePrice ?? "",
      parentManualPrice: row.parentManualPrice,
      childOverridePrice: row.childManualPrice
    });

    originalRow[CURRENT_UPLOADER_CONTRACT.columns.price - 1] = price.appliedPrice;
    return [
      ...originalRow,
      row.reviewStatus,
      row.candidateOfferUrl ?? row.manualOfferUrl ?? "",
      row.candidateOfferId ?? row.manualOfferId ?? "",
      row.candidateImageUrl ?? "",
      row.candidateTitle ?? "",
      row.candidateUnitPrice ?? "",
      row.candidateMonthlySales ?? "",
      row.candidateShopName ?? "",
      row.matchingReason ?? "",
      row.reviewer ?? "",
      row.reviewedAt ?? "",
      row.sourcePrice ?? "",
      row.parentManualPrice ?? "",
      row.childManualPrice ?? "",
      price.appliedPrice,
      price.source,
      price.changed ? "yes" : "no",
      row.firstCandidateOfferUrl ?? row.candidateOfferUrl ?? row.manualOfferUrl ?? ""
    ];
  });

  return {
    batchId,
    headers: [...baseHeaders, ...APPENDED_EXPORT_HEADERS],
    rows: exportedRows,
    parentSkuCount: new Set(rows.map((row) => row.parentSku)).size,
    childSkuCount: exportedRows.length,
    warnings: []
  };
}

export function buildFullReviewExport(db: DatabaseConnection, batchId: number): FullReviewExport {
  const batch = db
    .prepare("select id, original_header_json from batches where id = ?")
    .get(batchId) as { id: number; original_header_json: string | null } | undefined;
  if (!batch) {
    throw new Error(`Batch not found: ${batchId}`);
  }

  const baseHeaders = parseArray(batch.original_header_json ?? "[]");
  const rows = db
    .prepare(
      `select
        p.parent_sku as parentSku,
        p.manual_price as parentManualPrice,
        c.sku,
        c.source_price as sourcePrice,
        c.manual_price as childManualPrice,
        c.original_row_json as originalRowJson,
        coalesce(hr.review_status, 'unreviewed') as reviewStatus,
        hr.manual_1688_offer_id as manualOfferId,
        hr.manual_1688_url as manualOfferUrl,
        hr.matching_reason as matchingReason,
        hr.reviewer,
        hr.reviewed_at as reviewedAt,
        sc.offer_id as candidateOfferId,
        sc.offer_url as candidateOfferUrl,
        sc.title as candidateTitle,
        sc.image_url as candidateImageUrl,
        sc.unit_price as candidateUnitPrice,
        sc.monthly_sales as candidateMonthlySales,
        sc.shop_name as candidateShopName,
        first_sc.offer_url as firstCandidateOfferUrl
      from child_skus c
      join parent_skus p on p.id = c.parent_sku_id
      left join human_reviews hr on hr.parent_sku_id = p.id and hr.batch_id = c.batch_id
      left join search_candidates sc on sc.id = hr.selected_candidate_id
      left join search_candidates first_sc
        on first_sc.batch_id = c.batch_id and first_sc.parent_sku_id = p.id and first_sc.rank = 1
      where c.batch_id = ?
      order by c.original_row_index asc`
    )
    .all(batchId) as ExportRowSource[];

  const exportedRows = rows.map((row) => {
    const originalRow = parseArray(row.originalRowJson);
    const price = resolveExportPrice({
      originalPrice: row.sourcePrice ?? "",
      parentManualPrice: row.parentManualPrice,
      childOverridePrice: row.childManualPrice
    });

    return [
      ...originalRow,
      row.reviewStatus,
      row.candidateOfferUrl ?? row.manualOfferUrl ?? "",
      row.candidateOfferId ?? row.manualOfferId ?? "",
      row.candidateImageUrl ?? "",
      row.candidateTitle ?? "",
      row.candidateUnitPrice ?? "",
      row.candidateMonthlySales ?? "",
      row.candidateShopName ?? "",
      row.matchingReason ?? "",
      row.reviewer ?? "",
      row.reviewedAt ?? "",
      row.sourcePrice ?? "",
      row.parentManualPrice ?? "",
      row.childManualPrice ?? "",
      price.appliedPrice,
      price.source,
      price.changed ? "yes" : "no",
      row.firstCandidateOfferUrl ?? row.candidateOfferUrl ?? row.manualOfferUrl ?? ""
    ];
  });

  return {
    batchId,
    headers: [...baseHeaders, ...APPENDED_EXPORT_HEADERS],
    rows: exportedRows,
    parentSkuCount: new Set(rows.map((row) => row.parentSku)).size,
    childSkuCount: exportedRows.length,
    warnings: []
  };
}

interface ExportRowSource {
  parentSku: string;
  sku: string;
  sourcePrice: string | null;
  parentManualPrice: string | null;
  childManualPrice: string | null;
  originalRowJson: string;
  reviewStatus: string;
  manualOfferId: string | null;
  manualOfferUrl: string | null;
  matchingReason: string | null;
  reviewer: string | null;
  reviewedAt: string | null;
  candidateOfferId: string | null;
  candidateOfferUrl: string | null;
  candidateTitle: string | null;
  candidateImageUrl: string | null;
  candidateUnitPrice: string | null;
  candidateMonthlySales: number | null;
  candidateShopName: string | null;
  firstCandidateOfferUrl: string | null;
}

function requireParentSkuId(db: DatabaseConnection, batchId: number, parentSku: string): number {
  const row = db
    .prepare("select id from parent_skus where batch_id = ? and parent_sku = ?")
    .get(batchId, parentSku) as { id: number } | undefined;
  if (!row) {
    throw new Error(`ParentSKU not found: ${parentSku}`);
  }
  return row.id;
}

function normalizeOptionalOfferUrl(value: string | null | undefined): { offerId: string; normalizedUrl: string } | null {
  const normalizedInput = normalizeNullable(value);
  if (normalizedInput === null) {
    return null;
  }

  const normalized = normalize1688OfferLink(normalizedInput);
  if (!normalized.ok) {
    throw new Error(`Invalid 1688 offer URL: ${normalized.reason}`);
  }
  return {
    offerId: normalized.offerId,
    normalizedUrl: normalized.normalizedUrl
  };
}

function normalizeNullable(value: string | null | undefined): string | null {
  const normalized = (value ?? "").trim();
  return normalized === "" ? null : normalized;
}

function parseArray(json: string): unknown[] {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) {
    throw new Error("Stored workbook row is not an array.");
  }
  return [...parsed];
}

