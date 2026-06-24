import Database from "../src/sqlite.js";
import { describe, expect, it, vi } from "vitest";

import { importScraperRows } from "../src/repositories/import-batch.js";
import {
  getBatchSearchProgress,
  listFailedImageSearchJobs,
  resetFailedImageSearchJobs,
  resetRunningImageSearchJobs,
  runBatchImageSearchJobs,
  runNextImageSearchJob,
  runParentImageSearchJob
} from "../src/repositories/search-workbench.js";
import { initializeDatabase } from "../src/schema.js";

describe("runNextImageSearchJob", () => {
  it("runs the next unsearched ParentSKU and stores ranked 1688 candidates", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({
          parentSku: "P1",
          sku: "P1-red-s",
          variantImage: "https://img.example.com/p1.jpg",
          productTag: "pet cage hamster transparent acrylic"
        }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2.jpg" })
      ]
    });
    const searchOne = vi.fn().mockResolvedValue({
      offers: [
        {
          offerId: "111",
          title: "same item 1",
          url: "https://detail.1688.com/offer/111.html?spm=test",
          image: "https://cbu01.alicdn.com/111.jpg",
          price: { text: "12.80" },
          turnover: "300+",
          supplier: { name: "shop a" }
        },
        {
          offerId: "222",
          title: "same item 2",
          url: "https://detail.1688.com/offer/222.html",
          image: "https://cbu01.alicdn.com/222.jpg",
          price: { text: "13.90" },
          turnover: null,
          supplier: { name: "shop b" }
        }
      ]
    });

    const result = await runNextImageSearchJob(db, {
      batchId: imported.batchId,
      maxCandidates: 10,
      searchOne,
      keywordProvider: async ({ productTag }) => {
        return productTag === "pet cage hamster transparent acrylic" ? "transparent pet cage hamster acrylic" : "";
      }
    });

    expect(result).toEqual({
      status: "completed",
      parentSku: "P1",
      storedCandidateCount: 2
    });
    expect(searchOne).toHaveBeenCalledWith({
      image: "https://img.example.com/p1.jpg",
      max: 10,
      keyword: "transparent pet cage hamster acrylic"
    });
    expect(db.prepare("select search_keyword_zh from parent_skus where parent_sku = 'P1'").get()).toEqual({
      search_keyword_zh: "transparent pet cage hamster acrylic"
    });
    expect(
      db
        .prepare("select status, search_image_url, error_code from search_jobs")
        .all()
    ).toEqual([{ status: "completed", search_image_url: "https://img.example.com/p1.jpg", error_code: null }]);
    expect(
      db
        .prepare("select rank, offer_id, offer_url, title, unit_price, monthly_sales, shop_name from search_candidates order by rank")
        .all()
    ).toEqual([
      {
        rank: 1,
        offer_id: "111",
        offer_url: "https://detail.1688.com/offer/111.html",
        title: "same item 1",
        unit_price: "12.80",
        monthly_sales: 300,
        shop_name: "shop a"
      },
      {
        rank: 2,
        offer_id: "222",
        offer_url: "https://detail.1688.com/offer/222.html",
        title: "same item 2",
        unit_price: "13.90",
        monthly_sales: null,
        shop_name: "shop b"
      }
    ]);
  });

  it("records a structured failed search job without storing candidates", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [makeHeaderRow(), makeDataRow({ parentSku: "P1", sku: "P1-red-s" })]
    });

    const result = await runNextImageSearchJob(db, {
      batchId: imported.batchId,
      maxCandidates: 10,
      searchOne: async () => {
        throw new Error("1688 login expired");
      }
    });

    expect(result).toEqual({
      status: "failed",
      parentSku: "P1",
      errorCode: "login_expired",
      errorMessage: "1688 login expired"
    });
    expect(db.prepare("select status, error_code from search_jobs").all()).toEqual([
      { status: "failed", error_code: "login_expired" }
    ]);
    expect(db.prepare("select count(*) as count from search_candidates").get()).toEqual({ count: 0 });
  });

  it("reruns image search for a specific ParentSKU and replaces old candidates", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2.jpg" })
      ]
    });
    const searchOne = vi
      .fn()
      .mockResolvedValueOnce({
        offers: [{ title: "old item", url: "https://detail.1688.com/offer/111.html" }]
      })
      .mockResolvedValueOnce({
        offers: [{ title: "new item", url: "https://detail.1688.com/offer/222.html" }]
      });

    await runParentImageSearchJob(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      maxCandidates: 10,
      searchOne
    });
    const result = await runParentImageSearchJob(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      maxCandidates: 10,
      searchOne
    });

    expect(result).toEqual({
      status: "completed",
      parentSku: "P1",
      storedCandidateCount: 1
    });
    expect(searchOne).toHaveBeenCalledTimes(2);
    expect(db.prepare("select title, offer_url from search_candidates order by id").all()).toEqual([
      { title: "new item", offer_url: "https://detail.1688.com/offer/222.html" }
    ]);
  });
});

describe("runBatchImageSearchJobs", () => {
  it("runs pending ParentSKU searches until the batch has no pending jobs", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2.jpg" })
      ]
    });
    const searchOne = vi.fn().mockResolvedValue({
      offers: [
        {
          title: "same item",
          url: "https://detail.1688.com/offer/111.html",
          image: "https://cbu01.alicdn.com/111.jpg",
          price: { text: "12.80" }
        }
      ]
    });

    const result = await runBatchImageSearchJobs(db, {
      batchId: imported.batchId,
      maxCandidates: 10,
      maxJobs: 10,
      searchOne
    });

    expect(result).toEqual({
      status: "completed",
      stoppedReason: "idle",
      attemptedCount: 2,
      completedCount: 2,
      failedCount: 0
    });
    expect(searchOne).toHaveBeenCalledTimes(2);
    expect(db.prepare("select status from search_jobs order by parent_sku_id").all()).toEqual([
      { status: "completed" },
      { status: "completed" }
    ]);
  });

  it("stops the batch when a blocking 1688 session error happens", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2.jpg" }),
        makeDataRow({ parentSku: "P3", sku: "P3-green-s", variantImage: "https://img.example.com/p3.jpg" })
      ]
    });
    const searchOne = vi
      .fn()
      .mockResolvedValueOnce({
        offers: [
          {
            title: "same item",
            url: "https://detail.1688.com/offer/111.html",
            image: "https://cbu01.alicdn.com/111.jpg",
            price: { text: "12.80" }
          }
        ]
      })
      .mockRejectedValueOnce(new Error("1688 login expired"));

    const result = await runBatchImageSearchJobs(db, {
      batchId: imported.batchId,
      maxCandidates: 10,
      maxJobs: 10,
      searchOne
    });

    expect(result).toEqual({
      status: "stopped",
      stoppedReason: "blocking_error",
      attemptedCount: 2,
      completedCount: 1,
      failedCount: 1,
      blockingError: {
        parentSku: "P2",
        errorCode: "login_expired",
        errorMessage: "1688 login expired"
      }
    });
    expect(searchOne).toHaveBeenCalledTimes(2);
    expect(db.prepare("select p.parent_sku, j.status from parent_skus p left join search_jobs j on j.parent_sku_id = p.id order by p.id").all()).toEqual([
      { parent_sku: "P1", status: "completed" },
      { parent_sku: "P2", status: "failed" },
      { parent_sku: "P3", status: null }
    ]);
  });

  it("stops the batch after the current job when a stop is requested", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2.jpg" })
      ]
    });
    let calls = 0;
    const searchOne = vi.fn().mockImplementation(async () => {
      calls += 1;
      return {
        offers: [
          {
            title: "same item",
            url: "https://detail.1688.com/offer/111.html",
            image: "https://cbu01.alicdn.com/111.jpg",
            price: { text: "12.80" }
          }
        ]
      };
    });

    const result = await runBatchImageSearchJobs(db, {
      batchId: imported.batchId,
      maxCandidates: 10,
      maxJobs: 10,
      searchOne,
      shouldStop: () => calls >= 1
    });

    expect(result).toEqual({
      status: "stopped",
      stoppedReason: "stop_requested",
      attemptedCount: 1,
      completedCount: 1,
      failedCount: 0
    });
    expect(searchOne).toHaveBeenCalledTimes(1);
    expect(db.prepare("select p.parent_sku, j.status from parent_skus p left join search_jobs j on j.parent_sku_id = p.id order by p.id").all()).toEqual([
      { parent_sku: "P1", status: "completed" },
      { parent_sku: "P2", status: null }
    ]);
  });
});

describe("search job progress and retry reset", () => {
  it("summarizes completed, failed, pending, and blocking failed jobs for a batch", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2.jpg" }),
        makeDataRow({ parentSku: "P3", sku: "P3-green-s", variantImage: "https://img.example.com/p3.jpg" })
      ]
    });
    const searchOne = vi
      .fn()
      .mockResolvedValueOnce({
        offers: [
          {
            title: "same item",
            url: "https://detail.1688.com/offer/111.html",
            image: "https://cbu01.alicdn.com/111.jpg",
            price: { text: "12.80" }
          }
        ]
      })
      .mockRejectedValueOnce(new Error("1688 login expired"));

    await runNextImageSearchJob(db, { batchId: imported.batchId, maxCandidates: 10, searchOne });
    await runNextImageSearchJob(db, { batchId: imported.batchId, maxCandidates: 10, searchOne });

    expect(getBatchSearchProgress(db, imported.batchId)).toEqual({
      totalParentSkuCount: 3,
      completedCount: 1,
      failedCount: 1,
      runningCount: 0,
      pendingCount: 1,
      blockingFailedCount: 1,
      lastBlockingError: {
        parentSku: "P2",
        errorCode: "login_expired",
        errorMessage: "1688 login expired"
      }
    });
  });

  it("resets failed search jobs so they can be retried before untouched ParentSKU", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2.jpg" })
      ]
    });

    await runNextImageSearchJob(db, {
      batchId: imported.batchId,
      maxCandidates: 10,
      searchOne: async () => {
        throw new Error("1688 login expired");
      }
    });

    expect(resetFailedImageSearchJobs(db, { batchId: imported.batchId })).toEqual({ resetCount: 1 });
    const searchOne = vi.fn().mockResolvedValue({
      offers: [
        {
          title: "retried same item",
          url: "https://detail.1688.com/offer/222.html",
          image: "https://cbu01.alicdn.com/222.jpg",
          price: { text: "13.80" }
        }
      ]
    });

    const result = await runNextImageSearchJob(db, {
      batchId: imported.batchId,
      maxCandidates: 10,
      searchOne
    });

    expect(result).toMatchObject({ status: "completed", parentSku: "P1" });
    expect(getBatchSearchProgress(db, imported.batchId)).toMatchObject({
      totalParentSkuCount: 2,
      completedCount: 1,
      failedCount: 0,
      pendingCount: 1
    });
  });

  it("resets running search jobs so interrupted work can continue from that ParentSKU", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2.jpg" })
      ]
    });
    const parent = db.prepare("select id from parent_skus where parent_sku = 'P1'").get() as { id: number };
    db.prepare(
      "insert into search_jobs (batch_id, parent_sku_id, status, search_image_url, started_at) values (?, ?, 'running', ?, datetime('now'))"
    ).run(imported.batchId, parent.id, "https://img.example.com/p1.jpg");

    expect(getBatchSearchProgress(db, imported.batchId)).toMatchObject({
      runningCount: 1,
      pendingCount: 1
    });
    expect(resetRunningImageSearchJobs(db, { batchId: imported.batchId })).toEqual({ resetCount: 1 });

    const searchOne = vi.fn().mockResolvedValue({
      offers: [
        {
          title: "retried same item",
          url: "https://detail.1688.com/offer/222.html",
          image: "https://cbu01.alicdn.com/222.jpg",
          price: { text: "13.80" }
        }
      ]
    });
    const result = await runNextImageSearchJob(db, {
      batchId: imported.batchId,
      maxCandidates: 10,
      searchOne
    });

    expect(result).toMatchObject({ status: "completed", parentSku: "P1" });
    expect(getBatchSearchProgress(db, imported.batchId)).toMatchObject({
      completedCount: 1,
      runningCount: 0,
      pendingCount: 1
    });
  });

  it("lists failed search jobs with parent SKU and error details", async () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2.jpg" })
      ]
    });

    await runNextImageSearchJob(db, {
      batchId: imported.batchId,
      maxCandidates: 10,
      searchOne: async () => {
        throw new Error("1688 login expired");
      }
    });

    expect(listFailedImageSearchJobs(db, imported.batchId)).toMatchObject([
      {
        parentSku: "P1",
        errorCode: "login_expired",
        errorMessage: "1688 login expired"
      }
    ]);
  });
});

function makeHeaderRow(length = 86): string[] {
  return Array.from({ length }, (_, index) => `H${index + 1}`);
}

function makeDataRow(overrides: {
  parentSku: string;
  sku?: string;
  price?: string;
  mainImage?: string;
  variantImage?: string;
  sourceTitle?: string;
  productTag?: string;
}): string[] {
  const row = Array.from({ length: 86 }, () => "");
  row[0] = overrides.parentSku;
  row[1] = overrides.sku ?? `${overrides.parentSku}-SKU`;
  row[2] = overrides.sourceTitle ?? "Acrylic hamster cage";
  row[4] = overrides.productTag ?? "pet cage hamster transparent acrylic";
  row[9] = "Black";
  row[10] = "S";
  row[11] = "https://www.aliexpress.com/item/100500.html";
  row[12] = overrides.price ?? "10000";
  row[17] = overrides.mainImage ?? "https://img.example.com/main.jpg";
  row[40] = overrides.variantImage ?? "https://img.example.com/variant.jpg";
  row[66] = "https://img.example.com/detail-1.jpg";
  return row;
}

