# 阶段版导出与改价落地 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把已确认的阶段版功能落到真实桌面端：改价页内联导出上传器采集表、导出末尾追加首选 1688 链接、改价区显示韩元对应人民币。

**Architecture:** 后端导出仍复用 `buildSourcedScraperExport`，只在追加列末尾增加首选候选链接。桌面端不新增独立导出页，在审核/改价页顶部增加导出确认条，并在现有韩国定价工具里暴露汇率输入与人民币换算显示。UI 保持现有组件结构，避免本轮大拆页面。

**Tech Stack:** TypeScript, React, Electron bridge, Vitest, SQLite repository tests.

---

### Task 1: 导出追加首选 1688 链接

**Files:**
- Modify: `packages/db/tests/export-batch.test.ts`
- Modify: `packages/db/src/repositories/export-batch.ts`

- [ ] **Step 1: Write the failing test**

Add a test where rank 1 and selected candidate differ, then assert the last appended column is `首选 1688 链接` and contains rank 1 URL.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --workspace @yaowo/db test -- packages/db/tests/export-batch.test.ts`
Expected: FAIL because the header and value do not exist.

- [ ] **Step 3: Write minimal implementation**

Add the new header to the end of `APPENDED_EXPORT_HEADERS`, select rank 1 candidate URL per parent SKU, and append it to every exported row.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --workspace @yaowo/db test -- packages/db/tests/export-batch.test.ts`
Expected: PASS.

### Task 2: 改价页内联导出入口

**Files:**
- Modify: `apps/desktop/tests/app.test.tsx`
- Modify: `apps/desktop/src/renderer/App.tsx`
- Modify: `apps/desktop/src/renderer/styles.css`

- [ ] **Step 1: Write the failing tests**

Update the desktop test so the batch list no longer exposes `导出完整结果`; add a review page test that opens inline export confirmation and confirms `exportSourcedWorkbook` is called for the selected batch.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --workspace @yaowo/desktop test -- apps/desktop/tests/app.test.tsx`
Expected: FAIL because the inline export panel does not exist and full export is still visible.

- [ ] **Step 3: Write minimal implementation**

Pass `onExport` and `exporting` into `ReviewPanel`, add `导出上传器采集表` button plus inline confirmation panel, remove the full-result export button from the normal batch UI.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --workspace @yaowo/desktop test -- apps/desktop/tests/app.test.tsx`
Expected: PASS.

### Task 3: 改价页韩元汇率与人民币显示

**Files:**
- Modify: `apps/desktop/tests/app.test.tsx`
- Modify: `apps/desktop/src/renderer/App.tsx`
- Modify: `apps/desktop/src/renderer/styles.css`

- [ ] **Step 1: Write the failing test**

Add assertions that the default exchange rate field is `0.0046`, the Korea listing result passes that rate into calculation, and the suggested KRW price shows an RMB estimate underneath.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm --workspace @yaowo/desktop test -- apps/desktop/tests/app.test.tsx`
Expected: FAIL because the exchange rate field and RMB display do not exist.

- [ ] **Step 3: Write minimal implementation**

Add `exchangeRateRmbPerKrw` state, pass it to `calculateKoreaListingPrice`, and render `约 ¥...` under suggested/manual/child KRW prices in the改价 section.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm --workspace @yaowo/desktop test -- apps/desktop/tests/app.test.tsx`
Expected: PASS.

### Task 4: Final Verification

**Files:**
- Verify only.

- [ ] Run `npm --workspace @yaowo/db test -- packages/db/tests/export-batch.test.ts`
- [ ] Run `npm --workspace @yaowo/desktop test -- apps/desktop/tests/app.test.tsx`
- [ ] Run `npm run typecheck`
- [ ] Start the desktop dev server with `npm --workspace @yaowo/desktop run dev` and provide the local URL for manual testing.
