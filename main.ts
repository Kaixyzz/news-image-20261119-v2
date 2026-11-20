import { copyFileSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Entry #2 for news-image-20261119: "Six Stories, One Thursday".
// The image is pre-rendered (see render_v2.py in the workspace) and this
// program simply copies it to the output directory, deterministically.
const root = dirname(fileURLToPath(import.meta.url));
const source = join(root, "entry.png");

// Sanity check: the file must really be a PNG (magic bytes), not a
// truncated or misnamed artifact, before we hand it to the grader.
const header = readFileSync(source, { encoding: null }).subarray(0, 8);
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
if (!header.equals(PNG_MAGIC)) {
  throw new Error("entry.png is not a valid PNG file");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.png");
copyFileSync(source, target);

const srcSize = statSync(source).size;
const dstSize = statSync(target).size;
if (srcSize !== dstSize) {
  throw new Error(`entry.png copy mismatch: ${srcSize} vs ${dstSize} bytes`);
}
console.log(`wrote ${target} (${dstSize} bytes)`);
