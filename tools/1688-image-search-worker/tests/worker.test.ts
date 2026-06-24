import fs from "node:fs";
import path from "node:path";
import { describe, expect, test, vi } from "vitest";
import {
  buildWholeImageSearchResult,
  buildOfferPoolFromRegionCandidates,
  chooseSelectedRegionCandidate,
  extractImageIdFromUrl,
  isMainSearchMtopUrl,
  isPunishUrl,
  parseMtopUrlData,
  resolveImageUploadMode,
  shouldAcceptWholeImageOffers,
  shouldTryAlternativeRegions,
  waitForManualVerification,
} from "../src/worker.js";
import { countKeywordTitleHits, titlesMatchKeyword } from "../src/dom-extract.js";

describe("extractImageIdFromUrl", () => {
  test("extracts imageId from 1688 result URLs", () => {
    expect(
      extractImageIdFromUrl("https://s.1688.com/selloffer/offer_search.htm?imageId=123456&foo=bar"),
    ).toBe("123456");
    expect(extractImageIdFromUrl("https://s.1688.com/youyuan/index.htm")).toBeNull();
  });
});

describe("isMainSearchMtopUrl", () => {
  test("accepts only wireless recommend calls for the main search appId", () => {
    const goodData = encodeURIComponent(JSON.stringify({ appId: "32517" }));
    const badData = encodeURIComponent(JSON.stringify({ appId: "other" }));

    expect(
      isMainSearchMtopUrl(
        `https://h5api.m.1688.com/h5/mtop.relationrecommend.wirelessrecommend.recommend/1.0/?data=${goodData}`,
      ),
    ).toBe(true);
    expect(
      isMainSearchMtopUrl(
        `https://h5api.m.1688.com/h5/mtop.relationrecommend.wirelessrecommend.recommend/1.0/?data=${badData}`,
      ),
    ).toBe(false);
    expect(isMainSearchMtopUrl("https://example.com/not-mtop")).toBe(false);
  });
});

describe("parseMtopUrlData", () => {
  test("returns parsed mtop data query JSON", () => {
    const data = encodeURIComponent(JSON.stringify({ appId: "32517", imageId: "123" }));
    expect(parseMtopUrlData(`https://h5api.m.1688.com/?data=${data}`)).toEqual({
      appId: "32517",
      imageId: "123",
    });
    expect(parseMtopUrlData("not a url")).toBeNull();
  });
});

describe("isPunishUrl", () => {
  test("detects 1688 anti-bot punish URLs", () => {
    expect(
      isPunishUrl("https://s.1688.com/____tmd_____/punish?x5secdata=abc&x5step=1"),
    ).toBe(true);
    expect(isPunishUrl("https://punish.1688.com/captcha")).toBe(true);
    expect(isPunishUrl("https://s.1688.com/selloffer/offer_search.htm?imageId=123")).toBe(false);
  });
});

describe("waitForManualVerification", () => {
  test("waits while the page is on a 1688 verification URL and continues after it clears", async () => {
    const page = {
      url: vi
        .fn()
        .mockReturnValueOnce("https://s.1688.com/youyuan/index.htm/_____tmd_____/punish?x5secdata=abc")
        .mockReturnValueOnce("https://s.1688.com/youyuan/index.htm/_____tmd_____/punish?x5secdata=abc")
        .mockReturnValueOnce("https://s.1688.com/youyuan/index.htm/_____tmd_____/punish?x5secdata=abc")
        .mockReturnValueOnce("https://s.1688.com/youyuan/index.htm?tab=imageSearch&imageId=123"),
      waitForTimeout: vi.fn().mockResolvedValue(undefined),
    };

    await expect(waitForManualVerification(page as never, 1000, 125)).resolves.toBe(true);

    expect(page.waitForTimeout).toHaveBeenCalledTimes(2);
    expect(page.waitForTimeout).toHaveBeenCalledWith(125);
  });
});

describe("resolveImageUploadMode", () => {
  test("defaults to browser-context official upload", () => {
    expect(resolveImageUploadMode({})).toBe("browser");
    expect(resolveImageUploadMode({ uploadMode: "h5" })).toBe("h5");
  });
});

describe("imageSearch official search flow", () => {
  test("does not call the direct mtop whole-image shortcut before opening the official youyuan page", () => {
    const source = fs.readFileSync(path.resolve(import.meta.dirname, "../src/worker.ts"), "utf8");
    const imageSearchBody = source.slice(source.indexOf("export async function imageSearch"), source.indexOf("async function searchWholeImageFirst"));

    expect(imageSearchBody).not.toContain("searchWholeImageFirst");
    expect(imageSearchBody).toContain("searchYouyuanPage");
  });

  test("reuses the browser upload page for the official youyuan search instead of opening another page", () => {
    const source = fs.readFileSync(path.resolve(import.meta.dirname, "../src/worker.ts"), "utf8");
    const imageSearchBody = source.slice(source.indexOf("export async function imageSearch"), source.indexOf("async function searchWholeImageFirst"));
    const searchYouyuanSignature = source.slice(
      source.indexOf("async function searchYouyuanPage"),
      source.indexOf("): Promise<YouyuanPageSearchResult>"),
    );
    const searchYouyuanBody = source.slice(source.indexOf("async function searchYouyuanPage"), source.indexOf("interface YouyuanPageSearchResult"));

    expect(imageSearchBody).toContain("uploadImageInPage");
    expect(imageSearchBody).toContain("uploadResult.page");
    expect(imageSearchBody).toMatch(
      /searchYouyuanPage\(\s*context,\s*imageId,\s*input\.timeoutMs,\s*input\.keyword,\s*input\.max,\s*uploadResult\.page,\s*\)/,
    );
    expect(searchYouyuanSignature).toContain("existingPage?: Page");
    expect(searchYouyuanBody).toContain("const page = existingPage ?? await context.newPage()");
    expect(searchYouyuanBody).toContain("if (!existingPage)");
  });

  test("uses condition-based waits in the official youyuan search instead of fixed long sleeps", () => {
    const source = fs.readFileSync(path.resolve(import.meta.dirname, "../src/worker.ts"), "utf8");
    const searchYouyuanBody = source.slice(source.indexOf("async function searchYouyuanPage"), source.indexOf("interface YouyuanPageSearchResult"));

    expect(searchYouyuanBody).not.toContain("waitForTimeout(5000)");
    expect(searchYouyuanBody).not.toContain("waitForTimeout(2000)");
    expect(searchYouyuanBody).toContain("waitForYouyuanSearchReady");
    expect(searchYouyuanBody).toContain("waitForYouyuanOffers");
  });

  test("does not silently continue with the default 1688 region when whole-image crop fails", () => {
    const source = fs.readFileSync(path.resolve(import.meta.dirname, "../src/worker.ts"), "utf8");
    const searchYouyuanBody = source.slice(source.indexOf("async function searchYouyuanPage"), source.indexOf("interface YouyuanPageSearchResult"));

    expect(searchYouyuanBody).not.toContain("confirmWholeImageCropSearch(page, 1200).catch(() => false)");
    expect(searchYouyuanBody).not.toContain("usedWholeImageCrop ? -1 : 0");
    expect(searchYouyuanBody).not.toContain("if (!usedWholeImageCrop");
    expect(searchYouyuanBody).toContain("navigateToWholeImageRegion");
    expect(searchYouyuanBody).not.toContain("ensureWholeImageCropSearch");
  });

  test("clicks the real upload popover search button instead of broad search text", () => {
    const source = fs.readFileSync(path.resolve(import.meta.dirname, "../src/worker.ts"), "utf8");
    const uploadBody = source.slice(source.indexOf("async function uploadImageInPage"), source.indexOf("async function searchByImageId"));

    expect(uploadBody).toContain('locator(".search-btn")');
    expect(uploadBody).not.toContain('locator("text=\\u641c\\u7d22\\u56fe\\u7247")');
  });
});

describe("chooseSelectedRegionCandidate", () => {
  test("matches multi-token Chinese keywords by individual terms", () => {
    const titles = ["透明亚克力仓鼠笼", "宠物笼小号", "仓鼠笼配件", "亚克力展示盒", "小宠笼子"];

    expect(countKeywordTitleHits(titles, "透明 宠物笼 仓鼠笼 亚克力")).toBe(4);
    expect(titlesMatchKeyword([...titles, "透明宠物笼"], "透明 宠物笼 仓鼠笼 亚克力")).toBe(true);
  });

  test("prefers the first fully matched keyword region over the default region", () => {
    const selected = chooseSelectedRegionCandidate(
      [
        {
          regionIndex: 0,
          switched: false,
          matchedKeyword: false,
          keywordTitleHits: 0,
          titles: ["娃衣配件", "儿童玩具"],
          topOffers: [],
        },
        {
          regionIndex: 1,
          switched: true,
          matchedKeyword: true,
          keywordTitleHits: 5,
          titles: ["透明宠物笼", "折叠宠物笼", "仓鼠宠物笼", "亚克力宠物笼", "宠物笼配件"],
          topOffers: [],
        },
      ],
      "宠物笼",
    );

    expect(selected?.regionIndex).toBe(1);
  });

  test("falls back to the candidate with the most keyword title hits", () => {
    const selected = chooseSelectedRegionCandidate(
      [
        {
          regionIndex: 0,
          switched: false,
          matchedKeyword: false,
          keywordTitleHits: 0,
          titles: ["娃衣配件"],
          topOffers: [],
        },
        {
          regionIndex: 1,
          switched: true,
          matchedKeyword: false,
          keywordTitleHits: 2,
          titles: ["透明收纳箱", "折叠收纳箱"],
          topOffers: [],
        },
      ],
      "收纳箱",
    );

    expect(selected?.regionIndex).toBe(1);
  });

  test("keeps the default region over a higher partial keyword hit alternative", () => {
    const selected = chooseSelectedRegionCandidate(
      [
        {
          regionIndex: 0,
          switched: false,
          matchedKeyword: false,
          keywordTitleHits: 1,
          titles: ["甜妹套装裙", "女童夏季套装", "连衣裙两件套", "韩版裙装", "短袖裙套装"],
          topOffers: [
            { offerId: "1", title: "甜妹套装裙", image: "", priceText: "12.8", similarityScore: null },
            { offerId: "2", title: "女童夏季套装", image: "", priceText: "13.8", similarityScore: null },
            { offerId: "3", title: "连衣裙两件套", image: "", priceText: "14.8", similarityScore: null },
          ],
        },
        {
          regionIndex: 1,
          switched: true,
          matchedKeyword: false,
          keywordTitleHits: 3,
          titles: ["甜妹发夹", "甜妹头饰", "甜妹发饰", "儿童发夹", "蝴蝶结头绳"],
          topOffers: [
            { offerId: "4", title: "甜妹发夹", image: "", priceText: "1.8", similarityScore: null },
            { offerId: "5", title: "甜妹头饰", image: "", priceText: "2.8", similarityScore: null },
            { offerId: "6", title: "甜妹发饰", image: "", priceText: "3.8", similarityScore: null },
          ],
        },
      ],
      "甜妹 裙装 套装",
    );

    expect(selected?.regionIndex).toBe(0);
  });

  test("keeps the default region when result titles already match the core product keyword", () => {
    expect(
      shouldTryAlternativeRegions(
        {
          regionIndex: 0,
          switched: false,
          matchedKeyword: false,
          keywordTitleHits: 3,
          titles: ["甜妹连衣裙", "夏季连衣裙女", "法式碎花连衣裙", "半身裙", "儿童玩具"],
          topOffers: [],
        },
        "连衣裙 甜妹 法式",
      ),
    ).toBe(false);
  });

  test("tries another region when the default result titles are clearly off-topic", () => {
    expect(
      shouldTryAlternativeRegions(
        {
          regionIndex: 0,
          switched: false,
          matchedKeyword: false,
          keywordTitleHits: 0,
          titles: ["发夹配件", "手机壳", "娃衣配件", "儿童玩具", "头绳发饰"],
          topOffers: [],
        },
        "连衣裙 甜妹 法式",
      ),
    ).toBe(true);
  });

  test("keeps the default region when it already returns enough offers even without keyword hits", () => {
    expect(
      shouldTryAlternativeRegions(
        {
          regionIndex: 0,
          switched: false,
          matchedKeyword: false,
          keywordTitleHits: 0,
          titles: ["跨境欧美模特金色大码女内衣模特展示架", "置物架收纳柜", "落地展示柜"],
          topOffers: [
            { offerId: "1", title: "跨境欧美模特金色大码女内衣模特展示架", image: "", priceText: "547.33", similarityScore: null },
            { offerId: "2", title: "置物架收纳柜", image: "", priceText: "128", similarityScore: null },
            { offerId: "3", title: "落地展示柜", image: "", priceText: "168", similarityScore: null },
          ],
        },
        "厨房置物架 收纳柜",
      ),
    ).toBe(false);
  });

  test("does not switch away from the default region when it has usable partial keyword evidence", () => {
    expect(
      shouldTryAlternativeRegions(
        {
          regionIndex: 0,
          switched: false,
          matchedKeyword: false,
          keywordTitleHits: 1,
          titles: ["甜妹套装裙", "女童夏季套装", "连衣裙两件套", "韩版裙装", "短袖裙套装"],
          topOffers: [
            { offerId: "1", title: "甜妹套装裙", image: "", priceText: "12.8", similarityScore: null },
            { offerId: "2", title: "女童夏季套装", image: "", priceText: "13.8", similarityScore: null },
            { offerId: "3", title: "连衣裙两件套", image: "", priceText: "14.8", similarityScore: null },
          ],
        },
        "甜妹 裙装 套装",
      ),
    ).toBe(false);
  });
});

describe("buildOfferPoolFromRegionCandidates", () => {
  const offer = (offerId: string, title = `offer ${offerId}`) => ({
    offerId,
    title,
    url: `https://detail.1688.com/offer/${offerId}.html`,
    image: `https://img.example.com/${offerId}.jpg`,
    price: { text: "12.8", min: 12.8, max: 12.8 },
    supplier: { name: null, shopUrl: null, years: null },
    location: { province: null, city: null },
    bizType: null,
    verified: { factory: false, business: false, superFactory: false },
    tags: [],
    isP4P: false,
    turnover: null,
  });

  test("keeps default whole-image offers in the final pool when a fallback region is selected", () => {
    const defaultOffers = Array.from({ length: 5 }, (_, index) => offer(`default-${index + 1}`));
    const fallbackOffers = Array.from({ length: 10 }, (_, index) => offer(`fallback-${index + 1}`));
    const selected = {
      regionIndex: 1,
      switched: true,
      matchedKeyword: true,
      keywordTitleHits: 5,
      titles: ["fallback"],
      topOffers: [],
      offers: fallbackOffers,
    };

    const pool = buildOfferPoolFromRegionCandidates(
      [
        {
          regionIndex: 0,
          switched: false,
          matchedKeyword: false,
          keywordTitleHits: 0,
          titles: ["off topic"],
          topOffers: [],
          offers: defaultOffers,
        },
        selected,
      ],
      selected,
      10,
    );

    expect(pool).toHaveLength(10);
    expect(pool.map((candidate) => candidate.offerId)).toContain("default-1");
    expect(pool.map((candidate) => candidate.offerId)).toContain("default-2");
    expect(pool.map((candidate) => candidate.offerId)).toContain("default-3");
  });

  test("deduplicates offers when default and fallback regions return the same product", () => {
    const duplicate = offer("same");
    const selected = {
      regionIndex: 1,
      switched: true,
      matchedKeyword: true,
      keywordTitleHits: 4,
      titles: ["same product"],
      topOffers: [],
      offers: [duplicate, offer("fallback-2")],
    };

    const pool = buildOfferPoolFromRegionCandidates(
      [
        {
          regionIndex: 0,
          switched: false,
          matchedKeyword: false,
          keywordTitleHits: 0,
          titles: ["mixed"],
          topOffers: [],
          offers: [duplicate, offer("default-2")],
        },
        selected,
      ],
      selected,
      10,
    );

    expect(pool.map((candidate) => candidate.offerId)).toEqual(["same", "fallback-2", "default-2"]);
  });
});

describe("buildWholeImageSearchResult", () => {
  const offer = (offerId: string, title = `offer ${offerId}`) => ({
    offerId,
    title,
    url: `https://detail.1688.com/offer/${offerId}.html`,
    image: `https://img.example.com/${offerId}.jpg`,
    price: { text: "12.8", min: 12.8, max: 12.8 },
    supplier: { name: null, shopUrl: null, years: null },
    location: { province: null, city: null },
    bizType: null,
    verified: { factory: false, business: false, superFactory: false },
    tags: [],
    isP4P: false,
    turnover: null,
  });

  test("turns whole-image offers into the primary search result without detection regions", () => {
    const result = buildWholeImageSearchResult([offer("1"), offer("2"), offer("3")], 2);

    expect(result.selectedRegionIndex).toBe(-1);
    expect(result.offers.map((candidate) => candidate.offerId)).toEqual(["1", "2"]);
    expect(result.regionCandidates).toEqual([
      {
        regionIndex: -1,
        switched: false,
        matchedKeyword: true,
        keywordTitleHits: 3,
        titles: ["整图搜图结果"],
        topOffers: [
          { offerId: "1", title: "offer 1", image: "https://img.example.com/1.jpg", priceText: "12.8", similarityScore: null },
          { offerId: "2", title: "offer 2", image: "https://img.example.com/2.jpg", priceText: "12.8", similarityScore: null },
          { offerId: "3", title: "offer 3", image: "https://img.example.com/3.jpg", priceText: "12.8", similarityScore: null },
        ],
      },
    ]);
  });

  test("rejects off-topic whole-image offers before falling back to official youyuan results", () => {
    const offers = [
      offer("1", "新品围兜大合集10cm棉花娃娃15cm自嘲熊kt掌门狗围兜厂家批发"),
      offer("2", "UB厘米娃衣二代帽子LAB17衣服仅盲盒衣服一拉布布U玩偶毛衣批发无"),
      offer("3", "5.5cm拼豆盒正方形PP塑料半透明包装盒小物料盒带盖零件首饰盒子"),
      offer("4", "小鸭子捏捏乐解压小玩具透明仿真小鸭子发泄地推热卖玩具儿童小礼"),
    ];

    expect(shouldAcceptWholeImageOffers(offers, "厨房 置物架 收纳柜")).toBe(false);
  });

  test("accepts whole-image offers when top titles match the Chinese product keyword", () => {
    const offers = [
      offer("1", "厨房置物架多层落地收纳架"),
      offer("2", "不锈钢厨房收纳柜锅具整理架"),
      offer("3", "多层厨房储物架置物架"),
    ];

    expect(shouldAcceptWholeImageOffers(offers, "厨房 置物架 收纳柜")).toBe(true);
  });
});
