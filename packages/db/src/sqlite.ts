import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { DatabaseSync } = require("node:sqlite") as {
  DatabaseSync: new (path: string) => RawDatabaseSync;
};

export interface RunResult {
  changes: number;
  lastInsertRowid: number | bigint;
}

export interface Statement {
  get(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
  run(...params: unknown[]): RunResult;
}

export interface DatabaseConnection {
  close(): void;
  exec(sql: string): void;
  prepare(sql: string): Statement;
  pragma(sql: string, options?: { simple?: boolean }): unknown;
  transaction<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => TResult): (...args: TArgs) => TResult;
}

interface RawDatabaseSync {
  close(): void;
  exec(sql: string): void;
  prepare(sql: string): RawStatementSync;
}

interface RawStatementSync {
  get(...params: unknown[]): unknown;
  all(...params: unknown[]): unknown[];
  run(...params: unknown[]): RunResult;
}

export default class Database implements DatabaseConnection {
  private readonly db: RawDatabaseSync;

  constructor(path: string) {
    this.db = new DatabaseSync(path);
  }

  close(): void {
    this.db.close();
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }

  prepare(sql: string): Statement {
    const statement = this.db.prepare(sql);
    return {
      get(...params: unknown[]): unknown {
        return statement.get(...params) ?? undefined;
      },
      all(...params: unknown[]): unknown[] {
        return statement.all(...params);
      },
      run(...params: unknown[]): RunResult {
        return statement.run(...params);
      }
    };
  }

  pragma(sql: string, options?: { simple?: boolean }): unknown {
    const rows = this.prepare(`pragma ${sql}`).all() as Array<Record<string, unknown>>;
    if (!options?.simple) {
      return rows;
    }
    const firstRow = rows[0];
    if (!firstRow) {
      return undefined;
    }
    return Object.values(firstRow)[0];
  }

  transaction<TArgs extends unknown[], TResult>(fn: (...args: TArgs) => TResult): (...args: TArgs) => TResult {
    return (...args: TArgs) => {
      this.exec("begin");
      try {
        const result = fn(...args);
        this.exec("commit");
        return result;
      } catch (error) {
        this.exec("rollback");
        throw error;
      }
    };
  }
}
