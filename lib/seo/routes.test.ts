// lib/seo/routes.test.ts
import { describe, expect, it } from "vitest";
import { INDUSTRIES } from "@/content/industries";
import { PACKAGES } from "@/lib/pricing";
import { indexableRoutes, industryRoute, ROUTES } from "./routes";

describe("route registry", () => {
  it("keeps titles within 60 characters and descriptions between 120 and 155", () => {
    for (const r of Object.values(ROUTES)) {
      expect(r.title.length, r.path).toBeLessThanOrEqual(60);
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(120);
      expect(r.description.length, r.path).toBeLessThanOrEqual(155);
    }
  });
  it("has unique titles and paths", () => {
    const all = Object.values(ROUTES);
    expect(new Set(all.map((r) => r.title)).size).toBe(all.length);
    expect(new Set(all.map((r) => r.path)).size).toBe(all.length);
  });
  it("keeps noindex pages out of the sitemap", () => {
    expect(indexableRoutes().some((r) => r.path === "/notice")).toBe(false);
  });
  it("lists every industry page with its own title and description", () => {
    const paths = indexableRoutes().map((r) => r.path);
    for (const industry of INDUSTRIES) {
      expect(paths).toContain(`/industries/${industry.slug}`);
      expect(industryRoute(industry)).toMatchObject({ title: industry.title, description: industry.description, updated: industry.updated });
    }
    expect(new Set(indexableRoutes().map((r) => r.title)).size).toBe(paths.length);
  });
  it("builds prices from the pricing module", () => {
    expect(ROUTES.pricing.title).toBe("Pricing: free website, plans from ₹3,000 a month");
    expect(ROUTES.home.description).toContain("₹3,000 a month");
    expect(ROUTES.pricing.description).toContain(`Packages up to ${Math.max(...PACKAGES.map((p) => p.percent))}%`);
  });
});
