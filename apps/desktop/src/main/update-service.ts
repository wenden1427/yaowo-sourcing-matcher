export interface GithubUpdateCheckInput {
  repository: string;
  currentVersion: string;
  branch?: string;
  fetchImpl?: typeof fetch;
}

export interface GithubUpdateCheckResult {
  repository: string;
  currentVersion: string;
  latestVersion: string;
  updateAvailable: boolean;
  releaseUrl: string;
  downloadUrl: string;
  packageType: "appAsar" | "zip";
  updatePackage: AppAsarUpdatePackage | null;
  releaseName: string;
  publishedAt: string;
  notes: string;
}

export interface AppAsarUpdatePackage {
  type: "appAsar";
  url: string;
  sha256: string;
  size?: number;
}

const DEFAULT_BRANCH = "main";
const DESKTOP_VERSION_FILE = "desktop-version.txt";
const DESKTOP_APP_ASAR_SHA256_PATH = "desktop-update/resources/app.asar.sha256";

export async function checkGithubUpdate(input: GithubUpdateCheckInput): Promise<GithubUpdateCheckResult> {
  const repository = normalizeRepository(input.repository);
  const branch = normalizeBranch(input.branch);
  const fetchImpl = input.fetchImpl ?? fetch;
  const latestVersion = normalizeVersion(await fetchText(fetchImpl, contentUrl(repository, branch, DESKTOP_VERSION_FILE)));
  if (!latestVersion) {
    throw new Error("GitHub desktop version marker is empty");
  }

  const currentVersion = normalizeVersion(input.currentVersion);
  const updateAvailable = isNewerVersion(latestVersion, currentVersion);
  const appAsarUrl = releaseAppAsarUrl(repository, latestVersion);
  const updatePackage = updateAvailable
    ? {
        type: "appAsar" as const,
        url: appAsarUrl,
        sha256: parseSha256(await fetchText(fetchImpl, contentUrl(repository, branch, DESKTOP_APP_ASAR_SHA256_PATH)))
      }
    : null;

  return {
    repository,
    currentVersion: input.currentVersion,
    latestVersion,
    updateAvailable,
    releaseUrl: `https://github.com/${repository}`,
    downloadUrl: updatePackage?.url || `https://github.com/${repository}`,
    packageType: "appAsar",
    updatePackage,
    releaseName: latestVersion,
    publishedAt: "",
    notes: "Repository desktop update package"
  };
}

export function normalizeRepository(value: string): string {
  const normalized = value.trim().replace(/^https:\/\/github\.com\//i, "").replace(/\/+$/g, "");
  if (!/^[\w.-]+\/[\w.-]+$/.test(normalized)) {
    throw new Error(`Invalid GitHub repository: ${value}`);
  }
  return normalized;
}

function normalizeBranch(value?: string): string {
  const normalized = (value || DEFAULT_BRANCH).trim();
  if (!/^[\w./-]+$/.test(normalized)) {
    throw new Error(`Invalid GitHub branch: ${value}`);
  }
  return normalized;
}

function contentUrl(repository: string, branch: string, path: string): string {
  return `https://api.github.com/repos/${repository}/contents/${path}?ref=${encodeURIComponent(branch)}`;
}

function releaseAppAsarUrl(repository: string, version: string): string {
  return `https://github.com/${repository}/releases/download/v${version}/yaowo-sourcing-matcher-v${version}-app.asar`;
}

async function fetchText(fetchImpl: typeof fetch, url: string): Promise<string> {
  const response = await fetchImpl(url, {
    headers: {
      Accept: "application/vnd.github.raw,text/plain,application/octet-stream",
      "User-Agent": "yaowo-sourcing-matcher-updater"
    }
  });
  if (!response.ok) {
    throw new Error(`GitHub desktop update file download failed: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

function normalizeVersion(value: string): string {
  return value.trim().replace(/^v/i, "");
}

function parseSha256(value: string): string {
  const match = value.trim().match(/([a-f0-9]{64})/i);
  if (!match) {
    throw new Error("GitHub desktop update sha256 marker is invalid");
  }
  return match[1].toLowerCase();
}

function isNewerVersion(latestVersion: string, currentVersion: string): boolean {
  const latestParts = latestVersion.split(".").map((part) => Number.parseInt(part, 10));
  const currentParts = currentVersion.split(".").map((part) => Number.parseInt(part, 10));
  for (let index = 0; index < Math.max(latestParts.length, currentParts.length); index += 1) {
    const latest = Number.isFinite(latestParts[index]) ? latestParts[index] : 0;
    const current = Number.isFinite(currentParts[index]) ? currentParts[index] : 0;
    if (latest > current) {
      return true;
    }
    if (latest < current) {
      return false;
    }
  }
  return false;
}
