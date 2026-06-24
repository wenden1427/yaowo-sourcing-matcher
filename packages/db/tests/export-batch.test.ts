import Database from "../src/sqlite.js";
import { describe, expect, it } from "vitest";

import { importScraperRows } from "../src/repositories/import-batch.js";
import { saveAiCandidateReview } from "../src/repositories/ai-review-workbench.js";
import {
  buildFullReviewExport,
  buildSourcedScraperExport,
  setChildManualPrice,
  setChildExcluded,
  setParentManualPrice,
  setParentExcluded,
  upsertHumanReview,
  upsertSearchCandidate
} from "../src/repositories/export-batch.js";
import { initializeDatabase } from "../src/schema.js";

describe("buildSourcedScraperExport", () => {
  it("exports only sourced ParentSKUs and writes row-level manual prices back to the scraper price column", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", price: "10000" }),
        makeDataRow({ parentSku: "P1", sku: "P1-red-m", price: "10000" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", price: "20000" })
      ]
    });

    const candidate = upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      rank: 1,
      offerUrl: "https://detail.1688.com/offer/123456789.html?spm=a261y.7663282",
      title: "1688 same item",
      imageUrl: "https://cbu01.alicdn.com/img/ibank/example.jpg",
      unitPrice: "12.80",
      monthlySales: 321,
      shopName: "source shop"
    });

    upsertHumanReview(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      reviewStatus: "sourced",
      selectedCandidateId: candidate.candidateId,
      matchingReason: "same item",
      reviewer: "operator-a"
    });
    upsertHumanReview(db, {
      batchId: imported.batchId,
      parentSku: "P2",
      reviewStatus: "no_source",
      matchingReason: "娌℃湁鍚屾",
      reviewer: "operator-a"
    });
    setParentExcluded(db, { batchId: imported.batchId, parentSku: "P2", excluded: true });
    setParentManualPrice(db, { batchId: imported.batchId, parentSku: "P1", manualPrice: "12900" });
    setChildManualPrice(db, { batchId: imported.batchId, sku: "P1-red-m", manualPrice: "13900" });

    const exported = buildSourcedScraperExport(db, imported.batchId);

    expect(exported.parentSkuCount).toBe(1);
    expect(exported.childSkuCount).toBe(2);
    expect(exported.headers.slice(0, 86)).toEqual(makeHeaderRow());
    expect(exported.headers.slice(86).length).toBeGreaterThan(0);
    expect(exported.rows.map((row) => row[0])).toEqual(["P1", "P1"]);
    expect(exported.rows.map((row) => row[12])).toEqual(["12900", "13900"]);

    const firstAppend = appended(exported.headers, exported.rows[0]);
    const secondAppend = appended(exported.headers, exported.rows[1]);
    const statusHeader = String(exported.headers[86]);
    const offerUrlHeader = String(exported.headers[87]);
    const offerIdHeader = String(exported.headers[88]);
    const unitPriceHeader = String(exported.headers[91]);
    const matchingReasonHeader = String(exported.headers[94]);
    const sourcePriceHeader = String(exported.headers[97]);
    const parentManualHeader = String(exported.headers[98]);
    const childManualHeader = String(exported.headers[99]);
    const appliedPriceHeader = String(exported.headers[100]);
    const priceSourceHeader = String(exported.headers[101]);
    const priceChangedHeader = String(exported.headers[102]);
    expect(firstAppend[statusHeader]).toBe("sourced");
    expect(firstAppend[offerUrlHeader]).toBe("https://detail.1688.com/offer/123456789.html");
    expect(firstAppend[offerIdHeader]).toBe("123456789");
    expect(firstAppend[unitPriceHeader]).toBe("12.80");
    expect(firstAppend[matchingReasonHeader]).toBe("same item");
    expect(firstAppend[sourcePriceHeader]).toBe("10000");
    expect(firstAppend[parentManualHeader]).toBe("12900");
    expect(firstAppend[childManualHeader]).toBe("");
    expect(firstAppend[appliedPriceHeader]).toBe("12900");
    expect(firstAppend[priceSourceHeader]).toBe("parentManual");
    expect(firstAppend[priceChangedHeader]).toBe("yes");
    expect(secondAppend[priceSourceHeader]).toBe("childOverride");
  });

  it("exports retained non-deleted SKUs without requiring a sourced review and uses the best AI candidate", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", price: "10000" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", price: "20000" })
      ]
    });

    const weakCandidate = upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      rank: 1,
      offerUrl: "https://detail.1688.com/offer/111111111.html?spm=weak",
      title: "weak candidate",
      unitPrice: "12.80"
    });
    const bestCandidate = upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      rank: 2,
      offerUrl: "https://detail.1688.com/offer/222222222.html?spm=best",
      title: "best candidate",
      unitPrice: "13.60"
    });
    const parentSkuId = db
      .prepare("select id from parent_skus where batch_id = ? and parent_sku = ?")
      .get(imported.batchId, "P1") as { id: number };
    saveAiCandidateReview(db, {
      batchId: imported.batchId,
      parentSkuId: parentSkuId.id,
      candidateId: weakCandidate.candidateId,
      providerName: "zhipu",
      modelName: "glm-4.6v-flashx",
      sameItemProbability: 0.2
    });
    saveAiCandidateReview(db, {
      batchId: imported.batchId,
      parentSkuId: parentSkuId.id,
      candidateId: bestCandidate.candidateId,
      providerName: "zhipu",
      modelName: "glm-4.6v-flashx",
      sameItemProbability: 0.95
    });
    setParentExcluded(db, { batchId: imported.batchId, parentSku: "P2", excluded: true });

    const exported = buildSourcedScraperExport(db, imported.batchId);
    const append = appended(exported.headers, exported.rows[0]);
    const lastHeader = String(exported.headers[exported.headers.length - 1]);

    expect(exported.parentSkuCount).toBe(1);
    expect(exported.childSkuCount).toBe(1);
    expect(exported.rows.map((row) => row[0])).toEqual(["P1"]);
    expect(append["1688_match_status"]).toBe("retained");
    expect(append["1688_offer_url"]).toBe("https://detail.1688.com/offer/222222222.html");
    expect(append["1688_purchase_price"]).toBe("13.60");
    expect(append[lastHeader]).toBe("https://detail.1688.com/offer/222222222.html");
  });

  it("appends the first-ranked 1688 candidate URL as the last uploader column", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", price: "10000" }),
        makeDataRow({ parentSku: "P1", sku: "P1-red-m", price: "10000" })
      ]
    });

    upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      rank: 1,
      offerUrl: "https://detail.1688.com/offer/111111111.html?spm=rank1",
      title: "first candidate"
    });
    const selectedCandidate = upsertSearchCandidate(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      rank: 2,
      offerUrl: "https://detail.1688.com/offer/222222222.html?spm=rank2",
      title: "selected candidate"
    });
    upsertHumanReview(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      reviewStatus: "sourced",
      selectedCandidateId: selectedCandidate.candidateId,
      matchingReason: "manual selected candidate 2"
    });

    const exported = buildSourcedScraperExport(db, imported.batchId);
    const lastHeader = String(exported.headers[exported.headers.length - 1]);
    const firstAppend = appended(exported.headers, exported.rows[0]);
    const secondAppend = appended(exported.headers, exported.rows[1]);

    expect(lastHeader).toBe("首选 1688 链接");
    expect(firstAppend["1688_offer_url"]).toBe("https://detail.1688.com/offer/222222222.html");
    expect(firstAppend[lastHeader]).toBe("https://detail.1688.com/offer/111111111.html");
    expect(secondAppend[lastHeader]).toBe("https://detail.1688.com/offer/111111111.html");
  });

  it("excludes soft-deleted parent and child SKU rows from sourced uploader export", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", price: "10000" }),
        makeDataRow({ parentSku: "P1", sku: "P1-red-m", price: "10000" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", price: "20000" })
      ]
    });

    upsertHumanReview(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      reviewStatus: "sourced",
      matchingReason: "same item"
    });
    upsertHumanReview(db, {
      batchId: imported.batchId,
      parentSku: "P2",
      reviewStatus: "sourced",
      matchingReason: "same item"
    });
    setChildExcluded(db, { batchId: imported.batchId, sku: "P1-red-s", excluded: true });
    setParentExcluded(db, { batchId: imported.batchId, parentSku: "P2", excluded: true });

    const exported = buildSourcedScraperExport(db, imported.batchId);

    expect(exported.parentSkuCount).toBe(1);
    expect(exported.childSkuCount).toBe(1);
    expect(exported.rows.map((row) => row[1])).toEqual(["P1-red-m"]);
  });
});

describe("buildFullReviewExport", () => {
  it("exports every ParentSKU row with review status for audit", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const imported = importScraperRows(db, {
      batchName: "Batch A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", price: "10000" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", price: "20000" }),
        makeDataRow({ parentSku: "P3", sku: "P3-green-s", price: "30000" })
      ]
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
    upsertHumanReview(db, {
      batchId: imported.batchId,
      parentSku: "P1",
      reviewStatus: "sourced",
      selectedCandidateId: candidate.candidateId,
      matchingReason: "manual same item",
      reviewer: "operator-a"
    });
    upsertHumanReview(db, {
      batchId: imported.batchId,
      parentSku: "P2",
      reviewStatus: "no_source",
      matchingReason: "not same item",
      reviewer: "operator-a"
    });
    setParentManualPrice(db, { batchId: imported.batchId, parentSku: "P1", manualPrice: "12900" });

    const exported = buildFullReviewExport(db, imported.batchId);

    expect(exported.parentSkuCount).toBe(3);
    expect(exported.childSkuCount).toBe(3);
    expect(exported.rows.map((row) => row[0])).toEqual(["P1", "P2", "P3"]);
    expect(exported.rows.map((row) => row[12])).toEqual(["10000", "20000", "30000"]);

    const p1 = appended(exported.headers, exported.rows[0]);
    const p2 = appended(exported.headers, exported.rows[1]);
    const p3 = appended(exported.headers, exported.rows[2]);
    const statusHeader = String(exported.headers[86]);
    const offerUrlHeader = String(exported.headers[87]);
    const matchingReasonHeader = String(exported.headers[94]);
    const appliedPriceHeader = String(exported.headers[100]);
    expect(p1[statusHeader]).toBe("sourced");
    expect(p1[offerUrlHeader]).toBe("https://detail.1688.com/offer/123456789.html");
    expect(p1[appliedPriceHeader]).toBe("12900");
    expect(p2[statusHeader]).toBe("no_source");
    expect(p2[matchingReasonHeader]).toBe("not same item");
    expect(p3[statusHeader]).toBe("unreviewed");
  });
});

function appended(headers: unknown[], row: unknown[]): Record<string, unknown> {
  return Object.fromEntries(headers.slice(86).map((header, index) => [String(header), row[86 + index]]));
}

function makeHeaderRow(length = 86): string[] {
  return Array.from({ length }, (_, index) => `H${index + 1}`);
}

function makeDataRow(overrides: {
  parentSku: string;
  sku?: string;
  price?: string;
  sourceUrl?: string;
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

