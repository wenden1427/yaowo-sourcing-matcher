import type { AiProviderConfig } from "./provider-config.js";

export interface ZhipuVisionJsonInput {
  config: AiProviderConfig;
  prompt: string;
  images?: string[];
  fetchImpl?: typeof fetch;
}

export interface ZhipuOcrInput {
  config: AiProviderConfig;
  file: string;
  fetchImpl?: typeof fetch;
}

export interface ZhipuConnectionTestResult {
  ok: true;
  provider: "zhipu";
  model: string;
}

export async function callZhipuVisionJson(input: ZhipuVisionJsonInput): Promise<unknown> {
  const response = await postJson(
    input.fetchImpl ?? fetch,
    input.config.chatCompletionsUrl,
    input.config.apiKey,
    {
      model: input.config.visionModel,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: input.prompt },
            ...(input.images ?? []).map((url) => ({
              type: "image_url",
              image_url: { url }
            }))
          ]
        }
      ],
      thinking: { type: "disabled" }
    }
  );

  const content = extractVisionContent(response);
  return parseJsonContent(content);
}

export async function callZhipuOcr(input: ZhipuOcrInput): Promise<unknown> {
  return postJson(input.fetchImpl ?? fetch, input.config.ocrUrl, input.config.apiKey, {
    model: input.config.ocrModel,
    file: input.file
  });
}

export async function testZhipuVisionConnection(input: {
  config: AiProviderConfig;
  fetchImpl?: typeof fetch;
}): Promise<ZhipuConnectionTestResult> {
  await callZhipuVisionJson({
    config: input.config,
    prompt: 'Return exactly this JSON: {"ok":true}',
    fetchImpl: input.fetchImpl
  });

  return {
    ok: true,
    provider: "zhipu",
    model: input.config.visionModel
  };
}

export async function testZhipuOcrConnection(input: {
  config: AiProviderConfig;
  file: string;
  fetchImpl?: typeof fetch;
}): Promise<ZhipuConnectionTestResult> {
  await callZhipuOcr({
    config: input.config,
    file: input.file,
    fetchImpl: input.fetchImpl
  });

  return {
    ok: true,
    provider: "zhipu",
    model: input.config.ocrModel
  };
}

async function postJson(fetchImpl: typeof fetch, url: string, apiKey: string, body: unknown): Promise<unknown> {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`Zhipu request failed: ${response.status} ${response.statusText} ${safeErrorBody(text)}`);
  }
  return text ? JSON.parse(text) : {};
}

function extractVisionContent(response: unknown): string {
  const content = (response as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Zhipu vision response did not include message content");
  }
  return content;
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

function safeErrorBody(text: string): string {
  return text.slice(0, 500);
}
