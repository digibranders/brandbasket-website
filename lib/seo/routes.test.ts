// lib/seo/routes.test.ts
import { describe, expect, it } from "vitest";
import { PACKAGES } from "@/lib/pricing";
import { CURRENCIES } from "@/lib/currency";
import { homeRoute, indexableRoutes, pricingRoute, ROUTES } from "./routes";

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
  it.each(CURRENCIES)("keeps the %s home and pricing entries within the length limits", (currency) => {
    for (const r of [homeRoute(currency), pricingRoute(currency)]) {
      expect(r.title.length, r.path).toBeLessThanOrEqual(60);
      expect(r.description.length, r.path).toBeGreaterThanOrEqual(120);
      expect(r.description.length, r.path).toBeLessThanOrEqual(155);
    }
  });
  it("prints dollars with no tax talk on the dollar entries", () => {
    expect(homeRoute("USD").description).toContain("$65 a month");
    expect(pricingRoute("USD").title).toBe("Pricing: free website, plans from $65 a month");
    expect(pricingRoute("USD").description).not.toMatch(/gst|tax|₹/i);
    expect(pricingRoute("INR").description).toContain("GST included");
  });
  it("builds prices from the pricing module", () => {
    expect(ROUTES.pricing.title).toBe("Pricing: free website, plans from ₹2,999 a month");
    expect(ROUTES.home.description).toContain("₹2,999 a month");
    expect(ROUTES.pricing.description).toContain(`Packages up to ${Math.max(...PACKAGES.map((p) => p.percent))}%`);
  });
});
