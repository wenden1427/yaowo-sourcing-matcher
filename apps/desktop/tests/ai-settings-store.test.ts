import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { createAiSettingsStore } from "../src/main/ai-settings-store.js";

const fakeZhipuKey = ["zhipu", "placeholder", "value"].join("-");
const fakeDeepSeekKey = ["deepseek", "placeholder", "value"].join("-");
const fakeEnvKey = ["env", "placeholder", "value"].join("-");
const fakeDeepSeekEnvKey = ["deepseek", "env", "placeholder", "value"].join("-");

describe("AI settings store", () => {
  it("stores the API key encrypted and returns a runtime config", () => {
    const dir = mkdtempSync(join(tmpdir(), "yaowo-ai-settings-"));
    const filePath = join(dir, "ai-settings.json");
    const store = createAiSettingsStore(filePath, reversibleCipher);

    store.save({
      apiKey: fakeZhipuKey,
      deepseekApiKey: fakeDeepSeekKey,
      visionModel: "glm-4.6v-flashx",
      ocrModel: "glm-ocr",
      chatCompletionsUrl: "https://example.test/chat",
      ocrUrl: "https://example.test/ocr",
      deepseekModel: "deepseek-v4-flash",
      deepseekChatCompletionsUrl: "https://example.test/deepseek"
    });

    expect(readFileSync(filePath, "utf8")).not.toContain(fakeZhipuKey);
    expect(readFileSync(filePath, "utf8")).not.toContain(fakeDeepSeekKey);
    expect(store.loadView()).toEqual({
      provider: "zhipu",
      configured: true,
      hasStoredApiKey: true,
      visionModel: "glm-4.6v-flashx",
      ocrModel: "glm-ocr",
      chatCompletionsUrl: "https://example.test/chat",
      ocrUrl: "https://example.test/ocr",
      missing: [],
      deepseekConfigured: true,
      hasStoredDeepSeekApiKey: true,
      deepseekModel: "deepseek-v4-flash",
      deepseekChatCompletionsUrl: "https://example.test/deepseek",
      deepseekMissing: []
    });
    expect(store.loadRuntimeConfig().apiKey).toBe(fakeZhipuKey);
    expect(store.loadDeepSeekRuntimeConfig().apiKey).toBe(fakeDeepSeekKey);
  });

  it("preserves the existing encrypted key when saving URLs and models without a new key", () => {
    const dir = mkdtempSync(join(tmpdir(), "yaowo-ai-settings-"));
    const store = createAiSettingsStore(join(dir, "ai-settings.json"), reversibleCipher);

    store.save({ apiKey: fakeZhipuKey });
    store.save({
      deepseekApiKey: fakeDeepSeekKey,
      visionModel: "custom-vision",
      ocrModel: "custom-ocr",
      deepseekModel: "custom-deepseek"
    });

    expect(store.loadRuntimeConfig()).toMatchObject({
      apiKey: fakeZhipuKey,
      visionModel: "custom-vision",
      ocrModel: "custom-ocr"
    });
    expect(store.loadDeepSeekRuntimeConfig()).toMatchObject({
      apiKey: fakeDeepSeekKey,
      model: "custom-deepseek"
    });
  });

  it("can use an environment API key as a fallback before the user saves one in the app", () => {
    const dir = mkdtempSync(join(tmpdir(), "yaowo-ai-settings-"));
    const store = createAiSettingsStore(join(dir, "ai-settings.json"), reversibleCipher, {
      YAOWO_ZHIPU_API_KEY: fakeEnvKey,
      YAOWO_DEEPSEEK_API_KEY: fakeDeepSeekEnvKey
    });

    expect(store.loadView()).toMatchObject({
      configured: true,
      hasStoredApiKey: false,
      deepseekConfigured: true,
      hasStoredDeepSeekApiKey: false,
      missing: []
    });
    expect(store.loadRuntimeConfig().apiKey).toBe(fakeEnvKey);
    expect(store.loadDeepSeekRuntimeConfig().apiKey).toBe(fakeDeepSeekEnvKey);
  });

  it("exports distribution defaults without stored API keys", () => {
    const dir = mkdtempSync(join(tmpdir(), "yaowo-ai-settings-"));
    const filePath = join(dir, "ai-settings.json");
    const outputPath = join(dir, "ai-settings.defaults.json");
    const store = createAiSettingsStore(filePath, reversibleCipher);

    store.save({
      apiKey: fakeZhipuKey,
      deepseekApiKey: fakeDeepSeekKey,
      visionModel: "custom-vision",
      ocrModel: "custom-ocr",
      chatCompletionsUrl: "https://example.test/chat",
      ocrUrl: "https://example.test/ocr",
      deepseekModel: "custom-deepseek",
      deepseekChatCompletionsUrl: "https://example.test/deepseek"
    });

    store.exportDistributionDefaults(outputPath);

    const exported = readFileSync(outputPath, "utf8");
    expect(exported).not.toContain("encryptedApiKey");
    expect(exported).not.toContain("encryptedDeepSeekApiKey");
    expect(exported).not.toContain(fakeZhipuKey);
    expect(exported).not.toContain(fakeDeepSeekKey);
    expect(JSON.parse(exported)).toMatchObject({
      provider: "zhipu",
      visionModel: "custom-vision",
      ocrModel: "custom-ocr",
      chatCompletionsUrl: "https://example.test/chat",
      ocrUrl: "https://example.test/ocr",
      deepseekModel: "custom-deepseek",
      deepseekChatCompletionsUrl: "https://example.test/deepseek"
    });
  });
});

const reversibleCipher = {
  encrypt(value: string): string {
    return Buffer.from([...value].reverse().join(""), "utf8").toString("base64");
  },
  decrypt(value: string): string {
    return [...Buffer.from(value, "base64").toString("utf8")].reverse().join("");
  },
  isEncryptionAvailable(): boolean {
    return true;
  }
};
