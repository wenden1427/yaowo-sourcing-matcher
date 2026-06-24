import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { appendOperationLog } from "../src/main/app-log.js";

describe("operation log", () => {
  it("writes timestamped operation entries to the logs directory", async () => {
    const dir = mkdtempSync(join(tmpdir(), "yaowo-operation-log-"));

    const logPath = await appendOperationLog(dir, {
      level: "error",
      scope: "update",
      message: "GitHub update failed",
      details: { status: 500 }
    });

    const written = readFileSync(logPath, "utf8");
    expect(logPath).toContain("operation-");
    expect(written).toContain('"level":"error"');
    expect(written).toContain('"scope":"update"');
    expect(written).toContain("GitHub update failed");
    expect(written).toContain('"status":500');
  });
});
