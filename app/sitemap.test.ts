import { beforeEach, describe, expect, it, vi } from "vitest";

const getSitemap = vi.hoisted(() => vi.fn());
vi.mock("@/lib/cms/blog", () => ({ getSitemap }));

import sitemap from "./sitemap";

const BLOG = {
  posts: [{ slug: "website-cost-india", lastModified: "2026-10-12T06:00:00.000Z" }, { slug: "pick-a-domain-name", lastModified: "2026-10-08T04:30:00.000Z" }],
  categories: [{ slug: "website-basics", lastModified: "2026-10-12T06:00:00.000Z" }],
  authors: [{ slug: "ananya-kulkarni", lastModified: "2026-10-12T06:00:00.000Z" }],
};

// Braces: a function returned from beforeEach is run as its cleanup, and that would call the mock.
beforeEach(() => {
  getSitemap.mockReset().mockResolvedValue(BLOG);
});

describe("sitemap", () => {
  it("lists About and no industry pages", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain("https://www.brandbasket.in/about");
    expect(urls.some((url) => url.includes("/industries"))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });

  it("leaves the noindex data notice out", async () => {
    expect((await sitemap()).map((entry) => entry.url)).not.toContain("https://www.brandbasket.in/notice");
  });

  it("adds the blog, its posts, categories and authors with the CMS's change times", async () => {
    const entries = await sitemap();
    const at = (url: string) => entries.find((entry) => entry.url === url)?.lastModified;
    expect(at("https://www.brandbasket.in/blog/website-cost-india")).toEqual(new Date("2026-10-12T06:00:00.000Z"));
    expect(at("https://www.brandbasket.in/blog/category/website-basics")).toEqual(new Date("2026-10-12T06:00:00.000Z"));
    expect(at("https://www.brandbasket.in/blog/author/ananya-kulkarni")).toEqual(new Date("2026-10-12T06:00:00.000Z"));
    expect(at("https://www.brandbasket.in/blog")).toEqual(new Date("2026-10-12T06:00:00.000Z"));
  });

  it("fails whole when the CMS cannot answer, rather than listing half the site", async () => {
    getSitemap.mockImplementation(async () => { throw new Error("The CMS could not be reached"); });
    await expect(sitemap()).rejects.toThrow(/could not be reached/);
  });
});
