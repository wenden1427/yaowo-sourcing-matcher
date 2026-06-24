import type { DatabaseConnection } from "../sqlite.js";

export interface AiReviewTarget {
  batchId: number;
  parentSkuId: number;
  parentSku: string;
  sourceImageUrl: string;
  candidateId: number;
  rank: number;
  candidateTitle: string;
  candidateImageUrl: string;
  unitPrice: string;
  monthlySales: number | null;
  shopName: string;
}

export interface ListAiReviewTargetsInput {
  batchId: number;
  maxRank?: number;
  limit?: number;
  includeReviewed?: boolean;
  parentSkus?: string[];
}

export interface SaveAiCandidateReviewInput {
  batchId: number;
  parentSkuId: number;
  candidateId: number;
  providerName: string;
  modelName: string;
  sameItemProbability?: number | null;
  matchingReason?: string | null;
  riskPoints?: string[] | null;
  errorMessage?: string | null;
  rawJson?: unknown;
}

export function listAiReviewTargets(db: DatabaseConnection, input: ListAiReviewTargetsInput): AiReviewTarget[] {
  const maxRank = input.maxRank ?? 5;
  const limit = input.limit ?? 200;
  const includeReviewed = input.includeReviewed ? 1 : 0;
  const parentSkus = input.parentSkus?.filter((sku) => sku.trim() !== "") ?? null;
  if (parentSkus && parentSkus.length === 0) {
    return [];
  }
  const parentSkuClause = parentSkus ? `and p.parent_sku in (${parentSkus.map(() => "?").join(", ")})` : "";
  return db
    .prepare(
      `select
        p.batch_id as batchId,
        p.id as parentSkuId,
        p.parent_sku as parentSku,
        p.default_search_image_url as sourceImageUrl,
        sc.id as candidateId,
        sc.rank as rank,
        sc.title as candidateTitle,
        sc.image_url as candidateImageUrl,
        sc.unit_price as unitPrice,
        sc.monthly_sales as monthlySales,
        sc.shop_name as shopName
      from parent_skus p
      join search_candidates sc on sc.parent_sku_id = p.id and sc.batch_id = p.batch_id
      where p.batch_id = ?
        and sc.rank <= ?
        ${parentSkuClause}
        and coalesce(p.default_search_image_url, '') <> ''
        and coalesce(sc.image_url, '') <> ''
        and (
          ? = 1
          or not exists (
            select 1
            from ai_reviews existing
            where existing.batch_id = sc.batch_id
              and existing.candidate_id = sc.id
          )
        )
      order by p.original_row_start asc, p.id asc, sc.rank asc
      limit ?`
    )
    .all(input.batchId, maxRank, ...(parentSkus ?? []), includeReviewed, limit)
    .map((row) => {
      const target = row as AiReviewTarget;
      return {
        batchId: target.batchId,
        parentSkuId: target.parentSkuId,
        parentSku: target.parentSku,
        sourceImageUrl: target.sourceImageUrl ?? "",
        candidateId: target.candidateId,
        rank: target.rank,
        candidateTitle: target.candidateTitle ?? "",
        candidateImageUrl: target.candidateImageUrl ?? "",
        unitPrice: target.unitPrice ?? "",
        monthlySales: target.monthlySales,
        shopName: target.shopName ?? ""
      };
    });
}

export function saveAiCandidateReview(db: DatabaseConnection, input: SaveAiCandidateReviewInput): void {
  db.prepare(
    `insert into ai_reviews (
      batch_id, parent_sku_id, candidate_id, provider_name, model_name,
      same_item_probability, matching_reason, risk_points, error_message, raw_json
    ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    input.batchId,
    input.parentSkuId,
    input.candidateId,
    input.providerName,
    input.modelName,
    input.sameItemProbability ?? null,
    input.matchingReason ?? null,
    JSON.stringify(input.riskPoints ?? []),
    input.errorMessage ?? null,
    input.rawJson === undefined ? null : JSON.stringify(input.rawJson)
  );
}

