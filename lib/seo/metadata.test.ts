// lib/seo/metadata.test.ts
import { describe, expect, it } from "vitest";
import { pageMetadata } from "./metadata";

const base = { title: "t", description: "d", path: "/" };

describe("pageMetadata", () => {
  it("leaves robots unset so the layout value is inherited", () => {
    expect("robots" in pageMetadata(base)).toBe(false);
  });

  it("marks noindex pages as not indexed but followed", () => {
    expect(pageMetadata({ ...base, noindex: true }).robots).toEqual({ index: false, follow: true });
  });

  it("builds the canonical and open graph url from the path", () => {
    const meta = pageMetadata({ ...base, path: "/pricing" });
    expect(meta.alternates?.canonical).toBe("/pricing");
    expect(meta.openGraph).toMatchObject({ url: "https://brandbasket.in/pricing" });
  });
});
