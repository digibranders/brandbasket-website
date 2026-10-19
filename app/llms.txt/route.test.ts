// app/llms.txt/route.test.ts
import { describe, expect, it } from "vitest";
import { indexableRoutes } from "@/lib/seo/routes";
import { GET } from "./route";

describe("GET /llms.txt", () => {
  it("lists plan prices and the sign-up add-on discount", async () => {
    const body = await GET().text();
    expect(body).toContain("Managed Website: ₹2,999 a month before 18% GST");
    expect(body).toContain("Digital Growth: ₹7,000 a month before 18% GST");
    expect(body).toContain("Local SEO + AEO: ₹25,000 a month before 18% GST");
    expect(body).toContain("Add-ons chosen at sign-up are 5% off for as long as they run; add-ons added later are charged at the listed price.");
  });

  it("states the build fee, GST and billing", async () => {
    const body = await GET().text();
    expect(body).toContain("- Website build: ₹0\n");
    expect(body).toContain("- GST: 18% on top\n");
    expect(body).toContain("- Billing: monthly\n");
  });

  it("lists the four packages at list price, at sign-up and the first payment to the paisa", async () => {
    const body = await GET().text();
    expect(body).toContain("- Website: ₹2,999 a month at list price; ₹2,999 a month when chosen at sign-up; first payment at sign-up ₹3,538.82 including 18% GST");
    expect(body).toContain("- Website + Growth: ₹9,999 a month at list price; ₹9,649 a month when chosen at sign-up; first payment at sign-up ₹11,385.82 including 18% GST");
    expect(body).toContain("- Website + Search: ₹27,999 a month at list price; ₹26,749 a month when chosen at sign-up; first payment at sign-up ₹31,563.82 including 18% GST");
    expect(body).toContain("- All three: ₹34,999 a month at list price; ₹33,399 a month when chosen at sign-up; first payment at sign-up ₹39,410.82 including 18% GST");
  });

  it("links every indexable page and leaves the noindex notice out", async () => {
    const body = await GET().text();
    expect(body).toContain("(https://brandbasket.in/pricing)");
    for (const r of indexableRoutes()) expect(body).toContain(`[${r.title}](`);
    expect(body).not.toContain("/notice");
  });
});
