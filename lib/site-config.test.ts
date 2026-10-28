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

  it("has a structured postal address for the registered office", () => {
    expect(businessDetails.postalAddress.postalCode).toBe("400607");
    expect(businessDetails.postalAddress.region).toBe("Maharashtra");
  });

  it("has a CIN in the private limited company format", () => {
    expect(businessDetails.cin).toMatch(/^U\d{5}[A-Z]{2}\d{4}PTC\d{6}$/);
  });

  it("names a Grievance Officer with a brandbasket.in mailbox", () => {
    expect(businessDetails.grievanceOfficer.name.trim()).not.toBe("");
    expect(businessDetails.grievanceOfficer.email.endsWith("@brandbasket.in")).toBe(true);
  });

  it("sends disputes to the courts at the registered office", () => {
    expect(businessDetails.courts).toBe("Thane, Maharashtra");
  });

  it("lists each data processor with a purpose and a location", () => {
    expect(businessDetails.processors.map((p) => p.name)).toEqual(["Vercel", "Brevo", "Razorpay", "Cloudflare"]);
    for (const p of businessDetails.processors) {
      expect(p.purpose.trim()).not.toBe("");
      expect(p.location.trim()).not.toBe("");
    }
  });

  it("carries no price in the default description", () => {
    expect(siteConfig.description).not.toMatch(/[₹$]/);
  });

  it("serves the site from brandbasket.in", () => {
    expect(siteConfig.url).toBe("https://www.brandbasket.in");
  });
});

describe("isProductionSite", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is off by default, production included", () => {
    vi.stubEnv("SITE_INDEXING", "");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isProductionSite()).toBe(false);
    vi.stubEnv("VERCEL_ENV", "");
    expect(isProductionSite()).toBe(false);
  });

  it("stays off on previews even with the flag set", () => {
    vi.stubEnv("SITE_INDEXING", "on");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(isProductionSite()).toBe(false);
  });

  it("is on only with the flag set on the production deployment", () => {
    vi.stubEnv("SITE_INDEXING", "on");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(isProductionSite()).toBe(true);
  });
});
