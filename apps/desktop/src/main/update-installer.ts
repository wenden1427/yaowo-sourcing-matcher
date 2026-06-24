import { appendFileSync, existsSync } from "node:fs";
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
  launcherPath: string;
  logPath: string;
  launcherLogPath: string;
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
  const launcherPath = join(stagingDir, "run-app-asar-update.cmd");
  const logPath = join(stagingDir, "apply-app-asar-update.log");
  const launcherLogPath = join(stagingDir, "apply-app-asar-update.launcher.log");
  const script = buildApplyAppAsarScript({
    currentProcessId: input.currentProcessId,
    downloadUrl: input.updatePackage.url,
    expectedSha256: sha256,
    downloadedPath,
    targetPath,
    backupPath,
    executablePath: input.executablePath,
    logPath
  });
  await writeFile(
    scriptPath,
    Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(script, "utf8")])
  );
  await writeFile(
    launcherPath,
    buildUpdateLauncherScript({
      scriptPath,
      launcherLogPath
    }),
    "utf8"
  );

  const launcher = childProcess.spawn(resolveCmdPath(), ["/d", "/s", "/c", launcherPath], {
    detached: true,
    stdio: "ignore",
    windowsHide: true
  });
  launcher.once("error", (error) => {
    appendLauncherLog(launcherLogPath, `spawn error: ${error instanceof Error ? error.message : String(error)}`);
  });
  launcher.unref();

  return {
    stagingDir,
    downloadedPath,
    scriptPath,
    launcherPath,
    logPath,
    launcherLogPath,
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
  logPath: string;
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
    `$logPath = ${quotePowerShellString(input.logPath)}`,
    "function Write-UpdateLog {",
    "  param([string]$Message)",
    "  $timestamp = Get-Date -Format o",
    "  Add-Content -LiteralPath $logPath -Encoding UTF8 -Value \"$timestamp $Message\"",
    "}",
    "try {",
    "  Write-UpdateLog 'Waiting for current app process to exit.'",
    "  Wait-Process -Id $pidToWait -Timeout 30 -ErrorAction SilentlyContinue",
    "  Start-Sleep -Milliseconds 800",
    "  Write-UpdateLog \"Downloading update package from $downloadUrl\"",
    "  Invoke-WebRequest -Uri $downloadUrl -OutFile $downloadedPath -UseBasicParsing",
    "  $actualSha256 = (Get-FileHash -Algorithm SHA256 -LiteralPath $downloadedPath).Hash.ToLowerInvariant()",
    "  if ($actualSha256 -ne $expectedSha256) {",
    "    throw \"App update sha256 mismatch: expected $expectedSha256, got $actualSha256\"",
    "  }",
    "  Write-UpdateLog 'Update package hash verified.'",
    "  Copy-Item -LiteralPath $targetPath -Destination $backupPath -Force",
    "  Copy-Item -LiteralPath $downloadedPath -Destination $targetPath -Force",
    "  Write-UpdateLog 'app.asar replaced. Restarting app.'",
    "  Start-Process -FilePath $exePath",
    "  Write-UpdateLog 'App restart command issued.'",
    "} catch {",
    "  Write-UpdateLog (\"ERROR: \" + $_.Exception.Message)",
    "  if ((Test-Path -LiteralPath $backupPath) -and (Test-Path -LiteralPath $targetPath)) {",
    "    Copy-Item -LiteralPath $backupPath -Destination $targetPath -Force",
    "    Write-UpdateLog 'Restored app.asar from backup after failure.'",
    "  }",
    "  throw",
    "}"
  ].join("\r\n");
}

export function buildUpdateLauncherScript(input: { scriptPath: string; launcherLogPath: string }): string {
  return [
    "@echo off",
    "setlocal",
    `set "LAUNCHER_LOG=${escapeCmdValue(input.launcherLogPath)}"`,
    `set "UPDATE_SCRIPT=${escapeCmdValue(input.scriptPath)}"`,
    `>>"%LAUNCHER_LOG%" echo [%date% %time%] launcher starting`,
    `set "POWERSHELL_EXE=%SystemRoot%\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"`,
    `if not exist "%POWERSHELL_EXE%" set "POWERSHELL_EXE=powershell.exe"`,
    `>>"%LAUNCHER_LOG%" echo [%date% %time%] using "%POWERSHELL_EXE%"`,
    `start "" /min "%POWERSHELL_EXE%" -NoProfile -ExecutionPolicy Bypass -File "%UPDATE_SCRIPT%"`,
    `>>"%LAUNCHER_LOG%" echo [%date% %time%] start command exit code %ERRORLEVEL%`,
    "endlocal"
  ].join("\r\n");
}

function quotePowerShellString(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function resolveCmdPath(): string {
  return process.env.ComSpec || join(process.env.SystemRoot || "C:\\Windows", "System32", "cmd.exe");
}

function appendLauncherLog(logPath: string, message: string): void {
  try {
    appendFileSync(logPath, `${new Date().toISOString()} ${message}\n`, "utf8");
  } catch {
    // The update attempt must not crash the running app because logging failed.
  }
}

function escapeCmdValue(value: string): string {
  return value.replace(/%/g, "%%");
}
