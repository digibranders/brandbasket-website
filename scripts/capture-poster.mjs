// scripts/capture-poster.mjs
// Captures the 3D basket in its base state (website tiles only) as public/basket/poster.avif.
// Usage: start the site (npm run dev), then `node scripts/capture-poster.mjs [url]`. Default url: http://localhost:3130/
import { mkdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const url = process.argv[2] ?? "http://localhost:3130/";
const out = new URL("../public/basket/poster.avif", import.meta.url);
const SETTLE_MS = 4000; // the last base tile drops at 770 ms; this leaves time for the bounces to finish
const MAX_KB = 40;
// Fine cane bindings need room in the AVIF budget; this resolution keeps the final scene under 40 KB.
const WIDTH = 832;

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 2, reducedMotion: "no-preference" });
  page.on("pageerror", (error) => console.error("page error:", error.message));
  await page.goto(url, { waitUntil: "networkidle" });
  const canvas = page.locator("canvas").first();
  await canvas.scrollIntoViewIfNeeded();
  await canvas.waitFor({ state: "attached", timeout: 20_000 });
  await page.waitForTimeout(SETTLE_MS);
  // Paint only the canvas: page background, poster and every other element go transparent or hidden.
  await page.addStyleTag({
    content: "html, body, main { background: transparent !important; } body * { visibility: hidden !important; } canvas { visibility: visible !important; }",
  });
  const png = await canvas.screenshot({ omitBackground: true, animations: "disabled" });
  await mkdir(new URL(".", out), { recursive: true });
  await sharp(png).resize({ width: WIDTH }).avif({ quality: 60, chromaSubsampling: "4:2:0", effort: 9 }).toFile(fileURLToPath(out));
  const kb = (await stat(out)).size / 1024;
  console.log(`Wrote ${fileURLToPath(out)} (${kb.toFixed(1)} KB)`);
  if (kb > MAX_KB) {
    console.error(`Poster is over the ${MAX_KB} KB budget.`);
    process.exitCode = 1;
  }
} finally {
  await browser.close();
}
