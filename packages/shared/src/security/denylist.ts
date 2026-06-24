export interface DenylistRule {
  id: string;
  description: string;
  matches: (normalizedProjectPath: string) => boolean;
}

export interface SensitiveTextFinding {
  kind: "github-token" | "openai-key" | "generic-api-key";
  index: number;
  preview: string;
}

const SEGMENT_DENYLIST = new Set([
  ".runtime",
  ".codex",
  ".codegraph",
  "runtime",
  "archives",
  "context_store",
  "node_modules",
  "dist",
  "build",
  "out",
  "coverage",
  "cache",
  "logs",
  "backups",
  "browser-profiles",
  "profiles",
  "release",
  "releases",
  "artifacts",
  "tmp",
  "temp",
  "updater-staging",
  "staging",
  "update-backups"
]);

const DENIED_EXTENSIONS = [
  ".db",
  ".sqlite",
  ".sqlite3",
  ".db-wal",
  ".db-shm",
  ".log",
  ".zip",
  ".7z",
  ".rar",
  ".pem",
  ".key",
  ".pfx",
  ".p12"
];

export const DEFAULT_DENYLIST_RULES: DenylistRule[] = [
  {
    id: "known-local-credentials",
    description: "Known local credential file must never enter git or release packages.",
    matches: (path) => path === "context_store/credentials.md"
  },
  {
    id: "credential-like-name",
    description: "Credential or secret-like filenames are blocked by default.",
    matches: (path) => path.split("/").some((part) => part.includes("credentials") || part.includes("secret"))
  },
  {
    id: "generated-or-private-directory",
    description: "Generated outputs, local runtime data, caches, logs, backups, and browser profiles are blocked.",
    matches: (path) => path.split("/").some((part) => SEGMENT_DENYLIST.has(part))
  },
  {
    id: "generated-or-sensitive-extension",
    description: "Database, archive, log, and private-key file extensions are blocked.",
    matches: (path) => DENIED_EXTENSIONS.some((ext) => path.endsWith(ext))
  }
];

export function normalizeProjectPath(projectPath: string): string {
  return projectPath
    .replace(/^[A-Za-z]:[\\/]/, "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "")
    .replace(/\/+/g, "/")
    .toLowerCase();
}

export function isDeniedProjectPath(projectPath: string, rules: DenylistRule[] = DEFAULT_DENYLIST_RULES): boolean {
  const normalizedPath = normalizeProjectPath(projectPath);
  return rules.some((rule) => rule.matches(normalizedPath));
}

export function classifySensitiveText(text: string): SensitiveTextFinding[] {
  const patterns: Array<{ kind: SensitiveTextFinding["kind"]; regex: RegExp }> = [
    { kind: "github-token", regex: /gh[pousr]_[A-Za-z0-9_]{30,}/g },
    { kind: "openai-key", regex: /sk-[A-Za-z0-9_-]{30,}/g },
    { kind: "generic-api-key", regex: /\b(?:api[_-]?key|token|secret)\s*[:=]\s*["']?[A-Za-z0-9_-]{24,}/gi }
  ];

  const findings: SensitiveTextFinding[] = [];
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern.regex)) {
      if (pattern.kind === "generic-api-key" && /(?:gh[pousr]_|sk-)/i.test(match[0])) {
        continue;
      }

      findings.push({
        kind: pattern.kind,
        index: match.index ?? 0,
        preview: redactSecretPreview(match[0])
      });
    }
  }

  return findings.sort((left, right) => left.index - right.index);
}

function redactSecretPreview(value: string): string {
  if (value.length <= 8) {
    return "***";
  }
  return `${value.slice(0, 4)}...${value.slice(-4)}`;
}
