import Database from "../src/sqlite.js";
import { describe, expect, it } from "vitest";

import { importScraperRows } from "../src/repositories/import-batch.js";
import { initializeDatabase } from "../src/schema.js";

describe("importScraperRows", () => {
  it("creates a batch with grouped ParentSKUs and child SKUs", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const result = importScraperRows(db, {
      batchName: "Import A",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1-red-s.jpg" }),
        makeDataRow({ parentSku: "P1", sku: "P1-red-m", variantImage: "https://img.example.com/p1-red-m.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2-blue-s.jpg" })
      ]
    });

    expect(result).toEqual({
      batchId: 1,
      parentSkuCount: 2,
      childSkuCount: 3
    });

    expect(db.prepare("select count(*) as count from parent_skus").get()).toEqual({ count: 2 });
    expect(db.prepare("select count(*) as count from child_skus").get()).toEqual({ count: 3 });
    expect(
      db
        .prepare(
          "select parent_sku, source_title, source_product_tag, default_search_image_url, default_search_image_source from parent_skus order by id"
        )
        .all()
    ).toEqual([
      {
        parent_sku: "P1",
        source_title: "Acrylic hamster cage",
        source_product_tag: "pet cage hamster transparent acrylic",
        default_search_image_url: "https://img.example.com/p1-red-s.jpg",
        default_search_image_source: "childVariantImage"
      },
      {
        parent_sku: "P2",
        source_title: "Acrylic hamster cage",
        source_product_tag: "pet cage hamster transparent acrylic",
        default_search_image_url: "https://img.example.com/p2-blue-s.jpg",
        default_search_image_source: "childVariantImage"
      }
    ]);
  });

  it("falls back to source main image when a ParentSKU has no variant images", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    importScraperRows(db, {
      batchName: "Import B",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({
          parentSku: "P1",
          sku: "P1-default",
          mainImage: "https://img.example.com/main.jpg",
          variantImage: ""
        })
      ]
    });

    expect(
      db.prepare("select default_search_image_url, default_search_image_source from parent_skus").get()
    ).toEqual({
      default_search_image_url: "https://img.example.com/main.jpg",
      default_search_image_source: "sourceMainImage"
    });
  });

  it("uses source main image as the default search image for Shein imports", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    importScraperRows(db, {
      batchName: "Shein Import",
      sourcePath: "input.xlsx",
      sourcePlatform: "shein",
      rows: [
        makeHeaderRow(),
        makeDataRow({
          parentSku: "P1",
          sku: "P1-default",
          mainImage: "https://img.example.com/shein-main.jpg",
          variantImage: "https://img.example.com/child-variant.jpg"
        })
      ]
    });

    expect(
      db.prepare("select default_search_image_url, default_search_image_source from parent_skus").get()
    ).toEqual({
      default_search_image_url: "https://img.example.com/shein-main.jpg",
      default_search_image_source: "sourceMainImage"
    });
  });

  it("can append new SKUs into an existing batch or replace the current workspace", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const first = importScraperRows(db, {
      batchName: "Import A",
      sourcePath: "a.xlsx",
      rows: [makeHeaderRow(), makeDataRow({ parentSku: "P1", sku: "P1-red-s" })]
    });

    const appended = importScraperRows(db, {
      batchName: "Import B",
      sourcePath: "b.xlsx",
      importMode: "append",
      targetBatchId: first.batchId,
      rows: [makeHeaderRow(), makeDataRow({ parentSku: "P2", sku: "P2-blue-s" })]
    });

    expect(appended.batchId).toBe(first.batchId);
    expect(db.prepare("select count(*) as count from batches").get()).toEqual({ count: 1 });
    expect(db.prepare("select count(*) as count from parent_skus").get()).toEqual({ count: 2 });

    const replaced = importScraperRows(db, {
      batchName: "Import C",
      sourcePath: "c.xlsx",
      importMode: "replace",
      rows: [makeHeaderRow(), makeDataRow({ parentSku: "P3", sku: "P3-green-s" })]
    });

    expect(replaced.batchId).toBeGreaterThan(0);
    expect(db.prepare("select count(*) as count from batches").get()).toEqual({ count: 1 });
    expect(db.prepare("select parent_sku from parent_skus").all()).toEqual([{ parent_sku: "P3" }]);
  });

  it("merges non-contiguous ParentSKU rows instead of rejecting real scraper order", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const result = importScraperRows(db, {
      batchName: "Import C",
      sourcePath: "input.xlsx",
      rows: [
        makeHeaderRow(),
        makeDataRow({ parentSku: "P1", sku: "P1-red-s", variantImage: "https://img.example.com/p1-red-s.jpg" }),
        makeDataRow({ parentSku: "P2", sku: "P2-blue-s", variantImage: "https://img.example.com/p2-blue-s.jpg" }),
        makeDataRow({ parentSku: "P1", sku: "P1-red-m", variantImage: "https://img.example.com/p1-red-m.jpg" })
      ]
    });

    expect(result).toEqual({
      batchId: 1,
      parentSkuCount: 2,
      childSkuCount: 3
    });
    expect(db.prepare("select count(*) as count from parent_skus where parent_sku = 'P1'").get()).toEqual({ count: 1 });
    expect(
      db.prepare("select sku, original_row_index from child_skus where sku like 'P1-%' order by original_row_index").all()
    ).toEqual([
      { sku: "P1-red-s", original_row_index: 2 },
      { sku: "P1-red-m", original_row_index: 4 }
    ]);
  });

  it("rejects malformed scraper rows before writing a batch", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    expect(() =>
      importScraperRows(db, {
        batchName: "Bad Import",
        sourcePath: "bad.xlsx",
        rows: [makeHeaderRow(40)]
      })
    ).toThrow("preflight");

    expect(db.prepare("select count(*) as count from batches").get()).toEqual({ count: 0 });
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
  row[11] = overrides.sourceUrl ?? "https://www.aliexpress.com/item/100500.html";
  row[12] = overrides.price ?? "10000";
  row[17] = overrides.mainImage ?? "https://img.example.com/main.jpg";
  row[40] = overrides.variantImage ?? "https://img.example.com/variant.jpg";
  row[66] = "https://img.example.com/detail-1.jpg";
  return row;
}

