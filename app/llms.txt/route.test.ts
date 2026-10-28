// app/llms.txt/route.test.ts
import { describe, expect, it } from "vitest";
import { PACKAGE_TERMS } from "@/content/legal/fees";
import { indexableRoutes } from "@/lib/seo/routes";
import { GET } from "./route";

describe("GET /llms.txt", () => {
  it("lists plan prices and the package terms", async () => {
    const body = await GET().text();
    expect(body).toContain("Managed Website: ₹2,999 a month, GST included");
    expect(body).toContain("Social Media and Ads: ₹9,999 a month, GST included");
    expect(body).toContain("Local SEO + AEO: ₹24,999 a month, GST included");
    expect(body).toContain(`- Package offer: ${PACKAGE_TERMS}`);
    expect(body).not.toContain("chosen at sign-up");
  });

  it("states the build fee, GST and billing", async () => {
    const body = await GET().text();
    expect(body).toContain("- Website build: ₹0\n");
    expect(body).toContain("- GST: 18%, included in every price\n");
    expect(body).toContain("- Billing: monthly\n");
  });

  it("lists the four packages with list price, package price, saving and the ad credit", async () => {
    const body = await GET().text();
    expect(body).toContain("- Website + Social: ₹12,998 a month at list price; ₹11,699 a month as a package (10% off, you save ₹1,299). Bought together as you start: ₹1,500 a month of ad credit.");
    expect(body).toContain("- Website + SEO: ₹27,998 a month at list price; ₹25,199 a month as a package (10% off, you save ₹2,799).\n");
    expect(body).toContain("- Social + SEO: ₹34,998 a month at list price; ₹31,499 a month as a package (10% off, you save ₹3,499). Bought together as you start: ₹1,500 a month of ad credit.");
    expect(body).toContain("- All three: ₹37,997 a month at list price; ₹30,398 a month as a package (20% off, you save ₹7,599). Bought together as you start: ₹3,000 a month of ad credit.");
  });

  it("links every indexable page and leaves the noindex notice out", async () => {
    const body = await GET().text();
    expect(body).toContain("(https://www.brandbasket.in/pricing)");
    for (const r of indexableRoutes()) expect(body).toContain(`[${r.title}](`);
    expect(body).not.toContain("/notice");
  });
});
