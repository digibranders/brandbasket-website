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
    expect(await robotsFor("/start")).toBe("noindex");
  });

  it("is still noindex once the site is live, when other pages carry no header", async () => {
    vi.stubEnv("SITE_INDEXING", "on");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(await robotsFor("/start")).toBe("noindex");
    expect(await robotsFor("/pricing")).toBeUndefined();
  });
});
