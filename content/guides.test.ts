// content/guides.test.ts
import { describe, expect, it } from "vitest";
import { GLOSSARY, GUIDE_LINKS, GUIDE_PAGES } from "./guides";
import { indexableRoutes } from "@/lib/seo/routes";

const wordCount = (text: string): number => text.trim().split(/\s+/).length;
const everyText = (): string[] => [
  ...GUIDE_PAGES.flatMap((p) => [p.h1, p.answer, ...p.sections.flatMap((s) => [s.heading, ...s.paragraphs, ...(s.bullets ?? [])]), ...p.faq.flatMap((f) => [f.q, f.a])]),
  ...GLOSSARY.terms.flatMap((t) => [t.term, t.definition]),
];

describe("guide pages", () => {
  it("has unique slugs and paths that match the slug", () => {
    expect(new Set(GUIDE_PAGES.map((p) => p.slug)).size).toBe(GUIDE_PAGES.length);
    for (const page of GUIDE_PAGES) expect(page.path.endsWith(`/${page.slug}`)).toBe(true);
  });

  it("opens each page with a direct answer of 40 to 60 words", () => {
    for (const page of GUIDE_PAGES) {
      const words = wordCount(page.answer);
      expect(words, page.path).toBeGreaterThanOrEqual(40);
      expect(words, page.path).toBeLessThanOrEqual(60);
    }
  });

  it("carries no price, tax or discount in any sentence, so one copy serves both currencies", () => {
    for (const text of everyText()) expect(text).not.toMatch(/[₹$]|\bGST\b|\d+% off|\bper month\b/i);
  });

  it("gives the comparison table the same number of cells in every row", () => {
    for (const page of GUIDE_PAGES) {
      if (page.table === undefined) continue;
      for (const row of page.table.rows) expect(row.length, row[0]).toBe(page.table.head.length);
    }
  });
});

describe("guide links", () => {
  const knownPaths = new Set(indexableRoutes().map((r) => r.path));
  const allLinks = [...Object.values(GUIDE_LINKS).flat(), ...GUIDE_PAGES.flatMap((p) => p.next), ...GLOSSARY.next];

  it("points every link at a page of this site or at a blog post address", () => {
    for (const link of allLinks) {
      expect(link.href.startsWith("/"), link.href).toBe(true);
      expect(knownPaths.has(link.href) || /^\/blog\/[a-z0-9-]+$/.test(link.href), link.href).toBe(true);
    }
  });

  it("has no repeated address inside one list", () => {
    for (const list of [...Object.values(GUIDE_LINKS), ...GUIDE_PAGES.map((p) => p.next)]) {
      expect(new Set(list.map((l) => l.href)).size).toBe(list.length);
    }
  });

  it("gives the ads post an inbound link from a service page", () => {
    expect(GUIDE_LINKS.growth.some((l) => l.href === "/blog/facebook-instagram-ads-budget-local-business")).toBe(true);
  });
});
