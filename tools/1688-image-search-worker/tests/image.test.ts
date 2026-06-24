import fs from "node:fs/promises";
import { afterEach, describe, expect, test, vi } from "vitest";
import { downloadImageToTemp, guessImageExt } from "../src/image.js";

const createdFiles: string[] = [];

afterEach(async () => {
  vi.unstubAllGlobals();
  await Promise.all(createdFiles.map((file) => fs.rm(file, { force: true })));
  createdFiles.length = 0;
});

describe("guessImageExt", () => {
  test("uses the response content type when it conflicts with the URL extension", () => {
    expect(guessImageExt("https://example.com/a.jpg", "image/webp")).toBe(".webp");
    expect(guessImageExt("https://example.com/a.webp", "image/jpeg")).toBe(".jpg");
  });

  test("uses URL extension only when the content type is not an image", () => {
    expect(guessImageExt("https://example.com/a.webp?x=1", null)).toBe(".webp");
    expect(guessImageExt("https://example.com/no-ext", "text/html")).toBe(".jpg");
    expect(guessImageExt("https://example.com/no-ext", null)).toBe(".jpg");
  });
});

describe("downloadImageToTemp", () => {
  test("downloads an image URL into a temp file with cleanup", async () => {
    const body = new Uint8Array([1, 2, 3, 4]);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        statusText: "OK",
        headers: new Headers({ "content-type": "image/png" }),
        arrayBuffer: async () => body.buffer,
      })),
    );

    const downloaded = await downloadImageToTemp("https://example.com/image");
    createdFiles.push(downloaded.path);

    expect(downloaded.path.endsWith(".png")).toBe(true);
    expect(await fs.readFile(downloaded.path)).toEqual(Buffer.from(body));

    await downloaded.cleanup();
    await expect(fs.stat(downloaded.path)).rejects.toThrow();
    createdFiles.length = 0;
  });
});
