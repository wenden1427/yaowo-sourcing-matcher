export type AiProvider = "zhipu";

export type AiProviderConfig = {
  provider: AiProvider;
  apiKey: string;
  visionModel: string;
  ocrModel: string;
  chatCompletionsUrl: string;
  ocrUrl: string;
};

export type AiProviderStatus = {
  provider: AiProvider;
  configured: boolean;
  visionModel: string;
  ocrModel: string;
  missing: string[];
};

export type AiProviderEnv = Record<string, string | undefined>;

const DEFAULT_PROVIDER: AiProvider = "zhipu";
const DEFAULT_VISION_MODEL = "glm-4.6v-flashx";
const DEFAULT_OCR_MODEL = "glm-ocr";
const DEFAULT_CHAT_COMPLETIONS_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const DEFAULT_OCR_URL = "https://open.bigmodel.cn/api/paas/v4/layout_parsing";

export function loadAiProviderConfig(env: AiProviderEnv = process.env): AiProviderConfig {
  const provider = resolveProvider(env);
  const apiKey = readTrimmed(env.YAOWO_ZHIPU_API_KEY);

  if (!apiKey) {
    throw new Error("YAOWO_ZHIPU_API_KEY is not configured");
  }

  return {
    provider,
    apiKey,
    visionModel: readTrimmed(env.YAOWO_VISION_MODEL) ?? DEFAULT_VISION_MODEL,
    ocrModel: readTrimmed(env.YAOWO_OCR_MODEL) ?? DEFAULT_OCR_MODEL,
    chatCompletionsUrl: readTrimmed(env.YAOWO_ZHIPU_CHAT_COMPLETIONS_URL) ?? DEFAULT_CHAT_COMPLETIONS_URL,
    ocrUrl: readTrimmed(env.YAOWO_ZHIPU_OCR_URL) ?? DEFAULT_OCR_URL
  };
}

export function getAiProviderStatus(env: AiProviderEnv = process.env): AiProviderStatus {
  const provider = resolveProvider(env);
  const missing = readTrimmed(env.YAOWO_ZHIPU_API_KEY) ? [] : ["YAOWO_ZHIPU_API_KEY"];

  return {
    provider,
    configured: missing.length === 0,
    visionModel: readTrimmed(env.YAOWO_VISION_MODEL) ?? DEFAULT_VISION_MODEL,
    ocrModel: readTrimmed(env.YAOWO_OCR_MODEL) ?? DEFAULT_OCR_MODEL,
    missing
  };
}

function resolveProvider(env: AiProviderEnv): AiProvider {
  const provider = readTrimmed(env.YAOWO_AI_PROVIDER) ?? DEFAULT_PROVIDER;
  if (provider !== "zhipu") {
    throw new Error(`Unsupported AI provider: ${provider}`);
  }

  return provider;
}

function readTrimmed(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
