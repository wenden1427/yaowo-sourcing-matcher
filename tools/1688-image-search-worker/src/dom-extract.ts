import type { Page } from "playwright";
import type { NormalizedOffer } from "./types.js";

const OFFER_SELECTOR = '[class*="searchOfferWrapper"]';
const OFFER_LINK_SELECTOR =
  'a[href*="detail.1688.com/offer/"], a[href*="detail.m.1688.com"], a[href*="m.1688.com/offer"]';

type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CursorPoint = {
  x: number;
  y: number;
  cursor: string;
};

export async function extractOffersFromYouyuanPage(page: Page): Promise<NormalizedOffer[]> {
  return page.evaluate(`
    (() => {
      ${buildOfferTitlePickerBrowserScript()}

      function parseSoldCount(text) {
        const normalized = (text || "").replace(/\\s+/g, "");
        if (/起批|起订|璧锋壒/.test(normalized)) return 0;
        const match = normalized.match(/([\\d.]+)(万)?\\+?件(?!起批)/) || normalized.match(/([\\d.]+)(涓?)?\\+?浠?(?!璧锋壒)/);
        if (!match) return 0;
        const number = Number.parseFloat(match[1] || "0");
        if (!Number.isFinite(number)) return 0;
        return match[2] ? Math.round(number * 10000) : Math.round(number);
      }

      function parsePrice(text, report, card) {
        const reportMatch = report.match(/(?:^|\\^)price@([\\d.]+)/);
        if (reportMatch && reportMatch[1]) return Number.parseFloat(reportMatch[1]);

        const leaves = Array.from(card.querySelectorAll("*")).filter((node) => node.children.length === 0);
        for (const leaf of leaves) {
          const raw = (leaf.textContent || "").replace(/\\s+/g, "");
          const leafMatch = raw.match(/^[¥￥楼]([\\d.]+)(?:[~-]([\\d.]+))?$/);
          if (!leafMatch || !leafMatch[1]) continue;
          const value = Number.parseFloat(leafMatch[1]);
          if (Number.isFinite(value) && value > 0 && value < 100000) return value;
        }

        const compact = (text || "").replace(/\\s+/g, "");
        const domMatch = compact.match(/[¥￥楼]([\\d.]+)/);
        return domMatch && domMatch[1] ? Number.parseFloat(domMatch[1]) : null;
      }

      function parseOfferIdFromHref(href) {
        const match = String(href || "").match(/[?&]offerId=(\\d+)/) || String(href || "").match(/\\/offer\\/(\\d+)\\.html/);
        return match && match[1] ? match[1] : "";
      }

      function parseOfferId(card) {
        const renderKey = card.getAttribute("data-renderkey") || "";
        const renderMatch = renderKey.match(/_(\\d{10,})$/);
        if (renderMatch && renderMatch[1]) return renderMatch[1];
        const report = card.getAttribute("data-aplus-report") || "";
        const reportMatch = report.match(/object_id@(\\d+)/);
        if (reportMatch && reportMatch[1]) return reportMatch[1];
        const anchor = card.querySelector('${OFFER_LINK_SELECTOR}');
        return parseOfferIdFromHref(anchor ? anchor.getAttribute("href") : "");
      }

      function findOfferAnchor(card, offerId) {
        const anchors = Array.from(card.querySelectorAll('${OFFER_LINK_SELECTOR}'));
        return anchors.find((anchor) => parseOfferIdFromHref(anchor.getAttribute("href")) === offerId) || anchors[0] || null;
      }

      function collectTitleCandidates(card, anchor, lines) {
        const anchorElement = anchor || null;
        return [
          anchorElement ? anchorElement.getAttribute("title") : "",
          anchorElement ? (anchorElement.querySelector("img") || {}).alt : "",
          ...Array.from(card.querySelectorAll('[class*="title" i], [class*="Title"], [class*="name" i], h1, h2, h3, h4')).map((node) => node.textContent || ""),
          ...Array.from(card.querySelectorAll("a[title]")).map((node) => node.getAttribute("title") || ""),
          ...Array.from(card.querySelectorAll("img[alt]")).map((node) => node.getAttribute("alt") || ""),
          ...lines,
        ];
      }

      const cards = Array.from(document.querySelectorAll('${OFFER_SELECTOR}'));
      const seen = new Set();
      const offers = [];
      for (const card of cards) {
        const offerId = parseOfferId(card);
        if (!offerId || seen.has(offerId)) continue;
        seen.add(offerId);

        const text = card.innerText || "";
        const lines = text.split("\\n").map((line) => line.trim()).filter(Boolean);
        const report = card.getAttribute("data-aplus-report") || "";
        const anchor = findOfferAnchor(card, offerId);
        const title = pickOfferTitleFromCandidates(collectTitleCandidates(card, anchor, lines));
        const price = parsePrice(text, report, card);
        const img = (anchor && anchor.querySelector("img")) || card.querySelector('img[src*="alicdn"], img[data-src*="alicdn"]');
        const supplier =
          lines.find((line) => /厂|公司|商行|店|批发/.test(line) && line.length <= 80 && !line.includes("起批")) || null;

        offers.push({
          offerId,
          title,
          url: "https://detail.1688.com/offer/" + offerId + ".html",
          image: img ? img.getAttribute("src") || img.getAttribute("data-src") : null,
          price: {
            text: price === null ? "" : "¥" + price,
            min: price,
            max: price,
          },
          supplier: {
            name: supplier,
            shopUrl: null,
            years: null,
          },
          location: {
            province: null,
            city: null,
          },
          bizType: null,
          verified: {
            factory: false,
            business: false,
            superFactory: false,
          },
          tags: [],
          isP4P: /_p4p_|p4p/i.test(card.getAttribute("data-renderkey") || ""),
          turnover: String(parseSoldCount(text) || ""),
        });
      }
      return offers;
    })()
  `) as Promise<NormalizedOffer[]>;
}

export function parseSoldCount(text: string): number {
  const normalized = text.replace(/\s+/g, "");
  if (/起批|起订|璧锋壒/.test(normalized)) return 0;
  const match = normalized.match(/([\d.]+)(万)?\+?件(?!起批)/) || normalized.match(/([\d.]+)(涓?)?\+?浠?(?!璧锋壒)/);
  if (!match) return 0;
  const number = Number.parseFloat(match[1] ?? "0");
  if (!Number.isFinite(number)) return 0;
  return match[2] ? Math.round(number * 10000) : Math.round(number);
}

export async function getTopTitles(page: Page, count = 20): Promise<string[]> {
  return page.evaluate(
    `
      (() => {
        ${buildOfferTitlePickerBrowserScript()}
        return Array.from(document.querySelectorAll('${OFFER_SELECTOR}'))
          .slice(0, ${Math.max(1, Math.floor(count))})
          .map((card) => {
            const lines = (card.innerText || "").split("\\n").map((line) => line.trim()).filter(Boolean);
            const anchors = Array.from(card.querySelectorAll('${OFFER_LINK_SELECTOR}'));
            const candidates = [
              ...anchors.map((anchor) => anchor.getAttribute("title") || ""),
              ...anchors.map((anchor) => {
                const img = anchor.querySelector("img");
                return img ? img.getAttribute("alt") || "" : "";
              }),
              ...Array.from(card.querySelectorAll('[class*="title" i], [class*="Title"], [class*="name" i], h1, h2, h3, h4')).map((node) => node.textContent || ""),
              ...Array.from(card.querySelectorAll("a[title]")).map((node) => node.getAttribute("title") || ""),
              ...Array.from(card.querySelectorAll("img[alt]")).map((node) => node.getAttribute("alt") || ""),
              ...lines,
            ];
            return pickOfferTitleFromCandidates(candidates);
          })
          .filter(Boolean);
      })()
    `,
  ) as Promise<string[]>;
}

export function pickOfferTitleFromCandidates(candidates: Array<string | null | undefined>): string {
  for (const candidate of candidates) {
    const title = cleanTitleCandidate(candidate);
    if (title) return title;
  }
  return "";
}

export function buildOfferTitlePickerBrowserScript(): string {
  return `
    const cleanTitleCandidate = ${cleanTitleCandidate.toString()};
    const pickOfferTitleFromCandidates = ${pickOfferTitleFromCandidates.toString()};
  `;
}

function cleanTitleCandidate(value: string | null | undefined): string {
  const title = (value ?? "").replace(/\s+/g, " ").trim();
  if (!title) return "";
  if (title.length < 4 || title.length > 220) return "";
  if (/^¥$|^￥$|^楼$|^[\d.]+$|^[¥￥楼]\s*[\d.]+(?:[~-][\d.]+)?$/.test(title)) return "";
  if (/^\d+\s*件起批$|^[\d.万]+\+?\s*件$|^月销\s*[\d.万+]+$|^销量\s*[\d.万+]+$/.test(title)) return "";
  if (/^符合\s*\d+\s*\/\s*\d+\s*个条件$/.test(title)) return "";
  if (/^(打开|找相似|看相似|进店|联系商家|加入进货单|发起询价|源图|1688图)$/.test(title)) return "";
  if (/^候选\s*\d+$/.test(title)) return "";
  return title.slice(0, 220);
}

export function titlesMatchKeyword(titles: string[], keyword: string): boolean {
  if (!keyword) return true;
  return countKeywordTitleHits(titles, keyword) >= 5;
}

export function countKeywordTitleHits(titles: string[], keyword: string): number {
  const tokens = tokenizeKeyword(keyword);
  if (tokens.length === 0) return 0;
  return titles.filter((title) => titleMatchesAnyToken(title, tokens)).length;
}

function tokenizeKeyword(keyword: string): string[] {
  return keyword
    .toLowerCase()
    .replace(/[，、,;；/|]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function titleMatchesAnyToken(title: string, tokens: string[]): boolean {
  const normalized = title.toLowerCase();
  return tokens.some((token) => normalized.includes(token));
}

export async function confirmWholeImageCropSearch(page: Page, settleMs = 5000): Promise<boolean> {
  const opened = (await page.evaluate(`
    (() => {
      const visible = (element) => {
        if (!element) return false;
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const candidates = Array.from(document.querySelectorAll(".cut-btn, [class*='cutBtn']"));
      const button =
        candidates.find((element) => visible(element) && /框选主体/.test(element.textContent || "")) ||
        candidates.find(visible);
      if (!button) return false;
      button.click();
      return true;
    })()
  `)) as boolean;
  if (!opened) return false;

  const canvasBox = await waitForCropCanvasBox(page);
  if (!canvasBox || canvasBox.width <= 6 || canvasBox.height <= 6) return false;

  const expanded = await expandCropSelectionToWholeCanvas(page, canvasBox);
  if (!expanded) return false;
  await page.waitForTimeout(80);

  const confirmed = (await page.evaluate(`
    (() => {
      const visible = (element) => {
        if (!element) return false;
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const okButton = document.querySelector("#croper-ok-btn");
      if (!visible(okButton)) return false;
      okButton.click();
      return true;
    })()
  `)) as boolean;
  if (!confirmed) return false;

  await page.waitForTimeout(Math.max(150, Math.min(settleMs, 2000)));
  return true;
}

async function waitForCropCanvasBox(page: Page) {
  const canvas = page.locator("#croper-canvas");
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const box = await canvas.boundingBox().catch(() => null);
    if (box && box.width > 6 && box.height > 6) return box;
    await page.waitForTimeout(50);
  }
  return null;
}

async function expandCropSelectionToWholeCanvas(page: Page, canvasBox: BoundingBox): Promise<boolean> {
  const initialBounds = await findCropMoveBounds(page, canvasBox);
  if (!initialBounds) return false;

  const topLeftHandle = await findResizeHandleNear(page, canvasBox, initialBounds.left, initialBounds.top, [
    "nw-resize",
  ]);
  if (!topLeftHandle) return false;
  await dragCropPoint(page, topLeftHandle, {
    x: canvasBox.x + 3,
    y: canvasBox.y + 3,
  });
  await page.waitForTimeout(80);

  const expandedBounds = await findCropMoveBounds(page, canvasBox);
  const right = expandedBounds?.right ?? initialBounds.right;
  const bottom = expandedBounds?.bottom ?? initialBounds.bottom;
  const bottomRightHandle = await findResizeHandleNear(page, canvasBox, right, bottom, ["se-resize"]);
  if (!bottomRightHandle) return false;
  await dragCropPoint(page, bottomRightHandle, {
    x: canvasBox.x + canvasBox.width - 3,
    y: canvasBox.y + canvasBox.height - 3,
  });
  return true;
}

async function findCropMoveBounds(page: Page, canvasBox: BoundingBox) {
  const grid = 4;
  const samplePoints: Array<{ x: number; y: number }> = [];
  for (let yStep = 0; yStep <= grid; yStep += 1) {
    for (let xStep = 0; xStep <= grid; xStep += 1) {
      samplePoints.push({
        x: canvasBox.x + 4 + ((canvasBox.width - 8) * xStep) / grid,
        y: canvasBox.y + 4 + ((canvasBox.height - 8) * yStep) / grid,
      });
    }
  }
  const points = (await readCanvasCursors(page, samplePoints)).filter((point) => point.cursor === "move");

  if (points.length === 0) return null;
  return {
    left: Math.min(...points.map((point) => point.x)),
    top: Math.min(...points.map((point) => point.y)),
    right: Math.max(...points.map((point) => point.x)),
    bottom: Math.max(...points.map((point) => point.y)),
  };
}

async function findResizeHandleNear(
  page: Page,
  canvasBox: BoundingBox,
  centerX: number,
  centerY: number,
  expectedCursors: string[],
): Promise<CursorPoint | null> {
  return (
    (await findResizeHandleInRadius(page, canvasBox, centerX, centerY, expectedCursors, 24, 6)) ??
    findResizeHandleInRadius(page, canvasBox, centerX, centerY, expectedCursors, 42, 6)
  );
}

async function findResizeHandleInRadius(
  page: Page,
  canvasBox: BoundingBox,
  centerX: number,
  centerY: number,
  expectedCursors: string[],
  radius: number,
  step: number,
): Promise<CursorPoint | null> {
  const candidates: Array<{ x: number; y: number; distance: number }> = [];
  for (let dx = -radius; dx <= radius; dx += step) {
    for (let dy = -radius; dy <= radius; dy += step) {
      const x = clamp(centerX + dx, canvasBox.x + 2, canvasBox.x + canvasBox.width - 2);
      const y = clamp(centerY + dy, canvasBox.y + 2, canvasBox.y + canvasBox.height - 2);
      candidates.push({
        x,
        y,
        distance: Math.hypot(dx, dy),
      });
    }
  }

  candidates.sort((a, b) => a.distance - b.distance);
  const seen = new Set<string>();
  const samplePoints: Array<{ x: number; y: number }> = [];
  for (const candidate of candidates) {
    const key = `${Math.round(candidate.x)}:${Math.round(candidate.y)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    samplePoints.push({ x: candidate.x, y: candidate.y });
  }

  const cursorPoints = await readCanvasCursors(page, samplePoints);
  for (const { x, y, cursor } of cursorPoints) {
    if (expectedCursors.includes(cursor)) {
      return { x, y, cursor };
    }
  }
  return null;
}

async function readCanvasCursors(page: Page, points: Array<{ x: number; y: number }>): Promise<CursorPoint[]> {
  const cursorPoints: CursorPoint[] = [];
  for (const point of points) {
    await page.mouse.move(point.x, point.y);
    const cursor = (await page.evaluate(`
      (() => {
        const canvas = document.querySelector("#croper-canvas");
        if (!canvas) return "";
        return canvas.style.cursor || window.getComputedStyle(canvas).cursor || "";
      })()
    `)) as string;
    cursorPoints.push({ ...point, cursor });
  }
  return cursorPoints;
}

async function dragCropPoint(page: Page, from: Pick<CursorPoint, "x" | "y">, to: { x: number; y: number }): Promise<void> {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  for (let step = 1; step <= 6; step += 1) {
    const x = from.x + ((to.x - from.x) * step) / 6;
    const y = from.y + ((to.y - from.y) * step) / 6;
    await page.mouse.move(x, y);
  }
  await page.mouse.up();
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export async function switchDetectionRegion(page: Page, regionIndex: number): Promise<boolean> {
  return page.evaluate(
    `
      (() => {
        const all = Array.from(document.querySelectorAll('[class*="cropRegion--"]'));
        const regions = all.filter((region) => {
          const cls = region.getAttribute("class") || "";
          return !cls.includes("cropRegionMask") && !cls.includes("cropRegionSelectedHook");
        });
        const region = regions[${Math.max(0, Math.floor(regionIndex))}];
        if (!region) return false;
        region.click();
        return true;
      })()
    `,
  ) as Promise<boolean>;
}
