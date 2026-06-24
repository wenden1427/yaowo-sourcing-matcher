import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { App } from "../src/renderer/App.js";

describe("App", () => {
  beforeEach(() => {
    window.yaowo = {
      getAppVersion: vi.fn().mockResolvedValue("0.1.0"),
      listBatches: vi.fn().mockResolvedValue([
        {
          id: 1,
          name: "0615 测试批次",
          status: "imported",
          parentSkuCount: 2,
          childSkuCount: 3,
          searchCompletedCount: 1,
          searchFailedCount: 1,
          searchRunningCount: 0,
          searchPendingCount: 0,
          searchBlockingFailedCount: 1,
          createdAt: "2026-06-15 16:20:00"
        }
      ]),
      importWorkbook: vi.fn().mockResolvedValue({
        batchId: 2,
        parentSkuCount: 10,
        childSkuCount: 24
      }),
      exportSourcedWorkbook: vi.fn().mockResolvedValue({
        outputPath: "E:/exports/sourced.xlsx",
        parentSkuCount: 1,
        childSkuCount: 2
      }),
      exportFullReviewWorkbook: vi.fn().mockResolvedValue({
        outputPath: "E:/exports/full-review.xlsx",
        parentSkuCount: 2,
        childSkuCount: 3
      }),
      open1688Login: vi.fn().mockResolvedValue({
        profileDir: "C:/Users/Administrator/AppData/Roaming/yaowo-sourcing-matcher/1688-image-search-profile"
      }),
      runNextImageSearchJob: vi.fn().mockResolvedValue({
        status: "completed",
        parentSku: "P1",
        storedCandidateCount: 2
      }),
      runParentImageSearchJob: vi.fn().mockResolvedValue({
        status: "completed",
        parentSku: "P1",
        storedCandidateCount: 2
      }),
      runBatchImageSearchJobs: vi.fn().mockResolvedValue({
        status: "completed",
        stoppedReason: "idle",
        attemptedCount: 2,
        completedCount: 2,
        failedCount: 0
      }),
      runBatchAiReview: vi.fn().mockResolvedValue({
        attemptedCount: 2,
        completedCount: 2,
        failedCount: 0
      }),
      stopBatchImageSearchJobs: vi.fn().mockResolvedValue({
        stopRequested: true
      }),
      resetFailedImageSearchJobs: vi.fn().mockResolvedValue({
        resetCount: 1
      }),
      resetRunningImageSearchJobs: vi.fn().mockResolvedValue({
        resetCount: 1
      }),
      getAiProviderStatus: vi.fn().mockResolvedValue({
        provider: "zhipu",
        configured: true,
        hasStoredApiKey: true,
        visionModel: "glm-4.6v-flashx",
        ocrModel: "glm-ocr",
        chatCompletionsUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        ocrUrl: "https://open.bigmodel.cn/api/paas/v4/layout_parsing",
        missing: [],
        deepseekConfigured: true,
        hasStoredDeepSeekApiKey: true,
        deepseekModel: "deepseek-v4-flash",
        deepseekChatCompletionsUrl: "https://api.deepseek.com/chat/completions",
        deepseekMissing: []
      }),
      saveAiSettings: vi.fn().mockResolvedValue({
        provider: "zhipu",
        configured: true,
        hasStoredApiKey: true,
        visionModel: "glm-4.6v-flashx",
        ocrModel: "glm-ocr",
        chatCompletionsUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        ocrUrl: "https://open.bigmodel.cn/api/paas/v4/layout_parsing",
        missing: [],
        deepseekConfigured: true,
        hasStoredDeepSeekApiKey: true,
        deepseekModel: "deepseek-v4-flash",
        deepseekChatCompletionsUrl: "https://api.deepseek.com/chat/completions",
        deepseekMissing: []
      }),
      testAiVisionConnection: vi.fn().mockResolvedValue({
        ok: true,
        provider: "zhipu",
        model: "glm-4.6v-flashx"
      }),
      testAiOcrConnection: vi.fn().mockResolvedValue({
        ok: true,
        provider: "zhipu",
        model: "glm-ocr"
      }),
      openLogsDir: vi.fn().mockResolvedValue("C:/Users/Administrator/AppData/Roaming/yaowo-sourcing-matcher/logs"),
      listFailedImageSearchJobs: vi.fn().mockResolvedValue([
        {
          parentSku: "P1",
          errorCode: "login_expired",
          errorMessage: "1688 login expired",
          finishedAt: "2026-06-16 13:00:00"
        }
      ]),
      listReviewItems: vi.fn().mockResolvedValue([
        {
          parentSku: "P1",
          defaultSearchImageUrl: "https://img.example.com/p1.jpg",
          sourceUrl: "https://www.aliexpress.com/item/100500.html",
          childSkuCount: 2,
          isExcluded: false,
          reviewStatus: "unreviewed",
          manual1688Url: "",
          manualPrice: "",
          matchingReason: "",
          childSkus: [
            {
              sku: "P1-red-s",
              color: "红色",
              size: "S",
              variantImageUrl: "https://img.example.com/p1-red-s.jpg",
              sourcePrice: "10000",
              manualPrice: "",
              appliedPrice: "10000",
              priceSource: "original",
              isExcluded: false
            },
            {
              sku: "P1-red-m",
              color: "攴鸽Π",
              size: "L",
              variantImageUrl: "https://img.example.com/p1-red-m.jpg",
              sourcePrice: "11000",
              manualPrice: "",
              appliedPrice: "11000",
              priceSource: "original",
              isExcluded: false
            }
          ],
          candidates: [
            {
              candidateId: 7,
              rank: 1,
              offerUrl: "https://detail.1688.com/offer/987654321.html",
              title: "1688 same item",
              imageUrl: "https://cbu01.alicdn.com/img/ibank/example.jpg",
              unitPrice: "¥12.80",
              monthlySales: 321,
              shopName: "source shop",
              aiReview: {
                sameItemProbability: 0.91,
                matchingReason: "same structure",
                riskPoints: ["color differs"],
                errorMessage: null
              }
            }
          ]
        }
      ]),
      saveManualPrices: vi.fn().mockResolvedValue(undefined),
      savePricingDraft: vi.fn().mockResolvedValue(undefined),
      saveManualSourcedReview: vi.fn().mockResolvedValue(undefined),
      markParentNoSource: vi.fn().mockResolvedValue(undefined),
      setParentExcluded: vi.fn().mockResolvedValue(undefined),
      setChildExcluded: vi.fn().mockResolvedValue(undefined)
    };
  });

  it("opens directly into the final parent SKU match list when a batch exists", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "导入采集表" })).toBeInTheDocument();

    await waitFor(() => expect(window.yaowo.listReviewItems).toHaveBeenCalledWith(1));
    expect(await screen.findByText("P1")).toBeInTheDocument();
    expect(screen.getByText("¥12.80")).toBeInTheDocument();
    expect(screen.queryByText("¥¥12.80")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "匹配结果" })).toBeInTheDocument();
    expect(screen.getByText(/10000/)).toBeInTheDocument();
    expect(screen.getByText("失败 1")).toBeInTheDocument();
    expect(screen.queryByText("开始新批次")).not.toBeInTheDocument();
    expect(screen.queryByText("流程进度")).not.toBeInTheDocument();
    expect(screen.queryByText("imported")).not.toBeInTheDocument();
  });

  it("calls the import bridge and refreshes batches", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "导入采集表" }));

    expect(window.yaowo.importWorkbook).toHaveBeenCalledWith({
      sourcePlatform: "aliexpress",
      importMode: "replace",
      targetBatchId: null
    });
    await waitFor(() => expect(window.yaowo.listBatches).toHaveBeenCalledTimes(2));
    expect(screen.getByText("已导入：父SKU 10，子SKU 24")).toBeInTheDocument();
  });

  it("passes platform and append mode to the import bridge", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.selectOptions(screen.getByLabelText("采集平台"), "shein");
    await user.selectOptions(screen.getByLabelText("导入方式"), "append");
    await user.click(screen.getByRole("button", { name: "导入采集表" }));

    expect(window.yaowo.importWorkbook).toHaveBeenCalledWith({
      sourcePlatform: "shein",
      importMode: "append",
      targetBatchId: 1
    });
  });

  it("switches sidebar navigation between independent pages", async () => {
    const user = userEvent.setup();
    render(<App />);

    await screen.findByText("P1");
    expect(screen.getByRole("heading", { name: "匹配结果" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "AI 设置" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "设置" }));
    expect(await screen.findByRole("heading", { name: "AI 设置" })).toBeInTheDocument();
    expect(screen.queryByText("0615 测试批次")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "改价" }));
    expect(screen.getByRole("heading", { name: "保留 SKU 改价" })).toBeInTheDocument();
    expect(await screen.findByText("P1")).toBeInTheDocument();
    expect(screen.queryByText("no selected batch")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "AI 设置" })).not.toBeInTheDocument();
  });

  it("loads and saves configurable Zhipu AI settings", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "设置" }));
    expect(await screen.findByDisplayValue("glm-4.6v-flashx")).toBeInTheDocument();
    expect(screen.getByDisplayValue("glm-ocr")).toBeInTheDocument();
    expect(screen.getByDisplayValue("deepseek-v4-flash")).toBeInTheDocument();
    expect(screen.queryByLabelText("视觉接口 URL")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "高级接口设置" }));
    expect(screen.getByLabelText("视觉接口 URL")).toBeInTheDocument();

    await user.type(screen.getByLabelText("鏅鸿氨 API Key"), "unit-test-key");
    await user.type(screen.getByLabelText("DeepSeek API Key"), "deepseek-test-key");
    await user.click(screen.getByRole("button", { name: "保存 AI 设置" }));

    expect(window.yaowo.saveAiSettings).toHaveBeenCalledWith({
      apiKey: "unit-test-key",
      deepseekApiKey: "deepseek-test-key",
      visionModel: "glm-4.6v-flashx",
      ocrModel: "glm-ocr",
      chatCompletionsUrl: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      ocrUrl: "https://open.bigmodel.cn/api/paas/v4/layout_parsing",
      deepseekModel: "deepseek-v4-flash",
      deepseekChatCompletionsUrl: "https://api.deepseek.com/chat/completions"
    });
  });

  it("shows the current app version on the settings page", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "设置" }));

    expect(window.yaowo.getAppVersion).toHaveBeenCalled();
    expect(await screen.findByText(/0\.1\.0/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /GitHub|更新/ })).not.toBeInTheDocument();
  });

  it("opens the operation log directory from the settings page", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "设置" }));
    await user.click(await screen.findByRole("button", { name: /日志|鏃ュ織/ }));

    expect(window.yaowo.openLogsDir).toHaveBeenCalled();
  });

  it("does not expose the old direct batch export on the match page", async () => {
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /导出 0615/ })).not.toBeInTheDocument();
  });

  it("does not expose the full review workbook export in normal batch actions", async () => {
    render(<App />);

    await screen.findByText("P1");

    expect(screen.queryByRole("button", { name: /瀹屾暣缁撴灉/ })).not.toBeInTheDocument();
  });

  it("exports the uploader scraper workbook from the price page after inline confirmation", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "改价" }));

    await user.click(screen.getByRole("button", { name: "导出上传器采集表" }));
    expect(screen.getByText(/1688/)).toBeInTheDocument();
    expect(screen.getByText(/1688/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "确认导出上传器采集表" }));

    expect(window.yaowo.exportSourcedWorkbook).toHaveBeenCalledWith(1);
    expect(screen.getByText(/E:\/exports\/sourced\.xlsx/)).toBeInTheDocument();
  });

  it("saves unsaved final prices before exporting the uploader scraper workbook", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "改价" }));
    await user.click(await screen.findByRole("button", { name: /P1/ }));
    const finalPriceInput = screen.getByLabelText(/P1.*价|P1.*敭/);
    await user.clear(finalPriceInput);
    await user.type(finalPriceInput, "21900");

    await user.click(screen.getByRole("button", { name: /导出|export/ }));
    await user.click(screen.getByRole("button", { name: /纭|确认|confirm/ }));

    await waitFor(() => expect(window.yaowo.exportSourcedWorkbook).toHaveBeenCalledWith(1));
    expect(window.yaowo.saveManualPrices).toHaveBeenCalledWith({
      batchId: 1,
      parentSku: "P1",
      parentManualPrice: "21900",
      childPrices: [
        { sku: "P1-red-s", manualPrice: "21900" },
        { sku: "P1-red-m", manualPrice: "21900" }
      ]
    });
    const saveOrder = vi.mocked(window.yaowo.saveManualPrices).mock.invocationCallOrder.at(-1) ?? 0;
    const exportOrder = vi.mocked(window.yaowo.exportSourcedWorkbook).mock.invocationCallOrder.at(-1) ?? 0;
    expect(saveOrder).toBeLessThan(exportOrder);
  });

  it("auto-saves price edits after input without requiring the save button", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "改价" }));
    await user.click(await screen.findByRole("button", { name: "展开 P1" }));
    const finalPriceInput = screen.getByLabelText("P1 的售价");

    await user.clear(finalPriceInput);
    await user.type(finalPriceInput, "21900");

    await waitFor(() =>
      expect(window.yaowo.saveManualPrices).toHaveBeenCalledWith({
        batchId: 1,
        parentSku: "P1",
        parentManualPrice: "21900",
        childPrices: [
          { sku: "P1-red-s", manualPrice: "21900" },
          { sku: "P1-red-m", manualPrice: "21900" }
        ]
      })
    );
  });

  it("restores saved price calculation drafts when reopening a price row", async () => {
    const user = userEvent.setup();
    vi.mocked(window.yaowo.listReviewItems).mockResolvedValueOnce([
      {
        parentSkuId: 1,
        parentSku: "P1",
        defaultSearchImageUrl: "https://img.example.com/p1.jpg",
        sourceUrl: "https://www.aliexpress.com/item/100500.html",
        childSkuCount: 1,
        isExcluded: false,
        reviewStatus: "unreviewed",
        manual1688Url: "",
        manualPrice: "21900",
        matchingReason: "",
        searchStatus: null,
        searchErrorCode: null,
        searchErrorMessage: null,
        pricingDraft: {
          purchasePriceRmb: "50",
          domesticFreightRmb: "5",
          weightKg: "1.2",
          lengthCm: "20",
          widthCm: "15",
          heightCm: "10",
          targetRoiPercent: "35",
          commissionPercent: "12",
          priceMultiplier: "1.1",
          exchangeRateRmbPerKrw: "0.0046",
          airEnabled: true,
          seaEnabled: false,
          priceResult: {
            recommendedPriceKrw: 21900,
            recommendedChannel: "air",
            channels: {
              air: {
                available: true,
                channel: "air",
                totalCostRmb: 82.5,
                baseInternationalFreightRmb: 22,
                cjSurchargeRmb: 10,
                rawListingPriceKrw: 21850,
                listingPriceKrw: 21900
              },
              sea: {
                available: false,
                channel: "sea",
                unavailableReason: "disabled"
              }
            }
          }
        },
        childSkus: [
          {
            sku: "P1-red-s",
            color: "红色",
            size: "S",
            variantImageUrl: "https://img.example.com/p1-red-s.jpg",
            sourcePrice: "10000",
            manualPrice: "21900",
            appliedPrice: "21900",
            priceSource: "childOverride",
            isExcluded: false
          }
        ],
        candidates: []
      }
    ]);

    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "改价" }));
    await user.click(await screen.findByRole("button", { name: "展开 P1" }));

    expect(screen.getByLabelText("P1 的采购价RMB")).toHaveValue("50");
    expect(screen.getByLabelText("P1 的重量KG")).toHaveValue("1.2");
    expect(screen.getByLabelText("P1 海运可用")).not.toBeChecked();
    expect(screen.getByText("建议售价 21900 KRW")).toBeInTheDocument();
  });

  it("loads review items without exposing manual sourced/no-source status controls", async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => expect(window.yaowo.listReviewItems).toHaveBeenCalledWith(1));
    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "灞曞紑 P1" }));
    expect(screen.queryByText("unreviewed")).not.toBeInTheDocument();
    expect(screen.getByText("AI 91%")).toBeInTheDocument();
    expect(screen.getByText(/color differs/)).toBeInTheDocument();
    expect(screen.getByText(/L/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "保存 P1 为有货源" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /no source|无货源/ })).not.toBeInTheDocument();
  });

  it("opens child SKU thumbnails as image links from expanded review rows", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /P1/ }));

    expect(screen.getByRole("link", { name: "P1-red-s" })).toHaveAttribute(
      "href",
      "https://img.example.com/p1-red-s.jpg"
    );
    expect(screen.getByRole("link", { name: "P1-red-m" })).toHaveAttribute(
      "href",
      "https://img.example.com/p1-red-m.jpg"
    );
  });

  it("calculates a Korea listing price and saves manual price overrides", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "改价" }));
    await user.click(await screen.findByRole("button", { name: "灞曞紑 P1" }));
    await user.type(await screen.findByLabelText("P1 鐨勯噰璐环RMB"), "50");
    await user.type(screen.getByLabelText("P1 鐨勫浗鍐呰繍璐筊MB"), "5");
    await user.type(screen.getByLabelText("P1 的重量KG"), "1");
    await user.type(screen.getByLabelText("P1 鐨勯暱CM"), "20");
    await user.type(screen.getByLabelText("P1 鐨勫CM"), "20");
    await user.type(screen.getByLabelText("P1 鐨勯珮CM"), "20");
    await user.clear(screen.getByLabelText(/ROI/));
    await user.type(screen.getByLabelText(/ROI/), "30");
    await user.clear(screen.getByLabelText(/系数|郴/));
    await user.type(screen.getByLabelText(/系数|郴/), "1.1");
    await user.click(screen.getByRole("button", { name: "计算 P1 建议售价" }));

    expect(screen.getByText("鎺ㄨ崘鍞环 30200 KRW")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "填入 P1 父SKU售价" }));
    expect(screen.getByLabelText(/P1.*价|P1.*敭/)).toHaveValue("30200");

    await user.click(screen.getByRole("button", { name: "填入 P1 全部子SKU售价" }));
    expect(screen.getByLabelText(/P1-red-s/)).toHaveValue("30200");
    expect(screen.getByLabelText(/P1-red-m/)).toHaveValue("30200");

    await user.click(screen.getByRole("button", { name: "保存 P1 价格" }));
    expect(window.yaowo.saveManualPrices).toHaveBeenCalledWith({
      batchId: 1,
      parentSku: "P1",
      parentManualPrice: "30200",
      childPrices: [
        { sku: "P1-red-s", manualPrice: "30200" },
        { sku: "P1-red-m", manualPrice: "30200" }
      ]
    });
  });

  it("shows RMB estimates using the configurable KRW exchange rate on the price page", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "改价" }));
    await user.click(await screen.findByRole("button", { name: "灞曞紑 P1" }));
    expect(await screen.findByLabelText(/0\.0046|汇率|鐜/)).toHaveValue("0.0046");
    await user.type(screen.getByLabelText("P1 鐨勯噰璐环RMB"), "50");
    await user.type(screen.getByLabelText("P1 鐨勫浗鍐呰繍璐筊MB"), "5");
    await user.type(screen.getByLabelText("P1 的重量KG"), "1");
    await user.type(screen.getByLabelText("P1 鐨勯暱CM"), "20");
    await user.type(screen.getByLabelText("P1 鐨勫CM"), "20");
    await user.type(screen.getByLabelText("P1 鐨勯珮CM"), "20");
    await user.clear(screen.getByLabelText(/ROI/));
    await user.type(screen.getByLabelText(/ROI/), "30");
    await user.clear(screen.getByLabelText(/系数|郴/));
    await user.type(screen.getByLabelText(/系数|郴/), "1.1");
    await user.click(screen.getByRole("button", { name: "计算 P1 建议售价" }));

    expect(screen.getByText("鎺ㄨ崘鍞环 30200 KRW")).toBeInTheDocument();
    expect(screen.getByText(/138\.92/)).toBeInTheDocument();
  });

  it("runs the next image search job for a batch", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "搜图" }));

    expect(window.yaowo.runNextImageSearchJob).toHaveBeenCalledWith(1);
    expect(window.yaowo.runBatchAiReview).toHaveBeenCalledWith(1);
    expect(screen.getByText(/P1/)).toBeInTheDocument();
  });

  it("reruns image search for a specific parent SKU from the match row", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "重新匹配 P1" }));

    expect(window.yaowo.runParentImageSearchJob).toHaveBeenCalledWith({
      batchId: 1,
      parentSku: "P1"
    });
    expect(window.yaowo.runBatchAiReview).toHaveBeenCalledWith(1);
    expect(screen.getByText(/P1/)).toBeInTheDocument();
  });

  it("runs batch image search jobs for a batch", async () => {
    const user = userEvent.setup();
    vi.mocked(window.yaowo.runNextImageSearchJob)
      .mockResolvedValueOnce({
        status: "completed",
        parentSku: "P1",
        storedCandidateCount: 2
      })
      .mockResolvedValueOnce({
        status: "completed",
        parentSku: "P2",
        storedCandidateCount: 3
      })
      .mockResolvedValueOnce({
        status: "idle"
      });
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "批量搜图" }));

    await waitFor(() => expect(window.yaowo.runNextImageSearchJob).toHaveBeenCalledTimes(3));
    expect(window.yaowo.runBatchImageSearchJobs).not.toHaveBeenCalled();
    expect(window.yaowo.runBatchAiReview).toHaveBeenCalledTimes(2);
    expect(vi.mocked(window.yaowo.listReviewItems).mock.calls.length).toBeGreaterThanOrEqual(4);
    expect(screen.getByText(/2/)).toBeInTheDocument();
  });

  it("continues batch image search while automatic AI review is still running", async () => {
    const user = userEvent.setup();
    let resolveAiReview: (value: { attemptedCount: number; completedCount: number; failedCount: number }) => void = () => {};
    let aiReviewCallCount = 0;
    vi.mocked(window.yaowo.runNextImageSearchJob)
      .mockResolvedValueOnce({
        status: "completed",
        parentSku: "P1",
        storedCandidateCount: 2
      })
      .mockResolvedValueOnce({
        status: "completed",
        parentSku: "P2",
        storedCandidateCount: 3
      })
      .mockResolvedValueOnce({
        status: "idle"
      });
    vi.mocked(window.yaowo.runBatchAiReview).mockImplementation(
      () => {
        aiReviewCallCount += 1;
        if (aiReviewCallCount > 1) {
          return Promise.resolve({ attemptedCount: 0, completedCount: 0, failedCount: 0 });
        }
        return new Promise((resolve) => {
          resolveAiReview = resolve;
        });
      }
    );

    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "批量搜图" }));

    await waitFor(() => expect(window.yaowo.runBatchAiReview).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(vi.mocked(window.yaowo.runNextImageSearchJob).mock.calls.length).toBeGreaterThanOrEqual(2)
    );
    resolveAiReview({ attemptedCount: 2, completedCount: 2, failedCount: 0 });
  });

  it("keeps other expanded parent rows open while batch search refreshes only the completed SKU row", async () => {
    const user = userEvent.setup();
    const p1 = {
      parentSkuId: 101,
      parentSku: "P1",
      defaultSearchImageUrl: "https://img.example.com/p1.jpg",
      sourceUrl: "https://www.aliexpress.com/item/p1.html",
      childSkuCount: 1,
      isExcluded: false,
      reviewStatus: "unreviewed",
      manual1688Url: "",
      manualPrice: "",
      matchingReason: "",
      childSkus: [
        {
          sku: "P1-red-s",
          color: "红色",
          size: "S",
          variantImageUrl: "https://img.example.com/p1-red-s.jpg",
          sourcePrice: "10000",
          manualPrice: "",
          appliedPrice: "10000",
          priceSource: "original",
          isExcluded: false
        }
      ],
      candidates: []
    };
    const p2 = {
      parentSkuId: 102,
      parentSku: "P2",
      defaultSearchImageUrl: "https://img.example.com/p2.jpg",
      sourceUrl: "https://www.aliexpress.com/item/p2.html",
      childSkuCount: 1,
      isExcluded: false,
      reviewStatus: "unreviewed",
      manual1688Url: "",
      manualPrice: "",
      matchingReason: "",
      childSkus: [
        {
          sku: "P2-blue-m",
          color: "钃濊壊",
          size: "M",
          variantImageUrl: "https://img.example.com/p2-blue-m.jpg",
          sourcePrice: "12000",
          manualPrice: "",
          appliedPrice: "12000",
          priceSource: "original",
          isExcluded: false
        }
      ],
      candidates: [
        {
          candidateId: 22,
          rank: 1,
          offerUrl: "https://detail.1688.com/offer/222.html",
          title: "P2 still open candidate",
          imageUrl: "https://cbu01.alicdn.com/img/ibank/p2.jpg",
          unitPrice: "11.80",
          monthlySales: 88,
          shopName: "p2 shop",
          aiReview: null
        }
      ]
    };
    vi.mocked(window.yaowo.listReviewItems)
      .mockResolvedValueOnce([p1, p2])
      .mockResolvedValue([
        {
          ...p1,
          candidates: [
            {
              candidateId: 11,
              rank: 1,
              offerUrl: "https://detail.1688.com/offer/111.html",
              title: "P1 refreshed candidate",
              imageUrl: "https://cbu01.alicdn.com/img/ibank/p1.jpg",
              unitPrice: "12.80",
              monthlySales: 100,
              shopName: "p1 shop",
              aiReview: null
            }
          ]
        },
        p2
      ]);
    vi.mocked(window.yaowo.runNextImageSearchJob)
      .mockResolvedValueOnce({
        status: "completed",
        parentSku: "P1",
        storedCandidateCount: 1
      })
      .mockResolvedValueOnce({
        status: "idle"
      });

    render(<App />);

    expect(await screen.findByText("P2")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "灞曞紑 P2" }));
    expect(await screen.findByText("P2 still open candidate")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "批量搜图" }));

    await waitFor(() => expect(window.yaowo.runNextImageSearchJob).toHaveBeenCalledTimes(2));
    expect(screen.getByText("P2 still open candidate")).toBeInTheDocument();
  });

  it("opens the dedicated 1688 login and verification browser", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole("button", { name: /1688 鐧诲綍/ }));

    expect(window.yaowo.open1688Login).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/已打开 1688 登录/)).toBeInTheDocument();
  });

  it("runs AI review for selected parent SKUs from the match page", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "选择 P1" }));
    await user.click(screen.getByRole("button", { name: "AI评分选中" }));

    expect(window.yaowo.runBatchAiReview).toHaveBeenCalledWith(1, {
      parentSkus: ["P1"],
      includeReviewed: true
    });
    expect(screen.getByText(/2\/2/)).toBeInTheDocument();
  });

  it("selects only visible parent SKUs that already have search candidates", async () => {
    const user = userEvent.setup();
    vi.mocked(window.yaowo.listReviewItems).mockResolvedValue([
      {
        parentSkuId: 1,
        parentSku: "P1",
        defaultSearchImageUrl: "https://img.example.com/p1.jpg",
        sourceUrl: "https://www.aliexpress.com/item/p1.html",
        childSkuCount: 1,
        isExcluded: false,
        reviewStatus: "unreviewed",
        manual1688Url: "",
        manualPrice: "",
        matchingReason: "",
        searchStatus: "completed",
        searchErrorCode: null,
        searchErrorMessage: null,
        childSkus: [
          {
            sku: "P1-red-s",
            color: "红色",
            size: "S",
            variantImageUrl: "https://img.example.com/p1-red-s.jpg",
            sourcePrice: "10000",
            manualPrice: "",
            appliedPrice: "10000",
            priceSource: "original",
            isExcluded: false
          }
        ],
        candidates: [
          {
            candidateId: 7,
            rank: 1,
            offerUrl: "https://detail.1688.com/offer/987654321.html",
            title: "1688 same item",
            imageUrl: "https://cbu01.alicdn.com/img/ibank/example.jpg",
            unitPrice: "¥12.80",
            monthlySales: 321,
            shopName: "source shop",
            aiReview: null
          }
        ]
      },
      {
        parentSkuId: 2,
        parentSku: "P2",
        defaultSearchImageUrl: "https://img.example.com/p2.jpg",
        sourceUrl: "https://www.aliexpress.com/item/p2.html",
        childSkuCount: 1,
        isExcluded: false,
        reviewStatus: "unreviewed",
        manual1688Url: "",
        manualPrice: "",
        matchingReason: "",
        searchStatus: "pending",
        searchErrorCode: null,
        searchErrorMessage: null,
        childSkus: [
          {
            sku: "P2-blue-m",
            color: "钃濊壊",
            size: "M",
            variantImageUrl: "https://img.example.com/p2-blue-m.jpg",
            sourcePrice: "12000",
            manualPrice: "",
            appliedPrice: "12000",
            priceSource: "original",
            isExcluded: false
          }
        ],
        candidates: []
      }
    ]);
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    expect(screen.getByText("P2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /候选/ }));

    expect(screen.getByRole("checkbox", { name: "选择 P1" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "选择 P2" })).not.toBeChecked();
  });

  it("requests a batch image search stop while the batch is running", async () => {
    const user = userEvent.setup();
    let resolveNext: ((value: RunNextImageSearchJobResult) => void) | undefined;
    vi.mocked(window.yaowo.runNextImageSearchJob).mockImplementation(
      () =>
        new Promise<RunNextImageSearchJobResult>((resolve) => {
          resolveNext = resolve;
        })
    );
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "批量搜图" }));
    await user.click(await screen.findByRole("button", { name: /停止搜图/ }));

    expect(window.yaowo.stopBatchImageSearchJobs).toHaveBeenCalledWith(1);
    expect(screen.getByText("已请求停止批量搜图，当前父SKU完成后会停下")).toBeInTheDocument();

    resolveNext?.({
      status: "completed",
      parentSku: "P1",
      storedCandidateCount: 2
    });
    await waitFor(() =>
      expect(screen.getByText(/1/)).toBeInTheDocument()
    );
    expect(window.yaowo.runNextImageSearchJob).toHaveBeenCalledTimes(1);
  });

  it("resets failed image search jobs for a batch", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "重试失败" }));

    expect(window.yaowo.resetFailedImageSearchJobs).toHaveBeenCalledWith(1);
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it("resets running image search jobs for a batch", async () => {
    const user = userEvent.setup();
    vi.mocked(window.yaowo.listBatches).mockResolvedValueOnce([
      {
        id: 1,
        name: "0615 测试批次",
        status: "imported",
        parentSkuCount: 2,
        childSkuCount: 3,
        searchCompletedCount: 1,
        searchFailedCount: 0,
        searchRunningCount: 1,
        searchPendingCount: 0,
        searchBlockingFailedCount: 0,
        createdAt: "2026-06-15 16:20:00"
      }
    ]);
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "重置卡住" }));

    expect(window.yaowo.resetRunningImageSearchJobs).toHaveBeenCalledWith(1);
    expect(screen.getByText(/1/)).toBeInTheDocument();
  });

  it("shows failed image search job details for a batch", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "查看失败" }));

    expect(window.yaowo.listFailedImageSearchJobs).toHaveBeenCalledWith(1);
    expect(screen.getByText(/login_expired/)).toBeInTheDocument();
  });

  it("filters failed parent SKUs and reruns selected failed matches", async () => {
    const user = userEvent.setup();
    vi.mocked(window.yaowo.listReviewItems).mockResolvedValue([
      {
        parentSkuId: 1,
        parentSku: "P1",
        defaultSearchImageUrl: "https://img.example.com/p1.jpg",
        sourceUrl: "https://www.aliexpress.com/item/p1.html",
        childSkuCount: 1,
        isExcluded: false,
        reviewStatus: "unreviewed",
        manual1688Url: "",
        manualPrice: "",
        matchingReason: "",
        searchStatus: "failed",
        searchErrorCode: "network_timeout",
        searchErrorMessage: "request timed out",
        childSkus: [
          {
            sku: "P1-red-s",
            color: "红色",
            size: "S",
            variantImageUrl: "https://img.example.com/p1-red-s.jpg",
            sourcePrice: "10000",
            manualPrice: "",
            appliedPrice: "10000",
            priceSource: "original",
            isExcluded: false
          }
        ],
        candidates: []
      },
      {
        parentSkuId: 2,
        parentSku: "P2",
        defaultSearchImageUrl: "https://img.example.com/p2.jpg",
        sourceUrl: "https://www.aliexpress.com/item/p2.html",
        childSkuCount: 1,
        isExcluded: false,
        reviewStatus: "unreviewed",
        manual1688Url: "",
        manualPrice: "",
        matchingReason: "",
        searchStatus: "completed",
        searchErrorCode: null,
        searchErrorMessage: null,
        childSkus: [
          {
            sku: "P2-blue-m",
            color: "钃濊壊",
            size: "M",
            variantImageUrl: "https://img.example.com/p2-blue-m.jpg",
            sourcePrice: "12000",
            manualPrice: "",
            appliedPrice: "12000",
            priceSource: "original",
            isExcluded: false
          }
        ],
        candidates: []
      }
    ]);
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    expect(screen.getByText("P2")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "查看失败" }));

    expect(screen.getByText("P1")).toBeInTheDocument();
    expect(screen.queryByText("P2")).not.toBeInTheDocument();
    expect(screen.getAllByText("匹配失败").length).toBeGreaterThan(0);
    expect(screen.getByText("network_timeout锛歳equest timed out")).toBeInTheDocument();
    expect(screen.queryByText("pending")).not.toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "选择 P1" }));
    await user.click(screen.getByRole("button", { name: "重新匹配选中" }));

    expect(window.yaowo.runParentImageSearchJob).toHaveBeenCalledWith({
      batchId: 1,
      parentSku: "P1"
    });
  });

  it("shows search candidates without the old fill-candidate review action", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "灞曞紑 P1" }));
    expect(await screen.findByText("1688 same item")).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "鎵撳紑" })).toHaveAttribute(
      "href",
      "https://detail.1688.com/offer/987654321.html"
    );
    expect(screen.queryByRole("button", { name: /P1 1/ })).not.toBeInTheDocument();
    expect(window.yaowo.saveManualSourcedReview).not.toHaveBeenCalled();
  });

  it("soft deletes parent and child SKUs without confirmation because restore is available", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "鍒犻櫎 P1" }));
    expect(screen.queryByRole("dialog", { name: /parent|SKU/ })).not.toBeInTheDocument();
    expect(window.yaowo.setParentExcluded).toHaveBeenCalledWith({
      batchId: 1,
      parentSku: "P1",
      excluded: true
    });

    await user.click(screen.getByRole("button", { name: "灞曞紑 P1" }));
    await user.click(screen.getByRole("button", { name: "鍒犻櫎 P1-red-s" }));
    expect(screen.queryByRole("dialog", { name: /child|SKU/ })).not.toBeInTheDocument();
    expect(window.yaowo.setChildExcluded).toHaveBeenCalledWith({
      batchId: 1,
      sku: "P1-red-s",
      excluded: true
    });
  });

  it("deletes and restores parent SKUs from the price page using the shared excluded state", async () => {
    const user = userEvent.setup();
    const activeParent = makeReviewItem("P1");
    const deletedParent = makeReviewItem("P1", { isExcluded: true });
    vi.mocked(window.yaowo.listReviewItems)
      .mockResolvedValueOnce([activeParent])
      .mockResolvedValueOnce([deletedParent])
      .mockResolvedValueOnce([activeParent]);

    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "改价" }));
    await user.click(screen.getByRole("button", { name: "删除 P1" }));

    expect(window.yaowo.setParentExcluded).toHaveBeenCalledWith({
      batchId: 1,
      parentSku: "P1",
      excluded: true
    });
    expect(await screen.findByRole("button", { name: "恢复 P1" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "恢复 P1" }));
    expect(window.yaowo.setParentExcluded).toHaveBeenCalledWith({
      batchId: 1,
      parentSku: "P1",
      excluded: false
    });
  });

  it("deletes and restores child SKUs from the price page using the shared excluded state", async () => {
    const user = userEvent.setup();
    const activeParent = makeReviewItem("P1");
    const childDeletedParent = makeReviewItem("P1", {
      childSkus: [
        {
          ...makeReviewItem("P1").childSkus[0],
          isExcluded: true
        }
      ]
    });
    vi.mocked(window.yaowo.listReviewItems)
      .mockResolvedValueOnce([activeParent])
      .mockResolvedValueOnce([childDeletedParent])
      .mockResolvedValueOnce([activeParent]);

    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "改价" }));
    await user.click(screen.getByRole("button", { name: "展开 P1" }));
    await user.click(screen.getByRole("button", { name: "删除 P1-red-s" }));

    expect(window.yaowo.setChildExcluded).toHaveBeenCalledWith({
      batchId: 1,
      sku: "P1-red-s",
      excluded: true
    });
    expect(await screen.findByRole("button", { name: "恢复 P1-red-s" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "恢复 P1-red-s" }));
    expect(window.yaowo.setChildExcluded).toHaveBeenCalledWith({
      batchId: 1,
      sku: "P1-red-s",
      excluded: false
    });
  });

  it("bulk deletes selected parent SKUs from the match page", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "鍏ㄩ€夊綋鍓嶉〉" }));
    await user.click(screen.getByRole("button", { name: "鎵归噺鍒犻櫎" }));
    expect(screen.queryByRole("dialog", { name: "纭鎵归噺鍒犻櫎" })).not.toBeInTheDocument();

    expect(window.yaowo.setParentExcluded).toHaveBeenCalledWith({
      batchId: 1,
      parentSku: "P1",
      excluded: true
    });
  });

  it("bulk restores selected parent SKUs from the match page", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "鍏ㄩ€夊綋鍓嶉〉" }));
    await user.click(screen.getByRole("button", { name: "鎵归噺鎭㈠" }));

    expect(window.yaowo.setParentExcluded).toHaveBeenCalledWith({
      batchId: 1,
      parentSku: "P1",
      excluded: false
    });
  });

  it("paginates match page parent SKUs from the footer controls", async () => {
    const user = userEvent.setup();
    vi.mocked(window.yaowo.listReviewItems).mockResolvedValue(
      Array.from({ length: 21 }, (_, index) => makeReviewItem(`P${index + 1}`))
    );
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    expect(screen.getByText("P20")).toBeInTheDocument();
    expect(screen.queryByText("P21")).not.toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText("姣忛〉鏄剧ず"), "10");
    expect(screen.getByText("P10")).toBeInTheDocument();
    expect(screen.queryByText("P11")).not.toBeInTheDocument();
    expect(screen.getByText(/1.*3/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /下一页/ }));
    expect(screen.queryByText("P1")).not.toBeInTheDocument();
    expect(screen.getByText("P11")).toBeInTheDocument();
    expect(screen.getByText("P20")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "鏈〉" }));
    expect(screen.queryByText("P20")).not.toBeInTheDocument();
    expect(screen.getByText("P21")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "棣栭〉" }));
    expect(screen.getByText("P1")).toBeInTheDocument();
  });

  it("paginates price page parent SKUs from the footer controls", async () => {
    const user = userEvent.setup();
    vi.mocked(window.yaowo.listReviewItems).mockResolvedValue(
      Array.from({ length: 11 }, (_, index) => makeReviewItem(`P${index + 1}`))
    );
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "改价" }));

    expect(screen.getByText("P11")).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("姣忛〉鏄剧ず"), "10");
    expect(screen.getByText("P10")).toBeInTheDocument();
    expect(screen.queryByText("P11")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /下一页/ }));
    expect(screen.queryByText("P10")).not.toBeInTheDocument();
    expect(screen.getByText("P11")).toBeInTheDocument();
    expect(screen.getByText(/2.*2/)).toBeInTheDocument();
  });

  it("toggles current visible parent SKU selection from the checkbox column header", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByText("P1")).toBeInTheDocument();
    const selectCurrentPage = screen.getByRole("checkbox", { name: "鍏ㄩ€夊綋鍓嶉〉" });
    const parentCheckbox = screen.getByRole("checkbox", { name: "选择 P1" });

    expect(parentCheckbox).not.toBeChecked();
    await user.click(selectCurrentPage);
    expect(parentCheckbox).toBeChecked();
    expect(screen.queryByRole("button", { name: "鍏ㄩ€夊綋鍓嶉〉" })).not.toBeInTheDocument();

    await user.click(selectCurrentPage);
    expect(parentCheckbox).not.toBeChecked();
  });

  it("renders a preview-safe empty state when the Electron bridge is not available", async () => {
    delete (window as Partial<Window>).yaowo;

    render(<App />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("还没有可展示的父 SKU")).toBeInTheDocument());
    expect(screen.getByRole("heading", { name: "匹配结果" })).toBeInTheDocument();
    expect(screen.queryByText("开始新批次")).not.toBeInTheDocument();
    expect(screen.queryByText("流程进度")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "导入采集表" })).toBeInTheDocument();
    expect(screen.getAllByText("1688 鐧诲綍").length).toBeGreaterThan(0);
    expect(screen.getAllByText("匹配").length).toBeGreaterThan(0);
    expect(screen.queryByText(/Cannot read properties/)).not.toBeInTheDocument();
  });
});

function makeReviewItem(parentSku: string, overrides: Partial<ReviewItem> = {}): ReviewItem {
  return {
    parentSkuId: Number(parentSku.replace(/\D/g, "")) || 1,
    parentSku,
    defaultSearchImageUrl: `https://img.example.com/${parentSku}.jpg`,
    sourceUrl: `https://www.aliexpress.com/item/${parentSku}.html`,
    childSkuCount: 1,
    isExcluded: false,
    reviewStatus: "unreviewed",
    manual1688Url: "",
    manualPrice: "",
    matchingReason: "",
    searchStatus: "completed",
    searchErrorCode: null,
    searchErrorMessage: null,
    childSkus: [
      {
        sku: `${parentSku}-red-s`,
        color: "红色",
        size: "S",
        variantImageUrl: `https://img.example.com/${parentSku}-red-s.jpg`,
        sourcePrice: "10000",
        manualPrice: "",
        appliedPrice: "10000",
        priceSource: "original",
        isExcluded: false
      }
    ],
    candidates: [],
    ...overrides
  };
}
