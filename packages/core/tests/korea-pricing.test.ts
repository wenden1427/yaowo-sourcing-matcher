import { describe, expect, it } from "vitest";

import { calculateKoreaListingPrice } from "../src/pricing/korea.js";

describe("calculateKoreaListingPrice", () => {
  it("calculates air and sea listing prices from cost, ROI, and multiplier", () => {
    const result = calculateKoreaListingPrice({
      purchasePriceRmb: 50,
      domesticFreightRmb: 5,
      weightKg: 1,
      lengthCm: 20,
      widthCm: 20,
      heightCm: 20,
      targetRoi: 0.3,
      priceMultiplier: 1.1,
      airEnabled: true,
      seaEnabled: true
    });

    expect(result.recommendedChannel).toBe("sea");
    expect(result.recommendedPriceKrw).toBe(30200);
    expect(result.channels.air).toMatchObject({
      available: true,
      baseInternationalFreightRmb: 33,
      cjSurchargeRmb: 0,
      totalCostRmb: 88,
      listingPriceKrw: 32200
    });
    expect(result.channels.sea).toMatchObject({
      available: true,
      baseInternationalFreightRmb: 27.5,
      cjSurchargeRmb: 0,
      totalCostRmb: 82.5,
      listingPriceKrw: 30200
    });
  });

  it("uses the higher CJ surcharge tier from weight and size", () => {
    const result = calculateKoreaListingPrice({
      purchasePriceRmb: 20,
      domesticFreightRmb: 0,
      weightKg: 3,
      lengthCm: 30,
      widthCm: 30,
      heightCm: 50,
      targetRoi: 0.4,
      priceMultiplier: 1,
      airEnabled: false,
      seaEnabled: true
    });

    expect(result.channels.sea).toMatchObject({
      available: true,
      cjSurchargeRmb: 5.5
    });
  });

  it("marks disabled or overweight channels unavailable", () => {
    const result = calculateKoreaListingPrice({
      purchasePriceRmb: 100,
      domesticFreightRmb: 0,
      weightKg: 21,
      lengthCm: 20,
      widthCm: 20,
      heightCm: 20,
      targetRoi: 0.3,
      priceMultiplier: 1,
      airEnabled: false,
      seaEnabled: true
    });

    expect(result.recommendedChannel).toBeNull();
    expect(result.channels.air).toMatchObject({ available: false, unavailableReason: "disabled" });
    expect(result.channels.sea).toMatchObject({ available: false, unavailableReason: "overweight" });
  });
});
