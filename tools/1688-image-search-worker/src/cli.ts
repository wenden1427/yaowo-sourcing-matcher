import path from "node:path";
import { Command } from "commander";
import { imageSearch } from "./worker.js";

const program = new Command();

program
  .requiredOption("-i, --image <pathOrUrl>", "图片 URL 或本地图片路径")
  .option("-m, --max <number>", "最多返回候选数", "20")
  .option(
    "-p, --profile <dir>",
    "专用 Chrome profile 目录",
    path.resolve(".runtime/1688-image-search-profile"),
  )
  .option("--headed", "显示浏览器窗口，适合首次登录或处理滑块")
  .option("--timeout <ms>", "单步等待超时毫秒", "30000")
  .option("--debug-dir <dir>", "保存 mtop 诊断信息的目录")
  .option("--keyword <keyword>", "期望商品关键词，用于自动切换图搜主体区域");

program.parse();

const options = program.opts<{
  image: string;
  max: string;
  profile: string;
  headed?: boolean;
  timeout: string;
  debugDir?: string;
  keyword?: string;
}>();

try {
  const result = await imageSearch({
    image: options.image,
    max: Math.max(1, Number.parseInt(options.max, 10) || 20),
    profileDir: path.resolve(options.profile),
    headed: options.headed === true,
    timeoutMs: Math.max(10_000, Number.parseInt(options.timeout, 10) || 30_000),
    debugDir: options.debugDir ? path.resolve(options.debugDir) : undefined,
    keyword: options.keyword,
  });
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${(error as Error).message}\n`);
  process.exitCode = 1;
}
