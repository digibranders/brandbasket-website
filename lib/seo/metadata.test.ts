// lib/seo/metadata.test.ts
import { describe, expect, it, vi } from "vitest";
import { pageMetadata } from "./metadata";

const base = { title: "t", description: "d", path: "/" };

describe("pageMetadata", () => {
  it("leaves robots unset so the layout value is inherited", () => {
    expect("robots" in pageMetadata(base)).toBe(false);
  });

  it("marks noindex pages nofollow too while indexing is off", () => {
    expect(pageMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: false });
  });

  it("marks noindex pages as not indexed but followed once indexing is on", () => {
    vi.stubEnv("SITE_INDEXING", "on");
    vi.stubEnv("VERCEL_ENV", "production");
    expect(pageMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: true });
    vi.unstubAllEnvs();
  });

  it("sets the registry title as an absolute title", () => {
    expect(pageMetadata(base).title).toEqual({ absolute: "t" });
  });

  it("builds the canonical and open graph url from the path", () => {
    const meta = pageMetadata({ ...base, path: "/pricing" });
    expect(meta.alternates?.canonical).toBe("/pricing");
    expect(meta.openGraph).toMatchObject({ url: "https://brandbasket.in/pricing" });
  });
});
