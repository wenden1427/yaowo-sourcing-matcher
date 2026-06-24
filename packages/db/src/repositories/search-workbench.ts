import type { DatabaseConnection } from "../sqlite.js";

import { upsertSearchCandidate } from "./export-batch.js";

export type SearchErrorCode =
  | "upload_failed"
  | "no_results"
  | "login_expired"
  | "verification_required"
  | "network_timeout"
  | "parse_failed"
  | "profile_locked"
  | "browser_unavailable"
  | "unknown_error";

export interface ImageSearchOfferLike {
  offerId?: string;
  title?: string;
  url: string;
  image?: string | null;
  price?: {
    text?: string;
  };
  turnover?: string | null;
  supplier?: {
    name?: string | null;
  };
}

export interface ImageSearchResultLike {
  offers: ImageSearchOfferLike[];
}

export interface ImageSearchProviderInput {
  image: string;
  max: number;
  keyword: string;
}

export type ImageSearchProvider = (input: ImageSearchProviderInput) => Promise<ImageSearchResultLike>;

export interface SearchKeywordProviderInput {
  parentSku: string;
  sourceTitle: string;
  productTag: string;
}

export type SearchKeywordProvider = (input: SearchKeywordProviderInput) => Promise<string>;

export interface RunNextImageSearchJobInput {
  batchId: number;
  maxCandidates: number;
  searchOne: ImageSearchProvider;
  keywordProvider?: SearchKeywordProvider;
}

export interface RunParentImageSearchJobInput extends RunNextImageSearchJobInput {
  parentSku: string;
}

export interface RunBatchImageSearchJobsInput extends RunNextImageSearchJobInput {
  maxJobs: number;
  stopOnErrorCodes?: SearchErrorCode[];
  shouldStop?: () => boolean;
}

export type RunNextImageSearchJobResult =
  | {
      status: "completed";
      parentSku: string;
      storedCandidateCount: number;
    }
  | {
      status: "failed";
      parentSku: string;
      errorCode: SearchErrorCode;
      errorMessage: string;
    }
  | {
      status: "idle";
    };

export type RunBatchImageSearchJobsResult =
  | {
      status: "completed";
      stoppedReason: "idle" | "max_jobs";
      attemptedCount: number;
      completedCount: number;
      failedCount: number;
    }
  | {
      status: "stopped";
      stoppedReason: "blocking_error";
      attemptedCount: number;
      completedCount: number;
      failedCount: number;
      blockingError: {
        parentSku: string;
        errorCode: SearchErrorCode;
        errorMessage: string;
      };
    }
  | {
      status: "stopped";
      stoppedReason: "stop_requested";
      attemptedCount: number;
      completedCount: number;
      failedCount: number;
    };

export interface BatchSearchProgress {
  totalParentSkuCount: number;
  completedCount: number;
  failedCount: number;
  runningCount: number;
  pendingCount: number;
  blockingFailedCount: number;
  lastBlockingError: {
    parentSku: string;
    errorCode: SearchErrorCode;
    errorMessage: string;
  } | null;
}

export interface ResetFailedImageSearchJobsInput {
  batchId: number;
  errorCodes?: SearchErrorCode[];
}

export interface ResetFailedImageSearchJobsResult {
  resetCount: number;
}

export interface ResetRunningImageSearchJobsInput {
  batchId: number;
}

export interface ResetRunningImageSearchJobsResult {
  resetCount: number;
}

export interface FailedImageSearchJob {
  parentSku: string;
  errorCode: SearchErrorCode;
  errorMessage: string;
  finishedAt: string | null;
}

interface PendingParentRow {
  id: number;
  parent_sku: string;
  source_title: string | null;
  source_product_tag: string | null;
  search_keyword_zh: string | null;
  default_search_image_url: string | null;
}

export async function runNextImageSearchJob(
  db: DatabaseConnection,
  input: RunNextImageSearchJobInput
): Promise<RunNextImageSearchJobResult> {
  const parent = findNextPendingParent(db, input.batchId);
  if (!parent) {
    return { status: "idle" };
  }

  return runImageSearchForParent(db, input, parent);
}

export async function runParentImageSearchJob(
  db: DatabaseConnection,
  input: RunParentImageSearchJobInput
): Promise<RunNextImageSearchJobResult> {
  const parent = findParentBySku(db, input.batchId, input.parentSku);
  if (!parent) {
    throw new Error(`ParentSKU not found: ${input.parentSku}`);
  }
  return runImageSearchForParent(db, input, parent);
}

async function runImageSearchForParent(
  db: DatabaseConnection,
  input: RunNextImageSearchJobInput,
  parent: PendingParentRow
): Promise<RunNextImageSearchJobResult> {
  const searchImage = parent.default_search_image_url ?? "";
  if (!searchImage) {
    const errorMessage = "ParentSKU 缂哄皯鍙敤浜庢悳鍥剧殑鍥剧墖";
    markJobFailed(db, input.batchId, parent.id, searchImage, "upload_failed", errorMessage);
    return {
      status: "failed",
      parentSku: parent.parent_sku,
      errorCode: "upload_failed",
      errorMessage
    };
  }

  markJobRunning(db, input.batchId, parent.id, searchImage);

  try {
    const keyword = await resolveSearchKeyword(db, input, parent);
    const result = await input.searchOne({
      image: searchImage,
      max: input.maxCandidates,
      keyword
    });
    const offers = result.offers.slice(0, input.maxCandidates);
    if (offers.length === 0) {
      const errorMessage = "1688 image search returned no candidates";
      markJobFailed(db, input.batchId, parent.id, searchImage, "no_results", errorMessage);
      return {
        status: "failed",
        parentSku: parent.parent_sku,
        errorCode: "no_results",
        errorMessage
      };
    }

    db.transaction(() => {
      db.prepare("delete from search_candidates where batch_id = ? and parent_sku_id = ?").run(input.batchId, parent.id);
      offers.forEach((offer, index) => {
        upsertSearchCandidate(db, {
          batchId: input.batchId,
          parentSku: parent.parent_sku,
          rank: index + 1,
          offerUrl: offer.url,
          title: offer.title ?? null,
          imageUrl: offer.image ?? null,
          unitPrice: offer.price?.text ?? null,
          monthlySales: parseMonthlySales(offer.turnover),
          shopName: offer.supplier?.name ?? null
        });
      });
      markJobCompleted(db, input.batchId, parent.id, searchImage);
    })();

    return {
      status: "completed",
      parentSku: parent.parent_sku,
      storedCandidateCount: offers.length
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const code = classifySearchError(message);
    markJobFailed(db, input.batchId, parent.id, searchImage, code, message);
    return {
      status: "failed",
      parentSku: parent.parent_sku,
      errorCode: code,
      errorMessage: message
    };
  }
}

const DEFAULT_BATCH_BLOCKING_ERRORS = new Set<SearchErrorCode>([
  "login_expired",
  "verification_required",
  "profile_locked",
  "browser_unavailable"
]);

export async function runBatchImageSearchJobs(
  db: DatabaseConnection,
  input: RunBatchImageSearchJobsInput
): Promise<RunBatchImageSearchJobsResult> {
  const blockingErrors = new Set(input.stopOnErrorCodes ?? DEFAULT_BATCH_BLOCKING_ERRORS);
  const maxJobs = Math.max(0, input.maxJobs);
  let attemptedCount = 0;
  let completedCount = 0;
  let failedCount = 0;

  for (let index = 0; index < maxJobs; index += 1) {
    const result = await runNextImageSearchJob(db, input);

    if (result.status === "idle") {
      return {
        status: "completed",
        stoppedReason: "idle",
        attemptedCount,
        completedCount,
        failedCount
      };
    }

    attemptedCount += 1;

    if (result.status === "completed") {
      completedCount += 1;
      if (input.shouldStop?.()) {
        return {
          status: "stopped",
          stoppedReason: "stop_requested",
          attemptedCount,
          completedCount,
          failedCount
        };
      }
      continue;
    }

    failedCount += 1;
    if (blockingErrors.has(result.errorCode)) {
      return {
        status: "stopped",
        stoppedReason: "blocking_error",
        attemptedCount,
        completedCount,
        failedCount,
        blockingError: {
          parentSku: result.parentSku,
          errorCode: result.errorCode,
          errorMessage: result.errorMessage
        }
      };
    }
    if (input.shouldStop?.()) {
      return {
        status: "stopped",
        stoppedReason: "stop_requested",
        attemptedCount,
        completedCount,
        failedCount
      };
    }
  }

  return {
    status: "completed",
    stoppedReason: "max_jobs",
    attemptedCount,
    completedCount,
    failedCount
  };
}

export function getBatchSearchProgress(db: DatabaseConnection, batchId: number): BatchSearchProgress {
  const totalParentSkuCount = getCount(
    db,
    "select count(*) as count from parent_skus where batch_id = ?",
    batchId
  );
  const completedCount = getJobStatusCount(db, batchId, "completed");
  const failedCount = getJobStatusCount(db, batchId, "failed");
  const runningCount = getJobStatusCount(db, batchId, "running");
  const searchedCount = getCount(db, "select count(*) as count from search_jobs where batch_id = ?", batchId);
  const pendingCount = Math.max(0, totalParentSkuCount - searchedCount);
  const blockingCodes = Array.from(DEFAULT_BATCH_BLOCKING_ERRORS);
  const blockingFailedCount = getFailedJobErrorCodeCount(db, batchId, blockingCodes);
  const lastBlockingError = findLastBlockingError(db, batchId, blockingCodes);

  return {
    totalParentSkuCount,
    completedCount,
    failedCount,
    runningCount,
    pendingCount,
    blockingFailedCount,
    lastBlockingError
  };
}

export function resetFailedImageSearchJobs(
  db: DatabaseConnection,
  input: ResetFailedImageSearchJobsInput
): ResetFailedImageSearchJobsResult {
  const params: unknown[] = [input.batchId];
  let errorCodeClause = "";
  if (input.errorCodes && input.errorCodes.length > 0) {
    errorCodeClause = ` and error_code in (${input.errorCodes.map(() => "?").join(", ")})`;
    params.push(...input.errorCodes);
  }

  const failedParentRows = db
    .prepare(`select parent_sku_id from search_jobs where batch_id = ? and status = 'failed'${errorCodeClause}`)
    .all(...params) as Array<{ parent_sku_id: number }>;

  if (failedParentRows.length === 0) {
    return { resetCount: 0 };
  }

  db.transaction(() => {
    const deleteCandidates = db.prepare("delete from search_candidates where batch_id = ? and parent_sku_id = ?");
    const deleteJob = db.prepare("delete from search_jobs where batch_id = ? and parent_sku_id = ? and status = 'failed'");
    failedParentRows.forEach((row) => {
      deleteCandidates.run(input.batchId, row.parent_sku_id);
      deleteJob.run(input.batchId, row.parent_sku_id);
    });
  })();

  return { resetCount: failedParentRows.length };
}

export function resetRunningImageSearchJobs(
  db: DatabaseConnection,
  input: ResetRunningImageSearchJobsInput
): ResetRunningImageSearchJobsResult {
  const runningParentRows = db
    .prepare("select parent_sku_id from search_jobs where batch_id = ? and status = 'running'")
    .all(input.batchId) as Array<{ parent_sku_id: number }>;

  if (runningParentRows.length === 0) {
    return { resetCount: 0 };
  }

  db.transaction(() => {
    const deleteCandidates = db.prepare("delete from search_candidates where batch_id = ? and parent_sku_id = ?");
    const deleteJob = db.prepare("delete from search_jobs where batch_id = ? and parent_sku_id = ? and status = 'running'");
    runningParentRows.forEach((row) => {
      deleteCandidates.run(input.batchId, row.parent_sku_id);
      deleteJob.run(input.batchId, row.parent_sku_id);
    });
  })();

  return { resetCount: runningParentRows.length };
}

export function listFailedImageSearchJobs(db: DatabaseConnection, batchId: number): FailedImageSearchJob[] {
  const rows = db
    .prepare(
      `select
        p.parent_sku as parentSku,
        j.error_code as errorCode,
        j.error_message as errorMessage,
        j.finished_at as finishedAt
      from search_jobs j
      join parent_skus p on p.id = j.parent_sku_id
      where j.batch_id = ? and j.status = 'failed'
      order by j.finished_at desc, j.id desc`
    )
    .all(batchId) as Array<{
    parentSku: string;
    errorCode: SearchErrorCode | null;
    errorMessage: string | null;
    finishedAt: string | null;
  }>;

  return rows.map((row) => ({
    parentSku: row.parentSku,
    errorCode: row.errorCode ?? "unknown_error",
    errorMessage: row.errorMessage ?? "",
    finishedAt: row.finishedAt
  }));
}

function findNextPendingParent(db: DatabaseConnection, batchId: number): PendingParentRow | null {
  const row = db
    .prepare(
      `select
        p.id,
        p.parent_sku,
        p.source_title,
        p.source_product_tag,
        p.search_keyword_zh,
        p.default_search_image_url
      from parent_skus p
      left join search_jobs j on j.parent_sku_id = p.id and j.batch_id = p.batch_id
      where p.batch_id = ? and j.id is null and coalesce(p.is_excluded, 0) = 0
      order by p.original_row_start asc, p.id asc
      limit 1`
    )
    .get(batchId) as PendingParentRow | undefined;
  return row ?? null;
}

function findParentBySku(db: DatabaseConnection, batchId: number, parentSku: string): PendingParentRow | null {
  const row = db
    .prepare(
      `select
        p.id,
        p.parent_sku,
        p.source_title,
        p.source_product_tag,
        p.search_keyword_zh,
        p.default_search_image_url
      from parent_skus p
      where p.batch_id = ? and p.parent_sku = ?
      limit 1`
    )
    .get(batchId, parentSku) as PendingParentRow | undefined;
  return row ?? null;
}

async function resolveSearchKeyword(
  db: DatabaseConnection,
  input: RunNextImageSearchJobInput,
  parent: PendingParentRow
): Promise<string> {
  const cached = clean(parent.search_keyword_zh);
  if (cached) {
    return cached;
  }

  const sourceTitle = clean(parent.source_title) ?? "";
  const productTag = clean(parent.source_product_tag) ?? "";

  if (input.keywordProvider && (sourceTitle || productTag)) {
    try {
      const generated = clean(
        await input.keywordProvider({
          parentSku: parent.parent_sku,
          sourceTitle,
          productTag
        })
      );
      if (generated) {
        db.prepare("update parent_skus set search_keyword_zh = ? where id = ?").run(generated, parent.id);
        return generated;
      }
    } catch {
      // Keyword generation should improve image search, not block it.
    }
  }

  return productTag || sourceTitle || parent.parent_sku;
}

function getJobStatusCount(db: DatabaseConnection, batchId: number, status: string): number {
  return getCount(db, "select count(*) as count from search_jobs where batch_id = ? and status = ?", batchId, status);
}

function getFailedJobErrorCodeCount(db: DatabaseConnection, batchId: number, errorCodes: SearchErrorCode[]): number {
  if (errorCodes.length === 0) {
    return 0;
  }
  return getCount(
    db,
    `select count(*) as count from search_jobs
    where batch_id = ? and status = 'failed' and error_code in (${errorCodes.map(() => "?").join(", ")})`,
    batchId,
    ...errorCodes
  );
}

function findLastBlockingError(
  db: DatabaseConnection,
  batchId: number,
  errorCodes: SearchErrorCode[]
): BatchSearchProgress["lastBlockingError"] {
  if (errorCodes.length === 0) {
    return null;
  }
  const row = db
    .prepare(
      `select p.parent_sku as parentSku, j.error_code as errorCode, j.error_message as errorMessage
      from search_jobs j
      join parent_skus p on p.id = j.parent_sku_id
      where j.batch_id = ? and j.status = 'failed' and j.error_code in (${errorCodes.map(() => "?").join(", ")})
      order by j.finished_at desc, j.id desc
      limit 1`
    )
    .get(batchId, ...errorCodes) as
    | {
        parentSku: string;
        errorCode: SearchErrorCode;
        errorMessage: string | null;
      }
    | undefined;

  return row
    ? {
        parentSku: row.parentSku,
        errorCode: row.errorCode,
        errorMessage: row.errorMessage ?? ""
      }
    : null;
}

function getCount(db: DatabaseConnection, sql: string, ...params: unknown[]): number {
  const row = db.prepare(sql).get(...params) as { count: number } | undefined;
  return row?.count ?? 0;
}

function markJobRunning(db: DatabaseConnection, batchId: number, parentSkuId: number, searchImageUrl: string): void {
  db.prepare(
    `insert into search_jobs (batch_id, parent_sku_id, status, search_image_url, started_at)
    values (?, ?, 'running', ?, datetime('now'))
    on conflict(batch_id, parent_sku_id) do update set
      status = 'running',
      search_image_url = excluded.search_image_url,
      error_code = null,
      error_message = null,
      started_at = excluded.started_at,
      finished_at = null,
      retry_count = search_jobs.retry_count + 1`
  ).run(batchId, parentSkuId, searchImageUrl);
}

function markJobCompleted(db: DatabaseConnection, batchId: number, parentSkuId: number, searchImageUrl: string): void {
  db.prepare(
    `update search_jobs
    set status = 'completed',
      search_image_url = ?,
      error_code = null,
      error_message = null,
      finished_at = datetime('now')
    where batch_id = ? and parent_sku_id = ?`
  ).run(searchImageUrl, batchId, parentSkuId);
}

function markJobFailed(
  db: DatabaseConnection,
  batchId: number,
  parentSkuId: number,
  searchImageUrl: string,
  errorCode: SearchErrorCode,
  errorMessage: string
): void {
  db.prepare(
    `insert into search_jobs (
      batch_id, parent_sku_id, status, search_image_url, error_code, error_message, started_at, finished_at
    ) values (?, ?, 'failed', ?, ?, ?, datetime('now'), datetime('now'))
    on conflict(batch_id, parent_sku_id) do update set
      status = 'failed',
      search_image_url = excluded.search_image_url,
      error_code = excluded.error_code,
      error_message = excluded.error_message,
      finished_at = excluded.finished_at`
  ).run(batchId, parentSkuId, searchImageUrl, errorCode, errorMessage);
}

function classifySearchError(message: string): SearchErrorCode {
  if (/鐧诲綍|login/i.test(message)) return "login_expired";
  if (/楠岃瘉|椋庢帶|婊戝潡|punish|captcha|x5sec/i.test(message)) return "verification_required";
  if (/timeout|瓒呮椂/i.test(message)) return "network_timeout";
  if (/profile|Singleton|lock|鍗犵敤/i.test(message)) return "profile_locked";
  if (/browser|chrome|chromium/i.test(message)) return "browser_unavailable";
  if (/parse|瑙ｆ瀽/i.test(message)) return "parse_failed";
  if (/upload|涓婁紶/i.test(message)) return "upload_failed";
  return "unknown_error";
}

function parseMonthlySales(value: string | null | undefined): number | null {
  if (!value) {
    return null;
  }
  const match = value.replace(/,/g, "").match(/\d+/);
  return match ? Number.parseInt(match[0], 10) : null;
}

function clean(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

