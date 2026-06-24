import type { DatabaseConnection } from "../sqlite.js";
import { resolveExportPrice, type KoreaListingPriceResult } from "@yaowo/core";

import {
  setChildExcluded,
  setChildManualPrice,
  setParentExcluded,
  setParentManualPrice,
  upsertHumanReview
} from "./export-batch.js";

export { setChildExcluded, setParentExcluded } from "./export-batch.js";

export interface ReviewItem {
  parentSkuId: number;
  parentSku: string;
  defaultSearchImageUrl: string;
  sourceUrl: string;
  childSkuCount: number;
  isExcluded: boolean;
  reviewStatus: string;
  manual1688Url: string;
  manualPrice: string;
  matchingReason: string;
  searchStatus: string | null;
  searchErrorCode: string | null;
  searchErrorMessage: string | null;
  pricingDraft: PricingDraftState | null;
  childSkus: ReviewChildSku[];
  candidates: ReviewCandidate[];
}

export interface ReviewChildSku {
  sku: string;
  color: string;
  size: string;
  variantImageUrl: string;
  sourcePrice: string;
  manualPrice: string;
  appliedPrice: string;
  priceSource: string;
  isExcluded: boolean;
}

export interface ReviewCandidate {
  candidateId: number;
  rank: number;
  offerUrl: string;
  title: string;
  imageUrl: string;
  unitPrice: string;
  monthlySales: number | null;
  shopName: string;
  aiReview?: ReviewCandidateAiReview | null;
}

export interface ReviewCandidateAiReview {
  sameItemProbability: number | null;
  matchingReason: string;
  riskPoints: string[];
  errorMessage: string | null;
}

export interface SaveManualSourcedReviewInput {
  batchId: number;
  parentSku: string;
  offerUrl: string;
  manualPrice: string;
  selectedCandidateId?: number | null;
  matchingReason?: string | null;
  reviewer?: string | null;
}

export interface MarkParentNoSourceInput {
  batchId: number;
  parentSku: string;
  matchingReason?: string | null;
  reviewer?: string | null;
}

export interface SaveManualPricesInput {
  batchId: number;
  parentSku: string;
  parentManualPrice: string | null;
  childPrices: Array<{
    sku: string;
    manualPrice: string | null;
  }>;
}

export interface PricingDraftState {
  purchasePriceRmb: string;
  domesticFreightRmb: string;
  weightKg: string;
  lengthCm: string;
  widthCm: string;
  heightCm: string;
  targetRoiPercent: string;
  commissionPercent: string;
  priceMultiplier: string;
  exchangeRateRmbPerKrw: string;
  airEnabled: boolean;
  seaEnabled: boolean;
  priceResult: KoreaListingPriceResult | null;
}

export interface SavePricingDraftInput {
  batchId: number;
  parentSku: string;
  draft: PricingDraftState;
}

export function listReviewItems(db: DatabaseConnection, batchId: number): ReviewItem[] {
  const items = db
    .prepare(
      `select
        p.id as parentSkuId,
        p.parent_sku as parentSku,
        p.default_search_image_url as defaultSearchImageUrl,
        p.source_url as sourceUrl,
        p.manual_price as manualPrice,
        p.is_excluded as isExcluded,
        coalesce(hr.review_status, 'unreviewed') as reviewStatus,
        coalesce(hr.manual_1688_url, sc.offer_url, '') as manual1688Url,
        coalesce(hr.matching_reason, '') as matchingReason,
        j.status as searchStatus,
        j.error_code as searchErrorCode,
        j.error_message as searchErrorMessage,
        count(c.id) as childSkuCount
      from parent_skus p
      join child_skus c on c.parent_sku_id = p.id
      left join human_reviews hr on hr.parent_sku_id = p.id and hr.batch_id = p.batch_id
      left join search_candidates sc on sc.id = hr.selected_candidate_id
      left join search_jobs j on j.parent_sku_id = p.id and j.batch_id = p.batch_id
      where p.batch_id = ?
      group by p.id
      order by p.original_row_start asc, p.id asc`
    )
    .all(batchId)
    .map((row) => {
      const item = row as ReviewItem;
      return {
        parentSkuId: item.parentSkuId,
        parentSku: item.parentSku,
        defaultSearchImageUrl: item.defaultSearchImageUrl ?? "",
        sourceUrl: item.sourceUrl ?? "",
        childSkuCount: item.childSkuCount,
        isExcluded: Boolean(item.isExcluded),
        reviewStatus: item.reviewStatus,
        manual1688Url: item.manual1688Url ?? "",
        manualPrice: item.manualPrice ?? "",
        matchingReason: item.matchingReason ?? "",
        searchStatus: item.searchStatus ?? null,
        searchErrorCode: item.searchErrorCode ?? null,
        searchErrorMessage: item.searchErrorMessage ?? null,
        pricingDraft: null,
        childSkus: [],
        candidates: []
      };
    });

  const candidatesByParentSkuId = loadCandidatesByParentSkuId(db, batchId);
  const childSkusByParentSkuId = loadChildSkusByParentSkuId(db, batchId);
  const pricingDraftsByParentSkuId = loadPricingDraftsByParentSkuId(db, batchId);
  return items.map((item) => ({
    ...item,
    pricingDraft: pricingDraftsByParentSkuId.get(item.parentSkuId) ?? null,
    childSkus: childSkusByParentSkuId.get(item.parentSkuId) ?? [],
    candidates: candidatesByParentSkuId.get(item.parentSkuId) ?? []
  }));
}

export function saveManualSourcedReview(db: DatabaseConnection, input: SaveManualSourcedReviewInput): void {
  const transaction = db.transaction(() => {
    setParentManualPrice(db, {
      batchId: input.batchId,
      parentSku: input.parentSku,
      manualPrice: input.manualPrice
    });
    upsertHumanReview(db, {
      batchId: input.batchId,
      parentSku: input.parentSku,
      reviewStatus: "sourced",
      selectedCandidateId: input.selectedCandidateId,
      manualOfferUrl: input.offerUrl,
      matchingReason: input.matchingReason,
      reviewer: input.reviewer
    });
  });
  transaction();
}

export function markParentNoSource(db: DatabaseConnection, input: MarkParentNoSourceInput): void {
  upsertHumanReview(db, {
    batchId: input.batchId,
    parentSku: input.parentSku,
    reviewStatus: "no_source",
    matchingReason: input.matchingReason,
    reviewer: input.reviewer
  });
}

export function saveManualPrices(db: DatabaseConnection, input: SaveManualPricesInput): void {
  const transaction = db.transaction(() => {
    setParentManualPrice(db, {
      batchId: input.batchId,
      parentSku: input.parentSku,
      manualPrice: input.parentManualPrice
    });
    for (const child of input.childPrices) {
      setChildManualPrice(db, {
        batchId: input.batchId,
        sku: child.sku,
        manualPrice: child.manualPrice
      });
    }
  });
  transaction();
}

export function savePricingDraft(db: DatabaseConnection, input: SavePricingDraftInput): void {
  const parent = db
    .prepare("select id from parent_skus where batch_id = ? and parent_sku = ?")
    .get(input.batchId, input.parentSku) as { id: number } | undefined;
  if (!parent) {
    throw new Error(`Parent SKU not found for pricing draft: ${input.parentSku}`);
  }

  db.prepare(
    `insert into pricing_drafts (batch_id, parent_sku_id, draft_json, updated_at)
     values (?, ?, ?, datetime('now'))
     on conflict(batch_id, parent_sku_id) do update set
       draft_json = excluded.draft_json,
       updated_at = datetime('now')`
  ).run(input.batchId, parent.id, JSON.stringify(input.draft));
}

function loadPricingDraftsByParentSkuId(db: DatabaseConnection, batchId: number): Map<number, PricingDraftState> {
  const rows = db
    .prepare("select parent_sku_id as parentSkuId, draft_json as draftJson from pricing_drafts where batch_id = ?")
    .all(batchId) as Array<{ parentSkuId: number; draftJson: string }>;

  const byParent = new Map<number, PricingDraftState>();
  for (const row of rows) {
    const parsed = parsePricingDraft(row.draftJson);
    if (parsed) {
      byParent.set(row.parentSkuId, parsed);
    }
  }
  return byParent;
}

function parsePricingDraft(value: string): PricingDraftState | null {
  try {
    const parsed = JSON.parse(value) as Partial<PricingDraftState>;
    return {
      purchasePriceRmb: asString(parsed.purchasePriceRmb),
      domesticFreightRmb: asString(parsed.domesticFreightRmb),
      weightKg: asString(parsed.weightKg),
      lengthCm: asString(parsed.lengthCm),
      widthCm: asString(parsed.widthCm),
      heightCm: asString(parsed.heightCm),
      targetRoiPercent: asString(parsed.targetRoiPercent),
      commissionPercent: asString(parsed.commissionPercent),
      priceMultiplier: asString(parsed.priceMultiplier),
      exchangeRateRmbPerKrw: asString(parsed.exchangeRateRmbPerKrw),
      airEnabled: typeof parsed.airEnabled === "boolean" ? parsed.airEnabled : true,
      seaEnabled: typeof parsed.seaEnabled === "boolean" ? parsed.seaEnabled : true,
      priceResult: (parsed.priceResult as KoreaListingPriceResult | null | undefined) ?? null
    };
  } catch {
    return null;
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function loadChildSkusByParentSkuId(db: DatabaseConnection, batchId: number): Map<number, ReviewChildSku[]> {
  const rows = db
    .prepare(
      `select
        c.parent_sku_id as parentSkuId,
        c.sku,
        c.color,
        c.size,
        c.variant_image_url as variantImageUrl,
        c.source_price as sourcePrice,
        c.manual_price as manualPrice,
        c.is_excluded as isExcluded,
        p.manual_price as parentManualPrice
      from child_skus c
      join parent_skus p on p.id = c.parent_sku_id and p.batch_id = c.batch_id
      where c.batch_id = ?
      order by c.original_row_index asc`
    )
    .all(batchId) as Array<{
    parentSkuId: number;
    sku: string;
    color: string | null;
    size: string | null;
    variantImageUrl: string | null;
    sourcePrice: string | null;
    manualPrice: string | null;
    isExcluded: number | null;
    parentManualPrice: string | null;
  }>;

  const byParent = new Map<number, ReviewChildSku[]>();
  for (const row of rows) {
    const price = resolveExportPrice({
      originalPrice: row.sourcePrice ?? "",
      parentManualPrice: row.parentManualPrice,
      childOverridePrice: row.manualPrice
    });
    const childSku = {
      sku: row.sku,
      color: row.color ?? "",
      size: row.size ?? "",
      variantImageUrl: row.variantImageUrl ?? "",
      sourcePrice: row.sourcePrice ?? "",
      manualPrice: row.manualPrice ?? "",
      appliedPrice: price.appliedPrice,
      priceSource: price.source,
      isExcluded: Boolean(row.isExcluded)
    };
    byParent.set(row.parentSkuId, [...(byParent.get(row.parentSkuId) ?? []), childSku]);
  }
  return byParent;
}

function loadCandidatesByParentSkuId(db: DatabaseConnection, batchId: number): Map<number, ReviewCandidate[]> {
  const rows = db
    .prepare(
      `select
        sc.parent_sku_id as parentSkuId,
        sc.id as candidateId,
        sc.rank,
        sc.offer_url as offerUrl,
        sc.title,
        sc.image_url as imageUrl,
        sc.unit_price as unitPrice,
        sc.monthly_sales as monthlySales,
        sc.shop_name as shopName,
        ar.same_item_probability as aiSameItemProbability,
        ar.matching_reason as aiMatchingReason,
        ar.risk_points as aiRiskPoints,
        ar.error_message as aiErrorMessage
      from search_candidates
      sc
      left join (
        select r.*
        from ai_reviews r
        join (
          select candidate_id, max(id) as latest_id
          from ai_reviews
          where batch_id = ?
          group by candidate_id
        ) latest on latest.latest_id = r.id
      ) ar on ar.candidate_id = sc.id
      where sc.batch_id = ? and sc.rank <= 5
      order by sc.parent_sku_id asc, sc.rank asc`
    )
    .all(batchId, batchId) as Array<
    ReviewCandidate & {
      parentSkuId: number;
      aiSameItemProbability: number | null;
      aiMatchingReason: string | null;
      aiRiskPoints: string | null;
      aiErrorMessage: string | null;
    }
  >;

  const byParent = new Map<number, ReviewCandidate[]>();
  for (const row of rows) {
    const aiReview =
      row.aiSameItemProbability === null && row.aiMatchingReason === null && row.aiErrorMessage === null
        ? null
        : {
            sameItemProbability: row.aiSameItemProbability,
            matchingReason: row.aiMatchingReason ?? "",
            riskPoints: parseRiskPoints(row.aiRiskPoints),
            errorMessage: row.aiErrorMessage
          };
    const candidate = {
      candidateId: row.candidateId,
      rank: row.rank,
      offerUrl: row.offerUrl ?? "",
      title: row.title ?? "",
      imageUrl: row.imageUrl ?? "",
      unitPrice: row.unitPrice ?? "",
      monthlySales: row.monthlySales,
      shopName: row.shopName ?? "",
      ...(aiReview ? { aiReview } : {})
    };
    byParent.set(row.parentSkuId, [...(byParent.get(row.parentSkuId) ?? []), candidate]);
  }
  for (const [parentSkuId, candidates] of byParent) {
    byParent.set(parentSkuId, [...candidates].sort(compareCandidatesByAiScore));
  }
  return byParent;
}

function compareCandidatesByAiScore(left: ReviewCandidate, right: ReviewCandidate): number {
  const leftScore = left.aiReview?.sameItemProbability;
  const rightScore = right.aiReview?.sameItemProbability;
  const leftHasScore = typeof leftScore === "number" && Number.isFinite(leftScore);
  const rightHasScore = typeof rightScore === "number" && Number.isFinite(rightScore);
  if (leftHasScore && rightHasScore && leftScore !== rightScore) {
    return rightScore - leftScore;
  }
  if (leftHasScore !== rightHasScore) {
    return leftHasScore ? -1 : 1;
  }
  return left.rank - right.rank;
}

function parseRiskPoints(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((point): point is string => typeof point === "string") : [];
  } catch {
    return [];
  }
}

