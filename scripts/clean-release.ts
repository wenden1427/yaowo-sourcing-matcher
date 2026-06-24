import { existsSync, rmSync } from "node:fs";
import { resolve, sep } from "node:path";

const root = process.cwd();
const releaseRoot = resolve(root, "release");
const desktopRelease = resolve(releaseRoot, "desktop");

if (!desktopRelease.startsWith(`${releaseRoot}${sep}`)) {
  throw new Error(`Refusing to clean unexpected release path: ${desktopRelease}`);
}

if (existsSync(desktopRelease)) {
  rmSync(desktopRelease, { recursive: true, force: true });
}
