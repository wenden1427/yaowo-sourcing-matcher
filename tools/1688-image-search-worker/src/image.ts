import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

export interface TempImage {
  path: string;
  cleanup: () => Promise<void>;
}

export function guessImageExt(url: string, contentType: string | null): string {
  if (contentType) {
    if (/jpeg/i.test(contentType)) return ".jpg";
    if (/png/i.test(contentType)) return ".png";
    if (/webp/i.test(contentType)) return ".webp";
    if (/bmp/i.test(contentType)) return ".bmp";
  }

  const urlMatch = url.match(/\.(jpe?g|png|webp|bmp)(?:[?#].*)?$/i);
  if (urlMatch) return `.${urlMatch[1]!.toLowerCase().replace("jpeg", "jpg")}`;
  return ".jpg";
}

export async function downloadImageToTemp(url: string): Promise<TempImage> {
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`图片下载失败：${(error as Error).message}`);
  }

  if (!response.ok) {
    throw new Error(`图片下载失败：HTTP ${response.status} ${response.statusText}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length === 0) throw new Error("图片下载失败：文件为空");
  if (buffer.length > 20 * 1024 * 1024) {
    throw new Error(`图片过大：${(buffer.length / 1024 / 1024).toFixed(1)}MB`);
  }

  const ext = guessImageExt(url, response.headers.get("content-type"));
  const filePath = path.join(
    os.tmpdir(),
    `sourcing-1688-img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`,
  );
  await fs.writeFile(filePath, buffer);
  return {
    path: filePath,
    cleanup: () => fs.rm(filePath, { force: true }),
  };
}

export async function resolveImageInput(input: string): Promise<TempImage> {
  if (/^https?:\/\//i.test(input)) return downloadImageToTemp(input);

  const filePath = path.resolve(input);
  await fs.access(filePath);
  return {
    path: filePath,
    cleanup: async () => {},
  };
}
