import { describe, expect, it, vi } from "vitest";

import { callZhipuOcr, callZhipuVisionJson, testZhipuOcrConnection, testZhipuVisionConnection } from "../src/ai/zhipu-client.js";

const config = {
  provider: "zhipu" as const,
  apiKey: "unit-test-key",
  visionModel: "glm-4.6v-flashx",
  ocrModel: "glm-ocr",
  chatCompletionsUrl: "https://example.test/chat",
  ocrUrl: "https://example.test/ocr"
};

describe("Zhipu AI client", () => {
  it("calls the configured vision endpoint and parses JSON content", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        choices: [
          {
            message: {
              content: '{"sameItemProbability":0.91,"matchingReason":"same shape","riskPoints":["logo differs"]}'
            }
          }
        ]
      })
    );

    const result = await callZhipuVisionJson({
      config,
      prompt: "compare",
      images: ["https://img.example.com/a.jpg", "https://img.example.com/b.jpg"],
      fetchImpl
    });

    expect(result).toEqual({
      sameItemProbability: 0.91,
      matchingReason: "same shape",
      riskPoints: ["logo differs"]
    });
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
    expect(body.model).toBe("glm-4.6v-flashx");
    expect(body.thinking).toEqual({ type: "disabled" });
    expect(body.messages[0].content).toEqual(
      expect.arrayContaining([
        { type: "text", text: "compare" },
        { type: "image_url", image_url: { url: "https://img.example.com/a.jpg" } },
        { type: "image_url", image_url: { url: "https://img.example.com/b.jpg" } }
      ])
    );
  });

  it("calls the configured OCR endpoint with the OCR model and file", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      jsonResponse({
        md_results: [{ content: "Size: 20x10x5cm" }]
      })
    );

    const result = await callZhipuOcr({
      config,
      file: "data:image/png;base64,AAAA",
      fetchImpl
    });

    expect(result).toEqual({ md_results: [{ content: "Size: 20x10x5cm" }] });
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://example.test/ocr",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer unit-test-key"
        })
      })
    );
    expect(JSON.parse(fetchImpl.mock.calls[0][1].body)).toEqual({
      model: "glm-ocr",
      file: "data:image/png;base64,AAAA"
    });
  });

  it("returns safe health-check results for both configured models", async () => {
    const visionFetch = vi.fn().mockResolvedValue(jsonResponse({ choices: [{ message: { content: '{"ok":true}' } }] }));
    const ocrFetch = vi.fn().mockResolvedValue(jsonResponse({ md_results: [] }));

    await expect(testZhipuVisionConnection({ config, fetchImpl: visionFetch })).resolves.toEqual({
      ok: true,
      provider: "zhipu",
      model: "glm-4.6v-flashx"
    });
    await expect(
      testZhipuOcrConnection({ config, file: "data:image/png;base64,AAAA", fetchImpl: ocrFetch })
    ).resolves.toEqual({
      ok: true,
      provider: "zhipu",
      model: "glm-ocr"
    });
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
