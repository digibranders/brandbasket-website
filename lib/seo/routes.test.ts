// lib/seo/routes.test.ts
import { describe, expect, it, vi } from "vitest";
import { GUIDE_PAGES } from "@/content/guides";
import { pageMetadata } from "./metadata";
import { guideRoute, indexableRoutes, ROUTES } from "./routes";

describe("route registry", () => {
  it("keeps titles within 60 characters and descriptions between 120 and 155", () => {
    for (const r of Object.values(ROUTES)) {
      expect(r.title.length, r.path).toBeLessThanOrEqual(60);
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(120);
      expect(r.description.length, r.path).toBeLessThanOrEqual(155);
    }
  });
  it("keeps the guide pages within the same title and description limits", () => {
    for (const page of GUIDE_PAGES) {
      const r = guideRoute(page);
      expect(r.title.length, r.path).toBeLessThanOrEqual(60);
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(120);
      expect(r.description.length, r.path).toBeLessThanOrEqual(155);
    }
  });
  it("lists every guide page and the glossary as indexable", () => {
    const paths = indexableRoutes().map((r) => r.path);
    for (const page of GUIDE_PAGES) expect(paths).toContain(page.path);
    expect(paths).toContain("/glossary");
  });
  it("has unique titles and paths", () => {
    const all = Object.values(ROUTES);
    expect(new Set(all.map((r) => r.title)).size).toBe(all.length);
    expect(new Set(all.map((r) => r.path)).size).toBe(all.length);
  });
  it("keeps noindex pages out of the sitemap", () => {
    expect(indexableRoutes().some((r) => r.path === "/notice")).toBe(false);
  });
  it("keeps the ad landing page out of search and the sitemap but lets its links be followed once live", () => {
    expect(ROUTES.start).toMatchObject({ path: "/start", noindex: true });
    expect(indexableRoutes().some((r) => r.path === "/start")).toBe(false);
    vi.stubEnv("SITE_INDEXING", "on");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(pageMetadata(ROUTES.start).robots).toEqual({ index: false, follow: true });
    vi.unstubAllEnvs();
  });
  it("shows no price or discount in any page's title or description", () => {
    for (const r of indexableRoutes()) {
      expect(`${r.title} ${r.description}`, r.path).not.toMatch(/[₹$]|\d+% off|\bfrom \d/i);
    }
  });
});
