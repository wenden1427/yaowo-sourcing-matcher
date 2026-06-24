import { normalize } from "node:path";

import { describe, expect, it } from "vitest";

import { moduleDirFromImportMetaUrl, resolvePreloadPath, resolveRendererIndexPath } from "../src/main/paths.js";

describe("Electron built asset paths", () => {
  it("resolves preload next to the compiled main source tree", () => {
    const mainDir = "E:/app/apps/desktop/dist/src/main";

    expect(normalize(resolvePreloadPath(mainDir))).toBe(normalize("E:/app/apps/desktop/dist/src/preload/preload.cjs"));
  });

  it("resolves renderer index from the Vite output directory", () => {
    const mainDir = "E:/app/apps/desktop/dist/src/main";

    expect(normalize(resolveRendererIndexPath(mainDir))).toBe(normalize("E:/app/apps/desktop/dist/renderer/index.html"));
  });

  it("derives an ESM module directory from import.meta.url", () => {
    const moduleUrl = "file:///E:/app/apps/desktop/dist/src/main/main.js";

    expect(normalize(moduleDirFromImportMetaUrl(moduleUrl))).toBe(normalize("E:/app/apps/desktop/dist/src/main"));
  });
});
