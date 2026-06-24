import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

describe("workspace package runtime entries", () => {
  it("points package main fields at the TypeScript build output", () => {
    const packages = [
      ["packages/shared/package.json", "dist/src/index.js"],
      ["packages/core/package.json", "dist/src/index.js"],
      ["packages/db/package.json", "dist/src/index.js"],
      ["tools/1688-image-search-worker/package.json", "dist/src/worker.js"],
      ["apps/desktop/package.json", "dist/src/main/main.js"]
    ];

    for (const [packagePath, expectedMain] of packages) {
      const pkg = JSON.parse(readFileSync(join(process.cwd(), packagePath), "utf8")) as { main: string };
      expect(pkg.main, packagePath).toBe(expectedMain);
    }
  });
});
