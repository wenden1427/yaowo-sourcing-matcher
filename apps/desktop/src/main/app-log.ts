import { appendFile, mkdir } from "node:fs/promises";
import { join } from "node:path";

export type OperationLogLevel = "info" | "warn" | "error";

export interface OperationLogEntry {
  level: OperationLogLevel;
  scope: string;
  message: string;
  details?: unknown;
}

export async function appendOperationLog(logDir: string, entry: OperationLogEntry): Promise<string> {
  await mkdir(logDir, { recursive: true });
  const logPath = join(logDir, `operation-${new Date().toISOString().slice(0, 10)}.log`);
  const payload = {
    timestamp: new Date().toISOString(),
    level: entry.level,
    scope: entry.scope,
    message: entry.message,
    details: normalizeDetails(entry.details)
  };
  await appendFile(logPath, `${JSON.stringify(payload)}\n`, "utf8");
  return logPath;
}

export function normalizeDetails(value: unknown): unknown {
  if (value instanceof Error) {
    return {
      name: value.name,
      message: value.message,
      stack: value.stack
    };
  }
  return value;
}
