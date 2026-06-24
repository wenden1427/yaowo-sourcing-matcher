import Database from "../src/sqlite.js";
import { describe, expect, it } from "vitest";

import { initializeDatabase } from "../src/schema.js";

describe("initializeDatabase", () => {
  it("creates the Phase 1 core tables", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const tableNames = db
      .prepare("select name from sqlite_master where type = 'table' order by name")
      .all()
      .map((row) => (row as { name: string }).name);

    expect(tableNames).toEqual([
      "ai_reviews",
      "batches",
      "cache_files",
      "child_skus",
      "human_reviews",
      "parent_skus",
      "pricing_drafts",
      "schema_migrations",
      "search_candidates",
      "search_jobs",
      "settings_snapshots"
    ]);
  });

  it("enables foreign keys and WAL-friendly pragmas", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    expect(db.pragma("foreign_keys", { simple: true })).toBe(1);
    expect(db.pragma("journal_mode", { simple: true })).toBe("memory");
    expect(db.pragma("busy_timeout", { simple: true })).toBe(5000);
  });

  it("enforces idempotent parent and child SKU keys per batch", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const batchId = db
      .prepare("insert into batches (name, source_path, status) values (?, ?, ?) returning id")
      .get("Batch A", "input.xlsx", "imported") as { id: number };

    db.prepare("insert into parent_skus (batch_id, parent_sku, source_url) values (?, ?, ?)").run(
      batchId.id,
      "P1",
      "https://example.com/item"
    );

    expect(() =>
      db.prepare("insert into parent_skus (batch_id, parent_sku, source_url) values (?, ?, ?)").run(
        batchId.id,
        "P1",
        "https://example.com/item2"
      )
    ).toThrow();

    db.prepare("insert into child_skus (batch_id, parent_sku_id, sku, color, size) values (?, ?, ?, ?, ?)").run(
      batchId.id,
      1,
      "SKU-1",
      "Black",
      "S"
    );

    expect(() =>
      db.prepare("insert into child_skus (batch_id, parent_sku_id, sku, color, size) values (?, ?, ?, ?, ?)").run(
        batchId.id,
        1,
        "SKU-1",
        "Black",
        "M"
      )
    ).toThrow();
  });

  it("keeps AI reviews separate from human authoritative review state", () => {
    const db = new Database(":memory:");
    initializeDatabase(db);

    const aiColumns = columnNames(db, "ai_reviews");
    const humanColumns = columnNames(db, "human_reviews");

    expect(aiColumns).toContain("same_item_probability");
    expect(aiColumns).toContain("model_name");
    expect(aiColumns).not.toContain("review_status");

    expect(humanColumns).toContain("review_status");
    expect(humanColumns).toContain("selected_candidate_id");
    expect(humanColumns).not.toContain("same_item_probability");
  });
});

function columnNames(db: Database, table: string): string[] {
  return db
    .prepare(`pragma table_info(${table})`)
    .all()
    .map((row) => (row as { name: string }).name);
}

