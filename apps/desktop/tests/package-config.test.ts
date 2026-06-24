import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "../../..");

describe("desktop package configuration", () => {
  it("defines a root packaging script for the Windows desktop app", () => {
    const rootPackageJson = readJson("package.json");

    expect(rootPackageJson.main).toBe("apps/desktop/dist/src/main/main.js");
    expect(rootPackageJson.scripts["clean:release"]).toBe("tsx scripts/clean-release.ts");
    expect(rootPackageJson.scripts["prepare:desktop-resources"]).toBe("tsx scripts/prepare-desktop-resources.ts");
    expect(rootPackageJson.scripts["package:desktop"]).toBe(
      "npm run clean:release && npm run prepare:desktop-resources && npm run build && electron-builder --win zip --publish never"
    );
    expect(rootPackageJson.devDependencies["electron-builder"]).toBeDefined();
  });

  it("configures electron-builder for portable and zip Windows artifacts", () => {
    const rootPackageJson = readJson("package.json");
    const build = rootPackageJson.build;

    expect(build.appId).toBe("com.yaowo.sourcingmatcher");
    expect(build.productName).toBe("耀我货源匹配");
    expect(build.directories.output).toBe("release/desktop");
    expect(build.artifactName).toBe("${productName}.${ext}");
    expect(build.win.target).toEqual(["zip"]);
    expect(build.files).toEqual(
      expect.arrayContaining([
        "apps/desktop/dist/**/*",
        "apps/desktop/resources/**/*",
        "packages/*/dist/**/*",
        "tools/1688-image-search-worker/dist/**/*",
        "package.json"
      ])
    );
  });

  it("keeps Electron and Vite tooling out of production dependencies", () => {
    const desktopPackageJson = readJson("apps/desktop/package.json");

    expect(desktopPackageJson.dependencies.electron).toBeUndefined();
    expect(desktopPackageJson.dependencies.vite).toBeUndefined();
    expect(desktopPackageJson.dependencies["@vitejs/plugin-react"]).toBeUndefined();
    expect(desktopPackageJson.devDependencies.electron).toBeDefined();
    expect(desktopPackageJson.devDependencies.vite).toBeDefined();
    expect(desktopPackageJson.devDependencies["@vitejs/plugin-react"]).toBeDefined();
  });

  it("cleans stale renderer assets before every Vite build", () => {
    const viteConfig = readFileSync(join(root, "apps/desktop/vite.config.ts"), "utf8");

    expect(viteConfig).toContain("emptyOutDir: true");
  });

  it("uses relative renderer asset paths for packaged file loading", () => {
    const viteConfig = readFileSync(join(root, "apps/desktop/vite.config.ts"), "utf8");

    expect(viteConfig).toContain('base: "./"');
  });

  it("removes the default Electron application menu", () => {
    const mainSource = readFileSync(join(root, "apps/desktop/src/main/main.ts"), "utf8");

    expect(mainSource).toContain("Menu.setApplicationMenu(null)");
  });
});

function readJson(relativePath: string): Record<string, any> {
  return JSON.parse(readFileSync(join(root, relativePath), "utf8"));
}
