import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = process.cwd();
const resourcesDir = resolve(root, "apps/desktop/resources");
const defaultsPath = join(resourcesDir, "ai-settings.defaults.json");
const appData = process.env.APPDATA || join(process.env.USERPROFILE || "", "AppData/Roaming");
const localSettingsPath = join(appData, "yaowo-sourcing-matcher", "ai-settings.json");

const defaults = {
  provider: "zhipu",
  visionModel: "glm-4.6v-flashx",
  ocrModel: "glm-ocr",
  chatCompletionsUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
  ocrUrl: "https://open.bigmodel.cn/api/paas/v4/layout_parsing",
  deepseekModel: "deepseek-v4-flash",
  deepseekChatCompletionsUrl: "https://api.deepseek.com/chat/completions"
};

const merged = { ...defaults };
if (existsSync(localSettingsPath)) {
  try {
    const parsed = JSON.parse(readFileSync(localSettingsPath, "utf8")) as Record<string, unknown>;
    for (const key of [
      "visionModel",
      "ocrModel",
      "chatCompletionsUrl",
      "ocrUrl",
      "deepseekModel",
      "deepseekChatCompletionsUrl"
    ] as const) {
      if (typeof parsed[key] === "string" && parsed[key].trim()) {
        merged[key] = parsed[key].trim();
      }
    }
  } catch {
    // Keep defaults if the local settings file is unreadable.
  }
}

mkdirSync(resourcesDir, { recursive: true });
writeFileSync(defaultsPath, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
console.log(`Wrote desktop distribution defaults: ${defaultsPath}`);
