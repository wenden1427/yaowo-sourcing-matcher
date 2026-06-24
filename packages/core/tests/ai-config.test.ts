import { describe, expect, it } from "vitest";

import { getAiProviderStatus, loadAiProviderConfig } from "../src/ai/provider-config.js";

describe("AI provider configuration", () => {
  it("loads Zhipu vision and OCR models from environment defaults", () => {
    const config = loadAiProviderConfig({
      YAOWO_ZHIPU_API_KEY: "test-secret-key"
    });

    expect(config).toEqual({
      provider: "zhipu",
      apiKey: "test-secret-key",
      visionModel: "glm-4.6v-flashx",
      ocrModel: "glm-ocr",
      chatCompletionsUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      ocrUrl: "https://open.bigmodel.cn/api/paas/v4/layout_parsing"
    });
  });

  it("allows model and endpoint overrides without changing provider identity", () => {
    const config = loadAiProviderConfig({
      YAOWO_AI_PROVIDER: "zhipu",
      YAOWO_ZHIPU_API_KEY: "test-secret-key",
      YAOWO_VISION_MODEL: "custom-vision",
      YAOWO_OCR_MODEL: "custom-ocr",
      YAOWO_ZHIPU_CHAT_COMPLETIONS_URL: "https://example.test/chat",
      YAOWO_ZHIPU_OCR_URL: "https://example.test/ocr"
    });

    expect(config).toMatchObject({
      provider: "zhipu",
      visionModel: "custom-vision",
      ocrModel: "custom-ocr",
      chatCompletionsUrl: "https://example.test/chat",
      ocrUrl: "https://example.test/ocr"
    });
  });

  it("throws a safe error when the Zhipu API key is missing", () => {
    expect(() => loadAiProviderConfig({})).toThrow("YAOWO_ZHIPU_API_KEY is not configured");
  });

  it("reports status without leaking the API key", () => {
    const status = getAiProviderStatus({
      YAOWO_ZHIPU_API_KEY: "test-secret-key",
      YAOWO_VISION_MODEL: "glm-4.6v-flashx",
      YAOWO_OCR_MODEL: "glm-ocr"
    });

    expect(status).toEqual({
      provider: "zhipu",
      configured: true,
      visionModel: "glm-4.6v-flashx",
      ocrModel: "glm-ocr",
      missing: []
    });
    expect(JSON.stringify(status)).not.toContain("test-secret-key");
  });
});
