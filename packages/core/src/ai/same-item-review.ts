import type { AiProviderConfig } from "./provider-config.js";
import { callZhipuVisionJson } from "./zhipu-client.js";

export interface SameItemCandidateInput {
  rank: number;
  title: string;
  imageUrl: string;
  unitPrice: string;
  monthlySales: number | null;
  shopName: string;
}

export interface ScoreSameItemCandidateInput {
  config: AiProviderConfig;
  sourceImageUrl: string;
  parentSku: string;
  candidate: SameItemCandidateInput;
  fetchImpl?: typeof fetch;
}

export interface SameItemReviewResult {
  sameItemProbability: number;
  matchingReason: string;
  riskPoints: string[];
}

export async function scoreSameItemCandidate(input: ScoreSameItemCandidateInput): Promise<SameItemReviewResult> {
  const raw = await callZhipuVisionJson({
    config: input.config,
    prompt: buildSameItemPrompt(input),
    images: [input.sourceImageUrl, input.candidate.imageUrl].filter(Boolean),
    fetchImpl: input.fetchImpl
  });

  return normalizeSameItemReview(raw);
}

export function normalizeSameItemReview(raw: unknown): SameItemReviewResult {
  const value = raw as {
    sameItemProbability?: unknown;
    matchingReason?: unknown;
    riskPoints?: unknown;
  };
  const probability = normalizeProbability(value.sameItemProbability);
  const matchingReason = typeof value.matchingReason === "string" ? value.matchingReason.trim() : "";
  const riskPoints = Array.isArray(value.riskPoints)
    ? value.riskPoints.filter((point): point is string => typeof point === "string").map((point) => point.trim()).filter(Boolean)
    : [];

  return {
    sameItemProbability: probability,
    matchingReason: matchingReason || "AI 未提供明确匹配理由",
    riskPoints
  };
}

function buildSameItemPrompt(input: ScoreSameItemCandidateInput): string {
  return [
    "你是跨境电商货源同款审核助手。",
    "请比较第1张图片中的采集源商品，与第2张图片中的1688候选商品是否为几乎一样的同款。",
    "重点判断：主体结构、轮廓、关键部件、图案位置、材质观感、套装组成是否一致；颜色、拍摄角度、轻微光线差异不要单独作为否定依据。",
    "如果只是同类、相似款、局部结构不同、配件不同、图案不同，应降低概率。",
    "只返回 JSON，不要 Markdown，不要解释。",
    'JSON 格式：{"sameItemProbability":0到1的小数,"matchingReason":"一句话理由","riskPoints":["风险点1","风险点2"]}',
    `父SKU：${input.parentSku}`,
    `候选排序：${input.candidate.rank}`,
    `候选标题：${input.candidate.title}`,
    `候选价格：${input.candidate.unitPrice || "未知"}`,
    `候选月销：${input.candidate.monthlySales ?? "未知"}`,
    `候选店铺：${input.candidate.shopName || "未知"}`
  ].join("\n");
}

function normalizeProbability(value: unknown): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return 0;
  const asRatio = numeric > 1 ? numeric / 100 : numeric;
  return Math.min(1, Math.max(0, Math.round(asRatio * 100) / 100));
}
