import type { DatabaseConnection } from "./sqlite.js";

export const SCHEMA_VERSION = 1;

export function initializeDatabase(db: DatabaseConnection): void {
  db.pragma("foreign_keys = ON");
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");

  db.exec(`
    create table if not exists schema_migrations (
      version integer primary key,
      applied_at text not null default (datetime('now'))
    );

    create table if not exists batches (
      id integer primary key,
      name text not null,
      source_path text not null,
      original_header_json text,
      status text not null,
      imported_at text not null default (datetime('now')),
      completed_at text,
      archived_at text,
      settings_snapshot_id integer
    );

    create table if not exists settings_snapshots (
      id integer primary key,
      batch_id integer,
      snapshot_json text not null,
      created_at text not null default (datetime('now')),
      foreign key (batch_id) references batches(id) on delete cascade
    );

    create table if not exists parent_skus (
      id integer primary key,
      batch_id integer not null,
      parent_sku text not null,
      source_title text,
      source_product_tag text,
      source_url text,
      source_main_image_url text,
      default_search_image_url text,
      default_search_image_source text,
      search_keyword_zh text,
      manual_price text,
      is_excluded integer not null default 0,
      original_row_start integer,
      original_row_end integer,
      import_status text not null default 'imported',
      created_at text not null default (datetime('now')),
      unique (batch_id, parent_sku),
      foreign key (batch_id) references batches(id) on delete cascade
    );

    create table if not exists child_skus (
      id integer primary key,
      batch_id integer not null,
      parent_sku_id integer not null,
      sku text not null,
      color text,
      size text,
      source_price text,
      manual_price text,
      is_excluded integer not null default 0,
      variant_image_url text,
      original_row_index integer,
      original_row_json text,
      created_at text not null default (datetime('now')),
      unique (batch_id, sku),
      foreign key (batch_id) references batches(id) on delete cascade,
      foreign key (parent_sku_id) references parent_skus(id) on delete cascade
    );

    create table if not exists search_jobs (
      id integer primary key,
      batch_id integer not null,
      parent_sku_id integer not null,
      status text not null,
      search_image_url text,
      error_code text,
      error_message text,
      started_at text,
      finished_at text,
      retry_count integer not null default 0,
      unique (batch_id, parent_sku_id),
      foreign key (batch_id) references batches(id) on delete cascade,
      foreign key (parent_sku_id) references parent_skus(id) on delete cascade
    );

    create table if not exists search_candidates (
      id integer primary key,
      batch_id integer not null,
      parent_sku_id integer not null,
      rank integer not null,
      offer_id text,
      offer_url text not null,
      title text,
      image_url text,
      unit_price text,
      monthly_sales integer,
      shop_name text,
      raw_json text,
      created_at text not null default (datetime('now')),
      unique (batch_id, parent_sku_id, rank),
      foreign key (batch_id) references batches(id) on delete cascade,
      foreign key (parent_sku_id) references parent_skus(id) on delete cascade
    );

    create table if not exists human_reviews (
      id integer primary key,
      batch_id integer not null,
      parent_sku_id integer not null,
      review_status text not null,
      selected_candidate_id integer,
      manual_1688_offer_id text,
      manual_1688_url text,
      matching_reason text,
      reviewer text,
      reviewed_at text,
      unique (batch_id, parent_sku_id),
      foreign key (batch_id) references batches(id) on delete cascade,
      foreign key (parent_sku_id) references parent_skus(id) on delete cascade,
      foreign key (selected_candidate_id) references search_candidates(id) on delete set null
    );

    create table if not exists pricing_drafts (
      id integer primary key,
      batch_id integer not null,
      parent_sku_id integer not null,
      draft_json text not null,
      updated_at text not null default (datetime('now')),
      unique (batch_id, parent_sku_id),
      foreign key (batch_id) references batches(id) on delete cascade,
      foreign key (parent_sku_id) references parent_skus(id) on delete cascade
    );

    create table if not exists ai_reviews (
      id integer primary key,
      batch_id integer not null,
      parent_sku_id integer not null,
      candidate_id integer,
      provider_name text,
      model_name text,
      same_item_probability real,
      matching_reason text,
      risk_points text,
      error_message text,
      raw_json text,
      created_at text not null default (datetime('now')),
      foreign key (batch_id) references batches(id) on delete cascade,
      foreign key (parent_sku_id) references parent_skus(id) on delete cascade,
      foreign key (candidate_id) references search_candidates(id) on delete cascade
    );

    create table if not exists cache_files (
      id integer primary key,
      batch_id integer,
      source_type text not null,
      source_id integer,
      original_url text not null,
      local_path text not null,
      sha256 text,
      byte_size integer,
      refcount integer not null default 0,
      pinned integer not null default 0,
      last_accessed_at text not null default (datetime('now')),
      created_at text not null default (datetime('now')),
      unique (original_url),
      foreign key (batch_id) references batches(id) on delete set null
    );

    insert or ignore into schema_migrations (version) values (${SCHEMA_VERSION});
  `);

  ensureColumn(db, "parent_skus", "source_title", "text");
  ensureColumn(db, "parent_skus", "source_product_tag", "text");
  ensureColumn(db, "parent_skus", "search_keyword_zh", "text");
  ensureColumn(db, "parent_skus", "is_excluded", "integer not null default 0");
  ensureColumn(db, "child_skus", "is_excluded", "integer not null default 0");
}

function ensureColumn(db: DatabaseConnection, table: string, column: string, definition: string): void {
  const columns = db.prepare(`pragma table_info(${table})`).all() as Array<{ name: string }>;
  if (columns.some((entry) => entry.name === column)) {
    return;
  }

  db.prepare(`alter table ${table} add column ${column} ${definition}`).run();
}

