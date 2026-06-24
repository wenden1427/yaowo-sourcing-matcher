export type KoreaShippingChannel = "air" | "sea";

export interface CalculateKoreaListingPriceInput {
  purchasePriceRmb: number;
  domesticFreightRmb: number;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  targetRoi: number;
  priceMultiplier?: number;
  commissionRate?: number;
  exchangeRateRmbPerKrw?: number;
  priceStepKrw?: number;
  airEnabled: boolean;
  seaEnabled: boolean;
}

export interface KoreaListingPriceResult {
  recommendedChannel: KoreaShippingChannel | null;
  recommendedPriceKrw: number | null;
  channels: Record<KoreaShippingChannel, KoreaChannelPriceResult>;
}

export type KoreaChannelPriceResult =
  | {
      available: true;
      channel: KoreaShippingChannel;
      baseInternationalFreightRmb: number;
      cjSurchargeRmb: number;
      totalCostRmb: number;
      rawListingPriceKrw: number;
      listingPriceKrw: number;
    }
  | {
      available: false;
      channel: KoreaShippingChannel;
      unavailableReason: "disabled" | "overweight" | "invalid_input";
    };

const DEFAULT_COMMISSION_RATE = 0.15;
const DEFAULT_EXCHANGE_RATE_RMB_PER_KRW = 0.0046;
const DEFAULT_PRICE_MULTIPLIER = 1;
const DEFAULT_PRICE_STEP_KRW = 100;

export function calculateKoreaListingPrice(input: CalculateKoreaListingPriceInput): KoreaListingPriceResult {
  const air = calculateChannel(input, "air");
  const sea = calculateChannel(input, "sea");
  const available = [air, sea].filter((channel): channel is Extract<KoreaChannelPriceResult, { available: true }> => {
    return channel.available;
  });
  available.sort((left, right) => left.listingPriceKrw - right.listingPriceKrw);
  const recommended = available[0] ?? null;

  return {
    recommendedChannel: recommended?.channel ?? null,
    recommendedPriceKrw: recommended?.listingPriceKrw ?? null,
    channels: { air, sea }
  };
}

function calculateChannel(input: CalculateKoreaListingPriceInput, channel: KoreaShippingChannel): KoreaChannelPriceResult {
  if ((channel === "air" && !input.airEnabled) || (channel === "sea" && !input.seaEnabled)) {
    return { available: false, channel, unavailableReason: "disabled" };
  }

  const invalid = [
    input.purchasePriceRmb,
    input.domesticFreightRmb,
    input.weightKg,
    input.lengthCm,
    input.widthCm,
    input.heightCm,
    input.targetRoi
  ].some((value) => !Number.isFinite(value) || value < 0);
  if (invalid) {
    return { available: false, channel, unavailableReason: "invalid_input" };
  }

  const baseInternationalFreightRmb = calculateBaseInternationalFreightRmb(channel, input.weightKg);
  if (baseInternationalFreightRmb === null) {
    return { available: false, channel, unavailableReason: "overweight" };
  }

  const commissionRate = input.commissionRate ?? DEFAULT_COMMISSION_RATE;
  const exchangeRate = input.exchangeRateRmbPerKrw ?? DEFAULT_EXCHANGE_RATE_RMB_PER_KRW;
  const priceMultiplier = input.priceMultiplier ?? DEFAULT_PRICE_MULTIPLIER;
  const priceStep = input.priceStepKrw ?? DEFAULT_PRICE_STEP_KRW;
  if (commissionRate < 0 || commissionRate >= 1 || exchangeRate <= 0 || priceMultiplier <= 0 || priceStep <= 0) {
    return { available: false, channel, unavailableReason: "invalid_input" };
  }

  const cjSurchargeRmb = calculateCjSurchargeRmb(input);
  const totalCostRmb =
    input.purchasePriceRmb + input.domesticFreightRmb + baseInternationalFreightRmb + cjSurchargeRmb;
  const rawListingPriceKrw = (totalCostRmb * (1 + input.targetRoi)) / ((1 - commissionRate) * exchangeRate);
  const listingPriceKrw = roundUp(rawListingPriceKrw * priceMultiplier, priceStep);

  return {
    available: true,
    channel,
    baseInternationalFreightRmb,
    cjSurchargeRmb,
    totalCostRmb,
    rawListingPriceKrw,
    listingPriceKrw
  };
}

function calculateBaseInternationalFreightRmb(channel: KoreaShippingChannel, weightKg: number): number | null {
  if (weightKg === 0) return 0;
  if (channel === "air") {
    return weightKg <= 2 ? weightKg * 12 + 18 + 3 : null;
  }
  return weightKg <= 20 ? weightKg * 3.5 + 21 + 3 : null;
}

function calculateCjSurchargeRmb(input: CalculateKoreaListingPriceInput): number {
  const sizeTier = surchargeByDimensionSum(input.lengthCm + input.widthCm + input.heightCm);
  const weightTier = surchargeByWeight(input.weightKg);
  return Math.max(sizeTier, weightTier);
}

function surchargeByDimensionSum(sumCm: number): number {
  if (sumCm < 80) return 0;
  if (sumCm < 100) return 2.98;
  if (sumCm < 120) return 5.5;
  if (sumCm < 140) return 12.62;
  return 13.99;
}

function surchargeByWeight(weightKg: number): number {
  if (weightKg <= 2) return 0;
  if (weightKg <= 5) return 2.98;
  if (weightKg <= 10) return 5.5;
  if (weightKg <= 15) return 12.62;
  return 13.99;
}

function roundUp(value: number, step: number): number {
  return Math.ceil(value / step) * step;
}
