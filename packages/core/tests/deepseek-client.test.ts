import { describe, expect, it, vi } from "vitest";

import { extractChineseSearchKeyword } from "../src/ai/deepseek-client.js";

const config = {
  provider: "deepseek" as const,
  apiKey: "unit-test-key",
  model: "deepseek-v4-flash",
  chatCompletionsUrl: "https://example.test/chat"
};

describe("DeepSeek keyword client", () => {
  it("extracts and normalizes a Chinese search keyword from JSON content", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        choices: [
          {
            message: {
              content: '{"searchKeyword":"透明 宠物笼 仓鼠笼 亚克力 亚克力"}'
            }
          }
        ]
      })
    );

    const keyword = await extractChineseSearchKeyword({
      config,
      sourceTitle: "Acrylic hamster cage",
      productTag: "pet cage hamster transparent acrylic",
      parentSku: "P1",
      fetchImpl
    });

    expect(keyword).toBe("透明 宠物笼 仓鼠笼 亚克力");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://example.test/chat",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer unit-test-key"
        })
      })
    );
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(body.model).toBe("deepseek-v4-flash");
    expect(body.response_format).toEqual({ type: "json_object" });
    expect(body.messages[1].content).toContain("pet cage hamster transparent acrylic");
  });

  it("accepts a keywords array and limits the normalized term count", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        choices: [
          {
            message: {
              content: '{"keywords":["透明","宠物笼","仓鼠笼","亚克力","笼子","小宠","多余"]}'
            }
          }
        ]
      })
    );

    await expect(
      extractChineseSearchKeyword({
        config,
        sourceTitle: "",
        productTag: "pet cage",
        fetchImpl
      })
    ).resolves.toBe("透明 宠物笼 仓鼠笼 亚克力 笼子 小宠");
  });
});

function jsonResponse(body: unknown): Response {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => JSON.stringify(body)
  } as Response;
}
