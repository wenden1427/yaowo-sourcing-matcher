import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";
import * as childProcess from "node:child_process";

import type { AppAsarUpdatePackage } from "./update-service.js";

export interface InstallAppAsarUpdateInput {
  updatePackage: AppAsarUpdatePackage;
  userDataDir: string;
  resourcesPath: string;
  executablePath: string;
  currentProcessId: number;
  fetchImpl?: typeof fetch;
}

export interface InstallAppAsarUpdateResult {
  stagingDir: string;
  downloadedPath: string;
  scriptPath: string;
  targetPath: string;
  backupPath: string;
  sha256: string;
}

export async function installAppAsarUpdate(input: InstallAppAsarUpdateInput): Promise<InstallAppAsarUpdateResult> {
  if (input.updatePackage.type !== "appAsar") {
    throw new Error(`Unsupported update package type: ${input.updatePackage.type}`);
  }

  const stagingDir = join(input.userDataDir, "updater-staging");
  await mkdir(stagingDir, { recursive: true });

  const downloadedPath = join(stagingDir, basename(new URL(input.updatePackage.url).pathname) || "app.asar");
  const sha256 = input.updatePackage.sha256.toLowerCase();

  const targetPath = join(input.resourcesPath, "app.asar");
  if (!existsSync(targetPath)) {
    throw new Error(`Cannot find packaged app.asar at ${targetPath}`);
  }

  const backupPath = join(stagingDir, `app.asar.backup-${Date.now()}`);
  const scriptPath = join(stagingDir, "apply-app-asar-update.ps1");
  await writeFile(
    scriptPath,
    buildApplyAppAsarScript({
      currentProcessId: input.currentProcessId,
      downloadUrl: input.updatePackage.url,
      expectedSha256: sha256,
      downloadedPath,
      targetPath,
      backupPath,
      executablePath: input.executablePath
    }),
    "utf8"
  );

  childProcess.spawn("powershell.exe", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", scriptPath], {
    detached: true,
    stdio: "ignore",
    windowsHide: true
  }).unref();

  return {
    stagingDir,
    downloadedPath,
    scriptPath,
    targetPath,
    backupPath,
    sha256
  };
}

export function buildApplyAppAsarScript(input: {
  currentProcessId: number;
  downloadUrl: string;
  expectedSha256: string;
  downloadedPath: string;
  targetPath: string;
  backupPath: string;
  executablePath: string;
}): string {
  return [
    "$ErrorActionPreference = 'Stop'",
    "$ProgressPreference = 'SilentlyContinue'",
    `$pidToWait = ${input.currentProcessId}`,
    `$downloadUrl = ${quotePowerShellString(input.downloadUrl)}`,
    `$expectedSha256 = ${quotePowerShellString(input.expectedSha256.toLowerCase())}`,
    `$downloadedPath = ${quotePowerShellString(input.downloadedPath)}`,
    `$targetPath = ${quotePowerShellString(input.targetPath)}`,
    `$backupPath = ${quotePowerShellString(input.backupPath)}`,
    `$exePath = ${quotePowerShellString(input.executablePath)}`,
    "try {",
    "  Wait-Process -Id $pidToWait -Timeout 30 -ErrorAction SilentlyContinue",
    "  Start-Sleep -Milliseconds 800",
    "  Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadedPath -UseBasicParsing",
    "  $actualSha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $downloadedPath).Hash.ToLowerInvariant()",
    "  if ($actualSha256 -ne $expectedSha256) {",
    "    throw \"App update sha256 mismatch: expected $expectedSha256, got $actualSha256\"",
    "  }",
    "  Copy-Item -LiteralPath $targetPath -Destination $backupPath -Force",
    "  Copy-Item -LiteralPath $downloadedPath -Destination $targetPath -Force",
    "  Start-Process -FilePath $exePath",
    "} catch {",
    "  if ((Test-Path -LiteralPath $backupPath) -and (Test-Path -LiteralPath $targetPath)) {",
    "    Copy-Item -LiteralPath $backupPath -Destination $targetPath -Force",
    "  }",
    "  throw",
    "}"
  ].join("\r\n");
}

function quotePowerShellString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}
