import { describe, expect, it } from "vitest";

import {
  DEFAULT_DENYLIST_RULES,
  classifySensitiveText,
  isDeniedProjectPath
} from "../src/security/denylist.js";

describe("project denylist", () => {
  it("blocks files that must never enter git or release packages", () => {
    const deniedPaths = [
      "context_store/credentials.md",
      "context_store/private_credentials_notes.txt",
      ".codex/local-state.json",
      ".runtime/state.json",
      "runtime/browser-profile/Default/Cookies",
      "tools/1688-image-search-worker/node_modules/playwright/index.js",
      "packages/shared/dist/index.js",
      "release/yaowo-sourcing-matcher-0.1.0.zip",
      "logs/runtime.log",
      "cache/images/1688.jpg",
      "SourcingMatcher.db",
      "backups/2026-06-15.zip"
    ];

    for (const path of deniedPaths) {
      expect(isDeniedProjectPath(path), path).toBe(true);
    }
  });

  it("allows source files and planning docs that are expected to be tracked", () => {
    const allowedPaths = [
      "PLAN.md",
      "packages/shared/src/index.ts",
      "tools/1688-image-search-worker/src/worker.ts",
      "docs/import-contract.md"
    ];

    for (const path of allowedPaths) {
      expect(isDeniedProjectPath(path), path).toBe(false);
    }
  });

  it("keeps the known credentials path as an explicit rule", () => {
    expect(DEFAULT_DENYLIST_RULES.some((rule) => rule.id === "known-local-credentials")).toBe(true);
  });

  it("detects common secret-looking tokens in text", () => {
    const githubToken = `ghp_${"1234567890abcdefghijklmnopqrstuv"}`;
    const openAiKey = `sk-${"1234567890abcdefghijklmnopqrstuv"}`;
    const findings = classifySensitiveText(
      `token=${githubToken} and api=${openAiKey}`
    );

    expect(findings.map((finding) => finding.kind)).toEqual(["github-token", "openai-key"]);
  });
});
