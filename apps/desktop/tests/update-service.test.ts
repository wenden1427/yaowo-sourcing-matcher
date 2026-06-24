import { describe, expect, it, vi } from "vitest";

import { checkGithubUpdate } from "../src/main/update-service.js";

describe("GitHub update service", () => {
  it("checks the repository desktop version marker and returns the app.asar update package", async () => {
    const fetchImpl = vi.fn().mockImplementation(async (url: string) => {
      if (
        url === "https://api.github.com/repos/wenden1427/yaowo-sourcing-matcher/contents/desktop-version.txt?ref=main"
      ) {
        return textResponse("0.1.4\n");
      }
      if (
        url ===
        "https://api.github.com/repos/wenden1427/yaowo-sourcing-matcher/contents/desktop-update/resources/app.asar.sha256?ref=main"
      ) {
        return textResponse("d3681399a01075bd33c23ad4ab9731aa4b3f6668a97a56d6adcd1b4092bfc8ff  app.asar\n");
      }
      throw new Error(`Unexpected fetch: ${url}`);
    });

    await expect(
      checkGithubUpdate({
        repository: "wenden1427/yaowo-sourcing-matcher",
        currentVersion: "0.1.3",
        fetchImpl
      })
    ).resolves.toMatchObject({
      repository: "wenden1427/yaowo-sourcing-matcher",
      currentVersion: "0.1.3",
      latestVersion: "0.1.4",
      updateAvailable: true,
      downloadUrl:
        "https://github.com/wenden1427/yaowo-sourcing-matcher/releases/download/v0.1.4/yaowo-sourcing-matcher-v0.1.4-app.asar",
      packageType: "appAsar",
      updatePackage: {
        type: "appAsar",
        url: "https://github.com/wenden1427/yaowo-sourcing-matcher/releases/download/v0.1.4/yaowo-sourcing-matcher-v0.1.4-app.asar",
        sha256: "d3681399a01075bd33c23ad4ab9731aa4b3f6668a97a56d6adcd1b4092bfc8ff"
      }
    });
  });

  it("does not fetch the update package hash when the local version is current", async () => {
    const fetchImpl = vi.fn().mockImplementation(async (url: string) => {
      if (
        url === "https://api.github.com/repos/wenden1427/yaowo-sourcing-matcher/contents/desktop-version.txt?ref=main"
      ) {
        return textResponse("0.1.4\n");
      }
      throw new Error(`Unexpected fetch: ${url}`);
    });

    const result = await checkGithubUpdate({
      repository: "wenden1427/yaowo-sourcing-matcher",
      currentVersion: "0.1.4",
      fetchImpl
    });

    expect(result.updateAvailable).toBe(false);
    expect(result.updatePackage).toBeNull();
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("normalizes GitHub repository URLs", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(textResponse("0.1.4"));

    const result = await checkGithubUpdate({
      repository: "https://github.com/wenden1427/yaowo-sourcing-matcher/",
      currentVersion: "0.1.4",
      fetchImpl
    });

    expect(result.repository).toBe("wenden1427/yaowo-sourcing-matcher");
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://api.github.com/repos/wenden1427/yaowo-sourcing-matcher/contents/desktop-version.txt?ref=main",
      expect.objectContaining({
        headers: expect.objectContaining({
          "User-Agent": "yaowo-sourcing-matcher-updater"
        })
      })
    );
  });
});

function textResponse(value: string): Response {
  return {
    ok: true,
    status: 200,
    statusText: "OK",
    text: async () => value
  } as Response;
}
