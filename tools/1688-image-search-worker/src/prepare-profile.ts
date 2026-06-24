import path from "node:path";
import { Command } from "commander";
import { openProfileForManualSetup } from "./worker.js";

const program = new Command();

program
  .option(
    "-p, --profile <dir>",
    "专用 Chrome profile 目录",
    path.resolve(".runtime/1688-image-search-profile"),
  )
  .option("--url <url>", "打开的 1688 页面", "https://s.1688.com/youyuan/index.htm");

program.parse();

const options = program.opts<{ profile: string; url: string }>();

await openProfileForManualSetup(path.resolve(options.profile), options.url);
