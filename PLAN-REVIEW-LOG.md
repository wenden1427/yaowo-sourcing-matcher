# Plan Review Log: Yaowo Sourcing Matcher Phase 1 - 1688 Image Search Same-Item Workbench

Act 1 (grill) complete - plan locked with the user. MAX_ROUNDS=5.

## Round 1 - Codex

Thread: `019eca36-41f8-7511-a951-938dfb3a5653`

Codex found material issues:

1. The plan assumes `E:\Claude sourcing matcher` is already a Git repository, but it is not. Fix: make Git initialization and safe `.gitignore` a step-0 prerequisite.
2. The current `.gitignore` only ignores `.sillyspec`, while sensitive data such as `context_store/credentials.md`, `.runtime`, `runtime`, `node_modules`, browser profiles, and caches could be added before safety rules exist. Fix: write and verify the denylist before `git init/add` or release packaging.
3. Secret storage says Credential Manager but does not define Electron-side storage, migration, snapshot, backup, diagnostics, or log redaction. Fix: only store secret references/key ids and ban secret values from settings snapshots, logs, backups, diagnostics.
4. Update security checks only zip and sha256 from the same GitHub Release, which does not protect against release tampering or account takeover. Fix: sign the update manifest with an embedded public-key verification model, or equivalent.
5. The custom Go updater lacks zip-slip, absolute path, symlink/hardlink, and arbitrary overwrite protections. Fix: validate every archive entry into a staging directory before switching.
6. Current `worker.ts` starts and closes a persistent browser context for every `imageSearch()` call, conflicting with the desired visible long-lived browser session. Fix: extract a long-lived search session/daemon interface.
7. Existing worker errors are generic thrown `Error`s with no stable error code, so structured failure reasons cannot be reliably stored. Fix: define `SearchErrorCode` and typed results/errors.
8. Current worker deletes Chrome `Singleton*` lock files, which risks profile corruption if another browser uses the profile. Fix: detect profile lock and ask the user to close or choose another profile.
9. Current worker hard-codes Chrome channel. Portable-package users without Chrome may fail on first start. Fix: detect Chrome or use bundled Playwright Chromium.
10. Current H5 image upload uses a separate token/fetch path and may not share the logged-in browser profile cookies. Fix: define whether uploads must use browser context cookies and surface upload failures distinctly.
11. Background AI review can race with human review and overwrite final human state. Fix: AI writes to independent versioned AI review records only.
12. `better-sqlite3` synchronous IO in Electron main can block UI, and transaction/crash boundaries are undefined. Fix: move DB work off the render path and use transactions/idempotent keys.
13. Fixed Excel columns need schema validation for missing columns, empty ParentSKU, merged cells, formulas, hyperlinks, and bad image/url values. Fix: import preflight report.
14. ExcelJS preservation is limited for macros, images, styles, formulas, and external links. Fix: explicitly limit Phase 1 export contract to known `.xlsx` scraper/uploader workbooks.
15. Writing manual price back to column 13 may not be enough because the uploader recalculates O/P output prices. Fix: acceptance must prove uploader output equals manual price, or patch/export-adjust uploader compatibility.
16. Export grouping lacks rules for duplicate/empty ParentSKU, cross-sheet data, hidden rows, filtered rows, and discontinuous groups. Fix: contract-limit to single sheet, non-empty grouped ParentSKU, and preflight errors.
17. Cache cleanup says oldest unprotected but does not define protected. Fix: define active/recent/export-pinned protection plus refcount and last_accessed.
18. Diagnostic zip redaction is too broad; logs can leak source URLs, image URLs, operator, paths, and system info. Fix: default to redacted summary and preview include list.
19. Backup/restore lacks encryption/integrity checks and schema compatibility. Fix: add manifest/hash and optional password encryption for manual backups.
20. `release.ps1` is too monolithic and may leave half-published releases. Fix: split into preflight, build, package, verify, publish stages.
21. Acceptance relies too much on real scraper Excel and live 1688. Fix: add fixture Excel, worker mock, export contract, updater staging, and security scan tests, then keep live smoke tests.
22. Existing `legacy_code/1688-cli-main` already has daemon/shared Chromium context and structured response protocol. Fix: evaluate reuse or document why not, and borrow its long-session/error-code ideas.

VERDICT: REVISE

### Claude Response

Accepted the critique and revised `PLAN.md`.

Changes made:
- Added repository bootstrap step 0: write/verify `.gitignore`, packaging denylist, and sensitive scan before any Git initialization, commit, GitHub repository creation, or release packaging.
- Added secret storage constraints: only secret references/key ids and redacted display values may appear in DB, settings snapshots, logs, backups, and diagnostics.
- Required DB writes to run off the UI render path and use transactions/idempotent keys.
- Required worker refactor into a long-lived `SearchSession`/daemon-style queue and required evaluating `legacy_code/1688-cli-main` before implementing the browser layer.
- Added stable `SearchErrorCode` typed errors/results.
- Banned deleting Chromium `Singleton*` profile lock files; require profile-lock detection.
- Added Chrome/bundled Chromium startup detection.
- Clarified image upload must be browser-context/cookie-aware unless tests prove standalone H5 upload is independent.
- Added import preflight validation and limited Phase 1 Excel support to known `.xlsx` scraper/uploader workbooks.
- Added AI-human conflict rule: AI writes only to independent versioned AI records.
- Defined cache protection, refcount, and `last_accessed`.
- Added uploader price compatibility acceptance requirement.
- Added diagnostic zip redaction and preview-list requirement.
- Added backup manifest/hash, schema compatibility check, and optional password encryption for manual backups.
- Hardened auto-update with signed update manifest, embedded public-key verification, version monotonicity, zip entry validation, staging-only extraction, and rollback.
- Split release tooling into preflight/build/package/verify/publish stages.
- Added automated contract tests before live 1688 smoke tests.

## Round 2 - Codex

Thread: `019eca36-41f8-7511-a951-938dfb3a5653`

Codex found remaining issues:

1. The plan still described Columns 67-86 as the only AliExpress detail-image contract, while the inspected uploader also reads Columns 18-38 as source/main/extra images and Column 41 as variant image. Fix: make the uploader-compatible column contract explicit and test it.
2. The plan allowed child SKU individual pricing, but export wording only said manual price writes back to the original price column. Fix: define row-level export priority for child override, ParentSKU price, and original price.
3. Manual 1688 link validation was too broad. Fix: normalize only product/offer URLs, extract `offerId`, and reject login/search/verification/shop/non-offer links.
4. Signed update manifests did not specify release private-key storage, rotation, loss, or leak handling. Fix: keep signing keys outside the repo/build/backups/diagnostics, require explicit secure key source, include key id/version fields, and define rotation/revocation behavior.
5. Key Decisions still described sha256 as a standalone update component. Fix: clarify sha256 is trusted only after signed-manifest verification.
6. ExcelJS fidelity and uploader repricing were still listed as open risks without release-blocking closure conditions. Fix: make import/export/uploader contract tests release blockers.

VERDICT: REVISE

### Claude Response

Accepted the critique and revised `PLAN.md`.

Changes made:
- Clarified the current uploader-compatible import contract: Column 18 plus Columns 18-38 for source/main/extra images, Column 41 for child variant image, and Columns 67-86 for AliExpress description/detail images.
- Added a rule that if the uploader target changes, the column contract must be rediscovered before imports are accepted.
- Added row-level price export priority: child SKU override first, ParentSKU manual price second, original Column 13 third with pre-export warning.
- Added row-level trace columns for original price, ParentSKU price, child override, applied export price, applied price source, and changed flag.
- Replaced broad 1688-link validation with product/offer URL parsing, normalized offer URL storage, `offerId` extraction, and rejection of login/search/verification/shop/non-offer pages.
- Added release signing-key storage rules, signing-key location checks, key id/public-key version manifest fields, and key rotation/revocation/loss handling.
- Updated the auto-update key decision so sha256 is only an integrity check after signed-manifest verification.
- Converted ExcelJS preservation and uploader repricing from open risks into release-blocking contract-test requirements.
- Added acceptance tests for fixed-column import, manual offer-link parsing, row-level price write-back priority, signed manifest failures, and signing-key location checks.

## Round 3 - Codex

Thread: `019eca36-41f8-7511-a951-938dfb3a5653`

Codex confirmed all Round 2 blockers were closed:

1. The uploader-compatible image-column contract now covers Columns 18-38 and AliExpress Columns 67-86, with contract tests.
2. Child SKU override export priority is explicit and row-level.
3. Manual 1688 link validation now requires normalized offer URLs and `offerId` extraction.
4. Update signing-key storage, path refusal, rotation, and leak/loss handling are specified.
5. Key Decisions now use signed manifest plus hash-as-integrity-check wording.
6. ExcelJS and uploader repricing issues are release blockers with contract-test closure.

Codex noted one non-blocking wording issue: the update-client step still said "download zip and sha256, verify hash" even though the same section already required signed-manifest verification first.

VERDICT: APPROVED

### Claude Response

Accepted the non-blocking wording note and revised `PLAN.md` so the update client explicitly downloads and verifies the signed manifest before trusting and verifying the referenced zip hash.
