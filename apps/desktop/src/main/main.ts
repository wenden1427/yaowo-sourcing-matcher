import { app, BrowserWindow, dialog, ipcMain, Menu, net, safeStorage, shell } from "electron";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { createImageSearchSession, openProfileForManualSetupSession } from "1688-image-search-worker";
import {
  buildFullReviewExport,
  buildSourcedScraperExport,
  Database,
  type DatabaseConnection,
  type PricingDraftState,
  importScraperRows,
  initializeDatabase,
  listAiReviewTargets,
  listFailedImageSearchJobs,
  listReviewItems,
  markParentNoSource,
  resetFailedImageSearchJobs,
  resetRunningImageSearchJobs,
  runBatchImageSearchJobs,
  runNextImageSearchJob,
  runParentImageSearchJob,
  saveAiCandidateReview,
  saveManualPrices,
  saveManualSourcedReview,
  savePricingDraft,
  setChildExcluded,
  setParentExcluded
} from "@yaowo/db";
import {
  extractChineseSearchKeyword,
  formatImportPreflightLog,
  loadScraperWorkbookForPreflight,
  scoreSameItemCandidate,
  type ScraperWorkbookPreflightInput,
  type SourcePlatform,
  testZhipuOcrConnection,
  testZhipuVisionConnection,
  writeRowsWorkbook
} from "@yaowo/core";
import { createAiSettingsStore, type SaveAiSettingsInput, type SecretCipher } from "./ai-settings-store.js";
import { appendOperationLog } from "./app-log.js";
import { moduleDirFromImportMetaUrl, resolvePreloadPath, resolveRendererIndexPath } from "./paths.js";
import { installAppAsarUpdate } from "./update-installer.js";
import { checkGithubUpdate } from "./update-service.js";

let mainWindow: BrowserWindow | null = null;
let db: DatabaseConnection | null = null;
let aiSettingsStore: ReturnType<typeof createAiSettingsStore> | null = null;
let manual1688SetupSession: Awaited<ReturnType<typeof openProfileForManualSetupSession>> | null = null;
let imageSearchSession: Awaited<ReturnType<typeof createImageSearchSession>> | null = null;
const stopRequestedBatchIds = new Set<number>();
const currentModuleDir = moduleDirFromImportMetaUrl(import.meta.url);
const DEFAULT_1688_MANUAL_URL = "https://www.1688.com/";
const DEFAULT_UPDATE_REPOSITORY = "wenden1427/yaowo-sourcing-matcher";

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: "#eef4f3",
    webPreferences: {
      preload: resolvePreloadPath(currentModuleDir),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    await mainWindow.loadFile(resolveRendererIndexPath(currentModuleDir));
  }
}

function getDatabase(): DatabaseConnection {
  if (!db) {
    const dbPath = join(app.getPath("userData"), "sourcing-matcher.db");
    db = new Database(dbPath);
    initializeDatabase(db);
  }
  return db;
}

function getAiSettingsStore(): ReturnType<typeof createAiSettingsStore> {
  if (!aiSettingsStore) {
    aiSettingsStore = createAiSettingsStore(join(app.getPath("userData"), "ai-settings.json"), createSafeStorageCipher(), process.env, {
      defaultsPath: join(app.getAppPath(), "apps/desktop/resources/ai-settings.defaults.json")
    });
  }
  return aiSettingsStore;
}

function registerIpcHandlers(): void {
  ipcMain.handle("batches:list", () => {
    return getDatabase()
      .prepare(
        `select
          b.id,
          b.name,
          b.status,
          b.imported_at as createdAt,
          (select count(*) from parent_skus p where p.batch_id = b.id) as parentSkuCount,
          (select count(*) from child_skus c where c.batch_id = b.id) as childSkuCount,
          (select count(*) from search_jobs j where j.batch_id = b.id and j.status = 'completed') as searchCompletedCount,
          (select count(*) from search_jobs j where j.batch_id = b.id and j.status = 'failed') as searchFailedCount,
          (select count(*) from search_jobs j where j.batch_id = b.id and j.status = 'running') as searchRunningCount,
          (
            (select count(*) from parent_skus p where p.batch_id = b.id)
            - (select count(*) from search_jobs j where j.batch_id = b.id)
          ) as searchPendingCount,
          (
            select count(*) from search_jobs j
            where j.batch_id = b.id
              and j.status = 'failed'
              and j.error_code in ('login_expired', 'verification_required', 'profile_locked', 'browser_unavailable')
          ) as searchBlockingFailedCount
        from batches b
        order by b.imported_at desc`
      )
      .all();
  });

  ipcMain.handle("app:version", () => {
    return app.getVersion();
  });

  ipcMain.handle("settings:aiStatus", () => {
    return getAiSettingsStore().loadView();
  });

  ipcMain.handle("settings:aiSave", (_event, input: SaveAiSettingsInput) => {
    return getAiSettingsStore().save(input);
  });

  ipcMain.handle("settings:aiTestVision", async () => {
    return testZhipuVisionConnection({
      config: getAiSettingsStore().loadRuntimeConfig()
    });
  });

  ipcMain.handle("settings:aiTestOcr", async () => {
    return testZhipuOcrConnection({
      config: getAiSettingsStore().loadRuntimeConfig(),
      file: SAMPLE_OCR_IMAGE_DATA_URI
    });
  });

  ipcMain.handle("update:check", async () => {
    try {
      const result = await checkGithubUpdate({
        repository: DEFAULT_UPDATE_REPOSITORY,
        currentVersion: app.getVersion(),
        fetchImpl: net.fetch as typeof fetch
      });
      await logOperation({
        level: "info",
        scope: "update",
        message: result.updateAvailable ? "GitHub update available" : "GitHub update not available",
        details: result
      });
      return result;
    } catch (error) {
      await logOperation({
        level: "error",
        scope: "update",
        message: "GitHub update check failed",
        details: error
      });
      throw error;
    }
  });

  ipcMain.handle("update:openUrl", async (_event, url: string) => {
    if (!/^https:\/\/github\.com\//i.test(url) && !/^https:\/\/api\.github\.com\//i.test(url)) {
      throw new Error(`Refusing to open non-GitHub update URL: ${url}`);
    }
    await logOperation({
      level: "info",
      scope: "update",
      message: "Open update URL",
      details: { url }
    });
    await shell.openExternal(url);
  });

  ipcMain.handle("update:installAppAsar", async () => {
    const result = await checkGithubUpdate({
      repository: DEFAULT_UPDATE_REPOSITORY,
      currentVersion: app.getVersion(),
      fetchImpl: net.fetch as typeof fetch
    });
    if (!result.updateAvailable || !result.updatePackage) {
      return { installed: false, reason: "No app.asar update package is available." };
    }
    const installed = await installAppAsarUpdate({
      updatePackage: result.updatePackage,
      userDataDir: app.getPath("userData"),
      resourcesPath: process.resourcesPath,
      executablePath: process.execPath,
      currentProcessId: process.pid,
      fetchImpl: net.fetch as typeof fetch
    });
    await logOperation({
      level: "info",
      scope: "update",
      message: "App asar update staged",
      details: installed
    });
    app.quit();
    return { installed: true };
  });

  ipcMain.handle("log:openDir", async () => {
    const logDir = getLogDir();
    await mkdir(logDir, { recursive: true });
    await shell.openPath(logDir);
    return logDir;
  });

  ipcMain.handle("1688:openLogin", async (_event, url?: string) => {
    return open1688ManualBrowser(url || DEFAULT_1688_MANUAL_URL);
  });

  ipcMain.handle("workbook:import", async (_event, input?: ImportWorkbookPayload) => {
    if (!mainWindow) {
      return null;
    }

    const result = await dialog.showOpenDialog(mainWindow, {
      title: "导入采集表",
      filters: [{ name: "Excel 工作簿", extensions: ["xlsx"] }],
      properties: ["openFile"]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const workbookPath = result.filePaths[0];
    const loaded = await loadScraperWorkbookForPreflight(workbookPath);
    if (!loaded.preflight.ok) {
      const logPath = await writeImportPreflightFailureLog(loaded);
      throw new Error(
        `Cannot import scraper workbook: preflight failed with ${loaded.preflight.issues.length} issue(s). Log: ${logPath}`
      );
    }
    return importScraperRows(getDatabase(), {
      batchName: loaded.sheetName,
      sourcePath: workbookPath,
      rows: loaded.rows,
      sourcePlatform: normalizeSourcePlatform(input?.sourcePlatform),
      importMode: normalizeImportMode(input?.importMode),
      targetBatchId: normalizeImportMode(input?.importMode) === "append" ? input?.targetBatchId ?? null : null
    });
  });

  ipcMain.handle("search:runNext", async (_event, batchId: number) => {
    await closeManual1688Browser();
    const searchSession = await get1688ImageSearchSession();
    const result = await runNextImageSearchJob(getDatabase(), {
      batchId,
      maxCandidates: 10,
      keywordProvider: createSearchKeywordProvider(),
      searchOne: ({ image, max, keyword }) =>
        searchSession.search({
          image,
          max,
          keyword,
          timeoutMs: 30_000
        })
    });
    return handle1688ManualActionResult(result);
  });

  ipcMain.handle("search:runParent", async (_event, input: RunParentImageSearchPayload) => {
    await closeManual1688Browser();
    const searchSession = await get1688ImageSearchSession();
    const result = await runParentImageSearchJob(getDatabase(), {
      batchId: input.batchId,
      parentSku: input.parentSku,
      maxCandidates: 10,
      keywordProvider: createSearchKeywordProvider(),
      searchOne: ({ image, max, keyword }) =>
        searchSession.search({
          image,
          max,
          keyword,
          timeoutMs: 30_000
        })
    });
    return handle1688ManualActionResult(result);
  });

  ipcMain.handle("search:runBatch", async (_event, batchId: number) => {
    await closeManual1688Browser();
    const searchSession = await get1688ImageSearchSession();
    stopRequestedBatchIds.delete(batchId);
    try {
      const result = await runBatchImageSearchJobs(getDatabase(), {
        batchId,
        maxCandidates: 10,
        maxJobs: 50,
        shouldStop: () => stopRequestedBatchIds.has(batchId),
        keywordProvider: createSearchKeywordProvider(),
        searchOne: ({ image, max, keyword }) =>
          searchSession.search({
            image,
            max,
            keyword,
            timeoutMs: 30_000
          })
      });
      return handle1688ManualActionResult(result);
    } finally {
      stopRequestedBatchIds.delete(batchId);
    }
  });

  ipcMain.handle("search:stopBatch", (_event, batchId: number) => {
    stopRequestedBatchIds.add(batchId);
    return { stopRequested: true };
  });

  ipcMain.handle("search:resetFailed", (_event, batchId: number) => {
    return resetFailedImageSearchJobs(getDatabase(), { batchId });
  });

  ipcMain.handle("search:resetRunning", (_event, batchId: number) => {
    return resetRunningImageSearchJobs(getDatabase(), { batchId });
  });

  ipcMain.handle("search:listFailed", (_event, batchId: number) => {
    return listFailedImageSearchJobs(getDatabase(), batchId);
  });

  ipcMain.handle("workbook:exportSourced", async (_event, batchId: number) => {
    if (!mainWindow) {
      return null;
    }

    const batch = getDatabase().prepare("select name from batches where id = ?").get(batchId) as
      | { name: string }
      | undefined;
    if (!batch) {
      throw new Error(`批次不存在：${batchId}`);
    }

    const saveResult = await dialog.showSaveDialog(mainWindow, {
      title: "导出有货源采集表",
      defaultPath: `${safeFileName(batch.name)}-有货源采集表.xlsx`,
      filters: [{ name: "Excel 工作簿", extensions: ["xlsx"] }]
    });

    if (saveResult.canceled || !saveResult.filePath) {
      return null;
    }

    const exported = buildSourcedScraperExport(getDatabase(), batchId);
    await writeRowsWorkbook({
      outputPath: saveResult.filePath,
      worksheetName: "有货源",
      headers: exported.headers,
      rows: exported.rows
    });

    return {
      outputPath: saveResult.filePath,
      parentSkuCount: exported.parentSkuCount,
      childSkuCount: exported.childSkuCount
    };
  });

  ipcMain.handle("workbook:exportFullReview", async (_event, batchId: number) => {
    if (!mainWindow) {
      return null;
    }

    const batch = getDatabase().prepare("select name from batches where id = ?").get(batchId) as
      | { name: string }
      | undefined;
    if (!batch) {
      throw new Error(`批次不存在：${batchId}`);
    }

    const saveResult = await dialog.showSaveDialog(mainWindow, {
      title: "导出完整审核结果",
      defaultPath: `${safeFileName(batch.name)}-完整审核结果.xlsx`,
      filters: [{ name: "Excel 工作簿", extensions: ["xlsx"] }]
    });

    if (saveResult.canceled || !saveResult.filePath) {
      return null;
    }

    const exported = buildFullReviewExport(getDatabase(), batchId);
    await writeRowsWorkbook({
      outputPath: saveResult.filePath,
      worksheetName: "完整审核结果",
      headers: exported.headers,
      rows: exported.rows
    });

    return {
      outputPath: saveResult.filePath,
      parentSkuCount: exported.parentSkuCount,
      childSkuCount: exported.childSkuCount
    };
  });

  ipcMain.handle("review:list", (_event, batchId: number) => {
    return listReviewItems(getDatabase(), batchId);
  });

  ipcMain.handle("ai:reviewBatch", async (_event, input: number | RunBatchAiReviewPayload) => {
    const reviewInput = normalizeRunBatchAiReviewPayload(input);
    const config = getAiSettingsStore().loadRuntimeConfig();
    const targets = listAiReviewTargets(getDatabase(), {
      batchId: reviewInput.batchId,
      maxRank: 5,
      limit: 200,
      parentSkus: reviewInput.parentSkus,
      includeReviewed: reviewInput.includeReviewed
    });
    let completedCount = 0;
    let failedCount = 0;

    for (const target of targets) {
      try {
        const review = await scoreSameItemCandidate({
          config,
          sourceImageUrl: target.sourceImageUrl,
          parentSku: target.parentSku,
          candidate: {
            rank: target.rank,
            title: target.candidateTitle,
            imageUrl: target.candidateImageUrl,
            unitPrice: target.unitPrice,
            monthlySales: target.monthlySales,
            shopName: target.shopName
          }
        });
        saveAiCandidateReview(getDatabase(), {
          batchId: target.batchId,
          parentSkuId: target.parentSkuId,
          candidateId: target.candidateId,
          providerName: config.provider,
          modelName: config.visionModel,
          sameItemProbability: review.sameItemProbability,
          matchingReason: review.matchingReason,
          riskPoints: review.riskPoints,
          rawJson: review
        });
        completedCount += 1;
      } catch (error) {
        saveAiCandidateReview(getDatabase(), {
          batchId: target.batchId,
          parentSkuId: target.parentSkuId,
          candidateId: target.candidateId,
          providerName: config.provider,
          modelName: config.visionModel,
          errorMessage: error instanceof Error ? error.message : String(error)
        });
        failedCount += 1;
      }
    }

    return {
      attemptedCount: targets.length,
      completedCount,
      failedCount
    };
  });

  ipcMain.handle("review:saveManualSourced", (_event, input: SaveManualSourcedReviewPayload) => {
    saveManualSourcedReview(getDatabase(), {
      batchId: input.batchId,
      parentSku: input.parentSku,
      offerUrl: input.offerUrl,
      manualPrice: input.manualPrice,
      selectedCandidateId: input.selectedCandidateId,
      matchingReason: input.matchingReason,
      reviewer: input.reviewer
    });
  });

  ipcMain.handle("review:saveManualPrices", (_event, input: SaveManualPricesPayload) => {
    saveManualPrices(getDatabase(), {
      batchId: input.batchId,
      parentSku: input.parentSku,
      parentManualPrice: input.parentManualPrice,
      childPrices: input.childPrices
    });
  });

  ipcMain.handle("review:savePricingDraft", (_event, input: SavePricingDraftPayload) => {
    savePricingDraft(getDatabase(), {
      batchId: input.batchId,
      parentSku: input.parentSku,
      draft: input.draft
    });
  });

  ipcMain.handle("review:markNoSource", (_event, input: MarkParentNoSourcePayload) => {
    markParentNoSource(getDatabase(), {
      batchId: input.batchId,
      parentSku: input.parentSku,
      matchingReason: input.matchingReason,
      reviewer: input.reviewer
    });
  });

  ipcMain.handle("review:setParentExcluded", (_event, input: SetParentExcludedPayload) => {
    setParentExcluded(getDatabase(), {
      batchId: input.batchId,
      parentSku: input.parentSku,
      excluded: input.excluded
    });
  });

  ipcMain.handle("review:setChildExcluded", (_event, input: SetChildExcludedPayload) => {
    setChildExcluded(getDatabase(), {
      batchId: input.batchId,
      sku: input.sku,
      excluded: input.excluded
    });
  });
}

interface ImportWorkbookPayload {
  sourcePlatform?: SourcePlatform;
  importMode?: "replace" | "append";
  targetBatchId?: number | null;
}

interface SaveManualSourcedReviewPayload {
  batchId: number;
  parentSku: string;
  offerUrl: string;
  manualPrice: string;
  selectedCandidateId?: number | null;
  matchingReason: string;
  reviewer: string;
}

interface MarkParentNoSourcePayload {
  batchId: number;
  parentSku: string;
  matchingReason: string;
  reviewer: string;
}

interface RunParentImageSearchPayload {
  batchId: number;
  parentSku: string;
}

interface RunBatchAiReviewPayload {
  batchId: number;
  parentSkus?: string[];
  includeReviewed?: boolean;
}

interface SetParentExcludedPayload {
  batchId: number;
  parentSku: string;
  excluded: boolean;
}

interface SetChildExcludedPayload {
  batchId: number;
  sku: string;
  excluded: boolean;
}

interface SaveManualPricesPayload {
  batchId: number;
  parentSku: string;
  parentManualPrice: string | null;
  childPrices: Array<{
    sku: string;
    manualPrice: string | null;
  }>;
}

interface SavePricingDraftPayload {
  batchId: number;
  parentSku: string;
  draft: PricingDraftState;
}

function normalizeSourcePlatform(value: unknown): SourcePlatform {
  return value === "shein" ? "shein" : "aliexpress";
}

function normalizeImportMode(value: unknown): "replace" | "append" {
  return value === "append" ? "append" : "replace";
}

function normalizeRunBatchAiReviewPayload(input: number | RunBatchAiReviewPayload): RunBatchAiReviewPayload {
  if (typeof input === "number") {
    return { batchId: input };
  }
  return {
    batchId: input.batchId,
    parentSkus: Array.isArray(input.parentSkus) ? Array.from(new Set(input.parentSkus.filter(Boolean))) : undefined,
    includeReviewed: Boolean(input.includeReviewed)
  };
}

function get1688ProfileDir(): string {
  return join(app.getPath("userData"), "1688-image-search-profile");
}

async function get1688ImageSearchSession(): Promise<NonNullable<typeof imageSearchSession>> {
  if (imageSearchSession?.isOpen()) {
    return imageSearchSession;
  }

  await closeImageSearchSession();
  imageSearchSession = await createImageSearchSession({
    profileDir: get1688ProfileDir(),
    headed: true
  });
  return imageSearchSession;
}

async function closeImageSearchSession(): Promise<void> {
  if (!imageSearchSession) {
    return;
  }
  await imageSearchSession.close();
  imageSearchSession = null;
}

async function open1688ManualBrowser(url: string): Promise<{ profileDir: string; alreadyOpen: boolean }> {
  const profileDir = get1688ProfileDir();
  if (manual1688SetupSession?.isOpen()) {
    return { profileDir, alreadyOpen: true };
  }

  await closeImageSearchSession();
  await closeManual1688Browser();
  manual1688SetupSession = await openProfileForManualSetupSession(profileDir, url);
  return { profileDir, alreadyOpen: false };
}

async function closeManual1688Browser(): Promise<void> {
  if (!manual1688SetupSession) {
    return;
  }
  await manual1688SetupSession.close();
  manual1688SetupSession = null;
}

async function handle1688ManualActionResult<T extends RunNextOrBatchSearchResult>(result: T): Promise<T> {
  const error = getManualActionError(result);
  if (!error) {
    return result;
  }

  const url = extractFirstHttpUrl(error.errorMessage) || DEFAULT_1688_MANUAL_URL;
  try {
    await open1688ManualBrowser(url);
    error.errorMessage = append1688ManualActionHint(error.errorMessage, "已打开 1688 登录/验证窗口，请在窗口里完成登录或滑块后重试失败任务。");
  } catch (openError) {
    error.errorMessage = append1688ManualActionHint(
      error.errorMessage,
      `需要手动打开 1688 登录/验证窗口，但自动打开失败：${openError instanceof Error ? openError.message : String(openError)}`
    );
  }

  return result;
}

type RunNextOrBatchSearchResult =
  | Awaited<ReturnType<typeof runNextImageSearchJob>>
  | Awaited<ReturnType<typeof runParentImageSearchJob>>
  | Awaited<ReturnType<typeof runBatchImageSearchJobs>>;

type ManualActionError = {
  errorCode: string;
  errorMessage: string;
};

function getManualActionError(result: RunNextOrBatchSearchResult): ManualActionError | null {
  if (result.status === "failed" && requires1688ManualAction(result.errorCode)) {
    return result;
  }
  if (
    result.status === "stopped" &&
    result.stoppedReason === "blocking_error" &&
    requires1688ManualAction(result.blockingError.errorCode)
  ) {
    return result.blockingError;
  }
  return null;
}

function requires1688ManualAction(errorCode: string): boolean {
  return errorCode === "login_expired" || errorCode === "verification_required";
}

function append1688ManualActionHint(message: string, hint: string): string {
  return message.includes(hint) ? message : `${message} ${hint}`;
}

function extractFirstHttpUrl(message: string): string | null {
  const match = message.match(/https?:\/\/\S+/);
  return match ? match[0].replace(/[，。；、)）\]}]+$/, "") : null;
}

async function writeImportPreflightFailureLog(loaded: ScraperWorkbookPreflightInput): Promise<string> {
  const logDir = getLogDir();
  await mkdir(logDir, { recursive: true });
  const logPath = join(logDir, `import-preflight-${timestampForFileName()}.log`);
  await writeFile(
    logPath,
    formatImportPreflightLog({
      workbookPath: loaded.path,
      sheetName: loaded.sheetName,
      report: loaded.preflight
    }),
    "utf8"
  );
  return logPath;
}

function getLogDir(): string {
  return join(app.getPath("userData"), "logs");
}

async function logOperation(entry: Parameters<typeof appendOperationLog>[1]): Promise<void> {
  try {
    await appendOperationLog(getLogDir(), entry);
  } catch {
    // Logging must never block the user's main workflow.
  }
}

function timestampForFileName(): string {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function createSearchKeywordProvider() {
  return async ({
    parentSku,
    sourceTitle,
    productTag
  }: {
    parentSku: string;
    sourceTitle: string;
    productTag: string;
  }): Promise<string> => {
    try {
      return await extractChineseSearchKeyword({
        config: getAiSettingsStore().loadDeepSeekRuntimeConfig(),
        parentSku,
        sourceTitle,
        productTag
      });
    } catch {
      return "";
    }
  };
}

function safeFileName(value: string): string {
  return value.trim().replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_") || "有货源采集表";
}

function createSafeStorageCipher(): SecretCipher {
  return {
    encrypt(value: string): string {
      return safeStorage.encryptString(value).toString("base64");
    },
    decrypt(value: string): string {
      return safeStorage.decryptString(Buffer.from(value, "base64"));
    },
    isEncryptionAvailable(): boolean {
      return safeStorage.isEncryptionAvailable();
    }
  };
}

const SAMPLE_OCR_IMAGE_DATA_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAFgwJ/lzjI2wAAAABJRU5ErkJggg==";

async function checkStartupUpdate(): Promise<void> {
  try {
    const result = await checkGithubUpdate({
      repository: DEFAULT_UPDATE_REPOSITORY,
      currentVersion: app.getVersion(),
      fetchImpl: net.fetch as typeof fetch
    });
    await logOperation({
      level: "info",
      scope: "update",
      message: result.updateAvailable ? "Startup update available" : "Startup update not available",
      details: result
    });
    if (!result.updateAvailable) {
      return;
    }

    if (result.updatePackage) {
      const choice = await dialog.showMessageBox({
        type: "info",
        buttons: ["立即更新", "稍后"],
        defaultId: 0,
        cancelId: 1,
        title: "发现新版本",
        message: `发现新版本 ${result.latestVersion}`,
        detail: `当前版本：${result.currentVersion}\n最新版本：${result.latestVersion}\n\n点击“立即更新”后会自动下载更新组件，校验通过后退出、替换并重启。`
      });
      if (choice.response === 0) {
        const installed = await installAppAsarUpdate({
          updatePackage: result.updatePackage,
          userDataDir: app.getPath("userData"),
          resourcesPath: process.resourcesPath,
          executablePath: process.execPath,
          currentProcessId: process.pid,
          fetchImpl: net.fetch as typeof fetch
        });
        await logOperation({
          level: "info",
          scope: "update",
          message: "Startup app asar update staged",
          details: installed
        });
        app.quit();
      }
      return;
    }

    const choice = await dialog.showMessageBox({
      type: "info",
      buttons: ["打开下载页", "稍后"],
      defaultId: 0,
      cancelId: 1,
      title: "发现新版本",
      message: `发现新版本 ${result.latestVersion}`,
      detail: `当前版本：${result.currentVersion}\n最新版本：${result.latestVersion}\n\n下载后解压覆盖旧程序即可。`
    });
    if (choice.response === 0) {
      await shell.openExternal(result.downloadUrl || result.releaseUrl);
    }
  } catch (error) {
    await logOperation({
      level: "warn",
      scope: "update",
      message: "Startup update check skipped",
      details: error
    });
  }
}

app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  registerIpcHandlers();
  await checkStartupUpdate();
  await createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  void closeImageSearchSession();
  void closeManual1688Browser();
  db?.close();
});

process.on("uncaughtException", (error) => {
  void logOperation({
    level: "error",
    scope: "process",
    message: "Uncaught exception",
    details: error
  });
});

process.on("unhandledRejection", (reason) => {
  void logOperation({
    level: "error",
    scope: "process",
    message: "Unhandled rejection",
    details: reason
  });
});
