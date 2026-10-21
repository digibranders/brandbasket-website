// app/llms.txt/route.test.ts
import { describe, expect, it } from "vitest";
import { PACKAGE_TERMS } from "@/content/legal/fees";
import { indexableRoutes } from "@/lib/seo/routes";
import { GET } from "./route";

describe("GET /llms.txt", () => {
  it("lists plan prices and the package terms", async () => {
    const body = await GET().text();
    expect(body).toContain("Managed Website: ₹3,000 a month before 18% GST");
    expect(body).toContain("Social Media and Ads: ₹10,000 a month before 18% GST");
    expect(body).toContain("Local SEO + AEO: ₹25,000 a month before 18% GST");
    expect(body).toContain(`- Package offer: ${PACKAGE_TERMS}`);
    expect(body).not.toContain("chosen at sign-up");
  });

  it("states the build fee, GST and billing", async () => {
    const body = await GET().text();
    expect(body).toContain("- Website build: ₹0\n");
    expect(body).toContain("- GST: 18% on top\n");
    expect(body).toContain("- Billing: monthly\n");
  });

  it("lists the four packages with list, package and with-GST figures, and the ad credit", async () => {
    const body = await GET().text();
    expect(body).toContain("- Website + Social: ₹13,000 a month at list price; ₹10,400 a month as a package (20% off); first payment ₹12,272 with GST. Bought together as you start: ₹2,000 a month of ad credit.");
    expect(body).toContain("- Website + SEO: ₹28,000 a month at list price; ₹22,400 a month as a package (20% off); first payment ₹26,432 with GST.\n");
    expect(body).toContain("- Social + SEO: ₹35,000 a month at list price; ₹24,500 a month as a package (30% off); first payment ₹28,910 with GST. Bought together as you start: ₹2,000 a month of ad credit.");
    expect(body).toContain("- All three: ₹38,000 a month at list price; ₹26,600 a month as a package (30% off); first payment ₹31,388 with GST. Bought together as you start: ₹5,000 a month of ad credit.");
  });

  it("links every indexable page and leaves the noindex notice out", async () => {
    const body = await GET().text();
    expect(body).toContain("(https://brandbasket.in/pricing)");
    for (const r of indexableRoutes()) expect(body).toContain(`[${r.title}](`);
    expect(body).not.toContain("/notice");
  });
});
