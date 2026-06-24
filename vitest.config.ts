import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@yaowo/core/pricing/korea": resolve(rootDir, "packages/core/src/pricing/korea.ts"),
      "@yaowo/core": resolve(rootDir, "packages/core/src/index.ts"),
      "@yaowo/db": resolve(rootDir, "packages/db/src/index.ts"),
      "@yaowo/shared": resolve(rootDir, "packages/shared/src/index.ts")
    }
  },
  test: {
    include: ["packages/**/*.test.ts", "apps/**/*.test.tsx", "apps/**/*.test.ts", "tools/**/*.test.ts"],
    globals: false,
    setupFiles: ["./apps/desktop/tests/setup.ts"],
    environmentMatchGlobs: [["apps/desktop/**", "jsdom"]]
  }
});
