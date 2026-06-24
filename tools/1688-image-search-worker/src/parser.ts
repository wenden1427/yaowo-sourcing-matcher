import type { NormalizedOffer } from "./types.js";

export const SEARCH_MTOP_API =
  "mtop.relationrecommend.wirelessrecommend.recommend";
export const SEARCH_APP_ID = "32517";

interface RawOfferItem {
  data?: {
    offerId?: string;
    title?: string;
    priceInfo?: { price?: string };
    offerPicUrl?: string;
    province?: string;
    city?: string;
    bookedCount?: string;
    isP4P?: string;
    bizType?: string;
    factoryInspection?: string;
    businessInspection?: string;
    superFactory?: string;
    tags?: { text?: string }[];
    winPortUrl?: string;
    shop?: { text?: string; tpYear?: string };
    shopAddition?: { shopLinkUrl?: string };
  };
}

export function parseMtopJsonp(raw: string): unknown {
  const trimmed = raw.trim();
  const callbackMatch = trimmed.match(/^\s*mtopjsonp\w+\(([\s\S]*)\)\s*$/);
  return JSON.parse(callbackMatch ? callbackMatch[1]! : trimmed);
}

export function extractOffersFromMtopResponse(raw: string): NormalizedOffer[] {
  const json = parseMtopJsonp(raw) as {
    data?: { data?: { OFFER?: { items?: RawOfferItem[] } } };
  };
  const items = json?.data?.data?.OFFER?.items ?? [];
  return items
    .map(mapOffer)
    .filter((offer): offer is NormalizedOffer => offer !== null);
}

function mapOffer(item: RawOfferItem): NormalizedOffer | null {
  const data = item.data;
  if (!data?.offerId) return null;

  const title = (data.title ?? "").replace(/<\/?font[^>]*>/g, "").trim();
  const priceRaw = data.priceInfo?.price;
  const price = priceRaw ? Number.parseFloat(priceRaw) : null;
  const yearsRaw = data.shop?.tpYear;
  const years = yearsRaw ? Number.parseInt(yearsRaw, 10) : null;

  return {
    offerId: data.offerId,
    title,
    url: `https://detail.1688.com/offer/${data.offerId}.html`,
    image: data.offerPicUrl ?? null,
    price: {
      text: priceRaw ? `¥${priceRaw}` : "",
      min: Number.isFinite(price) ? price : null,
      max: Number.isFinite(price) ? price : null,
    },
    supplier: {
      name: data.shop?.text ?? null,
      shopUrl: data.shopAddition?.shopLinkUrl ?? data.winPortUrl ?? null,
      years: Number.isFinite(years) ? years : null,
    },
    location: {
      province: data.province ?? null,
      city: data.city ?? null,
    },
    bizType: data.bizType ?? null,
    verified: {
      factory: parseBool(data.factoryInspection),
      business: parseBool(data.businessInspection),
      superFactory: parseBool(data.superFactory),
    },
    tags: (data.tags ?? [])
      .map((tag) => tag.text?.trim() ?? "")
      .filter((tag) => tag.length > 0),
    isP4P: parseBool(data.isP4P),
    turnover: data.bookedCount ?? null,
  };
}

function parseBool(value?: string): boolean {
  return value === "true";
}
