export {};

declare global {
  interface Window {
    yaowo: {
      getAppVersion: () => Promise<string>;
      listBatches: () => Promise<BatchSummary[]>;
      importWorkbook: (input?: ImportWorkbookInput) => Promise<ImportWorkbookResult | null>;
      exportSourcedWorkbook: (batchId: number) => Promise<ExportSourcedWorkbookResult | null>;
      exportFullReviewWorkbook: (batchId: number) => Promise<ExportSourcedWorkbookResult | null>;
      open1688Login: () => Promise<Open1688LoginResult>;
      runNextImageSearchJob: (batchId: number) => Promise<RunNextImageSearchJobResult>;
      runParentImageSearchJob: (input: RunParentImageSearchJobInput) => Promise<RunNextImageSearchJobResult>;
      runBatchImageSearchJobs: (batchId: number) => Promise<RunBatchImageSearchJobsResult>;
      stopBatchImageSearchJobs: (batchId: number) => Promise<StopBatchImageSearchJobsResult>;
      resetFailedImageSearchJobs: (batchId: number) => Promise<ResetFailedImageSearchJobsResult>;
      resetRunningImageSearchJobs: (batchId: number) => Promise<ResetRunningImageSearchJobsResult>;
      listFailedImageSearchJobs: (batchId: number) => Promise<FailedImageSearchJob[]>;
      getAiProviderStatus: () => Promise<AiProviderStatus>;
      saveAiSettings: (input: SaveAiSettingsInput) => Promise<AiProviderStatus>;
      testAiVisionConnection: () => Promise<AiConnectionTestResult>;
      testAiOcrConnection: () => Promise<AiConnectionTestResult>;
      openLogsDir: () => Promise<string>;
      runBatchAiReview: (batchId: number, input?: RunBatchAiReviewInput) => Promise<RunBatchAiReviewResult>;
      listReviewItems: (batchId: number) => Promise<ReviewItem[]>;
      saveManualPrices: (input: SaveManualPricesInput) => Promise<void>;
      savePricingDraft: (input: SavePricingDraftInput) => Promise<void>;
      saveManualSourcedReview: (input: SaveManualSourcedReviewInput) => Promise<void>;
      markParentNoSource: (input: MarkParentNoSourceInput) => Promise<void>;
      setParentExcluded: (input: SetParentExcludedInput) => Promise<void>;
      setChildExcluded: (input: SetChildExcludedInput) => Promise<void>;
    };
  }

  interface BatchSummary {
    id: number;
    name: string;
    status: string;
    parentSkuCount: number;
    childSkuCount: number;
    searchCompletedCount: number;
    searchFailedCount: number;
    searchRunningCount: number;
    searchPendingCount: number;
    searchBlockingFailedCount: number;
    createdAt: string;
  }

  interface ImportWorkbookResult {
    batchId: number;
    parentSkuCount: number;
    childSkuCount: number;
  }

  type SourcePlatform = "aliexpress" | "shein";
  type ImportMode = "replace" | "append";

  interface ImportWorkbookInput {
    sourcePlatform: SourcePlatform;
    importMode: ImportMode;
    targetBatchId?: number | null;
  }

  interface ExportSourcedWorkbookResult {
    outputPath: string;
    parentSkuCount: number;
    childSkuCount: number;
  }

  interface Open1688LoginResult {
    profileDir: string;
    alreadyOpen: boolean;
  }

  interface RunParentImageSearchJobInput {
    batchId: number;
    parentSku: string;
  }

  type RunNextImageSearchJobResult =
    | {
        status: "completed";
        parentSku: string;
        storedCandidateCount: number;
      }
    | {
        status: "failed";
        parentSku: string;
        errorCode: string;
        errorMessage: string;
      }
    | {
        status: "idle";
      };

  type RunBatchImageSearchJobsResult =
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
          errorCode: string;
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

  interface StopBatchImageSearchJobsResult {
    stopRequested: boolean;
  }

  interface ResetFailedImageSearchJobsResult {
    resetCount: number;
  }

  interface ResetRunningImageSearchJobsResult {
    resetCount: number;
  }

  interface FailedImageSearchJob {
    parentSku: string;
    errorCode: string;
    errorMessage: string;
    finishedAt: string | null;
  }

  interface AiProviderStatus {
    provider: "zhipu";
    configured: boolean;
    hasStoredApiKey: boolean;
    visionModel: string;
    ocrModel: string;
    chatCompletionsUrl: string;
    ocrUrl: string;
    missing: string[];
    deepseekConfigured: boolean;
    hasStoredDeepSeekApiKey: boolean;
    deepseekModel: string;
    deepseekChatCompletionsUrl: string;
    deepseekMissing: string[];
  }

  interface SaveAiSettingsInput {
    apiKey?: string;
    visionModel: string;
    ocrModel: string;
    chatCompletionsUrl: string;
    ocrUrl: string;
    deepseekApiKey?: string;
    deepseekModel: string;
    deepseekChatCompletionsUrl: string;
  }

  interface AiConnectionTestResult {
    ok: true;
    provider: "zhipu";
    model: string;
  }

  interface RunBatchAiReviewResult {
    attemptedCount: number;
    completedCount: number;
    failedCount: number;
  }

  interface RunBatchAiReviewInput {
    parentSkus?: string[];
    includeReviewed?: boolean;
  }

  interface ReviewItem {
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
    searchStatus?: string | null;
    searchErrorCode?: string | null;
    searchErrorMessage?: string | null;
    pricingDraft?: PricingDraftState | null;
    childSkus: ReviewChildSku[];
    candidates: ReviewCandidate[];
  }

  interface ReviewChildSku {
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

  interface ReviewCandidate {
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

  interface ReviewCandidateAiReview {
    sameItemProbability: number | null;
    matchingReason: string;
    riskPoints: string[];
    errorMessage: string | null;
  }

  interface SaveManualSourcedReviewInput {
    batchId: number;
    parentSku: string;
    offerUrl: string;
    manualPrice: string;
    selectedCandidateId?: number | null;
    matchingReason: string;
    reviewer: string;
  }

  interface SaveManualPricesInput {
    batchId: number;
    parentSku: string;
    parentManualPrice: string | null;
    childPrices: Array<{
      sku: string;
      manualPrice: string | null;
    }>;
  }

  interface PricingDraftState {
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
    priceResult: import("@yaowo/core/pricing/korea").KoreaListingPriceResult | null;
  }

  interface SavePricingDraftInput {
    batchId: number;
    parentSku: string;
    draft: PricingDraftState;
  }

  interface MarkParentNoSourceInput {
    batchId: number;
    parentSku: string;
    matchingReason: string;
    reviewer: string;
  }

  interface SetParentExcludedInput {
    batchId: number;
    parentSku: string;
    excluded: boolean;
  }

  interface SetChildExcludedInput {
    batchId: number;
    sku: string;
    excluded: boolean;
  }
}
