export interface DeepSeekKeywordConfig {
  provider: "deepseek";
  apiKey: string;
  model: string;
  chatCompletionsUrl: string;
}

export interface ExtractChineseSearchKeywordInput {
  config: DeepSeekKeywordConfig;
  sourceTitle: string;
  productTag: string;
  parentSku?: string;
  fetchImpl?: typeof fetch;
}

export async function extractChineseSearchKeyword(input: ExtractChineseSearchKeywordInput): Promise<string> {
  const response = await postJson(input.fetchImpl ?? fetch, input.config.chatCompletionsUrl, input.config.apiKey, {
    model: input.config.model,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "你是跨境电商1688搜图关键词助手。只输出JSON。把英文/多语言产品标签和标题提炼成适合1688搜索结果校正的中文商品核心词，不要输出SKU、颜色、营销词、平台词。"
      },
      {
        role: "user",
        content: JSON.stringify({
          task: "提炼3到6个中文核心商品词，按重要性排序。",
          output: { searchKeyword: "中文词1 中文词2 中文词3" },
          parentSku: input.parentSku ?? "",
          productTag: input.productTag,
          sourceTitle: input.sourceTitle
        })
      }
    ]
  });

  return normalizeKeyword(extractKeyword(response));
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
    throw new Error(`DeepSeek request failed: ${response.status} ${response.statusText} ${safeErrorBody(text)}`);
  }
  return text ? JSON.parse(text) : {};
}

function extractKeyword(response: unknown): string {
  const content = (response as { choices?: Array<{ message?: { content?: unknown } }> }).choices?.[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("DeepSeek response did not include message content");
  }

  const parsed = parseJsonContent(content) as {
    searchKeyword?: unknown;
    keyword?: unknown;
    keywords?: unknown;
  };
  if (typeof parsed.searchKeyword === "string") {
    return parsed.searchKeyword;
  }
  if (typeof parsed.keyword === "string") {
    return parsed.keyword;
  }
  if (Array.isArray(parsed.keywords)) {
    return parsed.keywords.filter((item): item is string => typeof item === "string").join(" ");
  }

  throw new Error("DeepSeek keyword response did not include searchKeyword");
}

function parseJsonContent(content: string): unknown {
  const trimmed = content.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return JSON.parse(fenced ? fenced[1] : trimmed);
}

function normalizeKeyword(value: string): string {
  const tokens = value
    .replace(/[，、,;/|]+/g, " ")
    .split(/\s+/)
    .map((token) => token.trim())
    .filter(Boolean);
  const unique: string[] = [];
  for (const token of tokens) {
    if (!unique.includes(token)) {
      unique.push(token);
    }
    if (unique.length >= 6) {
      break;
    }
  }
  return unique.join(" ");
}

function safeErrorBody(text: string): string {
  return text.slice(0, 500);
}
