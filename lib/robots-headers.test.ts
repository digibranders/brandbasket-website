import { afterEach, describe, expect, it, vi } from "vitest";
import nextConfig from "../next.config";

type Rule = { readonly source: string; readonly has?: unknown; readonly headers: readonly { readonly key: string; readonly value: string }[] };

/** What a request to `source` on an ordinary host gets for X-Robots-Tag: a later matching rule wins over an earlier one, as in Next. Rules for one host only (the vercel.app copies) are left out. */
async function robotsFor(source: string): Promise<string | undefined> {
  const rules = (await nextConfig.headers?.()) as Rule[] | undefined;
  const values = (rules ?? []).filter((rule) => rule.has === undefined && (rule.source === source || rule.source === "/:path*")).flatMap((rule) => rule.headers.filter((h) => h.key === "X-Robots-Tag").map((h) => h.value));
  return values.at(-1);
}

afterEach(() => vi.unstubAllEnvs());

describe("X-Robots-Tag for the ad landing page", () => {
  it("is noindex before launch", async () => {
    expect(await robotsFor("/website-landing-page")).toBe("noindex");
  });

  it("is still noindex once the site is live, when other pages carry no header", async () => {
    vi.stubEnv("SITE_INDEXING", "on");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(await robotsFor("/website-landing-page")).toBe("noindex");
    expect(await robotsFor("/pricing")).toBeUndefined();
  });
});

describe("headers for agents and static files", () => {
  async function rules(): Promise<Rule[]> {
    return (await nextConfig.headers?.()) as Rule[];
  }

  it("sends a Link header on the home page pointing at the sitemap, llms.txt and the feed", async () => {
    const link = (await rules()).find((rule) => rule.source === "/")?.headers.find((h) => h.key === "Link")?.value ?? "";
    expect(link).toContain('</sitemap.xml>; rel="sitemap"');
    expect(link).toContain('</llms.txt>; rel="describedby"');
    expect(link).toContain('</blog/feed.xml>; rel="alternate"');
  });

  it("caches the image and brand folders for a day", async () => {
    for (const dir of ["basket", "brand", "images", "work"]) {
      const rule = (await rules()).find((r) => r.source === `/${dir}/:path*`);
      expect(rule?.headers).toContainEqual({ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" });
    }
  });
});
