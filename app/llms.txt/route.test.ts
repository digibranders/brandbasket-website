// app/llms.txt/route.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const getPostsPage = vi.hoisted(() => vi.fn());
vi.mock("@/lib/cms/blog", () => ({ getPostsPage }));

import { indexableRoutes } from "@/lib/seo/routes";
import { GET } from "./route";

beforeEach(() => {
  getPostsPage.mockReset().mockResolvedValue({ posts: [{ slug: "website-cost-india", title: "What a website costs", excerpt: "A plain answer." }], pages: 1 });
});

describe("GET /llms.txt", () => {
  it("lists plan prices and says there are no offers but monitoring", async () => {
    const body = await (await GET()).text();
    expect(body).toContain("Website Management: ₹2,999 a month, GST included");
    expect(body).toContain("Social Media Management: ₹2,999 a month, GST included");
    expect(body).toContain("Paid Ads Management: ₹2,999 a month, GST included");
    expect(body).toContain("- Offers: none. Every plan costs the same and is billed at its own price. The only offer is Dedicated Expert Monitoring, included with all three plans");
    expect(body).not.toContain("chosen at sign-up");
  });

  it("states the build fee, GST and billing", async () => {
    const body = await (await GET()).text();
    expect(body).toContain("- Website build: ₹0\n");
    expect(body).toContain("- GST: 18%, included in every price\n");
    expect(body).toContain("- Billing: monthly, cancel anytime with no notice period\n");
  });

  it("lists no packages, package prices or ad credit", async () => {
    const body = await (await GET()).text();
    expect(body).not.toContain("## Packages");
    expect(body).not.toMatch(/package|ad credit|% off/i);
  });

  it("links every indexable page and leaves the noindex notice out", async () => {
    const body = await (await GET()).text();
    expect(body).toContain("(https://www.brandbasket.in/pricing)");
    for (const r of indexableRoutes()) expect(body).toContain(`[${r.title}](`);
    expect(body).not.toContain("/notice");
  });

  it("states the plan limits an assistant is asked about", async () => {
    const body = await (await GET()).text();
    expect(body).toContain("up to 10 pages built for you; live within 7 working days");
    expect(body).toContain("2 edits a month of 15 minutes each");
    expect(body).toContain("up to ₹10,000 a month of your ad budget");
    expect(body).toContain("Dedicated Expert Monitoring: included with all three plans, otherwise ₹6,000 a month");
  });

  it("lists the newest posts with their summaries", async () => {
    const body = await (await GET()).text();
    expect(body).toContain("- [What a website costs](https://www.brandbasket.in/blog/website-cost-india): A plain answer.");
  });

  it("is still served, without posts, when the CMS cannot answer", async () => {
    getPostsPage.mockRejectedValue(new Error("The CMS could not be reached"));
    const body = await (await GET()).text();
    expect(body).toContain("## Pages");
    expect(body).not.toContain("/blog/website-cost-india");
  });
});
