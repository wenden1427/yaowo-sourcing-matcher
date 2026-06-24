import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

import type { AiProviderConfig, AiProviderStatus, DeepSeekKeywordConfig } from "@yaowo/core";

export interface SecretCipher {
  encrypt(value: string): string;
  decrypt(value: string): string;
  isEncryptionAvailable(): boolean;
}

export type AiSettingsEnv = Record<string, string | undefined>;

export interface AiSettingsStoreOptions {
  defaultsPath?: string;
}

export interface SaveAiSettingsInput {
  apiKey?: string;
  visionModel?: string;
  ocrModel?: string;
  chatCompletionsUrl?: string;
  ocrUrl?: string;
  deepseekApiKey?: string;
  deepseekModel?: string;
  deepseekChatCompletionsUrl?: string;
}

export interface AiSettingsView extends AiProviderStatus {
  hasStoredApiKey: boolean;
  chatCompletionsUrl: string;
  ocrUrl: string;
  deepseekConfigured: boolean;
  hasStoredDeepSeekApiKey: boolean;
  deepseekModel: string;
  deepseekChatCompletionsUrl: string;
  deepseekMissing: string[];
}

interface StoredAiSettings {
  provider: "zhipu";
  encryptedApiKey?: string;
  encryptedDeepSeekApiKey?: string;
  visionModel: string;
  ocrModel: string;
  chatCompletionsUrl: string;
  ocrUrl: string;
  deepseekModel: string;
  deepseekChatCompletionsUrl: string;
}

const DEFAULT_VISION_MODEL = "glm-4.6v-flashx";
const DEFAULT_OCR_MODEL = "glm-ocr";
const DEFAULT_CHAT_COMPLETIONS_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";
const DEFAULT_OCR_URL = "https://open.bigmodel.cn/api/paas/v4/layout_parsing";
const DEFAULT_DEEPSEEK_MODEL = "deepseek-v4-flash";
const DEFAULT_DEEPSEEK_CHAT_COMPLETIONS_URL = "https://api.deepseek.com/chat/completions";

export function createAiSettingsStore(
  filePath: string,
  cipher: SecretCipher,
  env: AiSettingsEnv = process.env,
  options: AiSettingsStoreOptions = {}
) {
  return {
    loadView(): AiSettingsView {
      const stored = loadStored(filePath, options.defaultsPath);
      const hasStoredApiKey = Boolean(stored.encryptedApiKey);
      const hasAnyApiKey = hasStoredApiKey || Boolean(clean(env.YAOWO_ZHIPU_API_KEY));
      const missing = hasAnyApiKey ? [] : ["YAOWO_ZHIPU_API_KEY"];
      const hasStoredDeepSeekApiKey = Boolean(stored.encryptedDeepSeekApiKey);
      const hasAnyDeepSeekApiKey = hasStoredDeepSeekApiKey || Boolean(clean(env.YAOWO_DEEPSEEK_API_KEY));
      const deepseekMissing = hasAnyDeepSeekApiKey ? [] : ["YAOWO_DEEPSEEK_API_KEY"];
      return {
        provider: "zhipu",
        configured: missing.length === 0,
        hasStoredApiKey,
        visionModel: stored.visionModel,
        ocrModel: stored.ocrModel,
        chatCompletionsUrl: stored.chatCompletionsUrl,
        ocrUrl: stored.ocrUrl,
        missing,
        deepseekConfigured: deepseekMissing.length === 0,
        hasStoredDeepSeekApiKey,
        deepseekModel: stored.deepseekModel,
        deepseekChatCompletionsUrl: stored.deepseekChatCompletionsUrl,
        deepseekMissing
      };
    },

    loadRuntimeConfig(): AiProviderConfig {
      const stored = loadStored(filePath, options.defaultsPath);
      const apiKey = stored.encryptedApiKey ? cipher.decrypt(stored.encryptedApiKey) : (clean(env.YAOWO_ZHIPU_API_KEY) ?? "");
      if (!apiKey) {
        throw new Error("YAOWO_ZHIPU_API_KEY is not configured");
      }
      return {
        provider: "zhipu",
        apiKey,
        visionModel: stored.visionModel,
        ocrModel: stored.ocrModel,
        chatCompletionsUrl: stored.chatCompletionsUrl,
        ocrUrl: stored.ocrUrl
      };
    },

    loadDeepSeekRuntimeConfig(): DeepSeekKeywordConfig {
      const stored = loadStored(filePath, options.defaultsPath);
      const apiKey = stored.encryptedDeepSeekApiKey
        ? cipher.decrypt(stored.encryptedDeepSeekApiKey)
        : (clean(env.YAOWO_DEEPSEEK_API_KEY) ?? "");
      if (!apiKey) {
        throw new Error("YAOWO_DEEPSEEK_API_KEY is not configured");
      }
      return {
        provider: "deepseek",
        apiKey,
        model: stored.deepseekModel,
        chatCompletionsUrl: stored.deepseekChatCompletionsUrl
      };
    },

    save(input: SaveAiSettingsInput): AiSettingsView {
      if (!cipher.isEncryptionAvailable()) {
        throw new Error("当前系统不可用安全加密存储，请先解锁系统账户后重试");
      }
      const previous = loadStored(filePath, options.defaultsPath);
      const next: StoredAiSettings = {
        provider: "zhipu",
        encryptedApiKey: previous.encryptedApiKey,
        encryptedDeepSeekApiKey: previous.encryptedDeepSeekApiKey,
        visionModel: clean(input.visionModel) ?? previous.visionModel,
        ocrModel: clean(input.ocrModel) ?? previous.ocrModel,
        chatCompletionsUrl: clean(input.chatCompletionsUrl) ?? previous.chatCompletionsUrl,
        ocrUrl: clean(input.ocrUrl) ?? previous.ocrUrl,
        deepseekModel: clean(input.deepseekModel) ?? previous.deepseekModel,
        deepseekChatCompletionsUrl:
          clean(input.deepseekChatCompletionsUrl) ?? previous.deepseekChatCompletionsUrl
      };

      const apiKey = clean(input.apiKey);
      if (apiKey) {
        next.encryptedApiKey = cipher.encrypt(apiKey);
      }
      const deepseekApiKey = clean(input.deepseekApiKey);
      if (deepseekApiKey) {
        next.encryptedDeepSeekApiKey = cipher.encrypt(deepseekApiKey);
      }

      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
      return this.loadView();
    },

    exportDistributionDefaults(outputPath: string): void {
      const stored = loadStored(filePath, options.defaultsPath);
      const safeDefaults: StoredAiSettings = {
        provider: "zhipu",
        visionModel: stored.visionModel,
        ocrModel: stored.ocrModel,
        chatCompletionsUrl: stored.chatCompletionsUrl,
        ocrUrl: stored.ocrUrl,
        deepseekModel: stored.deepseekModel,
        deepseekChatCompletionsUrl: stored.deepseekChatCompletionsUrl
      };
      mkdirSync(dirname(outputPath), { recursive: true });
      writeFileSync(outputPath, `${JSON.stringify(safeDefaults, null, 2)}\n`, "utf8");
    }
  };
}

function loadStored(filePath: string, defaultsPath?: string): StoredAiSettings {
  if (!existsSync(filePath)) {
    return loadDefaults(defaultsPath);
  }

  try {
    const parsed = JSON.parse(readFileSync(filePath, "utf8")) as Partial<StoredAiSettings>;
    return {
      provider: "zhipu",
      encryptedApiKey: clean(parsed.encryptedApiKey),
      encryptedDeepSeekApiKey: clean(parsed.encryptedDeepSeekApiKey),
      visionModel: clean(parsed.visionModel) ?? DEFAULT_VISION_MODEL,
      ocrModel: clean(parsed.ocrModel) ?? DEFAULT_OCR_MODEL,
      chatCompletionsUrl: clean(parsed.chatCompletionsUrl) ?? DEFAULT_CHAT_COMPLETIONS_URL,
      ocrUrl: clean(parsed.ocrUrl) ?? DEFAULT_OCR_URL,
      deepseekModel: clean(parsed.deepseekModel) ?? DEFAULT_DEEPSEEK_MODEL,
      deepseekChatCompletionsUrl:
        clean(parsed.deepseekChatCompletionsUrl) ?? DEFAULT_DEEPSEEK_CHAT_COMPLETIONS_URL
    };
  } catch {
    return loadDefaults(defaultsPath);
  }
}

function loadDefaults(defaultsPath?: string): StoredAiSettings {
  if (!defaultsPath || !existsSync(defaultsPath)) {
    return defaultSettings();
  }

  try {
    const parsed = JSON.parse(readFileSync(defaultsPath, "utf8")) as Partial<StoredAiSettings>;
    return {
      provider: "zhipu",
      visionModel: clean(parsed.visionModel) ?? DEFAULT_VISION_MODEL,
      ocrModel: clean(parsed.ocrModel) ?? DEFAULT_OCR_MODEL,
      chatCompletionsUrl: clean(parsed.chatCompletionsUrl) ?? DEFAULT_CHAT_COMPLETIONS_URL,
      ocrUrl: clean(parsed.ocrUrl) ?? DEFAULT_OCR_URL,
      deepseekModel: clean(parsed.deepseekModel) ?? DEFAULT_DEEPSEEK_MODEL,
      deepseekChatCompletionsUrl:
        clean(parsed.deepseekChatCompletionsUrl) ?? DEFAULT_DEEPSEEK_CHAT_COMPLETIONS_URL
    };
  } catch {
    return defaultSettings();
  }
}

function defaultSettings(): StoredAiSettings {
  return {
    provider: "zhipu",
    visionModel: DEFAULT_VISION_MODEL,
    ocrModel: DEFAULT_OCR_MODEL,
    chatCompletionsUrl: DEFAULT_CHAT_COMPLETIONS_URL,
    ocrUrl: DEFAULT_OCR_URL,
    deepseekModel: DEFAULT_DEEPSEEK_MODEL,
    deepseekChatCompletionsUrl: DEFAULT_DEEPSEEK_CHAT_COMPLETIONS_URL
  };
}

function clean(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}
