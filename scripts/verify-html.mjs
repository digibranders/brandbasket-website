// scripts/verify-html.mjs
// Scans prerendered pages in .next/server/app for rules the copy and SEO plan depend on.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = ".next/server/app";
const pages = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path);
    else if (name.endsWith(".html") && !name.startsWith("_")) pages.push(path);
  }
})(ROOT);

const failures = [];
for (const path of pages) {
  const html = readFileSync(path, "utf8");
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const check = (ok, rule) => { if (!ok) failures.push(`${path}: ${rule}`); };
  check(!/[–—]/.test(text), "W-1 no em or en dashes in rendered copy");
  check((html.match(/<h1[\s>]/g) ?? []).length === 1, "S-1 exactly one h1");
  check(/<link rel="canonical"/.test(html) || /_not-found|404/.test(path), "S-2 has a canonical link");
  check(/<meta name="description" content="[^"]{50,160}"/.test(html) || /_not-found|404/.test(path), "S-3 description 50 to 160 characters");
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { failures.push(`${path}: S-4 JSON-LD does not parse`); }
  }
}

if (pages.length === 0) { console.error("verify-html: no prerendered pages found, run next build first"); process.exit(1); }
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`verify-html: ${pages.length} pages pass`);
