export type Normalize1688OfferLinkResult =
  | {
      ok: true;
      offerId: string;
      normalizedUrl: string;
    }
  | {
      ok: false;
      reason: "invalid-url" | "non-1688-domain" | "non-offer-url";
    };

const OFFER_PATH_PATTERN = /\/offer\/(\d+)(?:\.html?)?/i;

export function normalize1688OfferLink(input: string): Normalize1688OfferLinkResult {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return { ok: false, reason: "invalid-url" };
  }

  const hostname = url.hostname.toLowerCase();
  if (hostname !== "1688.com" && !hostname.endsWith(".1688.com")) {
    return { ok: false, reason: "non-1688-domain" };
  }

  const offerId = extractOfferId(url);
  if (!offerId) {
    return { ok: false, reason: "non-offer-url" };
  }

  return {
    ok: true,
    offerId,
    normalizedUrl: `https://detail.1688.com/offer/${offerId}.html`
  };
}

function extractOfferId(url: URL): string | null {
  const pathMatch = url.pathname.match(OFFER_PATH_PATTERN);
  if (pathMatch) {
    return pathMatch[1];
  }

  const queryOfferId = url.searchParams.get("offerId") ?? url.searchParams.get("offerid");
  if (queryOfferId && /^\d+$/.test(queryOfferId)) {
    return queryOfferId;
  }

  return null;
}
