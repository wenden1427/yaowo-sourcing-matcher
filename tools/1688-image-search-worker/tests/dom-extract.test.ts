import type { Page } from "playwright";
import { describe, expect, test, vi } from "vitest";
import {
  buildOfferTitlePickerBrowserScript,
  confirmWholeImageCropSearch,
  parseSoldCount,
  pickOfferTitleFromCandidates,
} from "../src/dom-extract.js";

const text = (value: string): string => value;

describe("parseSoldCount", () => {
  test("parses plain and ten-thousand based sold counts", () => {
    expect(parseSoldCount(text("200+\u4ef6"))).toBe(200);
    expect(parseSoldCount(text("7.3\u4e07\u4ef6"))).toBe(73000);
    expect(parseSoldCount(text("1\u4ef6\u8d77\u6279"))).toBe(0);
  });
});

describe("pickOfferTitleFromCandidates", () => {
  test("skips youyuan filter labels and keeps the real product title", () => {
    expect(
      pickOfferTitleFromCandidates([
        text("\u7b26\u54080/2\u4e2a\u6761\u4ef6"),
        text("\uffe570"),
        text("\u53a8\u623f\u7f6e\u7269\u67b6\u591a\u5c42\u843d\u5730\u6536\u7eb3\u67b6\u514d\u5b89\u88c5\u6298\u53e0\u67b6"),
        text("\u6708\u9500 600"),
      ]),
    ).toBe(text("\u53a8\u623f\u7f6e\u7269\u67b6\u591a\u5c42\u843d\u5730\u6536\u7eb3\u67b6\u514d\u5b89\u88c5\u6298\u53e0\u67b6"));
  });

  test("prefers explicit title or image-alt candidates before generic card lines", () => {
    expect(
      pickOfferTitleFromCandidates([
        text("\u7b26\u54080/2\u4e2a\u6761\u4ef6"),
        text("\u5168\u65b0\u5347\u7ea7\u4e00\u79d2\u6298\u53e0\u53a8\u623f\u7f6e\u7269\u67b6\u591a\u5c42\u6536\u7eb3\u67b6"),
        text("\uffe570"),
      ]),
    ).toBe(text("\u5168\u65b0\u5347\u7ea7\u4e00\u79d2\u6298\u53e0\u53a8\u623f\u7f6e\u7269\u67b6\u591a\u5c42\u6536\u7eb3\u67b6"));
  });

  test("browser-injected picker includes its helper functions", () => {
    const pickInBrowserContext = new Function(`
      ${buildOfferTitlePickerBrowserScript()}
      return pickOfferTitleFromCandidates;
    `)() as typeof pickOfferTitleFromCandidates;

    expect(
      pickInBrowserContext([
        text("\u7b26\u54080/2\u4e2a\u6761\u4ef6"),
        text("\uffe570"),
        text("\u53a8\u623f\u7f6e\u7269\u67b6\u591a\u5c42\u843d\u5730\u6536\u7eb3\u67b6"),
      ]),
    ).toBe(text("\u53a8\u623f\u7f6e\u7269\u67b6\u591a\u5c42\u843d\u5730\u6536\u7eb3\u67b6"));
  });
});

describe("confirmWholeImageCropSearch", () => {
  test("opens the subject cropper, expands the existing crop handles, and confirms it", async () => {
    let lastMousePosition = { x: 0, y: 0 };
    const canvasBox = { x: 100, y: 200, width: 300, height: 240 };
    const cursorForPosition = (x: number, y: number): string => {
      if (Math.abs(x - 150) <= 5 && Math.abs(y - 230) <= 5) return "nw-resize";
      if (Math.abs(x - 330) <= 5 && Math.abs(y - 380) <= 5) return "se-resize";
      if (x > 150 && x < 330 && y > 230 && y < 380) return "move";
      return "default";
    };
    const mouse = {
      move: vi.fn().mockImplementation(async (x: number, y: number) => {
        lastMousePosition = { x, y };
      }),
      down: vi.fn().mockResolvedValue(undefined),
      up: vi.fn().mockResolvedValue(undefined),
    };
    const boundingBox = vi.fn().mockResolvedValue(canvasBox);
    const page = {
      evaluate: vi.fn().mockImplementation(async (script: string) => {
        const body = String(script);
        if (body.includes("cut-btn")) return true;
        if (body.includes("croper-ok-btn")) return true;
        if (body.includes("canvas.style.cursor")) {
          return cursorForPosition(lastMousePosition.x, lastMousePosition.y);
        }
        return true;
      }),
      locator: vi.fn().mockReturnValue({
        boundingBox,
      }),
      mouse,
      waitForTimeout: vi.fn().mockResolvedValue(undefined),
    } as unknown as Page;

    await expect(confirmWholeImageCropSearch(page, 1200)).resolves.toBe(true);

    expect(String(vi.mocked(page.evaluate).mock.calls[0]?.[0])).toContain("cut-btn");
    expect(vi.mocked(page.evaluate).mock.calls.some((call) => String(call[0]).includes("croper-ok-btn"))).toBe(true);
    expect(page.locator).toHaveBeenCalledWith("#croper-canvas");
    expect(mouse.down).toHaveBeenCalledTimes(2);
    expect(mouse.up).toHaveBeenCalledTimes(2);
    expect(vi.mocked(mouse.move).mock.calls).toContainEqual([103, 203]);
    expect(vi.mocked(mouse.move).mock.calls).toContainEqual([397, 437]);
    expect(page.waitForTimeout).toHaveBeenCalledWith(80);
    expect(page.waitForTimeout).toHaveBeenCalledWith(1200);
    expect(vi.mocked(page.waitForTimeout).mock.calls.length).toBeLessThan(40);
  });
});
