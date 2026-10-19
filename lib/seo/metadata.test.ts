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

  it("names the default share image unless the route has its own", () => {
    const image = { url: "/opengraph-image", width: 1200, height: 630, alt: "Brandbasket logo and the page headline", type: "image/png" };
    expect(pageMetadata(base).openGraph).toMatchObject({ images: [image] });
    expect(pageMetadata(base).twitter).toMatchObject({ images: [image] });
    expect("images" in (pageMetadata(base, { ownShareImage: true }).openGraph ?? {})).toBe(false);
    expect("images" in (pageMetadata(base, { ownShareImage: true }).twitter ?? {})).toBe(false);
  });

  it("builds the canonical and open graph url from the path", () => {
    const meta = pageMetadata({ ...base, path: "/pricing" });
    expect(meta.alternates?.canonical).toBe("/pricing");
    expect(meta.openGraph).toMatchObject({ url: "https://brandbasket.in/pricing" });
  });
});
