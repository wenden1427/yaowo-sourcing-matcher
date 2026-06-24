import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it, vi } from "vitest";

import { buildApplyAppAsarScript, installAppAsarUpdate } from "../src/main/update-installer.js";

vi.mock("node:child_process", () => ({
  spawn: vi.fn(() => ({ unref: vi.fn() }))
}));

const tempDirs: string[] = [];

afterEach(async () => {
  await Promise.all(tempDirs.map((dir) => rm(dir, { recursive: true, force: true })));
  tempDirs.length = 0;
});

describe("app.asar update installer", () => {
  it("stages a PowerShell script that downloads, verifies, and replaces app.asar after quit", async () => {
    const tempDir = await mkdtemp(join(tmpdir(), "yaowo-updater-"));
    tempDirs.push(tempDir);
    const resourcesPath = join(tempDir, "resources");
    await mkdir(resourcesPath, { recursive: true });
    await writeFile(join(resourcesPath, ".keep"), "");
    await writeFile(join(resourcesPath, "app.asar"), "old app");

    const fetchImpl = vi.fn();
    const result = await installAppAsarUpdate({
      updatePackage: {
        type: "appAsar",
        url: "https://raw.githubusercontent.com/wenden1427/yaowo-sourcing-matcher/main/desktop-update/resources/app.asar",
        sha256: "abc123"
      },
      userDataDir: tempDir,
      resourcesPath,
      executablePath: "C:\\Program Files\\Yaowo\\耀我货源匹配.exe",
      currentProcessId: 123,
      fetchImpl
    });

    await expect(stat(result.downloadedPath)).rejects.toThrow();
    const scriptBytes = await readFile(result.scriptPath);
    expect(Array.from(scriptBytes.subarray(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    const script = scriptBytes.toString("utf8");
    expect(script).toContain("Wait-Process -Id $pidToWait");
    expect(script).toContain("Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadedPath");
    expect(script).toContain("Get-FileHash -Algorithm SHA256");
    expect(script).toContain("Write-UpdateLog");
    expect(script).toContain("App update sha256 mismatch");
    expect(result.logPath).toContain("apply-app-asar-update.log");
    expect(result.sha256).toBe("abc123");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("quotes PowerShell paths safely", () => {
    const script = buildApplyAppAsarScript({
      currentProcessId: 1,
      downloadUrl: "https://example.test/app.asar",
      expectedSha256: "abc123",
      downloadedPath: "C:\\Temp\\yaowo's\\app.asar",
      targetPath: "C:\\App\\resources\\app.asar",
      backupPath: "C:\\Temp\\backup.asar",
      logPath: "C:\\Temp\\update.log",
      executablePath: "C:\\App\\耀我货源匹配.exe"
    });

    expect(script).toContain("'C:\\Temp\\yaowo''s\\app.asar'");
  });
});
