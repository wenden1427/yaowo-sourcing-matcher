import Database from "../src/sqlite.js";
import { describe, expect, it } from "vitest";

import { importScraperRows } from "../src/repositories/import-batch.js";
import { saveAiCandidateReview } from "../src/repositories/ai-review-workbench.js";
import { upsertSearchCandidate } from "../src/repositories/export-batch.js";
import {
  listReviewItems,
  markParentNoSource,
  setChildExcluded,
  setParentExcluded,
  savePricingDraft,
  saveManualPrices,
  saveManualSourcedReview
} from "../src/repositories/review-workbench.js";
import { initializeDatabase } from "../src/schema.js";

describe("review workbench repository", () => {
  it("lists ParentSKU review items and saves a manual sourced review", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1-red-s.jpg" }),
        makeDataRow({ parentSku: "P1", sku: "P1-red-m", variantImage: "https://img.example.com/p1-red-m.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2-blue-s.jpg" })
      ]
    });

    expect(listReviewItems(db, imported.batchId)).toMatchObject([
      {
        parentSku: "P1",
        defaultSearchImageUrl: "https://img.example.com/p1-red-s.jpg",
        sourceUrl: "https://www.aliexpress.com/item/100500.html",
        childSkuCount: 2,
        reviewStatus: "unreviewed",
        manual1688Url: "",
        manualPrice: "",
        matchingReason: "",
        candidates: []
      },
      {
        parentSku: "P2",
        defaultSearchImageUrl: "https://img.example.com/p2-blue-s.jpg",
        sourceUrl: "https://www.aliexpress.com/item/100500.html",
        childSkuCount: 1,
        reviewStatus: "unreviewed",
        manual1688Url: "",
        manualPrice: "",
        matchingReason: "",
        candidates: []
      }
    ]);

    saveManualSourcedReview(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      offerUrl: "https://detail.1688.com/offer/987654321.html?foo=bar",
      manualPrice: "12900",
      matchingReason: "manual same item",
      reviewer: "operator-a"
    });
    markParentNoSource(db, {
      batchId: imported.batchId,
      parentSku: "P2",
      matchingReason: "no same item",
      reviewer: "operator-a"
    });

    expect(listReviewItems(db, imported.batchId)).toMatchObject([
      {
        parentSku: "P1",
        reviewStatus: "sourced",
        manual1688Url: "https://detail.1688.com/offer/987654321.html",
        manualPrice: "12900",
        matchingReason: "manual same item"
      },
      {
        parentSku: "P2",
        reviewStatus: "no_source",
        manual1688Url: "",
        manualPrice: "",
        matchingReason: "no same item"
      }
    ]);
  });

  it("includes ranked search candidates for each ParentSKU review item", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [makeHeaderRow(), makeDataRow({ parentSku: "P1", sku: "P1-red-s" })]
    });

    const candidate = upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      rank: 1,
      offerUrl: "https://detail.1688.com/offer/123456789.html",
      title: "1688 same item",
      imageUrl: "https://cbu01.alicdn.com/img/ibank/example.jpg",
      unitPrice: "12.80",
      monthlySales: 321,
      shopName: "source shop"
    });

    expect(listReviewItems(db, imported.batchId)[0]?.candidates).toEqual([
      {
        candidateId: candidate.candidateId,
        rank: 1,
        offerUrl: "https://detail.1688.com/offer/123456789.html",
        title: "1688 same item",
        imageUrl: "https://cbu01.alicdn.com/img/ibank/example.jpg",
        unitPrice: "12.80",
        monthlySales: 321,
        shopName: "source shop"
      }
    ]);
  });

  it("orders candidates by AI same-item probability before original search rank", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [makeHeaderRow(), makeDataRow({ parentSku: "P1", sku: "P1-red-s" })]
    });

    const lowScore = upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      rank: 1,
      offerUrl: "https://detail.1688.com/offer/111111111.html",
      title: "rank 1 but weak"
    });
    const highScore = upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      rank: 2,
      offerUrl: "https://detail.1688.com/offer/222222222.html",
      title: "rank 2 but strong"
    });
    const parentSkuId = db
      .prepare("select id from parent_skus where batch_id = ? and parent_sku = ?")
      .get(imported.batchId, "P1") as { id: number };

    saveAiCandidateReview(db, {
      batchId: imported.batchId,
      parentSkuId: parentSkuId.id,
      candidateId: lowScore.candidateId,
      providerName: "zhipu",
      modelName: "glm-4.6v-flashx",
      sameItemProbability: 0.2
    });
    saveAiCandidateReview(db, {
      batchId: imported.batchId,
      parentSkuId: parentSkuId.id,
      candidateId: highScore.candidateId,
      providerName: "zhipu",
      modelName: "glm-4.6v-flashx",
      sameItemProbability: 0.95
    });

    expect(listReviewItems(db, imported.batchId)[0]?.candidates.map((candidate) => candidate.rank)).toEqual([2, 1]);
  });

  it("lists and saves parent and child manual prices for price editing", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", price: "10000" }),
        makeDataRow({ parentSku: "P1", sku: "P1-red-m", price: "11000" })
      ]
    });

    saveManualPrices(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      parentManualPrice: "12900",
      childPrices: [
        { sku: "P1-red-s", manualPrice: "" },
        { sku: "P1-red-m", manualPrice: "13900" }
      ]
    });

    expect(listReviewItems(db, imported.batchId)[0]).toMatchObject({
      parentSku: "P1",
      manualPrice: "12900",
      childSkus: [
        {
          sku: "P1-red-s",
          sourcePrice: "10000",
          manualPrice: "",
          appliedPrice: "12900",
          priceSource: "parentManual"
        },
        {
          sku: "P1-red-m",
          sourcePrice: "11000",
          manualPrice: "13900",
          appliedPrice: "13900",
          priceSource: "childOverride"
        }
      ]
    });
  });

  it("persists price calculation drafts for each parent SKU", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [makeHeaderRow(), makeDataRow({ parentSku: "P1", sku: "P1-red-s", price: "10000" })]
    });

    savePricingDraft(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      draft: {
        purchasePriceRmb: "50",
        domesticFreightRmb: "5",
        weightKg: "1.2",
        lengthCm: "20",
        widthCm: "15",
        heightCm: "10",
        targetRoiPercent: "35",
        commissionPercent: "12",
        priceMultiplier: "1.1",
        exchangeRateRmbPerKrw: "0.0046",
        airEnabled: true,
        seaEnabled: false,
        priceResult: {
          recommendedPriceKrw: 21900,
          recommendedChannel: "air",
          channels: {
            air: {
              available: true,
              channel: "air",
              totalCostRmb: 82.5,
              baseInternationalFreightRmb: 22,
              cjSurchargeRmb: 10,
              rawListingPriceKrw: 21850,
              listingPriceKrw: 21900
            },
            sea: {
              available: false,
              channel: "sea",
              unavailableReason: "disabled"
            }
          }
        }
      }
    });

    expect(listReviewItems(db, imported.batchId)[0]?.pricingDraft).toMatchObject({
      purchasePriceRmb: "50",
      domesticFreightRmb: "5",
      weightKg: "1.2",
      targetRoiPercent: "35",
      seaEnabled: false,
      priceResult: {
        recommendedPriceKrw: 21900,
        recommendedChannel: "air"
      }
    });
  });

  it("persists parent and child exclusion flags for soft delete and restore", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s" }),
        makeDataRow({ parentSku: "P1", sku: "P1-red-m" })
      ]
    });

    setParentExcluded(db, { batchId: imported.batchId, parentSku: "P1", excluded: true });
    setChildExcluded(db, { batchId: imported.batchId, sku: "P1-red-s", excluded: true });

    expect(listReviewItems(db, imported.batchId)[0]).toMatchObject({
      parentSku: "P1",
      isExcluded: true,
      childSkus: [
        { sku: "P1-red-s", isExcluded: true },
        { sku: "P1-red-m", isExcluded: false }
      ]
    });

    setParentExcluded(db, { batchId: imported.batchId, parentSku: "P1", excluded: false });
    setChildExcluded(db, { batchId: imported.batchId, sku: "P1-red-s", excluded: false });

    expect(listReviewItems(db, imported.batchId)[0]).toMatchObject({
      parentSku: "P1",
      isExcluded: false,
      childSkus: [
        { sku: "P1-red-s", isExcluded: false },
        { sku: "P1-red-m", isExcluded: false }
      ]
    });
  });

  it("includes failed image search status on parent SKU review items", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [makeHeaderRow(), makeDataRow({ parentSku: "P1", sku: "P1-red-s" })]
    });
    const parent = db
      .prepare("select id from parent_skus where batch_id = ? and parent_sku = ?")
      .get(imported.batchId, "P1") as { id: number };

    db.prepare(
      `insert into search_jobs (
        batch_id, parent_sku_id, status, search_image_url, error_code, error_message, started_at, finished_at
      ) values (?, ?, 'failed', ?, 'network_timeout', 'request timed out', datetime('now'), datetime('now'))`
    ).run(imported.batchId, parent.id, "https://img.example.com/p1.jpg");

    expect(listReviewItems(db, imported.batchId)[0]).toMatchObject({
      parentSku: "P1",
      searchStatus: "failed",
      searchErrorCode: "network_timeout",
      searchErrorMessage: "request timed out"
    });
  });
});

function makeHeaderRow(length = 86): string[] {
  return Array.from({ length }, (_, index) => `H${index + 1}`);
}

function makeDataRow(overrides: {
  parentSku: string;
  sku?: string;
  sourceUrl?: string;
  price?: string;
  mainImage?: string;
  variantImage?: string;
}): string[] {
  const row = Array.from({ length: 86 }, () => "");
  row[0] = overrides.parentSku;
  row[1] = overrides.sku ?? `${overrides.parentSku}-SKU`;
  row[9] = "Black";
  row[10] = "S";
  row[11] = overrides.sourceUrl ?? "https://www.aliexpress.com/item/100500.html";
  row[12] = overrides.price ?? "10000";
  row[17] = overrides.mainImage ?? "https://img.example.com/main.jpg";
  row[40] = overrides.variantImage ?? "https://img.example.com/variant.jpg";
  row[66] = "https://img.example.com/detail-1.jpg";
  return row;
}

