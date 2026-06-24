# Plan: Yaowo Sourcing Matcher Phase 1 - 1688 Image Search Same-Item Workbench
_Locked via grill by Codex + user_

## Goal

Deliver a Windows desktop portable app named **Yaowo Sourcing Matcher**. The user-facing Chinese display name will be handled in UI copy, but this plan intentionally stays ASCII-only for review-tool compatibility. Phase 1 is a practical same-item sourcing workbench for operations staff: import the existing scraper Excel, batch-run 1688 image search, review candidate same-item sources with AI assistance and human confirmation, manually adjust listing prices, and export a "sourced" version of the original scraper Excel. This phase is meant to replace the current manual workflow where users search images on 1688 one by one and then manually calculate and fill prices. Automated inquiry, merchant reply collection, OCR of merchant reply images, size/weight extraction, 1688 detail-page SKU/freight parsing, ERP integration, and automatic listing are intentionally out of scope for Phase 1.

## Approach

0. Pre-implementation repository bootstrap:
   - `E:\Claude sourcing matcher` is currently a project directory, not a Git repository. Before any `git init`, `git add`, GitHub repository creation, or release packaging, create and verify a conservative `.gitignore` and packaging denylist.
   - The denylist must exclude at minimum: `context_store/credentials.md`, any `*credentials*`, `.runtime/`, `runtime/`, `node_modules/`, SQLite databases, backups containing data, image cache, browser profiles, logs, build outputs, release zips, updater staging directories, and temporary package directories.
   - Run a sensitive-file scan before the first commit and before every release. The scan must fail on API key patterns, GitHub tokens, browser profile files, database files, cache files, and the known local credentials path.
   - Only after this safety step may the project be initialized as a Git repository and connected to GitHub.
1. Continue development in the current repository after the repository bootstrap above.
2. Keep `tools/1688-image-search-worker` as the existing Playwright-based 1688 image-search worker, but refactor it before desktop integration:
   - Preserve its CLI for debugging.
   - Extract a long-lived `SearchSession` or daemon-style interface that owns one persistent browser context and processes queued ParentSKU search jobs.
   - The Electron main process must call the long-lived queue/session API, not a one-shot `imageSearch()` function that starts and closes a persistent context for every item.
   - Evaluate `legacy_code/1688-cli-main` before implementing this layer. Reuse or adapt its daemon/shared-Chromium-context protocol if practical; if not reused, borrow its long-session and structured-response ideas and document why a direct migration was rejected.
3. Use an npm workspaces monorepo:
   - `apps/desktop`: Electron + React/Vite desktop app.
   - `packages/shared`: shared types, enums, column definitions, DTOs.
   - `packages/core`: business logic for batches, search jobs, review, pricing, caching, export, update checks.
   - `packages/db`: SQLite schema, migrations, repositories.
   - `tools/1688-image-search-worker`: current 1688 image-search worker.
   - `updater`: a small Go updater executable.
4. Desktop stack:
   - Electron + React/Vite.
   - shadcn/ui + Tailwind + lucide-react.
   - Light workbench style with low-saturation blue/green accents and medium-high information density.
   - Chinese-only UI.
5. Local storage:
   - SQLite is the only internal state source.
   - Excel is only an import/export format.
   - Use `better-sqlite3`.
   - Use `ExcelJS` for `.xlsx` import/export.
   - Store database, settings, log index, and backups under `%APPDATA%/SourcingMatcher`.
   - Store image cache and temporary files under `%LOCALAPPDATA%/SourcingMatcher/cache`.
   - Do not encrypt the whole SQLite database. Store AI keys, GitHub tokens, and other secrets through Windows Credential Manager or equivalent secure storage, not plaintext database fields.
   - Database rows, settings snapshots, logs, backups, and diagnostics may store only secret references/key ids and redacted display values, never secret values.
   - Database writes must run off the UI render path, either in Electron main-process controlled worker threads or a utility process. Batch import, search-result insertion, human review, export status, cache metadata, and update state all require transactions and idempotent keys.
6. Import existing scraper Excel:
   - One imported Excel creates one batch.
   - One SQLite database manages many batches.
   - Phase 1 uses fixed column positions from the existing scraper/uploader format, not user-defined column mapping. The current compatibility target is the user-provided uploader package inspected during planning; if the uploader target changes, rediscover this contract before accepting imports.
     - Column 1: ParentSKU.
     - Column 2: SKU.
     - Column 10: color.
     - Column 11: size.
     - Column 12: source product URL.
     - Column 13: collected/source price.
     - Column 18: source main image and the first URL in the source image range.
     - Columns 18-38: source/main/extra image URL range used by the uploader as reference/extra images.
     - Column 41: child SKU variant image.
     - Columns 67-86: AliExpress description/detail image URL range used by the uploader when platform is AliExpress.
   - Preserve original rows, original column order, and all values needed for uploader-compatible export.
   - Import supports `.xlsx` workbooks only in Phase 1. Macro-enabled files, multiple data sheets, hidden filtered rows as the active source, or unusual workbook features must fail preflight with a clear message rather than silently importing wrong data.
   - Import preflight must validate minimum column count, critical-column sample values, non-empty ParentSKU, ParentSKU grouping, SKU count, URL/image formats, whether AliExpress files have the 67-86 detail-image range when needed, and whether ParentSKU rows are contiguous enough for group export.
   - Do not hard-limit file size. Before import, estimate parent SKU count and image cache space, and warn when the batch is large enough that splitting is recommended.
7. Search granularity:
   - Run 1688 image search by ParentSKU, not by every child SKU.
   - Default search image is the first child SKU variant image under that ParentSKU.
   - If no variant image exists, fallback to the source main image.
   - "Re-search with another image" can use any child variant image, the source main image, or a local uploaded image.
   - Store Top 10 candidates per ParentSKU.
   - Show Top 5 candidates prominently in the review UI, with an option to expand the remaining candidates.
8. 1688 browser execution:
   - Use a dedicated 1688 browser profile.
   - First run requires the user to manually log in to 1688. Later runs reuse the profile/login state.
   - Browser is visible by default so the user can see image search and detail pages.
   - Login expiration, verification, or page exceptions pause the workflow and ask the user to handle it manually before continuing.
   - Do not implement automatic handling of login, verification, or platform security mechanisms.
   - Do not delete Chromium `Singleton*` profile lock files. If the profile is already in use, detect the lock and ask the user to close the other browser or choose another profile.
   - Startup must detect whether a usable Chrome/Chromium is available. If system Chrome is missing, use bundled Playwright Chromium or show a clear setup path; do not hard-fail with an internal Playwright channel error.
   - Image upload must be part of the same long-lived search session. Prefer browser-context/cookie-aware upload. A standalone H5 token upload path is allowed only if tests prove it does not depend on login cookies; otherwise upload failures must be surfaced as a distinct network/upload failure, not as generic search failure.
   - Phase 1 defaults to one visible browser and one serial search job at a time.
   - Support pause, continue, single retry, and batch retry.
   - Reserve room for a future cautious acceleration mode, but do not expose arbitrary concurrency in Phase 1.
   - Show completed/total, average time per ParentSKU, and estimated remaining time.
9. Search failure handling:
   - Define stable `SearchErrorCode` values shared by worker, database, UI, and logs.
   - Store structured failure reasons: upload failed, no results, login expired, verification/exception, network timeout, parse failed, profile locked, browser unavailable, unknown error.
   - Refactor existing worker throws into typed results or typed errors mapped to the stable enum.
   - Allow single and batch retry.
   - Pause the batch and ask the user to inspect the browser after repeated failures.
10. Image caching:
   - Cache source images and 1688 candidate images locally.
   - Store both local cache path and original URL.
   - Electron main process downloads images in the background.
   - Limit download concurrency to 3 and retry each failed download up to 2 times.
   - Cache failure must not block review; fallback to remote URL display.
   - Default retention is 30 days.
   - Default cache cap is 2GB and configurable.
   - Define cache protection explicitly:
     - active batch caches are protected;
     - recently accessed caches inside the retention window are protected;
     - selected-source candidate images are protected until the batch is archived or the cache cap forces cleanup;
     - manually pinned/export-referenced cache files are protected.
   - Maintain cache refcount and `last_accessed` metadata in SQLite.
   - When cap is exceeded, automatically clean the oldest unprotected batch caches.
   - Deleting or archiving a batch does not automatically delete its cache.
   - Settings page and batch page both provide cache cleanup entry points: one-click cleanable cache cleanup and per-batch cleanup.
11. AI-assisted review:
   - AI is an optional enhancement and never blocks the main workflow.
   - AI provider settings separate language model and vision model. This supports combinations such as DeepSeek for language and Qwen for vision.
   - After image search completes for a ParentSKU, schedule background AI pre-review. Do not block human review.
   - AI output fields: same-item probability, matching reason, risk points.
   - AI writes only to an `ai_reviews` table or equivalent versioned AI-result area. It must never update human authoritative fields such as selected source, review status, manual price, or export eligibility.
   - Human review is authoritative.
   - If AI is not configured or fails, search, human review, pricing, and export still work. Only write an error log.
   - Do not implement AI token/cost statistics in Phase 1.
12. Review states:
   - ParentSKU states: sourced, no source, needs confirmation, re-search requested, unreviewed, search failed.
   - Candidate states: selected source, unsuitable, unselected.
   - Do not implement shop blacklist or link blacklist in Phase 1.
   - Allow marking a single candidate as unsuitable.
   - Allow selecting one candidate as the final source.
   - Do not implement free drag-sort or multiple starred candidates.
   - Allow manually entering a 1688 source link. Phase 1 must parse and normalize only product/offer URLs, extract and store `offerId`, and reject login, search, verification/exception, shop, homepage, seller, non-1688, or non-offer URLs. Links without a reliable `offerId` are not exportable until corrected. After a valid offer link is accepted, the user may manually fill title, main image URL, purchase price, monthly sales, shop, etc. Automatic detail-page parsing is Phase 2.
   - Allow opening a candidate 1688 link in the same dedicated 1688 browser profile for manual checking. Phase 1 does not force detail-page scraping.
13. Review UI:
   - Navigation modules: Batches, Image Search Review, Export, Settings, Logs/Updates.
   - Batches page: import scraper Excel, batch list, continue processing, delete/archive batch, view statistics.
   - Archive means hide completed batches from the default list without deleting data. Archived batches can be viewed and restored.
   - Image Search Review page layout: left ParentSKU queue, middle source item image/info, right Top 5 candidate comparison cards, bottom child SKU and pricing area. After confirmation, auto-advance to next ParentSKU.
   - Lightweight statistics: total ParentSKUs, sourced, no source, needs confirmation, failed, price changed, exportable count.
   - No keyboard shortcuts in Phase 1.
14. Manual pricing and lightweight calculator:
   - Default pricing is unified at ParentSKU level.
   - Allow expanding child SKUs and overriding individual child SKU prices.
   - Allow selecting multiple ParentSKUs and applying the same manual price.
   - Calculator is an assistant, not an automatic mandatory pricing engine.
   - Calculator inputs: 1688 purchase price, domestic freight, weight, length, width, height, commission rate, exchange rate, target ROI, air/sea channel toggles.
   - Purchase price should be extracted from image-search candidate data when available.
   - Domestic freight can be manually filled or default to 0 in Phase 1.
   - Exact 1688 detail-page freight extraction is Phase 2.
   - Calculator shows air and sea suggested prices, channel availability, and estimated ROI. User manually applies one result to the current ParentSKU.
   - Export writes the applied manual price back to the original source price column using row-level priority:
     - if a child SKU override exists, write that override to Column 13 for that child row;
     - otherwise, if the ParentSKU manual price exists, write the ParentSKU manual price to Column 13 for every child row under that ParentSKU;
     - otherwise keep the original Column 13 value and raise a pre-export warning.
   - Appended trace columns must be row-level: original collected price, ParentSKU manual price, child SKU override price, applied export price, applied price source, and manual price changed flag.
15. Export:
   - Provide two export buttons:
     - Export sourced scraper Excel: only ParentSKUs confirmed as sourced are exported. No-source, needs-confirmation, re-search, unreviewed, and failed ParentSKUs are not exported by default.
     - Export full review result Excel: all states are exported for audit, debugging, and review.
   - Sourced export preserves/deletes at ParentSKU group level. If a ParentSKU is confirmed sourced, all child SKU rows under it are kept. If a ParentSKU is no-source, the whole group is removed.
   - Sourced export should preserve original Excel columns and values as much as possible, then append matching columns at the end.
   - Export contract is limited to the known scraper/uploader `.xlsx` format. It does not promise full preservation of macros, embedded images, external links, or unsupported workbook features.
   - Append fields include: 1688 match status, normalized 1688 offer URL, 1688 offerId, 1688 main image URL, 1688 title, 1688 unit price, 1688 monthly sales, 1688 shop, matching reason, AI same-item probability, AI risk points, reviewer/operator, review time, original collected price, ParentSKU manual price, child SKU override price, applied export price, applied price source, manual price changed flag, selected logistics channel.
   - Do not embed 1688 images into exported Excel. Write URLs/text only.
   - Before export, run a pre-export check: sourced but missing 1688 link, empty manual price, empty purchase price, not price-changed, and similar issues. Show warnings and allow the user to confirm export anyway.
   - After successful sourced export, ask whether to mark the batch completed/archive it. Do not force archive.
   - Do not delete internal no-source history after export.
   - Do not automatically open or integrate the uploader in Phase 1. Record export path only.
   - Phase 1 acceptance must prove that the uploader's final output price equals the manual price exported by this app. If the existing uploader recalculates and overwrites the manual price, implement a minimal backward-compatible uploader patch or export contract adjustment before release.
16. Logs and diagnostics:
   - Write key operations to SQLite and log files: import, start/pause search, failure reason, human confirmation, manual price change, manual source link, export path, update action.
   - Error UI uses short Chinese explanation, expandable technical details, and log path.
   - Logs/Updates page has two tabs: runtime logs and version updates.
   - Support one-click diagnostic zip with recent logs, app version, system info, and current batch summary.
   - Diagnostic zip must default to redacted logs and summary only. It must not include API keys, GitHub tokens, browser profile, full database, cached images, full source URLs, or full local paths unless the user explicitly previews and confirms the included files.
   - Provide a preview list before generating diagnostics.
   - Do not auto-upload diagnostics.
17. Settings:
   - Required settings only: 1688 browser profile path, AI providers, cache cap/retention days, default commission/exchange rate/target ROI, air/sea toggles, operator name, update source.
   - Global settings are primary. Each batch records a settings snapshot used at the time.
   - Do not implement account/permission/multi-user collaboration.
   - Operator name is only used for export traceability.
   - Do not show prominent safety disclaimers in Phase 1, but still implement the agreed boundaries: user-authorized account profile, manual handling of verification, and no sensitive credentials in database/release packages.
18. Onboarding and demo data:
   - Include a short first-run guide covering import, 1688 login, image search, review, price change, export, and update.
   - Include a small demo batch template without real accounts, real business data, or secrets.
19. Backup and recovery:
   - Do not implement cloud backup.
   - Provide local data backup/restore package. It can be used for manual migration to another computer, but 1688 browser profile may need re-login.
   - Backup packages require a manifest with file list, schema version, app version, and hashes.
   - Manual exported backups should offer optional password encryption.
   - Restore must verify manifest hashes, app/schema compatibility, and backup type before replacing current data.
   - Before app update, backup SQLite database and settings.
   - Keep only the latest 3 update backups.
   - Settings page shows backup/restore list.
   - Before restore, backup the current state again.
   - Provide recovery mode or a small recovery entry point if the main app cannot open.
20. GitHub repositories and release workflow:
   - GitHub username: `wenden1427`.
   - Private source repository: `wenden1427/yaowo-sourcing-matcher`.
   - Public update release repository: `wenden1427/yaowo-sourcing-matcher-releases`.
   - Prefer GitHub CLI `gh` for repository creation, remote setup, and releases.
   - Install GitHub CLI on the development machine with `winget install --id GitHub.cli`, then log in using `gh auth login` as `wenden1427`.
   - Keep publishing permission only in the development machine's `gh` login state.
   - Do not store GitHub tokens in the project.
   - User machines only access the public release repository and need no GitHub credentials.
21. Auto update:
   - Publish full portable zip, signed update manifest, manifest signature, and artifact hash through GitHub Releases.
   - The app/updater embeds an update public key and verifies the signed manifest before trusting any zip/hash from GitHub.
   - The update manifest must include version, release channel, artifact name, sha256, size, minimum app version if needed, published timestamp, signature algorithm, key id, and public-key version.
   - The release signing private key must live outside the Git repository, release package, diagnostics, logs, backups, and settings snapshots. Release tooling may load it only from an explicit local secure-store key id or an operator-provided offline key file path outside the project directory.
   - Release tooling must refuse to run if the signing key is inside the project tree, a build output directory, a backup directory, or the release artifact directory.
   - Key rotation must be explicit: the app/updater embeds a trusted public-key set keyed by key id; new releases identify the signing key id in the manifest; old keys can be marked retired/revoked in app metadata. If a key is lost, generate a new key and ship a version that trusts it before relying on it. If a key is suspected leaked, revoke that key id in the next app version and block release tooling from signing with it.
   - Enforce monotonic version upgrades by default. Downgrade is allowed only through the explicit rollback path to the locally saved previous version.
   - Check once on app startup and allow manual check in Settings.
   - When a new version exists, prompt for one-click update. Do not silently force update.
   - Update failure must not block the current app version. Show reason and retry button.
   - Implement a lightweight custom update client: check GitHub Releases, download the signed manifest, verify its signature with the embedded trusted public key, download the referenced zip, verify the manifest-declared hash, then launch the standalone updater to replace the app directory.
   - Updater is a small Electron-free Go exe shipped with the app.
   - Main app downloads/verifies package, launches updater, and exits. Updater waits for the app to exit, backs up old app, extracts new package, replaces app directory, and restarts the app.
   - Updater must extract only into a staging directory, validate every zip entry against zip-slip, absolute path, drive prefix, `..`, symlink/hardlink, and unexpected executable path issues, then atomically switch staged files into place.
   - User data directory is never replaced during app update.
   - Release machine checks for Go. If Go is missing, show installation guidance. Development can skip updater build, but official release must build `updater.exe`. End users do not need Go.
   - Basic rollback: if update fails, restore old app automatically. After successful update, keep one previous app backup. Settings page offers rollback to previous version. Keep only one old app version.
22. Packaging and release:
   - Windows portable package first. Extract and run.
   - Use `electron-builder` to create Windows portable zip.
   - Local release tooling is staged, not one monolithic opaque step:
     - `preflight`: environment checks, git status, `.gitignore`/denylist verification, sensitive scan.
     - `build`: app build and updater build.
     - `package`: electron-builder package and artifact manifest generation.
     - `verify`: sha256, signature, unzip/staging smoke test, package content denylist, updater dry-run.
     - `publish`: create/upload GitHub Release only after all prior stages pass.
   - Each stage must be rerunnable and must not leave a half-published release on failure.
   - Release preflight must block `context_store/credentials.md`, API keys, database files, cache, browser profile, logs, release zip, and temporary build directories from entering Git or release packages.
   - Create/update `.gitignore` and release exclude rules for credentials, `.runtime/`, `runtime/`, `node_modules/`, databases, cache, browser profiles, logs, build outputs, and release packages.
23. Acceptance test:
   - Automated tests must exist before real end-to-end smoke tests:
     - fixture scraper Excel import contract tests covering the current uploader-compatible columns: 1/2/10/11/12/13/18, 18-38, 41, and AliExpress 67-86;
     - worker mock tests for search success/failure and typed error codes;
     - manual 1688 offer-link parser tests for normalized offer URLs, `offerId` extraction, and rejection of login/search/verification/shop/non-offer links;
     - export contract tests for sourced workbook row filtering, appended columns, and row-level price write-back priority between child SKU override, ParentSKU manual price, and original price;
     - uploader compatibility contract proving final uploader price behavior;
     - updater staging/unzip/path-validation tests;
     - signed update manifest tests, including missing signature, wrong key id, bad hash, retired/revoked key id, and signing-key location checks;
     - sensitive-file scan tests;
     - cache cleanup/refcount tests.
   - Then run a real scraper Excel end-to-end smoke test: import, select/login 1688 profile, batch image search, background AI pre-review (allowed to fail without blocking), human review/price change, export sourced scraper Excel, and verify the uploader can read it.
   - Verify resume after app restart.
   - Verify failed search retry.
   - Verify selected source, review state, and changed prices are not lost.
   - Verify pre-export checks and uploader-compatible export.
   - Verify portable package starts after extraction.
   - Verify update check works and update failure does not break the current app.

## Key Decisions & Tradeoffs

- Phase 1 is a same-item image-search workbench, not the full inquiry/listing system. This gives operations staff immediate value and avoids being blocked by later size/weight and inquiry complexity.
- SQLite is the internal state source; Excel is only import/export. This enables resume, retry, cached candidates, review history, and clean export.
- ParentSKU-level image search is the first-phase unit. The scraper already splits by price groups, and Phase 1 only needs to confirm whether the ParentSKU has a same-item source. Child SKU exact matching belongs to later detail/inquiry stages.
- Default search image is the first child SKU variant image, because this is more useful than a scene/main image for image search.
- Store Top 10 candidates but focus the UI on Top 5, balancing recall with review speed.
- AI assists but does not decide. Human review remains authoritative.
- Serial image search is the default because stability, login handling, and recovery matter more than raw speed for the first release.
- Manual pricing remains human-controlled. The calculator reduces spreadsheet work but does not force an automatic price.
- Export writes the final manual price back to the original price column to stay compatible with the uploader, while appended trace columns preserve original price and audit data.
- 1688 images are not embedded in exported Excel to avoid huge/slow workbooks.
- Batch archive keeps history without cluttering the active list. Cache is controlled separately through a 2GB cap and cleanup tools.
- Source code is private, release repository is public. This protects business logic while allowing simple token-free updates for end users.
- Auto update uses a signed manifest + full portable zip + Go updater. The sha256 is trusted only after signed-manifest verification and is used as an artifact-integrity check, not as standalone update security.
- Portable distribution does not mean data lives inside the app folder. User data lives in AppData/LocalAppData so app updates can replace the program directory safely.

## Risks / Open Questions

- 1688 image-search pages and request shapes may change. The existing worker must keep CLI/debug logging so regressions can be diagnosed quickly.
- GitHub CLI is not installed yet. Implementation must install/login `gh` before creating repos or publishing releases; if that fails, fall back to manual GitHub web creation plus local release script upload.
- Go may not be installed. Main app development should not be blocked by Go, but official release cannot ship the updater until `updater.exe` is built.
- Electron + `better-sqlite3` packaging must be verified on Windows because native modules can fail if packaging is wrong.
- ExcelJS may not perfectly preserve every style/image/macro/special workbook feature. Phase 1 release is blocked until fixture import/export contract tests prove the known `.xlsx` scraper/uploader fixed columns, row filtering, appended text columns, and price write-back survive the export path.
- The uploader currently has its own pricing logic. Phase 1 release is blocked until an uploader compatibility contract proves the uploader final output price equals the applied export price from this app, or until a minimal backward-compatible uploader patch/export adjustment is implemented and tested.
- AI provider adapters need concrete provider config and response format during implementation.
- Windows file locks and antivirus can interfere with app directory replacement. The updater needs timeout, retry, rollback, and clear error reporting.
- The local `context_store/credentials.md` contains sensitive API keys. `.gitignore`, release exclusions, and preflight scanning must be implemented before any repository push or package release.
- 1688 browser profiles may not migrate cleanly across computers. Backups can migrate business data, but 1688 login may require manual re-login.

## Out of Scope

- No automated 1688 inquiry, reply collection, merchant reply image OCR, or size/weight extraction in Phase 1.
- No 1688 detail-page SKU/freight/tier-price parser in Phase 1.
- No automatic listing, uploader embedding, automatic uploader launch, or ERP adapter in Phase 1.
- No account system, permissions, cloud sync, cloud backup, or multi-user concurrent editing.
- No shop blacklist, link blacklist, complex candidate ranking UI, keyboard shortcuts, or AI usage/cost statistics in Phase 1.
- No full unattended automation guarantee. Long-running search is allowed, but login/verification/exceptions pause for manual handling.
- No code signing, differential update, or GitHub Actions release automation in Phase 1.
- No bypassing login, verification, or platform security mechanisms.
