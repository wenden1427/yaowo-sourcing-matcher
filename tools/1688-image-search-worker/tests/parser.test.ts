import { describe, expect, test } from "vitest";
import { extractOffersFromMtopResponse, parseMtopJsonp } from "../src/parser.js";

describe("parseMtopJsonp", () => {
  test("parses plain JSON and mtopjsonp callback bodies", () => {
    expect(parseMtopJsonp('{"ok":true}')).toEqual({ ok: true });
    expect(parseMtopJsonp('mtopjsonp3({"ok":true})')).toEqual({ ok: true });
  });
});

describe("extractOffersFromMtopResponse", () => {
  test("maps 1688 wireless recommend offer items into normalized offers", () => {
    const raw = {
      data: {
        data: {
          OFFER: {
            items: [
              {
                data: {
                  offerId: "888888888888",
                  title: "<font>透明</font>宠物笼 亚克力仓鼠笼",
                  priceInfo: { price: "12.80" },
                  offerPicUrl: "https://cbu01.alicdn.com/img/test.jpg",
                  province: "浙江",
                  city: "金华",
                  bookedCount: "已售2000+",
                  isP4P: "false",
                  bizType: "生产加工",
                  factoryInspection: "true",
                  businessInspection: "false",
                  superFactory: "true",
                  tags: [{ text: "7天无理由" }, { text: "先采后付" }],
                  winPortUrl: "https://shop.1688.com",
                  shop: { text: "义乌某某用品厂", tpYear: "5" },
                  shopAddition: { shopLinkUrl: "https://shop-link.1688.com" },
                },
              },
              { data: { title: "missing offer id" } },
            ],
          },
        },
      },
    };

    expect(extractOffersFromMtopResponse(JSON.stringify(raw))).toEqual([
      {
        offerId: "888888888888",
        title: "透明宠物笼 亚克力仓鼠笼",
        url: "https://detail.1688.com/offer/888888888888.html",
        image: "https://cbu01.alicdn.com/img/test.jpg",
        price: { text: "¥12.80", min: 12.8, max: 12.8 },
        supplier: {
          name: "义乌某某用品厂",
          shopUrl: "https://shop-link.1688.com",
          years: 5,
        },
        location: { province: "浙江", city: "金华" },
        bizType: "生产加工",
        verified: { factory: true, business: false, superFactory: true },
        tags: ["7天无理由", "先采后付"],
        isP4P: false,
        turnover: "已售2000+",
      },
    ]);
  });
});
