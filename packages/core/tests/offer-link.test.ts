import { describe, expect, it } from "vitest";

import { normalize1688OfferLink } from "../src/1688/offer-link.js";

describe("normalize1688OfferLink", () => {
  it("normalizes desktop detail offer links and extracts offerId", () => {
    expect(normalize1688OfferLink("https://detail.1688.com/offer/123456789012.html?spm=a26352")).toEqual({
      ok: true,
      offerId: "123456789012",
      normalizedUrl: "https://detail.1688.com/offer/123456789012.html"
    });
  });

  it("normalizes mobile offer links to the canonical detail URL", () => {
    expect(normalize1688OfferLink("https://m.1688.com/offer/987654321098.html")).toEqual({
      ok: true,
      offerId: "987654321098",
      normalizedUrl: "https://detail.1688.com/offer/987654321098.html"
    });
  });

  it("rejects non-offer 1688 pages", () => {
    const urls = [
      "https://login.1688.com/member/signin.htm",
      "https://s.1688.com/selloffer/offer_search.htm?keywords=test",
      "https://shop123456.1688.com/",
      "https://www.1688.com/",
      "https://detail.1688.com/page/index.html"
    ];

    for (const url of urls) {
      expect(normalize1688OfferLink(url), url).toMatchObject({ ok: false });
    }
  });

  it("rejects non-1688 domains even if the path contains an offer id", () => {
    expect(normalize1688OfferLink("https://example.com/offer/123456789012.html")).toMatchObject({
      ok: false
    });
  });
});
