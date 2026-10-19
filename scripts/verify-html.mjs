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

// S-5: the JSON-LD each page type must carry (plan 02, Task 10.3). The root layout adds Organization to every page.
const REQUIRED_LD = [
  [/\/index\.html$/, ["WebSite", "Organization", "Service", "FAQPage"]],
  [/\/pricing\.html$/, ["Service", "BreadcrumbList", "FAQPage"]],
  [/\/industries\/[^/]+\.html$/, ["Service", "BreadcrumbList", "FAQPage"]],
  [/\/about\.html$/, ["AboutPage", "BreadcrumbList"]],
  [/\/contact\.html$/, ["ContactPage", "BreadcrumbList"]],
  [/\/(privacy|terms|refund|shipping|notice)\.html$/, ["BreadcrumbList"]],
];

const failures = [];
for (const path of pages) {
  const html = readFileSync(path, "utf8");
  const text = html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  const check = (ok, rule) => { if (!ok) failures.push(`${path}: ${rule}`); };
  check(!/[–—]/.test(text), "W-1 no em or en dashes in rendered copy");
  check((html.match(/<h1[\s>]/g) ?? []).length === 1, "S-1 exactly one h1");
  check(/<link rel="canonical"/.test(html) || /_not-found|404/.test(path), "S-2 has a canonical link");
  check(/<meta name="description" content="[^"]{50,160}"/.test(html) || /_not-found|404/.test(path), "S-3 description 50 to 160 characters");
  const ldTypes = new Set();
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { ldTypes.add(JSON.parse(m[1])["@type"]); } catch { failures.push(`${path}: S-4 JSON-LD does not parse`); }
  }
  for (const type of REQUIRED_LD.find(([pattern]) => pattern.test(path))?.[1] ?? []) check(ldTypes.has(type), `S-5 has ${type} JSON-LD`);
}

if (pages.length === 0) { console.error("verify-html: no prerendered pages found, run next build first"); process.exit(1); }
if (failures.length) { console.error(failures.join("\n")); process.exit(1); }
console.log(`verify-html: ${pages.length} pages pass`);
