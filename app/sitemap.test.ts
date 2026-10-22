import { describe, expect, it } from "vitest";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists About and no industry pages", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://brandbasket.in/about");
    expect(urls.some((url) => url.includes("/industries"))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
  });
  it("leaves the noindex data notice out", () => {
    expect(sitemap().map((entry) => entry.url)).not.toContain("https://brandbasket.in/notice");
  });
});
