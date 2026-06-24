import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileSpreadsheet,
  LogIn,
  RefreshCw,
  Search,
  Settings,
  UploadCloud
} from "lucide-react";
import { calculateKoreaListingPrice, type KoreaListingPriceResult } from "@yaowo/core/pricing/korea";

import "./styles.css";

type LoadState = "idle" | "loading" | "error";
type ActivePage = "match" | "price" | "settings";
type ReviewPanelMode = "match" | "price";
const BATCH_IMAGE_SEARCH_LIMIT = 50;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100, 200, 500, 1000, 2000] as const;
const BLOCKING_IMAGE_SEARCH_ERROR_CODES = new Set([
  "login_expired",
  "verification_required",
  "profile_locked",
  "browser_unavailable"
]);

export function App(): JSX.Element {
  const [batches, setBatches] = useState<BatchSummary[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("idle");
  const [activePage, setActivePage] = useState<ActivePage>("match");
  const [importing, setImporting] = useState(false);
  const [opening1688Login, setOpening1688Login] = useState(false);
  const [exportingBatchId, setExportingBatchId] = useState<number | null>(null);
  const [searchingBatchId, setSearchingBatchId] = useState<number | null>(null);
  const [aiReviewingBatchId, setAiReviewingBatchId] = useState<number | null>(null);
  const [selectedBatch, setSelectedBatch] = useState<BatchSummary | null>(null);
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>([]);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [aiSettings, setAiSettings] = useState<AiProviderStatus | null>(null);
  const [appVersion, setAppVersion] = useState("0.1.0");
  const [message, setMessage] = useState<string | null>(null);
  const [sourcePlatform, setSourcePlatform] = useState<SourcePlatform>("aliexpress");
  const [importMode, setImportMode] = useState<ImportMode>("replace");
  const batchStopRequestedRef = useRef(false);
  const aiReviewQueueRef = useRef<Promise<void>>(Promise.resolve());

  async function loadBatches(preferredBatchId?: number): Promise<void> {
    setLoadState("loading");
    try {
      const nextBatches = await getBridge().listBatches();
      setBatches(nextBatches);

      const nextSelectedBatch =
        nextBatches.find((batch) => batch.id === preferredBatchId) ??
        (selectedBatch ? nextBatches.find((batch) => batch.id === selectedBatch.id) : undefined) ??
        nextBatches[0] ??
        null;

      if (nextSelectedBatch) {
        setSelectedBatch(nextSelectedBatch);
        setReviewLoading(true);
        try {
          setReviewItems(await getBridge().listReviewItems(nextSelectedBatch.id));
        } finally {
          setReviewLoading(false);
        }
      } else {
        setSelectedBatch(null);
        setReviewItems([]);
      }

      setLoadState("idle");
    } catch (error) {
      setLoadState("error");
      setMessage(error instanceof Error ? error.message : "批次读取失败");
    }
  }

  async function refreshBatchAfterSearch(batchId: number, touchedParentSku?: string): Promise<void> {
    try {
      const nextBatches = await getBridge().listBatches();
      setBatches(nextBatches);
      const nextSelectedBatch =
        nextBatches.find((batch) => batch.id === batchId) ??
        (selectedBatch ? nextBatches.find((batch) => batch.id === selectedBatch.id) : undefined) ??
        nextBatches[0] ??
        null;

      if (!nextSelectedBatch) {
        setSelectedBatch(null);
        setReviewItems([]);
        return;
      }

      setSelectedBatch(nextSelectedBatch);
      const nextItems = await getBridge().listReviewItems(nextSelectedBatch.id);
      if (!touchedParentSku) {
        setReviewItems(nextItems);
        return;
      }

      const touchedItem = nextItems.find((item) => item.parentSku === touchedParentSku);
      if (!touchedItem) {
        return;
      }
      setReviewItems((currentItems) =>
        currentItems.some((item) => item.parentSku === touchedParentSku)
          ? currentItems.map((item) => (item.parentSku === touchedParentSku ? touchedItem : item))
          : nextItems
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "批次刷新失败");
    }
  }

  async function loadAiSettings(): Promise<void> {
    try {
      setAiSettings(await getBridge().getAiProviderStatus());
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AI 设置读取失败");
    }
  }

  async function importWorkbook(): Promise<void> {
    setImporting(true);
    setMessage(null);
    try {
      const result = await getBridge().importWorkbook({
        sourcePlatform,
        importMode,
        targetBatchId: importMode === "append" ? selectedBatch?.id ?? null : null
      });
      if (result) {
        setMessage(`已导入：父SKU ${result.parentSkuCount}，子SKU ${result.childSkuCount}`);
        await loadBatches(result.batchId);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "导入失败");
    } finally {
      setImporting(false);
    }
  }

  async function open1688Login(): Promise<void> {
    setOpening1688Login(true);
    setMessage(null);
    try {
      const result = await getBridge().open1688Login();
      setMessage(
        result.alreadyOpen
          ? "1688 登录/验证窗口已经打开，请完成登录或验证后继续搜图。"
          : "已打开 1688 登录/验证窗口，请完成登录或验证后重试失败任务。"
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "打开 1688 登录/验证窗口失败");
    } finally {
      setOpening1688Login(false);
    }
  }

  async function runAutoAiReview(batchId: number): Promise<string> {
    setAiReviewingBatchId(batchId);
    try {
      const result = await getBridge().runBatchAiReview(batchId);
      return `；AI评分 ${result.completedCount}/${result.attemptedCount}`;
    } catch (error) {
      return `；AI评分失败：${error instanceof Error ? error.message : String(error)}`;
    } finally {
      setAiReviewingBatchId(null);
    }
  }

  function queueAutoAiReview(batchId: number, touchedParentSku?: string): Promise<string> {
    const queued = aiReviewQueueRef.current
      .catch(() => undefined)
      .then(async () => {
        const aiReviewMessage = await runAutoAiReview(batchId);
        await refreshBatchAfterSearch(batchId, touchedParentSku);
        return aiReviewMessage;
      });
    aiReviewQueueRef.current = queued.then(
      () => undefined,
      () => undefined
    );
    return queued;
  }

  async function runSelectedAiReview(batch: BatchSummary, parentSkus: string[]): Promise<void> {
    if (parentSkus.length === 0) {
      return;
    }
    setAiReviewingBatchId(batch.id);
    setMessage(null);
    try {
      const result = await getBridge().runBatchAiReview(batch.id, {
        parentSkus,
        includeReviewed: true
      });
      setMessage(
        `AI评分完成：选中 ${parentSkus.length} 个父SKU，完成 ${result.completedCount}/${result.attemptedCount}，失败 ${result.failedCount}`
      );
      await loadBatches();
      if (selectedBatch?.id === batch.id) {
        setReviewItems(await getBridge().listReviewItems(batch.id));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "AI评分失败");
    } finally {
      setAiReviewingBatchId(null);
    }
  }

  async function runNextImageSearch(batch: BatchSummary): Promise<void> {
    setSearchingBatchId(batch.id);
    setMessage(null);
    try {
      const result = await getBridge().runNextImageSearchJob(batch.id);
      if (result.status === "completed") {
        const aiReviewMessage = await queueAutoAiReview(batch.id, result.parentSku);
        setMessage(`已完成搜图：${result.parentSku}，候选 ${result.storedCandidateCount} 个${aiReviewMessage}`);
      } else if (result.status === "failed") {
        setMessage(`搜图失败：${result.parentSku}，${result.errorMessage}`);
      } else {
        setMessage("没有待搜图的父SKU");
      }
      await refreshBatchAfterSearch(batch.id, result.status === "completed" ? result.parentSku : undefined);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "搜图失败");
    } finally {
      setSearchingBatchId(null);
    }
  }

  async function runParentImageSearch(parentSku: string): Promise<void> {
    if (!selectedBatch) {
      return;
    }
    setSearchingBatchId(selectedBatch.id);
    setMessage(null);
    try {
      const result = await getBridge().runParentImageSearchJob({
        batchId: selectedBatch.id,
        parentSku
      });
      if (result.status === "completed") {
        const aiReviewMessage = await queueAutoAiReview(selectedBatch.id, result.parentSku);
        setMessage(`已重新匹配：${result.parentSku}，候选 ${result.storedCandidateCount} 个${aiReviewMessage}`);
      } else if (result.status === "failed") {
        setMessage(`重新匹配失败：${result.parentSku}，${result.errorMessage}`);
      } else {
        setMessage(`没有可匹配的父SKU：${parentSku}`);
      }
      await refreshBatchAfterSearch(selectedBatch.id, result.status === "completed" ? result.parentSku : undefined);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "重新匹配失败");
    } finally {
      setSearchingBatchId(null);
    }
  }

  async function runBatchImageSearch(batch: BatchSummary): Promise<void> {
    setSearchingBatchId(batch.id);
    batchStopRequestedRef.current = false;
    setMessage(null);
    let attemptedCount = 0;
    let completedCount = 0;
    let failedCount = 0;
    try {
      for (let index = 0; index < BATCH_IMAGE_SEARCH_LIMIT; index += 1) {
        if (batchStopRequestedRef.current) {
          break;
        }

        const result = await getBridge().runNextImageSearchJob(batch.id);
        if (result.status === "idle") {
          await refreshBatchAfterSearch(batch.id);
          break;
        }

        attemptedCount += 1;

        if (result.status === "completed") {
          completedCount += 1;
          setMessage(
            `批量搜图中：处理 ${attemptedCount} 个，成功 ${completedCount} 个，失败 ${failedCount} 个；刚完成 ${result.parentSku}`
          );
          void queueAutoAiReview(batch.id, result.parentSku);
          await refreshBatchAfterSearch(batch.id, result.parentSku);
          continue;
        }

        failedCount += 1;
        await refreshBatchAfterSearch(batch.id, result.parentSku);

        if (BLOCKING_IMAGE_SEARCH_ERROR_CODES.has(result.errorCode)) {
          setMessage(
            `批量搜图已暂停：处理 ${attemptedCount} 个，成功 ${completedCount} 个，失败 ${failedCount} 个；${result.parentSku} 需要处理：${result.errorMessage}`
          );
          return;
        }
      }

      if (batchStopRequestedRef.current) {
        setMessage(`批量搜图已停止：处理 ${attemptedCount} 个，成功 ${completedCount} 个，失败 ${failedCount} 个`);
      } else {
        setMessage(`批量搜图完成：处理 ${attemptedCount} 个，成功 ${completedCount} 个，失败 ${failedCount} 个`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "批量搜图失败");
    } finally {
      setSearchingBatchId(null);
      batchStopRequestedRef.current = false;
    }
  }

  async function stopBatchImageSearch(batch: BatchSummary): Promise<void> {
    batchStopRequestedRef.current = true;
    try {
      const result = await getBridge().stopBatchImageSearchJobs(batch.id);
      if (result.stopRequested) {
        setMessage("已请求停止批量搜图，当前父SKU完成后会停下");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "停止批量搜图失败");
    }
  }

  async function resetFailedSearch(batch: BatchSummary): Promise<void> {
    setSearchingBatchId(batch.id);
    setMessage(null);
    try {
      const result = await getBridge().resetFailedImageSearchJobs(batch.id);
      setMessage(`已重置失败搜图：${result.resetCount} 个`);
      await loadBatches();
      if (selectedBatch?.id === batch.id) {
        setReviewItems(await getBridge().listReviewItems(batch.id));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "重试失败任务重置失败");
    } finally {
      setSearchingBatchId(null);
    }
  }

  async function resetRunningSearch(batch: BatchSummary): Promise<void> {
    setSearchingBatchId(batch.id);
    setMessage(null);
    try {
      const result = await getBridge().resetRunningImageSearchJobs(batch.id);
      setMessage(`已重置卡住搜图：${result.resetCount} 个`);
      await loadBatches();
      if (selectedBatch?.id === batch.id) {
        setReviewItems(await getBridge().listReviewItems(batch.id));
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "重置卡住搜图失败");
    } finally {
      setSearchingBatchId(null);
    }
  }

  async function showFailedSearches(batch: BatchSummary): Promise<void> {
    setMessage(null);
    try {
      const failedJobs = await getBridge().listFailedImageSearchJobs(batch.id);
      if (failedJobs.length === 0) {
        setMessage("暂无失败搜图");
        return;
      }
      const preview = failedJobs
        .slice(0, 3)
        .map((job) => `${job.parentSku}：${job.errorCode}：${job.errorMessage}`)
        .join("；");
      const suffix = failedJobs.length > 3 ? `；另有 ${failedJobs.length - 3} 个` : "";
      setMessage(`失败明细：${preview}${suffix}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "失败明细读取失败");
    }
  }

  async function exportSourcedWorkbook(batch: BatchSummary): Promise<void> {
    setExportingBatchId(batch.id);
    setMessage(null);
    try {
      const result = await getBridge().exportSourcedWorkbook(batch.id);
      if (result) {
        setMessage(`已导出：${result.outputPath}（父SKU ${result.parentSkuCount}，子SKU ${result.childSkuCount}）`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "导出失败");
    } finally {
      setExportingBatchId(null);
    }
  }

  async function exportFullReviewWorkbook(batch: BatchSummary): Promise<void> {
    setExportingBatchId(batch.id);
    setMessage(null);
    try {
      const result = await getBridge().exportFullReviewWorkbook(batch.id);
      if (result) {
        setMessage(`已导出完整结果：${result.outputPath}（父SKU ${result.parentSkuCount}，子SKU ${result.childSkuCount}）`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "导出完整结果失败");
    } finally {
      setExportingBatchId(null);
    }
  }

  async function saveManualPrices(input: Omit<SaveManualPricesInput, "batchId">): Promise<void> {
    if (!selectedBatch) {
      return;
    }
    await getBridge().saveManualPrices({
      batchId: selectedBatch.id,
      ...input
    });
    setMessage(`已保存价格：${input.parentSku}`);
    setReviewItems(await getBridge().listReviewItems(selectedBatch.id));
  }

  async function autoSaveManualPrices(input: Omit<SaveManualPricesInput, "batchId">): Promise<void> {
    if (!selectedBatch) {
      return;
    }
    await getBridge().saveManualPrices({
      batchId: selectedBatch.id,
      ...input
    });
  }

  async function savePricingDraft(parentSku: string, draft: PricingDraftState): Promise<void> {
    if (!selectedBatch) {
      return;
    }
    await getBridge().savePricingDraft({
      batchId: selectedBatch.id,
      parentSku,
      draft
    });
  }

  async function setParentExcluded(parentSku: string, excluded: boolean): Promise<void> {
    if (!selectedBatch) {
      return;
    }
    await getBridge().setParentExcluded({
      batchId: selectedBatch.id,
      parentSku,
      excluded
    });
    setMessage(`${excluded ? "已删除" : "已恢复"}父SKU：${parentSku}`);
    setReviewItems(await getBridge().listReviewItems(selectedBatch.id));
  }

  async function setChildExcluded(sku: string, excluded: boolean): Promise<void> {
    if (!selectedBatch) {
      return;
    }
    await getBridge().setChildExcluded({
      batchId: selectedBatch.id,
      sku,
      excluded
    });
    setMessage(`${excluded ? "已删除" : "已恢复"}子SKU：${sku}`);
    setReviewItems(await getBridge().listReviewItems(selectedBatch.id));
  }

  async function saveAiSettings(input: SaveAiSettingsInput): Promise<void> {
    const saved = await getBridge().saveAiSettings(input);
    setAiSettings(saved);
    setMessage("AI 设置已保存");
  }

  async function testAiVisionConnection(): Promise<void> {
    const result = await getBridge().testAiVisionConnection();
    setMessage(`视觉模型连接正常：${result.model}`);
  }

  async function testAiOcrConnection(): Promise<void> {
    const result = await getBridge().testAiOcrConnection();
    setMessage(`OCR 模型连接正常：${result.model}`);
  }

  async function loadAppVersion(): Promise<void> {
    try {
      setAppVersion(await getBridge().getAppVersion());
    } catch {
      setAppVersion("0.1.0");
    }
  }

  async function openLogsDir(): Promise<void> {
    const logDir = await getBridge().openLogsDir();
    setMessage(`已打开日志目录：${logDir}`);
  }

  useEffect(() => {
    void loadBatches();
    void loadAiSettings();
    void loadAppVersion();
  }, []);

  return (
    <main className="app-shell">
      <aside className="sidebar" aria-label="主导航">
        <div className="brand-mark">耀</div>
        <nav>
          <button
            className={activePage === "match" ? "nav-item active" : "nav-item"}
            type="button"
            aria-label="匹配"
            aria-current={activePage === "match" ? "page" : undefined}
            onClick={() => setActivePage("match")}
          >
            <Search size={19} />
            <span>匹配</span>
          </button>
          <button
            className={activePage === "price" ? "nav-item active" : "nav-item"}
            type="button"
            aria-label="改价"
            aria-current={activePage === "price" ? "page" : undefined}
            onClick={() => setActivePage("price")}
          >
            <FileSpreadsheet size={19} />
            <span>改价</span>
          </button>
          <button
            className={activePage === "settings" ? "nav-item active" : "nav-item"}
            type="button"
            aria-label="设置"
            aria-current={activePage === "settings" ? "page" : undefined}
            onClick={() => setActivePage("settings")}
          >
            <Settings size={19} />
            <span>设置</span>
          </button>
        </nav>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <h1>耀我货源匹配</h1>
            <p>图片搜同款工作台</p>
          </div>
          <div className="topbar-actions">
            <button className="icon-button" type="button" onClick={() => void loadBatches()} aria-label="刷新批次">
              <RefreshCw size={18} />
            </button>
            <label className="topbar-select">
              平台
              <select
                value={sourcePlatform}
                onChange={(event) => setSourcePlatform(event.target.value as SourcePlatform)}
                aria-label="采集平台"
              >
                <option value="aliexpress">AliExpress</option>
                <option value="shein">Shein</option>
              </select>
            </label>
            <label className="topbar-select">
              导入方式
              <select
                value={importMode}
                onChange={(event) => setImportMode(event.target.value as ImportMode)}
                aria-label="导入方式"
              >
                <option value="replace">覆盖当前</option>
                <option value="append">添加 SKU</option>
              </select>
            </label>
            <button
              className="secondary-button"
              type="button"
              onClick={() => void open1688Login()}
              disabled={opening1688Login}
            >
              <LogIn size={18} />
              {opening1688Login ? "打开中" : "1688 登录"}
            </button>
            <button className="primary-button" type="button" onClick={() => void importWorkbook()} disabled={importing}>
              <UploadCloud size={18} />
              {importing ? "导入中" : "导入采集表"}
            </button>
          </div>
        </header>

        {message ? <div className="notice">{message}</div> : null}

        {activePage === "match" ? (
          <>
            {selectedBatch ? (
              <ReviewPanel
                mode="match"
                batch={selectedBatch}
                items={reviewItems}
                loading={reviewLoading}
                exporting={exportingBatchId === selectedBatch.id}
                onSavePrices={saveManualPrices}
                onAutoSavePrices={autoSaveManualPrices}
                onSavePricingDraft={savePricingDraft}
                onSetParentExcluded={setParentExcluded}
                onSetChildExcluded={setChildExcluded}
                onRerunParentSearch={runParentImageSearch}
                onExport={() => exportSourcedWorkbook(selectedBatch)}
                searching={searchingBatchId === selectedBatch.id}
                aiReviewing={aiReviewingBatchId === selectedBatch.id}
                onRunNextSearch={() => void runNextImageSearch(selectedBatch)}
                onRunBatchSearch={() => void runBatchImageSearch(selectedBatch)}
                onStopBatchSearch={() => void stopBatchImageSearch(selectedBatch)}
                onResetFailedSearch={() => void resetFailedSearch(selectedBatch)}
                onResetRunningSearch={() => void resetRunningSearch(selectedBatch)}
                onShowFailedSearches={() => void showFailedSearches(selectedBatch)}
                onRunSelectedAiReview={(parentSkus) => void runSelectedAiReview(selectedBatch, parentSkus)}
              />
            ) : (
              <MatchEmptyState
                loading={loadState === "loading"}
                aiSettings={aiSettings}
              />
            )}
          </>
        ) : null}

        {activePage === "price" ? (
          selectedBatch ? (
            <ReviewPanel
              mode="price"
              batch={selectedBatch}
              items={reviewItems}
              loading={reviewLoading}
              exporting={exportingBatchId === selectedBatch.id}
              onSavePrices={saveManualPrices}
              onAutoSavePrices={autoSaveManualPrices}
              onSavePricingDraft={savePricingDraft}
              onSetParentExcluded={setParentExcluded}
              onSetChildExcluded={setChildExcluded}
              onRerunParentSearch={runParentImageSearch}
              onExport={() => exportSourcedWorkbook(selectedBatch)}
            />
          ) : (
            <ReviewEmptyState
              title="保留 SKU 改价"
              message="先在匹配页选择一个批次。"
              onOpenMatch={() => setActivePage("match")}
            />
          )
        ) : null}

        {activePage === "settings" ? (
          <AiSettingsPanel
            settings={aiSettings}
            onSave={saveAiSettings}
            onTestVision={testAiVisionConnection}
            onTestOcr={testAiOcrConnection}
            appVersion={appVersion}
            onOpenLogsDir={openLogsDir}
          />
        ) : null}
      </section>
    </main>
  );
}

function getBridge(): Window["yaowo"] {
  if (window.yaowo) {
    return window.yaowo;
  }

  return {
    getAppVersion: async () => "0.1.0",
    listBatches: async () => [],
    importWorkbook: async () => {
      throw new Error("请在桌面端使用导入");
    },
    exportSourcedWorkbook: async () => {
      throw new Error("请在桌面端使用导出");
    },
    exportFullReviewWorkbook: async () => {
      throw new Error("请在桌面端导出完整结果");
    },
    open1688Login: async () => {
      throw new Error("请在桌面端打开 1688 登录/验证窗口");
    },
    runNextImageSearchJob: async () => {
      throw new Error("请在桌面端使用搜图");
    },
    runParentImageSearchJob: async () => {
      throw new Error("请在桌面端使用重新匹配");
    },
    runBatchImageSearchJobs: async () => {
      throw new Error("请在桌面端使用批量搜图");
    },
    stopBatchImageSearchJobs: async () => {
      throw new Error("请在桌面端停止批量搜图");
    },
    resetFailedImageSearchJobs: async () => {
      throw new Error("请在桌面端重试失败搜图");
    },
    resetRunningImageSearchJobs: async () => {
      throw new Error("请在桌面端重置卡住搜图");
    },
    listFailedImageSearchJobs: async () => [],
    getAiProviderStatus: async () => ({
      provider: "zhipu",
      configured: false,
      hasStoredApiKey: false,
      visionModel: "glm-4.6v-flashx",
      ocrModel: "glm-ocr",
      chatCompletionsUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      ocrUrl: "https://open.bigmodel.cn/api/paas/v4/layout_parsing",
      missing: ["YAOWO_ZHIPU_API_KEY"],
      deepseekConfigured: false,
      hasStoredDeepSeekApiKey: false,
      deepseekModel: "deepseek-v4-flash",
      deepseekChatCompletionsUrl: "https://api.deepseek.com/chat/completions",
      deepseekMissing: ["YAOWO_DEEPSEEK_API_KEY"]
    }),
    saveAiSettings: async (input) => ({
      provider: "zhipu",
      configured: Boolean(input.apiKey),
      hasStoredApiKey: Boolean(input.apiKey),
      visionModel: input.visionModel,
      ocrModel: input.ocrModel,
      chatCompletionsUrl: input.chatCompletionsUrl,
      ocrUrl: input.ocrUrl,
      missing: input.apiKey ? [] : ["YAOWO_ZHIPU_API_KEY"],
      deepseekConfigured: Boolean(input.deepseekApiKey),
      hasStoredDeepSeekApiKey: Boolean(input.deepseekApiKey),
      deepseekModel: input.deepseekModel,
      deepseekChatCompletionsUrl: input.deepseekChatCompletionsUrl,
      deepseekMissing: input.deepseekApiKey ? [] : ["YAOWO_DEEPSEEK_API_KEY"]
    }),
    testAiVisionConnection: async () => {
      throw new Error("请在桌面端测试视觉模型");
    },
    testAiOcrConnection: async () => {
      throw new Error("请在桌面端测试 OCR 模型");
    },
    openLogsDir: async () => {
      throw new Error("请在桌面端打开日志目录");
    },
    runBatchAiReview: async () => ({
      attemptedCount: 0,
      completedCount: 0,
      failedCount: 0
    }),
    listReviewItems: async () => [],
    saveManualPrices: async () => {
      throw new Error("请在桌面端保存价格");
    },
    savePricingDraft: async () => {
      throw new Error("请在桌面端自动保存改价草稿");
    },
    saveManualSourcedReview: async () => {
      throw new Error("请在桌面端保存审核");
    },
    markParentNoSource: async () => {
      throw new Error("请在桌面端保存审核");
    },
    setParentExcluded: async () => {
      throw new Error("请在桌面端保存删除状态");
    },
    setChildExcluded: async () => {
      throw new Error("请在桌面端保存删除状态");
    }
  };
}

function MatchEmptyState({
  loading,
  aiSettings
}: {
  loading: boolean;
  aiSettings: AiProviderStatus | null;
}): JSX.Element {
  const aiReady = Boolean(aiSettings?.configured || aiSettings?.deepseekConfigured);

  return (
    <section id="match" className="panel">
      <div className="panel-heading">
        <div>
          <h2>匹配结果</h2>
          <p>导入采集表后，这里会按父 SKU 展示源图、最高匹配图和候选 1688 链接。</p>
        </div>
        <FileSpreadsheet size={22} />
      </div>
      <div className="match-empty-workbench">
        <div>
          <strong>{loading ? "正在读取批次" : "还没有可展示的父 SKU"}</strong>
          <p>先导入采集表；有批次后会自动进入商品显示列表，不需要再手动选择批次。</p>
        </div>
        <span className={aiReady ? "status-pill good" : "status-pill"}>{aiReady ? "AI 已就绪" : "AI 待配置"}</span>
      </div>
    </section>
  );
}

function ReviewEmptyState({
  title,
  message,
  onOpenMatch
}: {
  title: string;
  message: string;
  onOpenMatch: () => void;
}): JSX.Element {
  return (
    <section id="review" className="panel">
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          <p>{message}</p>
        </div>
        <Search size={22} />
      </div>
      <div className="empty-state">
        <span>{message}</span>
        <button className="secondary-button" type="button" onClick={onOpenMatch}>
          返回匹配页
        </button>
      </div>
    </section>
  );
}

function CandidateAiReview({ review }: { review: ReviewCandidateAiReview }): JSX.Element {
  if (review.errorMessage) {
    return <div className="candidate-ai danger">{`AI失败：${review.errorMessage}`}</div>;
  }

  const probability = Math.round((review.sameItemProbability ?? 0) * 100);

  return (
    <div className="candidate-ai">
      <strong>{`AI ${probability}%`}</strong>
      {review.matchingReason ? <span>{review.matchingReason}</span> : null}
      {review.riskPoints.length > 0 ? <span>{`风险：${review.riskPoints.join("；")}`}</span> : null}
    </div>
  );
}

function parseDecimal(value: string): number {
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function formatRmbEstimateFromKrw(
  priceKrw: number | string | null | undefined,
  exchangeRateRmbPerKrw: string
): string | null {
  if (priceKrw === null || priceKrw === undefined || priceKrw === "") {
    return null;
  }
  const parsedPrice = typeof priceKrw === "number" ? priceKrw : Number(String(priceKrw).trim());
  const parsedRate = parseDecimal(exchangeRateRmbPerKrw);
  if (!Number.isFinite(parsedPrice) || !Number.isFinite(parsedRate) || parsedRate <= 0) {
    return null;
  }
  return `约¥${(parsedPrice * parsedRate).toFixed(2)}`;
}

function formatCandidateUnitPrice(unitPrice: string | null | undefined): string {
  const trimmed = unitPrice?.trim();
  if (!trimmed) {
    return "无价格";
  }
  return /^[¥￥楼]/.test(trimmed) ? trimmed : `¥${trimmed}`;
}

function AiSettingsPanel({
  settings,
  onSave,
  onTestVision,
  onTestOcr,
  appVersion,
  onOpenLogsDir
}: {
  settings: AiProviderStatus | null;
  onSave: (input: SaveAiSettingsInput) => Promise<void>;
  onTestVision: () => Promise<void>;
  onTestOcr: () => Promise<void>;
  appVersion: string;
  onOpenLogsDir: () => Promise<void>;
}): JSX.Element {
  const [apiKey, setApiKey] = useState("");
  const [deepseekApiKey, setDeepseekApiKey] = useState("");
  const [visionModel, setVisionModel] = useState("glm-4.6v-flashx");
  const [ocrModel, setOcrModel] = useState("glm-ocr");
  const [chatCompletionsUrl, setChatCompletionsUrl] = useState(
    "https://open.bigmodel.cn/api/paas/v4/chat/completions"
  );
  const [ocrUrl, setOcrUrl] = useState("https://open.bigmodel.cn/api/paas/v4/layout_parsing");
  const [deepseekModel, setDeepseekModel] = useState("deepseek-v4-flash");
  const [deepseekChatCompletionsUrl, setDeepseekChatCompletionsUrl] = useState(
    "https://api.deepseek.com/chat/completions"
  );
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState<"vision" | "ocr" | null>(null);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    if (!settings) return;
    setVisionModel(settings.visionModel);
    setOcrModel(settings.ocrModel);
    setChatCompletionsUrl(settings.chatCompletionsUrl);
    setOcrUrl(settings.ocrUrl);
    setDeepseekModel(settings.deepseekModel);
    setDeepseekChatCompletionsUrl(settings.deepseekChatCompletionsUrl);
  }, [settings]);

  async function save(): Promise<void> {
    setSaving(true);
    try {
      const input: SaveAiSettingsInput = {
        visionModel,
        ocrModel,
        chatCompletionsUrl,
        ocrUrl,
        deepseekModel,
        deepseekChatCompletionsUrl
      };
      if (apiKey.trim()) {
        input.apiKey = apiKey.trim();
      }
      if (deepseekApiKey.trim()) {
        input.deepseekApiKey = deepseekApiKey.trim();
      }
      await onSave(input);
      setApiKey("");
      setDeepseekApiKey("");
    } finally {
      setSaving(false);
    }
  }

  async function testVision(): Promise<void> {
    setTesting("vision");
    try {
      await onTestVision();
    } finally {
      setTesting(null);
    }
  }

  async function testOcr(): Promise<void> {
    setTesting("ocr");
    try {
      await onTestOcr();
    } finally {
      setTesting(null);
    }
  }


  return (
    <section id="settings" className="panel">
      <div className="panel-heading">
        <div>
          <h2>AI 设置</h2>
          <p>
            {settings?.configured || settings?.deepseekConfigured
              ? "AI 通道已配置"
              : "填写模型密钥后可启用搜图关键词、视觉同款评分和 OCR"}
          </p>
        </div>
        <Settings size={22} />
      </div>

      <div className="settings-grid">
        <label>
          智谱 API Key
          <input
            aria-label="智谱 API Key"
            type="password"
            value={apiKey}
            placeholder={settings?.hasStoredApiKey ? "已保存，留空则不修改" : "请输入 API Key"}
            onChange={(event) => setApiKey(event.target.value)}
          />
        </label>
        <label>
          DeepSeek API Key
          <input
            aria-label="DeepSeek API Key"
            type="password"
            value={deepseekApiKey}
            placeholder={settings?.hasStoredDeepSeekApiKey ? "已保存，留空则不修改" : "请输入 API Key"}
            onChange={(event) => setDeepseekApiKey(event.target.value)}
          />
        </label>
        <label>
          视觉模型
          <input aria-label="视觉模型" value={visionModel} onChange={(event) => setVisionModel(event.target.value)} />
        </label>
        <label>
          OCR 模型
          <input aria-label="OCR 模型" value={ocrModel} onChange={(event) => setOcrModel(event.target.value)} />
        </label>
        <label>
          DeepSeek 关键词模型
          <input
            aria-label="DeepSeek 关键词模型"
            value={deepseekModel}
            onChange={(event) => setDeepseekModel(event.target.value)}
          />
        </label>
        <div className="advanced-settings">
          <button className="secondary-button" type="button" onClick={() => setAdvancedOpen((current) => !current)}>
            {advancedOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            高级接口设置
          </button>
        </div>
        {advancedOpen ? (
          <>
            <label className="wide-field">
              视觉接口 URL
              <input
                aria-label="视觉接口 URL"
                value={chatCompletionsUrl}
                onChange={(event) => setChatCompletionsUrl(event.target.value)}
              />
            </label>
            <label className="wide-field">
              OCR 接口 URL
              <input aria-label="OCR 接口 URL" value={ocrUrl} onChange={(event) => setOcrUrl(event.target.value)} />
            </label>
            <label className="wide-field">
              DeepSeek 接口 URL
              <input
                aria-label="DeepSeek 接口 URL"
                value={deepseekChatCompletionsUrl}
                onChange={(event) => setDeepseekChatCompletionsUrl(event.target.value)}
              />
            </label>
          </>
        ) : null}
      </div>

      <div className="settings-actions">
        <button className="primary-button" type="button" onClick={() => void save()} disabled={saving}>
          保存 AI 设置
        </button>
        <button className="secondary-button" type="button" onClick={() => void testVision()} disabled={testing !== null}>
          {testing === "vision" ? "测试中" : "测试视觉模型"}
        </button>
        <button className="secondary-button" type="button" onClick={() => void testOcr()} disabled={testing !== null}>
          {testing === "ocr" ? "测试中" : "测试 OCR 模型"}
        </button>
      </div>
      <div className="update-panel">
        <div>
          <h3>软件版本</h3>
          <p>{`当前版本：${appVersion}`}</p>
        </div>
        <div className="settings-actions compact">
          <button className="secondary-button" type="button" onClick={() => void onOpenLogsDir()}>
            打开操作日志
          </button>
        </div>
      </div>
    </section>
  );
}

function ReviewPanel({
  mode,
  batch,
  items,
  loading,
  exporting,
  searching = false,
  aiReviewing = false,
  onSavePrices,
  onAutoSavePrices,
  onSavePricingDraft,
  onSetParentExcluded,
  onSetChildExcluded,
  onRerunParentSearch,
  onExport,
  onRunNextSearch,
  onRunBatchSearch,
  onStopBatchSearch,
  onResetFailedSearch,
  onResetRunningSearch,
  onShowFailedSearches,
  onRunSelectedAiReview
}: {
  mode: ReviewPanelMode;
  batch: BatchSummary;
  items: ReviewItem[];
  loading: boolean;
  exporting: boolean;
  searching?: boolean;
  aiReviewing?: boolean;
  onSavePrices: (input: Omit<SaveManualPricesInput, "batchId">) => Promise<void>;
  onAutoSavePrices: (input: Omit<SaveManualPricesInput, "batchId">) => Promise<void>;
  onSavePricingDraft: (parentSku: string, draft: PricingDraftState) => Promise<void>;
  onSetParentExcluded: (parentSku: string, excluded: boolean) => Promise<void>;
  onSetChildExcluded: (sku: string, excluded: boolean) => Promise<void>;
  onRerunParentSearch: (parentSku: string) => Promise<void>;
  onExport: () => Promise<void>;
  onRunNextSearch?: () => void;
  onRunBatchSearch?: () => void;
  onStopBatchSearch?: () => void;
  onResetFailedSearch?: () => void;
  onResetRunningSearch?: () => void;
  onShowFailedSearches?: () => void;
  onRunSelectedAiReview?: (parentSkus: string[]) => void;
}): JSX.Element {
  const [exportConfirmOpen, setExportConfirmOpen] = useState(false);
  const [skuQueryDraft, setSkuQueryDraft] = useState("");
  const [skuFilter, setSkuFilter] = useState<string[]>([]);
  const [lowScoreThreshold, setLowScoreThreshold] = useState("50");
  const [lowScoreOnly, setLowScoreOnly] = useState(false);
  const [failedOnly, setFailedOnly] = useState(false);
  const [selectedParents, setSelectedParents] = useState<Set<string>>(() => new Set());
  const [pageSize, setPageSize] = useState<number>(20);
  const [requestedPageIndex, setRequestedPageIndex] = useState(0);
  const [globalRoiPercent, setGlobalRoiPercent] = useState("40");
  const [globalCommissionPercent, setGlobalCommissionPercent] = useState("15");
  const [globalPriceMultiplier, setGlobalPriceMultiplier] = useState("1");
  const [globalExchangeRate, setGlobalExchangeRate] = useState("0.0046");
  const [globalAirEnabled, setGlobalAirEnabled] = useState(true);
  const [globalSeaEnabled, setGlobalSeaEnabled] = useState(true);
  const pricingDraftsRef = useRef(new Map<string, Omit<SaveManualPricesInput, "batchId">>());
  const baseItems = items;
  const filteredItems = baseItems.filter((item) => {
    if (skuFilter.length > 0 && !skuFilter.includes(item.parentSku)) {
      return false;
    }
    if (mode === "match" && lowScoreOnly) {
      const score = getBestAiScorePercent(item);
      const threshold = Number(lowScoreThreshold);
      return score === null || score < (Number.isFinite(threshold) ? threshold : 50);
    }
    if (mode === "match" && failedOnly && item.searchStatus !== "failed") {
      return false;
    }
    return true;
  });
  const displayItems = filteredItems;
  const retainedChildCount = displayItems.reduce(
    (sum, item) => sum + item.childSkus.filter((child) => !child.isExcluded).length,
    0
  );
  const retainedParentCount = displayItems.filter(
    (item) =>
      !item.isExcluded &&
      item.childSkus.some((child) => !child.isExcluded)
  ).length;
  const totalPages = Math.max(1, Math.ceil(displayItems.length / pageSize));
  const currentPageIndex = Math.min(requestedPageIndex, totalPages - 1);
  const pagedItems = displayItems.slice(currentPageIndex * pageSize, currentPageIndex * pageSize + pageSize);
  const selectableCandidateParentSkus = displayItems
    .filter((item) => !item.isExcluded && item.candidates.length > 0)
    .map((item) => item.parentSku);
  const displayedParentSkus = pagedItems.map((item) => item.parentSku);
  const allDisplayedParentsSelected =
    displayedParentSkus.length > 0 && displayedParentSkus.every((parentSku) => selectedParents.has(parentSku));
  const hasFailedSearches = batch.searchFailedCount > 0;
  const hasRunningSearches = batch.searchRunningCount > 0;

  useEffect(() => {
    setRequestedPageIndex(0);
  }, [mode]);

  function updatePricingDraft(input: Omit<SaveManualPricesInput, "batchId">): void {
    pricingDraftsRef.current.set(input.parentSku, input);
  }

  async function flushPricingDraftsBeforeExport(): Promise<void> {
    const drafts = Array.from(pricingDraftsRef.current.values());
    if (drafts.length === 0) {
      return;
    }
    for (const draft of drafts) {
      await onSavePrices(draft);
    }
    pricingDraftsRef.current.clear();
  }

  const heading = mode === "match" ? "匹配结果" : "保留 SKU 改价";
  const description =
    mode === "match"
      ? "按父 SKU 收起展示源图和 AI 最高匹配图，展开后查看候选货源。"
      : "展示父 SKU 和子 SKU 的改价状态，可直接删除或恢复不参与导出的款式。";

  return (
    <section id={mode === "match" ? "match-review" : "price-review"} className="panel">
      <div className="panel-heading">
        <div>
          <h2>{heading}</h2>
          <p>{batch.name} · {description}</p>
        </div>
        <div className="panel-heading-actions">
          {mode === "match" ? (
            <>
              <button className="secondary-button" type="button" onClick={onRunNextSearch} disabled={!onRunNextSearch || searching}>
                <Search size={16} />
                {searching ? "搜图中" : "搜图"}
              </button>
              <button className="secondary-button" type="button" onClick={onRunBatchSearch} disabled={!onRunBatchSearch || searching}>
                <Search size={16} />
                {searching ? "匹配中" : "批量搜图"}
              </button>
              {searching && onStopBatchSearch ? (
                <button className="secondary-button danger-button" type="button" onClick={onStopBatchSearch}>
                  停止搜图
                </button>
              ) : null}
              {aiReviewing ? <span className="formula-tag">AI评分中</span> : null}
              {hasRunningSearches && !searching && onResetRunningSearch ? (
                <button className="secondary-button" type="button" onClick={onResetRunningSearch}>
                  重置卡住
                </button>
              ) : null}
              {hasFailedSearches ? (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setFailedOnly(true);
                    setLowScoreOnly(false);
                    setSkuFilter([]);
                    setSkuQueryDraft("");
                    setSelectedParents(new Set());
                    onShowFailedSearches?.();
                  }}
                >
                  查看失败
                </button>
              ) : null}
              {hasFailedSearches && onResetFailedSearch ? (
                <button className="secondary-button" type="button" onClick={onResetFailedSearch} disabled={searching}>
                  重试失败
                </button>
              ) : null}
            </>
          ) : (
            <button
              className="secondary-button"
              type="button"
              onClick={() => setExportConfirmOpen((current) => !current)}
              disabled={exporting}
            >
              <Download size={16} />
              导出上传器采集表
            </button>
          )}
          <Search size={22} />
        </div>
      </div>

      {mode === "price" && exportConfirmOpen ? (
        <div className="inline-export-panel" role="region" aria-label="上传器采集表导出确认">
          <div>
            <strong>将导出上传器采集表</strong>
            <p>只导出当前未删除的父 SKU 和子 SKU，末尾会追加候选第一位的 1688 链接。</p>
          </div>
          <div className="export-summary">
            <span>{`保留父 SKU ${retainedParentCount}/${items.length}`}</span>
            <span>{`保留子 SKU ${retainedChildCount}`}</span>
            <span>末尾会追加首选 1688 链接</span>
          </div>
          <div className="inline-export-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() =>
                void (async () => {
                  await flushPricingDraftsBeforeExport();
                  await onExport();
                })()
              }
              disabled={exporting}
            >
              {exporting ? "导出中" : "确认导出上传器采集表"}
            </button>
            <button className="secondary-button" type="button" onClick={() => setExportConfirmOpen(false)}>
              取消
            </button>
          </div>
        </div>
      ) : null}

      {mode === "match" ? (
        <div className="match-progress-strip" aria-label="匹配进度">
          <strong>{`匹配进度 ${batch.searchCompletedCount}/${batch.parentSkuCount}`}</strong>
          <span>{`待搜 ${batch.searchPendingCount}`}</span>
          {batch.searchRunningCount > 0 ? <span>{`正在匹配 ${batch.searchRunningCount} 个`}</span> : null}
          {batch.searchFailedCount > 0 ? <span className="danger">{`失败 ${batch.searchFailedCount}`}</span> : null}
        </div>
      ) : null}

      {mode === "match" ? (
        <div className="match-tools" aria-label="匹配结果筛选">
          <label className="multi-sku-search">
            父 SKU 查询
            <textarea
              value={skuQueryDraft}
              onChange={(event) => setSkuQueryDraft(event.target.value)}
              placeholder="每行一个父 SKU"
            />
          </label>
          <div className="match-tool-actions">
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setSkuFilter(uniqueLines(skuQueryDraft));
                setRequestedPageIndex(0);
              }}
            >
              只看这些父SKU
            </button>
            <label className="threshold-input">
              AI低于
              <input
                aria-label="AI匹配度阈值"
                value={lowScoreThreshold}
                onChange={(event) => setLowScoreThreshold(event.target.value)}
              />
              %
            </label>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setLowScoreOnly(true);
                setRequestedPageIndex(0);
              }}
            >
              只看低分
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setFailedOnly(true);
                setLowScoreOnly(false);
                setSkuFilter([]);
                setSkuQueryDraft("");
                setSelectedParents(new Set());
                setRequestedPageIndex(0);
              }}
              disabled={!hasFailedSearches}
            >
              只看失败
            </button>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setSkuFilter([]);
                setSkuQueryDraft("");
                setLowScoreOnly(false);
                setFailedOnly(false);
                setSelectedParents(new Set());
                setRequestedPageIndex(0);
              }}
            >
              显示全部
            </button>
            <button
              className="secondary-button"
              type="button"
              disabled={selectedParents.size === 0 || searching}
              onClick={() => {
                void (async () => {
                  for (const parentSku of selectedParents) {
                    await onRerunParentSearch(parentSku);
                  }
                  setSelectedParents(new Set());
                })();
              }}
            >
              重新匹配选中
            </button>
            <button
              className="secondary-button"
              type="button"
              disabled={selectableCandidateParentSkus.length === 0}
              onClick={() => setSelectedParents(new Set(selectableCandidateParentSkus))}
            >
              勾选已生成候选
            </button>
            <button
              className="secondary-button"
              type="button"
              disabled={selectedParents.size === 0 || aiReviewing || !onRunSelectedAiReview}
              onClick={() => onRunSelectedAiReview?.(Array.from(selectedParents))}
            >
              {aiReviewing ? "AI评分中" : "AI评分选中"}
            </button>
            <button
              className="secondary-button danger-button"
              type="button"
              disabled={selectedParents.size === 0}
              onClick={() => {
                void (async () => {
                  for (const parentSku of selectedParents) {
                    await onSetParentExcluded(parentSku, true);
                  }
                  setSelectedParents(new Set());
                })();
              }}
            >
              批量删除
            </button>
            <button
              className="secondary-button"
              type="button"
              disabled={selectedParents.size === 0}
              onClick={() => {
                void (async () => {
                  for (const parentSku of selectedParents) {
                    await onSetParentExcluded(parentSku, false);
                  }
                  setSelectedParents(new Set());
                })();
              }}
            >
              批量恢复
            </button>
          </div>
        </div>
      ) : null}

      {mode === "price" ? (
        <div className="pricing-global-bar" aria-label="全局改价参数">
          <label>
            目标 ROI
            <input value={globalRoiPercent} onChange={(event) => setGlobalRoiPercent(event.target.value)} />
          </label>
          <label>
            佣金率
            <input value={globalCommissionPercent} onChange={(event) => setGlobalCommissionPercent(event.target.value)} />
          </label>
          <label>
            价格系数
            <input value={globalPriceMultiplier} onChange={(event) => setGlobalPriceMultiplier(event.target.value)} />
          </label>
          <label>
            韩元汇率
            <input value={globalExchangeRate} onChange={(event) => setGlobalExchangeRate(event.target.value)} />
          </label>
          <div className="transport-toggle-group">
            <span>可用运输方式</span>
            <label className="toggle-line">
              <input
                type="checkbox"
                checked={globalAirEnabled}
                onChange={(event) => setGlobalAirEnabled(event.target.checked)}
              />
              空运可用
            </label>
            <label className="toggle-line">
              <input
                type="checkbox"
                checked={globalSeaEnabled}
                onChange={(event) => setGlobalSeaEnabled(event.target.checked)}
              />
              海运可用
            </label>
          </div>
        </div>
      ) : null}

      <div className="review-list">
        {loading ? <div className="empty-state">读取审核列表中</div> : null}
        {!loading && displayItems.length === 0 ? <div className="empty-state">暂无父 SKU</div> : null}
        {!loading && mode === "match" && pagedItems.length > 0 ? (
          <div className="review-list-header" aria-label="父 SKU 列表表头">
            <label className="row-checkbox" title="全选/取消当前页">
              <input
                aria-label="全选当前页"
                type="checkbox"
                checked={allDisplayedParentsSelected}
                onChange={() =>
                  setSelectedParents((current) => {
                    const next = new Set(current);
                    if (allDisplayedParentsSelected) {
                      for (const parentSku of displayedParentSkus) {
                        next.delete(parentSku);
                      }
                    } else {
                      for (const parentSku of displayedParentSkus) {
                        next.add(parentSku);
                      }
                    }
                    return next;
                  })
                }
              />
            </label>
            <span />
            <span>源图</span>
            <span>父 SKU / 标题</span>
            <span>候选1</span>
            <span>操作</span>
          </div>
        ) : null}
        {!loading
          ? pagedItems.map((item) => (
              <ReviewRow
                key={item.parentSku}
                mode={mode}
                item={item}
                onSavePrices={onSavePrices}
                onAutoSavePrices={onAutoSavePrices}
                onSavePricingDraft={onSavePricingDraft}
                onSetParentExcluded={onSetParentExcluded}
                onSetChildExcluded={onSetChildExcluded}
                onRerunParentSearch={onRerunParentSearch}
                onPricingDraftChange={updatePricingDraft}
                checked={selectedParents.has(item.parentSku)}
                pricingDefaults={{
                  roiPercent: globalRoiPercent,
                  commissionPercent: globalCommissionPercent,
                  priceMultiplier: globalPriceMultiplier,
                  exchangeRate: globalExchangeRate,
                  airEnabled: globalAirEnabled,
                  seaEnabled: globalSeaEnabled
                }}
                onCheckedChange={(checked) =>
                  setSelectedParents((current) => {
                    const next = new Set(current);
                    if (checked) {
                      next.add(item.parentSku);
                    } else {
                      next.delete(item.parentSku);
                    }
                    return next;
                  })
                }
              />
            ))
          : null}
      </div>

      {!loading && displayItems.length > 0 ? (
        <div className="pagination-footer" aria-label={`${heading}鍒嗛〉`}>
          <label>
            每页显示
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setRequestedPageIndex(0);
              }}
            >
              {PAGE_SIZE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <span>{`共 ${displayItems.length} 个`}</span>
          <span>{`第 ${currentPageIndex + 1} / ${totalPages} 页`}</span>
          <div className="pagination-actions">
            <button
              className="secondary-button"
              type="button"
              disabled={currentPageIndex === 0}
              onClick={() => setRequestedPageIndex(0)}
            >
              首页
            </button>
            <button
              className="secondary-button"
              type="button"
              disabled={currentPageIndex === 0}
              onClick={() => setRequestedPageIndex((current) => Math.max(0, current - 1))}
            >
              上一页
            </button>
            <button
              className="secondary-button"
              type="button"
              disabled={currentPageIndex >= totalPages - 1}
              onClick={() => setRequestedPageIndex((current) => Math.min(totalPages - 1, current + 1))}
            >
              下一页
            </button>
            <button
              className="secondary-button"
              type="button"
              disabled={currentPageIndex >= totalPages - 1}
              onClick={() => setRequestedPageIndex(totalPages - 1)}
            >
              末页
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ReviewRow({
  mode,
  item,
  onSavePrices,
  onAutoSavePrices,
  onSavePricingDraft,
  onSetParentExcluded,
  onSetChildExcluded,
  onRerunParentSearch,
  onPricingDraftChange,
  checked,
  pricingDefaults,
  onCheckedChange
}: {
  mode: ReviewPanelMode;
  item: ReviewItem;
  onSavePrices: (input: Omit<SaveManualPricesInput, "batchId">) => Promise<void>;
  onAutoSavePrices: (input: Omit<SaveManualPricesInput, "batchId">) => Promise<void>;
  onSavePricingDraft: (parentSku: string, draft: PricingDraftState) => Promise<void>;
  onSetParentExcluded: (parentSku: string, excluded: boolean) => Promise<void>;
  onSetChildExcluded: (sku: string, excluded: boolean) => Promise<void>;
  onRerunParentSearch: (parentSku: string) => Promise<void>;
  onPricingDraftChange: (input: Omit<SaveManualPricesInput, "batchId">) => void;
  checked: boolean;
  pricingDefaults: {
    roiPercent: string;
    commissionPercent: string;
    priceMultiplier: string;
    exchangeRate: string;
    airEnabled: boolean;
    seaEnabled: boolean;
  };
  onCheckedChange: (checked: boolean) => void;
}): JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const [manualPrice, setManualPrice] = useState(item.manualPrice);
  const [childPrices, setChildPrices] = useState<Record<string, string>>(() =>
    Object.fromEntries(item.childSkus.map((child) => [child.sku, child.manualPrice]))
  );
  const [purchasePriceRmb, setPurchasePriceRmb] = useState(item.pricingDraft?.purchasePriceRmb ?? "");
  const [domesticFreightRmb, setDomesticFreightRmb] = useState(item.pricingDraft?.domesticFreightRmb ?? "");
  const [weightKg, setWeightKg] = useState(item.pricingDraft?.weightKg ?? "");
  const [lengthCm, setLengthCm] = useState(item.pricingDraft?.lengthCm ?? "");
  const [widthCm, setWidthCm] = useState(item.pricingDraft?.widthCm ?? "");
  const [heightCm, setHeightCm] = useState(item.pricingDraft?.heightCm ?? "");
  const [targetRoiPercent, setTargetRoiPercent] = useState(item.pricingDraft?.targetRoiPercent ?? pricingDefaults.roiPercent);
  const [commissionPercent, setCommissionPercent] = useState(item.pricingDraft?.commissionPercent ?? pricingDefaults.commissionPercent);
  const [priceMultiplier, setPriceMultiplier] = useState(item.pricingDraft?.priceMultiplier ?? pricingDefaults.priceMultiplier);
  const [exchangeRateRmbPerKrw, setExchangeRateRmbPerKrw] = useState(
    item.pricingDraft?.exchangeRateRmbPerKrw ?? pricingDefaults.exchangeRate
  );
  const [airEnabled, setAirEnabled] = useState(item.pricingDraft?.airEnabled ?? pricingDefaults.airEnabled);
  const [seaEnabled, setSeaEnabled] = useState(item.pricingDraft?.seaEnabled ?? pricingDefaults.seaEnabled);
  const [priceResult, setPriceResult] = useState<KoreaListingPriceResult | null>(item.pricingDraft?.priceResult ?? null);
  const [saving, setSaving] = useState(false);
  const pricingDraftDirtyRef = useRef(false);

  function buildPriceDraft(
    parentPrice = manualPrice,
    childPriceMap = childPrices
  ): Omit<SaveManualPricesInput, "batchId"> {
    const activeChildSkus = item.childSkus.filter((child) => !child.isExcluded);
    return {
      parentSku: item.parentSku,
      parentManualPrice: parentPrice,
      childPrices: activeChildSkus.map((child) => ({
        sku: child.sku,
        manualPrice: childPriceMap[child.sku] ?? parentPrice
      }))
    };
  }

  function markPricingDraft(parentPrice = manualPrice, childPriceMap = childPrices): void {
    if (mode !== "price") {
      return;
    }
    const draft = buildPriceDraft(parentPrice, childPriceMap);
    pricingDraftDirtyRef.current = true;
    onPricingDraftChange(draft);
    void onAutoSavePrices(draft);
  }

  function buildCalculationDraft(overrides: Partial<PricingDraftState> = {}): PricingDraftState {
    return {
      purchasePriceRmb,
      domesticFreightRmb,
      weightKg,
      lengthCm,
      widthCm,
      heightCm,
      targetRoiPercent,
      commissionPercent,
      priceMultiplier,
      exchangeRateRmbPerKrw,
      airEnabled,
      seaEnabled,
      priceResult,
      ...overrides
    };
  }

  function markCalculationDraft(overrides: Partial<PricingDraftState> = {}): void {
    if (mode !== "price") {
      return;
    }
    void onSavePricingDraft(item.parentSku, buildCalculationDraft(overrides));
  }

  function setUnifiedManualPrice(value: string): void {
    const nextChildPrices = Object.fromEntries(
      item.childSkus.filter((child) => !child.isExcluded).map((child) => [child.sku, value])
    );
    setManualPrice(value);
    setChildPrices(nextChildPrices);
    markPricingDraft(value, nextChildPrices);
  }

  useEffect(() => {
    pricingDraftDirtyRef.current = false;
    setChildPrices(Object.fromEntries(item.childSkus.map((child) => [child.sku, child.manualPrice])));
    setManualPrice(item.manualPrice);
    setPurchasePriceRmb(item.pricingDraft?.purchasePriceRmb ?? "");
    setDomesticFreightRmb(item.pricingDraft?.domesticFreightRmb ?? "");
    setWeightKg(item.pricingDraft?.weightKg ?? "");
    setLengthCm(item.pricingDraft?.lengthCm ?? "");
    setWidthCm(item.pricingDraft?.widthCm ?? "");
    setHeightCm(item.pricingDraft?.heightCm ?? "");
    setTargetRoiPercent(item.pricingDraft?.targetRoiPercent ?? pricingDefaults.roiPercent);
    setCommissionPercent(item.pricingDraft?.commissionPercent ?? pricingDefaults.commissionPercent);
    setPriceMultiplier(item.pricingDraft?.priceMultiplier ?? pricingDefaults.priceMultiplier);
    setExchangeRateRmbPerKrw(item.pricingDraft?.exchangeRateRmbPerKrw ?? pricingDefaults.exchangeRate);
    setAirEnabled(item.pricingDraft?.airEnabled ?? pricingDefaults.airEnabled);
    setSeaEnabled(item.pricingDraft?.seaEnabled ?? pricingDefaults.seaEnabled);
    setPriceResult(item.pricingDraft?.priceResult ?? null);
  }, [item]);

  useEffect(() => {
    if (item.pricingDraft) {
      return;
    }
    setTargetRoiPercent(pricingDefaults.roiPercent);
    setCommissionPercent(pricingDefaults.commissionPercent);
    setPriceMultiplier(pricingDefaults.priceMultiplier);
    setExchangeRateRmbPerKrw(pricingDefaults.exchangeRate);
    setAirEnabled(pricingDefaults.airEnabled);
    setSeaEnabled(pricingDefaults.seaEnabled);
  }, [
    pricingDefaults.airEnabled,
    pricingDefaults.commissionPercent,
    pricingDefaults.exchangeRate,
    pricingDefaults.priceMultiplier,
    pricingDefaults.roiPercent,
    pricingDefaults.seaEnabled
  ]);

  function calculateSuggestedPrice(): void {
    const result = calculateKoreaListingPrice({
      purchasePriceRmb: parseDecimal(purchasePriceRmb),
      domesticFreightRmb: parseDecimal(domesticFreightRmb),
      weightKg: parseDecimal(weightKg),
      lengthCm: parseDecimal(lengthCm),
      widthCm: parseDecimal(widthCm),
      heightCm: parseDecimal(heightCm),
      targetRoi: parseDecimal(targetRoiPercent) / 100,
      commissionRate: parseDecimal(commissionPercent) / 100,
      priceMultiplier: parseDecimal(priceMultiplier || "1"),
      exchangeRateRmbPerKrw: parseDecimal(exchangeRateRmbPerKrw || "0.0046"),
      airEnabled,
      seaEnabled
    });
    setPriceResult(result);
    markCalculationDraft({ priceResult: result });
    if (!manualPrice.trim() && result.recommendedPriceKrw !== null) {
      setUnifiedManualPrice(String(result.recommendedPriceKrw));
    }
  }

  function fillParentPrice(): void {
    if (priceResult?.recommendedPriceKrw !== null && priceResult?.recommendedPriceKrw !== undefined) {
      setUnifiedManualPrice(String(priceResult.recommendedPriceKrw));
    }
  }

  function fillAllChildPrices(): void {
    if (priceResult?.recommendedPriceKrw === null || priceResult?.recommendedPriceKrw === undefined) {
      return;
    }
    const price = String(priceResult.recommendedPriceKrw);
    const nextChildPrices = Object.fromEntries(item.childSkus.filter((child) => !child.isExcluded).map((child) => [child.sku, price]));
    setChildPrices(nextChildPrices);
    markPricingDraft(manualPrice, nextChildPrices);
  }

  async function savePrices(): Promise<void> {
    setSaving(true);
    try {
      await onSavePrices(buildPriceDraft());
      pricingDraftDirtyRef.current = false;
    } finally {
      setSaving(false);
    }
  }

  const bestCandidate = item.candidates[0] ?? null;
  const bestProbability =
    bestCandidate?.aiReview?.sameItemProbability === null || bestCandidate?.aiReview?.sameItemProbability === undefined
      ? null
      : Math.round(bestCandidate.aiReview.sameItemProbability * 100);
  const sourcePricePreview = firstNonEmpty(item.manualPrice, item.childSkus[0]?.appliedPrice, item.childSkus[0]?.sourcePrice);
  const finalPricePreview = firstNonEmpty(manualPrice, item.manualPrice);
  const airResult = priceResult?.channels.air;
  const seaResult = priceResult?.channels.sea;
  const recommendedChannel = priceResult?.recommendedChannel;

  return (
    <article className={["review-row", expanded ? "expanded" : "", item.isExcluded ? "excluded" : ""].filter(Boolean).join(" ")}>
      <div className="parent-summary-row">
        {mode === "match" ? (
          <label className="row-checkbox">
            <input
              aria-label={`选择 ${item.parentSku}`}
              type="checkbox"
              checked={checked}
              onChange={(event) => onCheckedChange(event.target.checked)}
            />
          </label>
        ) : (
          <span className="row-checkbox spacer" />
        )}
        <button
          className="expand-button"
          type="button"
          onClick={() => setExpanded((current) => !current)}
          aria-label={`${expanded ? "收起" : "展开"} ${item.parentSku}`}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {item.defaultSearchImageUrl ? (
          <a className="review-image" href={item.defaultSearchImageUrl} target="_blank" rel="noreferrer" title="点击查看源图">
            <img src={item.defaultSearchImageUrl} alt={item.parentSku} />
          </a>
        ) : (
          <div className="review-image">
            <span>源图</span>
          </div>
        )}

        <div className="parent-copy">
          <div className="review-title">
            <strong>{item.parentSku}</strong>
            <span>{`子SKU ${item.childSkuCount}`}</span>
          </div>
          <a href={item.sourceUrl} target="_blank" rel="noreferrer">
            {item.sourceUrl}
          </a>
          <div className="parent-subline">
            {sourcePricePreview ? <span>{`源售价 ₩${sourcePricePreview}`}</span> : null}
            {mode === "price" && finalPricePreview ? <span>{`最终售价 ₩${finalPricePreview}`}</span> : null}
            {mode === "price" && finalPricePreview && formatRmbEstimateFromKrw(finalPricePreview, exchangeRateRmbPerKrw) ? (
              <span>{formatRmbEstimateFromKrw(finalPricePreview, exchangeRateRmbPerKrw)?.replace("约", "折合 ")}</span>
            ) : null}
            {mode === "match" && item.searchStatus === "failed" ? (
              <>
                <span className="danger">匹配失败</span>
                {item.searchErrorCode || item.searchErrorMessage ? (
                  <span className="danger">{`${item.searchErrorCode ?? "unknown_error"}：${item.searchErrorMessage ?? ""}`}</span>
                ) : null}
              </>
            ) : null}
          </div>
        </div>

        <div className="best-match-preview">
          {bestCandidate ? (
            <>
              {bestCandidate.imageUrl ? (
                <a className="best-match-image" href={bestCandidate.imageUrl} target="_blank" rel="noreferrer" title="点击查看1688图">
                  <img src={bestCandidate.imageUrl} alt={bestCandidate.title} />
                </a>
              ) : (
                <div className="best-match-image">
                  <span>1688图</span>
                </div>
              )}
              <div>
                <strong>候选1</strong>
                <div className="candidate-meta">
                  {bestProbability !== null ? <span>{`最高 ${bestProbability}%`}</span> : null}
                  <span>{formatCandidateUnitPrice(bestCandidate.unitPrice)}</span>
                </div>
              </div>
            </>
          ) : item.searchStatus === "failed" ? (
            <>
              <div className="best-match-image failed-placeholder">
                <span>失败</span>
              </div>
              <div>
                <strong className="danger">匹配失败</strong>
                <div className="candidate-meta">
                  <span>{item.searchErrorCode || "unknown_error"}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="best-match-image">
                <span>1688图</span>
              </div>
              <div>
                <strong>待匹配</strong>
                <div className="candidate-meta">
                  <span>暂无候选</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="parent-row-actions">
          {mode === "match" ? (
            <>
              {!item.isExcluded ? (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => void onRerunParentSearch(item.parentSku)}
                  disabled={saving}
                  aria-label={`重新匹配 ${item.parentSku}`}
                >
                  重新匹配
                </button>
              ) : null}
            </>
          ) : null}
          {item.isExcluded ? (
            <button
              className="secondary-button"
              type="button"
              onClick={() => void onSetParentExcluded(item.parentSku, false)}
              aria-label={`恢复 ${item.parentSku}`}
            >
              恢复
            </button>
          ) : (
            <button
              className="secondary-button danger-button"
              type="button"
              onClick={() => void onSetParentExcluded(item.parentSku, true)}
              aria-label={`删除 ${item.parentSku}`}
            >
              删除
            </button>
          )}
          <button className="secondary-button" type="button" onClick={() => setExpanded((current) => !current)}>
            {expanded ? "收起" : mode === "price" ? "展开填写" : "展开查看"}
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="expanded-detail">
          {item.candidates.length > 0 ? (
            <section className="detail-card">
              <div className="detail-heading">
                <h3>1688 候选链接</h3>
              </div>
              <div className="candidate-strip" aria-label={`${item.parentSku} 的1688候选`}>
                {item.candidates.slice(0, 5).map((candidate, candidateIndex) => (
                  <article className="candidate-card" key={candidate.candidateId}>
                    <a className="candidate-image" href={candidate.imageUrl || candidate.offerUrl} target="_blank" rel="noreferrer">
                      {candidate.imageUrl ? <img src={candidate.imageUrl} alt={candidate.title} /> : <span>1688图</span>}
                    </a>
                    <div className="candidate-body">
                      <div className="candidate-title">
                        <strong>{`候选${candidateIndex + 1}`}</strong>
                        <span>{candidate.title}</span>
                      </div>
                      <div className="candidate-meta">
                        <span>{formatCandidateUnitPrice(candidate.unitPrice)}</span>
                        <span>{candidate.monthlySales === null ? "月销未知" : `月销 ${candidate.monthlySales}`}</span>
                        {candidate.shopName ? <span>{candidate.shopName}</span> : null}
                      </div>
                      {candidate.aiReview ? <CandidateAiReview review={candidate.aiReview} /> : null}
                      <div className="candidate-links">
                        <a href={candidate.offerUrl} target="_blank" rel="noreferrer">
                          打开
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {mode === "price" ? (
            <section className="detail-card pricing-tool">
              <div className="detail-heading">
                <h3>父 SKU 统一改价</h3>
                <span>一个父 SKU 对应一个最终售价，保存后同步到子 SKU。</span>
              </div>
              <div className="pricing-grid">
                <label>
                  采购价RMB
                  <input
                    aria-label={`${item.parentSku} 的采购价RMB`}
                    value={purchasePriceRmb}
                    onChange={(event) => {
                      setPurchasePriceRmb(event.target.value);
                      markCalculationDraft({ purchasePriceRmb: event.target.value });
                    }}
                  />
                </label>
                <label>
                  国内运费RMB
                  <input
                    aria-label={`${item.parentSku} 的国内运费RMB`}
                    value={domesticFreightRmb}
                    onChange={(event) => {
                      setDomesticFreightRmb(event.target.value);
                      markCalculationDraft({ domesticFreightRmb: event.target.value });
                    }}
                  />
                </label>
                <label>
                  重量KG
                  <input
                    aria-label={`${item.parentSku} 的重量KG`}
                    value={weightKg}
                    onChange={(event) => {
                      setWeightKg(event.target.value);
                      markCalculationDraft({ weightKg: event.target.value });
                    }}
                  />
                </label>
                <label>
                  长CM
                  <input
                    aria-label={`${item.parentSku} 的长CM`}
                    value={lengthCm}
                    onChange={(event) => {
                      setLengthCm(event.target.value);
                      markCalculationDraft({ lengthCm: event.target.value });
                    }}
                  />
                </label>
                <label>
                  宽CM
                  <input
                    aria-label={`${item.parentSku} 的宽CM`}
                    value={widthCm}
                    onChange={(event) => {
                      setWidthCm(event.target.value);
                      markCalculationDraft({ widthCm: event.target.value });
                    }}
                  />
                </label>
                <label>
                  高CM
                  <input
                    aria-label={`${item.parentSku} 的高CM`}
                    value={heightCm}
                    onChange={(event) => {
                      setHeightCm(event.target.value);
                      markCalculationDraft({ heightCm: event.target.value });
                    }}
                  />
                </label>
                <label>
                  ROI%
                  <input
                    aria-label={`${item.parentSku} 的目标ROI百分比`}
                    value={targetRoiPercent}
                    onChange={(event) => {
                      setTargetRoiPercent(event.target.value);
                      markCalculationDraft({ targetRoiPercent: event.target.value });
                    }}
                  />
                </label>
                <label>
                  佣金率
                  <input
                    aria-label={`${item.parentSku} 的佣金率百分比`}
                    value={commissionPercent}
                    onChange={(event) => {
                      setCommissionPercent(event.target.value);
                      markCalculationDraft({ commissionPercent: event.target.value });
                    }}
                  />
                </label>
                <label>
                  系数
                  <input
                    aria-label={`${item.parentSku} 的价格系数`}
                    value={priceMultiplier}
                    onChange={(event) => {
                      setPriceMultiplier(event.target.value);
                      markCalculationDraft({ priceMultiplier: event.target.value });
                    }}
                  />
                </label>
                <label>
                  韩元汇率
                  <input
                    aria-label={`${item.parentSku} 的韩元兑人民币汇率`}
                    value={exchangeRateRmbPerKrw}
                    onChange={(event) => {
                      setExchangeRateRmbPerKrw(event.target.value);
                      markCalculationDraft({ exchangeRateRmbPerKrw: event.target.value });
                    }}
                  />
                </label>
                <label>
                  最终售价
                  <input
                    aria-label={`${item.parentSku} 的售价`}
                    value={manualPrice}
                    onChange={(event) => setUnifiedManualPrice(event.target.value)}
                  />
                  {formatRmbEstimateFromKrw(manualPrice, exchangeRateRmbPerKrw) ? (
                    <small className="rmb-estimate">
                      {formatRmbEstimateFromKrw(manualPrice, exchangeRateRmbPerKrw)?.replace("约", "最终价约")}
                    </small>
                  ) : null}
                </label>
              </div>
              <div className="pricing-actions">
                <label className="toggle-line">
                  <input
                    aria-label={`${item.parentSku} 空运可用`}
                    type="checkbox"
                    checked={airEnabled}
                    onChange={(event) => {
                      setAirEnabled(event.target.checked);
                      markCalculationDraft({ airEnabled: event.target.checked });
                    }}
                  />
                  空运可用
                </label>
                <label className="toggle-line">
                  <input
                    aria-label={`${item.parentSku} 海运可用`}
                    type="checkbox"
                    checked={seaEnabled}
                    onChange={(event) => {
                      setSeaEnabled(event.target.checked);
                      markCalculationDraft({ seaEnabled: event.target.checked });
                    }}
                  />
                  海运可用
                </label>
                <button
                  className="secondary-button"
                  type="button"
                  onClick={calculateSuggestedPrice}
                  aria-label={`计算 ${item.parentSku} 建议售价`}
                >
                  计算建议价
                </button>
                {priceResult?.recommendedPriceKrw ? (
                  <>
                    <strong className="price-result">
                      <span>{`建议售价 ${priceResult.recommendedPriceKrw} KRW`}</span>
                      {formatRmbEstimateFromKrw(priceResult.recommendedPriceKrw, exchangeRateRmbPerKrw) ? (
                        <span className="rmb-estimate">
                          {formatRmbEstimateFromKrw(priceResult.recommendedPriceKrw, exchangeRateRmbPerKrw)}
                        </span>
                      ) : null}
                    </strong>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={fillParentPrice}
                      aria-label={`填入 ${item.parentSku} 父SKU售价`}
                    >
                      填入父SKU
                    </button>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={fillAllChildPrices}
                      aria-label={`填入 ${item.parentSku} 全部子SKU售价`}
                    >
                      填入全部子SKU
                    </button>
                  </>
                ) : null}
              </div>
              {priceResult ? (
                <div className="shipping-result-grid" aria-label={`${item.parentSku} 运输成本结果`}>
                  <ChannelResultCard label="空运" channel={airResult} recommended={recommendedChannel === "air"} />
                  <ChannelResultCard label="海运" channel={seaResult} recommended={recommendedChannel === "sea"} />
                </div>
              ) : null}
              <button
                className="secondary-button price-save"
                type="button"
                onClick={() => void savePrices()}
                disabled={saving}
                aria-label={`保存 ${item.parentSku} 价格`}
                title="保存当前父 SKU 的成本、尺寸重量、最终价和子 SKU 价格"
              >
                保存本组
              </button>
            </section>
          ) : null}

          <section className="detail-card">
            <div className="detail-heading">
              <h3>子 SKU 明细</h3>
            </div>
            <div className={mode === "price" ? "child-price-list" : "child-sku-table"}>
              {item.childSkus.map((child) =>
                mode === "price" ? (
                  <div className={child.isExcluded ? "child-price-row excluded" : "child-price-row"} key={child.sku}>
                    <div className="child-thumb">
                      {child.variantImageUrl || item.defaultSearchImageUrl ? (
                        <a href={child.variantImageUrl || item.defaultSearchImageUrl} target="_blank" rel="noreferrer" title="点击查看子 SKU 图">
                          <img src={child.variantImageUrl || item.defaultSearchImageUrl} alt={child.sku} />
                        </a>
                      ) : (
                        <span>子图</span>
                      )}
                    </div>
                    <div className="child-price-info">
                      <strong>{child.sku}</strong>
                      <span>{formatChildSpec(child)}</span>
                      <small>
                        {[
                          `原价 ${child.sourcePrice || "-"}`,
                          formatRmbEstimateFromKrw(child.sourcePrice, exchangeRateRmbPerKrw),
                          `当前 ${child.appliedPrice || "-"}`,
                          formatRmbEstimateFromKrw(child.appliedPrice, exchangeRateRmbPerKrw)
                        ]
                          .filter(Boolean)
                          .join(" / ")}
                      </small>
                    </div>
                    <label>
                      手动价
                      <input
                        aria-label={`${child.sku} 的手动售价`}
                        value={childPrices[child.sku] ?? ""}
                        disabled={child.isExcluded}
                        onChange={(event) =>
                          setChildPrices((current) => {
                            const next = {
                              ...current,
                              [child.sku]: event.target.value
                            };
                            markPricingDraft(manualPrice, next);
                            return next;
                          })
                        }
                      />
                      {formatRmbEstimateFromKrw(childPrices[child.sku], exchangeRateRmbPerKrw) ? (
                        <small className="rmb-estimate">
                          {`手动 ${formatRmbEstimateFromKrw(childPrices[child.sku], exchangeRateRmbPerKrw)}`}
                        </small>
                      ) : null}
                    </label>
                    {child.isExcluded ? (
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => void onSetChildExcluded(child.sku, false)}
                        aria-label={`恢复 ${child.sku}`}
                      >
                        恢复
                      </button>
                    ) : (
                      <button
                        className="secondary-button danger-button"
                        type="button"
                        onClick={() => void onSetChildExcluded(child.sku, true)}
                        aria-label={`删除 ${child.sku}`}
                      >
                        删除
                      </button>
                    )}
                  </div>
                ) : (
                  <div className={child.isExcluded ? "child-sku-row excluded" : "child-sku-row"} key={child.sku}>
                    <div className="child-thumb">
                      {child.variantImageUrl || item.defaultSearchImageUrl ? (
                        <a href={child.variantImageUrl || item.defaultSearchImageUrl} target="_blank" rel="noreferrer" title="点击查看子 SKU 图">
                          <img src={child.variantImageUrl || item.defaultSearchImageUrl} alt={child.sku} />
                        </a>
                      ) : (
                        <span>子图</span>
                      )}
                    </div>
                    <button className="sku-copy-button" type="button" onClick={() => void navigator.clipboard?.writeText(child.sku)}>
                      {child.sku}
                    </button>
                    <span>{formatChildSpec(child)}</span>
                    <span>{`源价 ${child.sourcePrice || "-"}`}</span>
                    <span>{`当前 ${child.appliedPrice || "-"}`}</span>
                    {child.isExcluded ? (
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => void onSetChildExcluded(child.sku, false)}
                        aria-label={`恢复 ${child.sku}`}
                      >
                        恢复
                      </button>
                    ) : (
                      <button
                        className="secondary-button danger-button"
                        type="button"
                        onClick={() => void onSetChildExcluded(child.sku, true)}
                        aria-label={`删除 ${child.sku}`}
                      >
                        删除
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          </section>
        </div>
      ) : null}
    </article>
  );
}

function ChannelResultCard({
  label,
  channel,
  recommended
}: {
  label: string;
  channel: KoreaListingPriceResult["channels"]["air"] | undefined;
  recommended: boolean;
}): JSX.Element {
  if (!channel || !channel.available) {
    return (
      <div className="shipping-result-card">
        <span>{label}</span>
        <strong>不可用</strong>
      </div>
    );
  }

  return (
    <div className={recommended ? "shipping-result-card recommended" : "shipping-result-card"}>
      <span>{label}</span>
      <strong>{`¥${channel.totalCostRmb.toFixed(2)}`}</strong>
      <small>{`国际 ¥${channel.baseInternationalFreightRmb.toFixed(2)} · 派送 ¥${channel.cjSurchargeRmb.toFixed(2)}`}</small>
    </div>
  );
}

function firstNonEmpty(...values: Array<string | null | undefined>): string {
  return values.find((value) => typeof value === "string" && value.trim() !== "") ?? "";
}

const SPEC_TRANSLATIONS: Record<string, string> = {
  white: "白色",
  black: "黑色",
  red: "红色",
  green: "绿色",
  blue: "蓝色",
  pink: "粉色",
  yellow: "黄色",
  purple: "紫色",
  brown: "棕色",
  gray: "灰色",
  grey: "灰色",
  beige: "米色",
  orange: "橙色",
  small: "小号",
  medium: "中号",
  large: "大号",
  "화이트": "白色",
  "흰색": "白色",
  "백색": "白色",
  "블랙": "黑色",
  "검정": "黑色",
  "검은색": "黑色",
  "레드": "红色",
  "빨강": "红色",
  "빨간색": "红色",
  "그린": "绿色",
  "초록": "绿色",
  "블루": "蓝色",
  "파랑": "蓝色",
  "파란색": "蓝色",
  "핑크": "粉色",
  "분홍": "粉色",
  "옐로우": "黄色",
  "노랑": "黄色",
  "노란색": "黄色",
  "퍼플": "紫色",
  "보라": "紫色",
  "브라운": "棕色",
  "갈색": "棕色",
  "그레이": "灰色",
  "회색": "灰色",
  "베이지": "米色",
  "네이비": "藏青色",
  "오렌지": "橙色",
  "소형": "小号",
  "중형": "中号",
  "대형": "大号"
};

function translateSpecPart(value: string): string {
  const trimmed = value.trim();
  return SPEC_TRANSLATIONS[trimmed] ?? SPEC_TRANSLATIONS[trimmed.toLowerCase()] ?? trimmed;
}

function formatChildSpec(child: ReviewChildSku): string {
  const rawParts = [child.color, child.size].map((value) => value.trim()).filter(Boolean);
  if (rawParts.length === 0) {
    return "规格未填";
  }

  const translated = rawParts.map(translateSpecPart).join(" / ");
  const raw = rawParts.join(" / ");
  return translated === raw ? translated : `${translated}（原始：${raw}）`;
}

function uniqueLines(value: string): string[] {
  return Array.from(
    new Set(
      value
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
    )
  );
}

function getBestAiScorePercent(item: ReviewItem): number | null {
  const scores = item.candidates
    .map((candidate) => candidate.aiReview?.sameItemProbability)
    .filter((score): score is number => typeof score === "number" && Number.isFinite(score));
  if (scores.length === 0) {
    return null;
  }
  return Math.round(Math.max(...scores) * 100);
}

function ConfirmDialog({
  title,
  message,
  confirmText,
  onConfirm,
  onCancel
}: {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}): JSX.Element {
  const [submitting, setSubmitting] = useState(false);

  async function confirm(): Promise<void> {
    setSubmitting(true);
    try {
      await onConfirm();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="confirm-backdrop" role="dialog" aria-modal="true" aria-label={title}>
      <div className="confirm-card">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button className="secondary-button" type="button" onClick={onCancel} disabled={submitting}>
            取消
          </button>
          <button className="primary-button danger-primary" type="button" onClick={() => void confirm()} disabled={submitting}>
            {submitting ? "处理中" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
