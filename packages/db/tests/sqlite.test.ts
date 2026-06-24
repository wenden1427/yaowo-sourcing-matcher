import Database from "../src/sqlite.js";
import { describe, expect, it } from "vitest";

describe("SQLite adapter", () => {
  it("supports the synchronous database API used by repositories", () => {
    const db = new Database(":memory:");

    db.pragma("foreign_keys = ON");
    expect(db.pragma("foreign_keys", { simple: true })).toBe(1);

    db.exec("create table items (id integer primary key, name text not null)");
    const insert = db.prepare("insert into items (name) values (?) returning id");
    expect(insert.get("alpha")).toEqual({ id: 1 });

    const insertMany = db.transaction((names: string[]) => {
      for (const name of names) {
        db.prepare("insert into items (name) values (?)").run(name);
      }
      return db.prepare("select count(*) as count from items").get() as { count: number };
    });

    expect(insertMany(["beta", "gamma"])).toEqual({ count: 3 });
    expect(db.prepare("select name from items order by id").all()).toEqual([
      { name: "alpha" },
      { name: "beta" },
      { name: "gamma" }
    ]);

    db.close();
  });
});

