import fs from "node:fs/promises";
import path from "node:path";
import type { BrowserContext, Page, Response as PlaywrightResponse } from "playwright";
import { chromium } from "playwright-extra";
import stealth from "puppeteer-extra-plugin-stealth";
import {
  extractOffersFromYouyuanPage,
  countKeywordTitleHits,
  getTopTitles,
  titlesMatchKeyword,
} from "./dom-extract.js";
import { buildYouyuanSearchUrl, uploadImageFile } from "./h5-upload.js";
import { resolveImageInput } from "./image.js";
import { extractOffersFromMtopResponse, SEARCH_APP_ID, SEARCH_MTOP_API } from "./parser.js";
import type {
  DetectionRegionCandidate,
  ImageSearchInput,
  ImageUploadMode,
  ImageSearchResult,
  NormalizedOffer,
} from "./types.js";

const UPLOAD_PAGE = "https://s.1688.com/youyuan/index.htm";
const RESULT_URL = (imageId: string) =>
  `https://s.1688.com/selloffer/offer_search.htm?imageId=${imageId}`;
const GOOD_ENOUGH_KEYWORD_HITS = 3;
const GOOD_ENOUGH_KEYWORD_HIT_RATIO = 0.25;
const MIN_DEFAULT_OFFERS_TO_KEEP_REGION = 3;
const MANUAL_VERIFICATION_TIMEOUT_MS = 5 * 60 * 1000;
const YOUYUAN_OFFER_SELECTOR = '[class*="searchOfferWrapper"]';

const stealthPlugin = stealth();
stealthPlugin.enabledEvasions.delete("iframe.contentWindow");
stealthPlugin.enabledEvasions.delete("media.codecs");
chromium.use(stealthPlugin);

export function extractImageIdFromUrl(url: string): string | null {
  try {
    return new URL(url).searchParams.get("imageId");
  } catch {
    return null;
  }
}

export function isMainSearchMtopUrl(url: string): boolean {
  if (!url.includes(SEARCH_MTOP_API)) return false;
  const data = parseMtopUrlData(url);
  return String(data?.appId) === SEARCH_APP_ID;
}

export function parseMtopUrlData(url: string): Record<string, unknown> | null {
  try {
    const dataParam = new URL(url).searchParams.get("data");
    if (!dataParam) return null;
    const parsed = JSON.parse(dataParam) as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function isPunishUrl(url: string): boolean {
  return /\/punish|x5secdata=|punish\.1688\.com|____tmd_____/i.test(url);
}

export async function waitForManualVerification(
  page: Pick<Page, "url" | "waitForTimeout">,
  timeoutMs = MANUAL_VERIFICATION_TIMEOUT_MS,
  pollMs = 1000,
): Promise<boolean> {
  if (!isPunishUrl(page.url())) return false;

  const deadline = Date.now() + Math.max(1000, timeoutMs);
  while (isPunishUrl(page.url())) {
    if (Date.now() >= deadline) {
      throw new Error(`1688 verification wait timed out. Complete verification in the browser and retry: ${page.url()}`);
    }
    await page.waitForTimeout(Math.max(100, pollMs));
  }
  assertNotLoginPage(page.url());
  return true;
}

export function resolveImageUploadMode(input: Pick<ImageSearchInput, "uploadMode">): ImageUploadMode {
  return input.uploadMode ?? "browser";
}

export interface ManualProfileSetupSession {
  profileDir: string;
  isOpen: () => boolean;
  close: () => Promise<void>;
}

export interface ImageSearchSessionOptions {
  profileDir: string;
  headed: boolean;
}

export interface ImageSearchSession {
  search: (input: Omit<ImageSearchInput, "profileDir" | "headed">) => Promise<ImageSearchResult>;
  isOpen: () => boolean;
  close: () => Promise<void>;
}

export async function imageSearch(input: ImageSearchInput): Promise<ImageSearchResult> {
  const session = await createImageSearchSession({
    profileDir: input.profileDir,
    headed: input.headed,
  });
  try {
    return await session.search(input);
  } finally {
    await session.close();
  }
}

export async function createImageSearchSession(options: ImageSearchSessionOptions): Promise<ImageSearchSession> {
  const context = await launchSearchContext(options.profileDir, options.headed);
  await installSearchContextInitScript(context);
  let closed = false;
  let reusablePage: Page | undefined;

  return {
    search: async (input) => {
      if (closed) {
        throw new Error("1688 image search session is already closed");
      }
      const output = await imageSearchInContext(
        context,
        {
          ...input,
          profileDir: options.profileDir,
          headed: options.headed,
        },
        reusablePage,
      );
      reusablePage = output.page;
      return output.result;
    },
    isOpen: () => !closed && context.pages().some((page) => !page.isClosed()),
    close: async () => {
      closed = true;
      await context.close().catch(() => {});
    },
  };
}

async function imageSearchInContext(
  context: BrowserContext,
  input: ImageSearchInput,
  existingPage?: Page,
): Promise<{ result: ImageSearchResult; page?: Page }> {
  const tempImage = await resolveImageInput(input.image);
  try {
    const uploadResult =
      resolveImageUploadMode(input) === "h5"
        ? { imageId: await uploadImageFile(tempImage.path), page: undefined }
        : await uploadImageInPage(context, tempImage.path, input.timeoutMs, existingPage);
    const imageId = uploadResult.imageId;
    const searchResult = await searchYouyuanPage(
      context,
      imageId,
      input.timeoutMs,
      input.keyword,
      input.max,
      uploadResult.page,
    );
    return {
      result: {
        success: true,
        imageId,
        sourceImage: input.image,
        matchKeyword: input.keyword || null,
        selectedRegionIndex: searchResult.selectedRegionIndex,
        regionCandidates: searchResult.regionCandidates,
        offers: searchResult.offers.slice(0, input.max),
      },
      page: uploadResult.page,
    };
  } finally {
    await tempImage.cleanup().catch(() => {});
  }
}

async function searchWholeImageFirst(
  context: BrowserContext,
  imageId: string,
  timeoutMs: number,
  keyword = "",
  debugDir?: string,
): Promise<NormalizedOffer[]> {
  const wholeImageTimeoutMs = Math.min(timeoutMs, 20_000);
  try {
    const offers = await searchByImageId(context, imageId, wholeImageTimeoutMs, debugDir);
    return shouldAcceptWholeImageOffers(offers, keyword) ? offers : [];
  } catch {
    return [];
  }
}

async function searchYouyuanPage(
  context: BrowserContext,
  imageId: string,
  timeoutMs: number,
  keyword = "",
  maxOffers = 10,
  existingPage?: Page,
): Promise<YouyuanPageSearchResult> {
  const page = existingPage ?? await context.newPage();
  try {
    if (!page.url().includes(`imageId=${imageId}`)) {
      await page.goto(buildYouyuanSearchUrl(imageId), {
        waitUntil: "domcontentloaded",
        timeout: timeoutMs,
      });
    }
    assertNotLoginPage(page.url());
    if (isPunishUrl(page.url())) {
      await waitForManualVerification(page);
    }
    await waitForYouyuanSearchReady(page, Math.min(timeoutMs, 5000));
    await navigateToWholeImageRegion(page, Math.min(timeoutMs, 8000));
    if (isPunishUrl(page.url())) {
      await waitForManualVerification(page);
    }
    await waitForYouyuanOffers(page, Math.min(timeoutMs, 5000));

    const candidates: YouyuanRegionCandidate[] = [];
    candidates.push(await collectRegionCandidate(page, -1, false, keyword));

    const selected = chooseSelectedRegionCandidate(candidates, keyword) ?? candidates[0];
    return {
      offers: buildOfferPoolFromRegionCandidates(candidates, selected, maxOffers),
      selectedRegionIndex: selected?.regionIndex ?? 0,
      regionCandidates: candidates.map(({ offers: _offers, ...candidate }) => candidate),
    };
  } finally {
    if (!existingPage) {
      await page.close().catch(() => {});
    }
  }
}

async function waitForYouyuanSearchReady(page: Page, timeoutMs: number): Promise<void> {
  await page
    .waitForFunction(
      () =>
        Boolean(
          document.querySelector("#search-img") ||
            document.querySelector(".cut-btn, [class*='cutBtn']") ||
            document.querySelector('[class*="searchOfferWrapper"]'),
        ),
      undefined,
      { timeout: Math.max(500, timeoutMs) },
    )
    .catch(() => undefined);
}

async function navigateToWholeImageRegion(page: Page, timeoutMs: number): Promise<void> {
  const imageSize = await waitForSearchImageSize(page, timeoutMs);
  const currentUrl = new URL(page.url());
  const wholeRegion = `0,${imageSize.width},0,${imageSize.height}`;
  if (currentUrl.searchParams.get("region") === wholeRegion) {
    return;
  }
  currentUrl.searchParams.delete("region");
  currentUrl.searchParams.delete("yoloCropRegion");
  currentUrl.searchParams.set("region", wholeRegion);
  await page.goto(currentUrl.toString(), {
    waitUntil: "domcontentloaded",
    timeout: Math.max(500, timeoutMs),
  });
  await waitForSearchImageSize(page, timeoutMs);
}

async function waitForSearchImageSize(page: Page, timeoutMs: number): Promise<{ width: number; height: number }> {
  const handle = await page.waitForFunction(
    () => {
      const image = document.querySelector<HTMLImageElement>(".searchImg--mveyNQEN, [class*='searchImg']");
      if (!image || image.naturalWidth <= 0 || image.naturalHeight <= 0) {
        return null;
      }
      const rect = image.getBoundingClientRect();
      if (rect.width <= 20 || rect.height <= 20) {
        return null;
      }
      return {
        width: image.naturalWidth,
        height: image.naturalHeight,
      };
    },
    undefined,
    { timeout: Math.max(500, timeoutMs) },
  );
  const imageSize = (await handle.jsonValue()) as { width: number; height: number } | null;
  if (!imageSize) {
    throw new Error("whole image region failed: 1688 搜图主图未加载完成");
  }
  return imageSize;
}

async function waitForYouyuanOffers(page: Page, timeoutMs: number): Promise<void> {
  await page
    .waitForFunction(
      (selector) => document.querySelectorAll(selector).length > 0,
      YOUYUAN_OFFER_SELECTOR,
      { timeout: Math.max(500, timeoutMs) },
    )
    .catch(() => undefined);
}

interface YouyuanPageSearchResult {
  offers: NormalizedOffer[];
  selectedRegionIndex: number;
  regionCandidates: DetectionRegionCandidate[];
}

type YouyuanRegionCandidate = DetectionRegionCandidate & {
  offers: NormalizedOffer[];
};

export function buildWholeImageSearchResult(offers: NormalizedOffer[], maxOffers: number): YouyuanPageSearchResult {
  const safeMax = Math.max(1, maxOffers);
  const limitedOffers = offers.slice(0, safeMax);
  return {
    offers: limitedOffers,
    selectedRegionIndex: -1,
    regionCandidates: [
      {
        regionIndex: -1,
        switched: false,
        matchedKeyword: true,
        keywordTitleHits: offers.length,
        titles: ["\u6574\u56fe\u641c\u56fe\u7ed3\u679c"],
        topOffers: offers.slice(0, 5).map((offer) => ({
          offerId: offer.offerId,
          title: offer.title,
          image: offer.image,
          priceText: offer.price.text,
          similarityScore: null,
        })),
      },
    ],
  };
}

export function shouldAcceptWholeImageOffers(offers: NormalizedOffer[], keyword = ""): boolean {
  if (offers.length === 0) return false;
  if (!containsChinese(keyword)) return false;

  const titles = offers
    .slice(0, 10)
    .map((offer) => offer.title?.trim() ?? "")
    .filter(Boolean);
  if (titles.length === 0) return false;

  const hitCount = countKeywordTitleHits(titles, keyword);
  const requiredHits = Math.min(2, Math.max(1, Math.ceil(titles.length * 0.2)));
  return hitCount >= requiredHits;
}

function containsChinese(value: string): boolean {
  return /[\u4e00-\u9fff]/.test(value);
}

async function collectRegionCandidate(
  page: import("playwright").Page,
  regionIndex: number,
  switched: boolean,
  keyword: string,
): Promise<YouyuanRegionCandidate> {
  const [titles, offers] = await Promise.all([getTopTitles(page), extractOffersFromYouyuanPage(page)]);
  return {
    regionIndex,
    switched,
    matchedKeyword: titlesMatchKeyword(titles, keyword),
    keywordTitleHits: countKeywordTitleHits(titles, keyword),
    titles,
    topOffers: offers.slice(0, 5).map((offer) => ({
      offerId: offer.offerId,
      title: offer.title,
      image: offer.image,
      priceText: offer.price.text,
      similarityScore: null,
    })),
    offers,
  };
}

export function chooseSelectedRegionCandidate<T extends DetectionRegionCandidate>(
  candidates: T[],
  keyword = "",
): T | null {
  if (candidates.length === 0) return null;
  if (!keyword.trim()) return candidates[0] ?? null;
  const matched = candidates.find((candidate) => candidate.matchedKeyword);
  if (matched) return matched;
  const defaultCandidate = candidates[0];
  if (hasUsablePartialKeywordEvidence(defaultCandidate)) return defaultCandidate;
  return candidates.reduce((best, candidate) =>
    candidate.keywordTitleHits > best.keywordTitleHits ? candidate : best,
  );
}

export function shouldTryAlternativeRegions(
  candidate: DetectionRegionCandidate | null | undefined,
  keyword = "",
): boolean {
  if (!candidate || !keyword.trim()) return false;
  if (candidate.matchedKeyword) return false;
  if (hasEnoughDefaultOffers(candidate)) return false;
  if (hasUsablePartialKeywordEvidence(candidate)) return false;

  const inspectedTitleCount = Math.max(1, candidate.titles.length);
  const hitRatio = candidate.keywordTitleHits / inspectedTitleCount;
  const goodEnough =
    candidate.keywordTitleHits >= GOOD_ENOUGH_KEYWORD_HITS &&
    hitRatio >= GOOD_ENOUGH_KEYWORD_HIT_RATIO;

  return !goodEnough;
}

function hasEnoughDefaultOffers(candidate: DetectionRegionCandidate | null | undefined): boolean {
  return (candidate?.topOffers.length ?? 0) >= MIN_DEFAULT_OFFERS_TO_KEEP_REGION;
}

function hasUsablePartialKeywordEvidence(candidate: DetectionRegionCandidate | null | undefined): boolean {
  if (!candidate || candidate.keywordTitleHits <= 0) return false;
  return candidate.titles.length >= 3 || candidate.topOffers.length >= 3;
}

export function buildOfferPoolFromRegionCandidates(
  candidates: YouyuanRegionCandidate[],
  selected: YouyuanRegionCandidate | null | undefined,
  maxOffers: number,
): NormalizedOffer[] {
  if (candidates.length === 0) return [];
  const safeMax = Math.max(1, maxOffers);
  const defaultCandidate = candidates[0];
  const selectedCandidate = selected ?? defaultCandidate;
  const selectedIsDefault = selectedCandidate.regionIndex === defaultCandidate.regionIndex;
  const defaultReserve = selectedIsDefault ? 0 : Math.min(3, Math.max(1, Math.ceil(safeMax * 0.3)));
  const selectedPrimaryLimit = selectedIsDefault ? safeMax : Math.max(1, safeMax - defaultReserve);

  const orderedOffers = [
    ...selectedCandidate.offers.slice(0, selectedPrimaryLimit),
    ...(selectedIsDefault ? [] : defaultCandidate.offers.slice(0, defaultReserve)),
    ...selectedCandidate.offers,
    ...defaultCandidate.offers,
    ...candidates
      .filter(
        (candidate) =>
          candidate.regionIndex !== selectedCandidate.regionIndex &&
          candidate.regionIndex !== defaultCandidate.regionIndex,
      )
      .flatMap((candidate) => candidate.offers),
  ];

  const seen = new Set<string>();
  const deduped: NormalizedOffer[] = [];
  for (const offer of orderedOffers) {
    const key = offer.offerId || offer.url;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(offer);
    if (deduped.length >= safeMax) break;
  }
  return deduped;
}

async function launchSearchContext(profileDir: string, headed: boolean): Promise<BrowserContext> {
  await fs.mkdir(profileDir, { recursive: true });
  await clearChromeSingletonFiles(profileDir);
  const options = {
    headless: !headed,
    channel: "chrome",
    viewport: { width: 1440, height: 900 },
    locale: "zh-CN",
    timezoneId: "Asia/Shanghai",
  } as const;

  return chromium.launchPersistentContext(profileDir, options) as Promise<BrowserContext>;
}

async function installSearchContextInitScript(context: BrowserContext): Promise<void> {
  await context.addInitScript(() => {
    try {
      Object.defineProperty(navigator, "languages", {
        get: () => ["zh-CN", "zh", "en"],
      });
    } catch {
      /* ignore */
    }
  });
}

export async function openProfileForManualSetupSession(
  profileDir: string,
  url: string,
): Promise<ManualProfileSetupSession> {
  const context = await launchSearchContext(profileDir, true);
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30_000 }).catch(() => undefined);
  return {
    profileDir,
    isOpen: () => context.pages().some((openPage) => !openPage.isClosed()),
    close: async () => {
      await context.close().catch(() => {});
    },
  };
}

export async function openProfileForManualSetup(profileDir: string, url: string): Promise<void> {
  const session = await openProfileForManualSetupSession(profileDir, url);
  process.stdout.write(
    [
      "Opened the dedicated 1688 browser.",
      "Please finish login or verification in that browser window.",
      "Close the browser window when finished; this command will exit automatically.",
      "",
    ].join("\n"),
  );
  while (session.isOpen()) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  await session.close();
}

async function clearChromeSingletonFiles(profileDir: string): Promise<void> {
  for (const name of ["SingletonLock", "SingletonCookie", "SingletonSocket"]) {
    await fs.unlink(path.join(profileDir, name)).catch(() => {});
  }
}

async function uploadImageInPage(
  context: BrowserContext,
  imagePath: string,
  timeoutMs: number,
  existingPage?: Page,
): Promise<{ imageId: string; page: Page }> {
  const page = existingPage ?? await context.newPage();
  let succeeded = false;
  try {
    await page.goto(UPLOAD_PAGE, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    assertNotLoginPage(page.url());

    const directInput = page.locator("#img-search-upload").first();
    const directInputSucceeded = await directInput
      .setInputFiles(imagePath, { timeout: Math.min(timeoutMs, 10_000) })
      .then(() => true)
      .catch(() => false);
    if (!directInputSucceeded) {
      page.once("filechooser", async (chooser) => {
        await chooser.setFiles(imagePath).catch(() => {});
      });
      await page
        .locator('.image-upload-button-container, input[type="file"]')
        .first()
        .click({ force: true, timeout: Math.min(timeoutMs, 10_000) });
    }

    const searchButton = page.locator(".search-btn").first();
    await searchButton.waitFor({
      state: "visible",
      timeout: Math.min(timeoutMs, 15_000),
    });

    await Promise.all([
      page.waitForURL(/imageId=\d+|\/punish|x5secdata=|____tmd_____/, { timeout: timeoutMs }).catch(() => undefined),
      searchButton.click({ force: true }),
    ]);

    if (isPunishUrl(page.url())) {
      await waitForManualVerification(page);
    }

    const imageId = extractImageIdFromUrl(page.url());
    if (!imageId) {
      throw new Error(`Image upload finished without imageId, current URL: ${page.url()}`);
    }
    succeeded = true;
    return { imageId, page };
  } finally {
    if (!succeeded && !existingPage) {
      await page.close().catch(() => {});
    }
  }
}

async function searchByImageId(
  context: BrowserContext,
  imageId: string,
  timeoutMs: number,
  debugDir?: string,
): Promise<NormalizedOffer[]> {
  const page = await context.newPage();
  let capturedOffers: NormalizedOffer[] = [];

  const onResponse = async (response: PlaywrightResponse) => {
    const responseUrl = response.url();
    if (!responseUrl.includes(SEARCH_MTOP_API)) return;
    try {
      const body = await response.text();
      const offers = extractOffersFromMtopResponse(body);
      if (debugDir) {
        await writeDebugMtop(debugDir, {
          imageId,
          url: responseUrl,
          data: parseMtopUrlData(responseUrl),
          offerCount: offers.length,
          firstTitles: offers.slice(0, 5).map((offer) => offer.title),
          isMainSearch: isMainSearchMtopUrl(responseUrl),
        });
      }
      if (!isMainSearchMtopUrl(responseUrl)) return;
      if (offers.length > capturedOffers.length) capturedOffers = offers;
    } catch {
      /* ignore malformed recommendation payloads */
    }
  };

  page.on("response", onResponse);
  try {
    await page.goto(RESULT_URL(imageId), { waitUntil: "domcontentloaded", timeout: timeoutMs });
    assertNotLoginPage(page.url());

    let deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (capturedOffers.length > 0) break;
      if (isPunishUrl(page.url())) {
        await waitForManualVerification(page);
        deadline = Date.now() + timeoutMs;
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    return capturedOffers;
  } finally {
    page.off("response", onResponse);
    await page.close().catch(() => {});
  }
}

let debugSeq = 0;

async function writeDebugMtop(debugDir: string, payload: unknown): Promise<void> {
  await fs.mkdir(debugDir, { recursive: true });
  debugSeq += 1;
  const fileName = `mtop-${String(debugSeq).padStart(3, "0")}.json`;
  await fs.writeFile(path.join(debugDir, fileName), JSON.stringify(payload, null, 2), "utf8");
}

function assertNotLoginPage(url: string): void {
  if (/login\.1688\.com|login\.taobao\.com/.test(url)) {
    throw new Error("1688 login state is invalid. Open the same profile, finish login, then retry.");
  }
}
