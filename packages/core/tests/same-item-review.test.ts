import { describe, expect, it, vi } from "vitest";

import { scoreSameItemCandidate } from "../src/ai/same-item-review.js";

const config = {
  provider: "zhipu" as const,
  apiKey: "unit-test-key",
  visionModel: "glm-4.6v-flashx",
  ocrModel: "glm-ocr",
  chatCompletionsUrl: "https://example.test/chat",
  ocrUrl: "https://example.test/ocr"
};

describe("scoreSameItemCandidate", () => {
  it("uses the configured vision model and normalizes same-item JSON", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      text: async () =>
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  sameItemProbability: 92,
                  matchingReason: "鞋面结构、鞋底纹路和配色布局基本一致",
                  riskPoints: ["候选图没有展示鞋盒包装"]
                })
              }
            }
          ]
        })
    } as Response);

    const result = await scoreSameItemCandidate({
      config,
      sourceImageUrl: "https://img.example.com/source.jpg",
      parentSku: "P1",
      candidate: {
        rank: 1,
        title: "running shoes",
        imageUrl: "https://img.example.com/candidate.jpg",
        unitPrice: "12.80",
        monthlySales: 321,
        shopName: "source shop"
      },
      fetchImpl
    });

    expect(result).toEqual({
      sameItemProbability: 0.92,
      matchingReason: "鞋面结构、鞋底纹路和配色布局基本一致",
      riskPoints: ["候选图没有展示鞋盒包装"]
    });
    const body = JSON.parse(fetchImpl.mock.calls[0][1].body);
    expect(body.model).toBe("glm-4.6v-flashx");
    expect(body.messages[0].content).toEqual(
      expect.arrayContaining([
        { type: "image_url", image_url: { url: "https://img.example.com/source.jpg" } },
        { type: "image_url", image_url: { url: "https://img.example.com/candidate.jpg" } }
      ])
    );
  });
});
