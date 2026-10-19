import { describe, expect, it } from "vitest";
import { INDUSTRIES } from "@/content/industries";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists the hub, About and every industry page", () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain("https://brandbasket.in/industries");
    expect(urls).toContain("https://brandbasket.in/about");
    for (const { slug } of INDUSTRIES) expect(urls).toContain(`https://brandbasket.in/industries/${slug}`);
    expect(new Set(urls).size).toBe(urls.length);
  });
});
