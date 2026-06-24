import { describe, expect, test } from "vitest";
import { buildYouyuanSearchUrl, signMtopRequest } from "../src/h5-upload.js";

describe("signMtopRequest", () => {
  test("matches mtop md5 signing format", () => {
    expect(signMtopRequest("token", "123", "app", '{"x":1}')).toBe(
      "d7bf3a6ea40eeb534fe7f7c9b1facdc1",
    );
  });
});

describe("buildYouyuanSearchUrl", () => {
  test("builds the official image search page URL", () => {
    expect(buildYouyuanSearchUrl("123456")).toBe(
      "https://s.1688.com/youyuan/index.htm?tab=imageSearch&imageId=123456&imageIdList=123456",
    );
  });
});
