import { describe, expect, it } from "vitest";
import { config } from "./proxy";

// Next compiles each matcher as an anchored regular expression over the request path.
const [pattern = ""] = config.matcher;
const matches = (path: string): boolean => new RegExp(`^${pattern}$`).test(path);

describe("proxy matcher", () => {
  it("handles pages, including a CMS preview token that contains a dot", () => {
    for (const path of ["/", "/pricing", "/blog/some-post", "/blog/preview/abc123", "/blog/preview/eyJhbGciOi.payload.signature"]) expect(matches(path)).toBe(true);
  });

  it("leaves the API, built assets, the feed, the share image and files with an extension alone", () => {
    for (const path of ["/api/contact", "/_next/static/chunks/app.js", "/opengraph-image", "/blog/feed.xml", "/favicon.ico", "/robots.txt", "/sitemap.xml", "/llms.txt", "/blog/preview-notes.txt", "/blog/other/file.png"]) expect(matches(path)).toBe(false);
  });
});
