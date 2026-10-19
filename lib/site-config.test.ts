// lib/site-config.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { businessDetails, isProductionSite, siteConfig } from "./site-config";

describe("businessDetails", () => {
  it("is Digibranders trading as Brandbasket", () => {
    expect(businessDetails.legalName).toBe("Digibranders Private Limited");
    expect(businessDetails.tradeName).toBe("Brandbasket");
  });

  it("has a GSTIN that matches the Maharashtra registered office", () => {
    expect(businessDetails.gstNumber).toMatch(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][0-9A-Z]Z[0-9A-Z]$/);
    expect(businessDetails.gstNumber.slice(0, 2)).toBe("27");
    expect(businessDetails.address.join(" ")).toContain("Maharashtra");
  });

  it("serves the site from brandbasket.in", () => {
    expect(siteConfig.url).toBe("https://brandbasket.in");
  });
});

describe("isProductionSite", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is true only on the Vercel production deployment", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isProductionSite()).toBe(true);
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isProductionSite()).toBe(false);
  });

  it("is false locally", () => {
    vi.stubEnv("VERCEL_ENV", "");
    expect(isProductionSite()).toBe(false);
  });
});
