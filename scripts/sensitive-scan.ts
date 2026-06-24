import { readFileSync, readdirSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";
import { classifySensitiveText, isDeniedProjectPath } from "../packages/shared/src/security/denylist.js";

const root = process.cwd();
const findings: string[] = [];
const fallbackSourceRoots = [
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "tsconfig.base.json",
  "vitest.config.ts",
  "config",
  "scripts",
  "packages",
  "tools/1688-image-search-worker/package.json",
  "tools/1688-image-search-worker/tsconfig.json",
  "tools/1688-image-search-worker/src",
  "tools/1688-image-search-worker/tests"
];

const gitCandidates = getGitCandidatePaths();
if (gitCandidates) {
  for (const projectPath of gitCandidates) {
    scanCandidate(projectPath);
  }
} else {
  for (const sourceRoot of fallbackSourceRoots) {
    scanCandidate(sourceRoot);
  }
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exitCode = 1;
}

function getGitCandidatePaths(): string[] | null {
  try {
    execFileSync("git", ["rev-parse", "--is-inside-work-tree"], { cwd: root, stdio: "ignore" });
    const output = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
      cwd: root
    }).toString("utf8");
    return output.split("\0").filter(Boolean);
  } catch {
    return null;
  }
}

function scanCandidate(projectPath: string): void {
  if (isDeniedProjectPath(projectPath)) {
    findings.push(`DENIED_PATH ${projectPath}`);
    return;
  }

  const absolutePath = join(root, projectPath);
  let stat;
  try {
    stat = statSync(absolutePath);
  } catch {
    return;
  }

  if (stat.isDirectory()) {
    scanDirectory(absolutePath);
    return;
  }

  if (stat.isFile()) {
    scanFile(absolutePath);
  }
}

function scanDirectory(directory: string): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = join(directory, entry.name);
    const projectPath = relative(root, absolutePath) || entry.name;

    if (isDeniedProjectPath(projectPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      scanDirectory(absolutePath);
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    scanFile(absolutePath);
  }
}

function scanFile(absolutePath: string): void {
  const projectPath = relative(root, absolutePath);
  const stat = statSync(absolutePath);
  if (stat.size > 1024 * 1024) {
    return;
  }

  const text = readFileSync(absolutePath, "utf8");
  for (const finding of classifySensitiveText(text)) {
    findings.push(`SECRET_TEXT ${projectPath} ${finding.kind} ${finding.preview}`);
  }
}
