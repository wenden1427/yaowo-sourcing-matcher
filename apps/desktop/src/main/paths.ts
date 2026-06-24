import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export function moduleDirFromImportMetaUrl(importMetaUrl: string): string {
  return dirname(fileURLToPath(importMetaUrl));
}

export function resolvePreloadPath(compiledMainDir: string): string {
  return join(compiledMainDir, "../preload/preload.cjs");
}

export function resolveRendererIndexPath(compiledMainDir: string): string {
  return join(compiledMainDir, "../../renderer/index.html");
}
