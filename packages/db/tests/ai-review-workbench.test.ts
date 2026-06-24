import Database from "../src/sqlite.js";
import { describe, expect, it } from "vitest";

import { upsertSearchCandidate } from "../src/repositories/export-batch.js";
import { importScraperRows } from "../src/repositories/import-batch.js";
import { listAiReviewTargets, saveAiCandidateReview } from "../src/repositories/ai-review-workbench.js";
import { listReviewItems } from "../src/repositories/review-workbench.js";
import { initializeDatabase } from "../src/schema.js";

describe("AI review workbench repository", () => {
  it("lists Top 5 candidate review targets and exposes latest AI review on review items", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [makeHeaderRow(), makeDataRow({ parentSku: "P1", sku: "P1-red-s" })]
    });

    const candidates = Array.from({ length: 6 }, (_, index) =>
      upsertSearchCandidate(db, {
        batchId: imported.batchId,
        parentSku: "P1",
        rank: index + 1,
        offerUrl: `https://detail.1688.com/offer/12345678${index}.html`,
        title: `candidate ${index + 1}`,
        imageUrl: `https://img.example.com/candidate-${index + 1}.jpg`,
        unitPrice: `${12 + index}.80`,
        monthlySales: 100 + index,
        shopName: "source shop"
      })
    );

    expect(listAiReviewTargets(db, { batchId: imported.batchId, maxRank: 5 })).toHaveLength(5);
    expect(listAiReviewTargets(db, { batchId: imported.batchId, maxRank: 5 })[0]).toMatchObject({
      parentSku: "P1",
      sourceImageUrl: "https://img.example.com/variant.jpg",
      candidateId: candidates[0].candidateId,
      rank: 1,
      candidateImageUrl: "https://img.example.com/candidate-1.jpg"
    });

    saveAiCandidateReview(db, {
      batchId: imported.batchId,
      parentSkuId: listAiReviewTargets(db, { batchId: imported.batchId })[0].parentSkuId,
      candidateId: candidates[0].candidateId,
      providerName: "zhipu",
      modelName: "glm-4.6v-flashx",
      sameItemProbability: 0.91,
      matchingReason: "same structure",
      riskPoints: ["color differs"],
      rawJson: { sameItemProbability: 0.91 }
    });

    expect(listAiReviewTargets(db, { batchId: imported.batchId, maxRank: 5 }).map((target) => target.rank)).toEqual([
      2,
      3,
      4,
      5
    ]);
    expect(
      listAiReviewTargets(db, { batchId: imported.batchId, maxRank: 5, includeReviewed: true }).map(
        (target) => target.rank
      )
    ).toEqual([1, 2, 3, 4, 5]);

    expect(listReviewItems(db, imported.batchId)[0]?.candidates[0]?.aiReview).toEqual({
      sameItemProbability: 0.91,
      matchingReason: "same structure",
      riskPoints: ["color differs"],
      errorMessage: null
    });
  });

  it("limits AI review targets to selected parent SKUs", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);
    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-m" })
      ]
    });

    upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      rank: 1,
      offerUrl: "https://detail.1688.com/offer/111.html",
      title: "candidate p1",
      imageUrl: "https://img.example.com/candidate-p1.jpg",
      unitPrice: "12.80",
      monthlySales: 100,
      shopName: "source shop"
    });
    upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P2",
      rank: 1,
      offerUrl: "https://detail.1688.com/offer/222.html",
      title: "candidate p2",
      imageUrl: "https://img.example.com/candidate-p2.jpg",
      unitPrice: "13.80",
      monthlySales: 200,
      shopName: "source shop"
    });

    expect(listAiReviewTargets(db, { batchId: imported.batchId, parentSkus: ["P2"] }).map((target) => target.parentSku)).toEqual([
      "P2"
    ]);
    expect(listAiReviewTargets(db, { batchId: imported.batchId, parentSkus: [] })).toEqual([]);
  });
});

function makeHeaderRow(length = 86): string[] {
  return Array.from({ length }, (_, index) => `H${index + 1}`);
}

function makeDataRow(overrides: { parentSku: string; sku?: string }): string[] {
  const row = Array.from({ length: 86 }, () => "");
  row[0] = overrides.parentSku;
  row[1] = overrides.sku ?? `${overrides.parentSku}-SKU`;
  row[9] = "Black";
  row[10] = "S";
  row[11] = "https://www.aliexpress.com/item/100500.html";
  row[12] = "10000";
  row[17] = "https://img.example.com/main.jpg";
  row[40] = "https://img.example.com/variant.jpg";
  row[66] = "https://img.example.com/detail-1.jpg";
  return row;
}

