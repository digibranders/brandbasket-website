import { describe, expect, it } from "vitest";
import type { VendorId } from "./consent";
import { securityHeaders } from "./security-headers";

const byKey = (dev: boolean, tools: readonly VendorId[] = []): Record<string, string> => Object.fromEntries(securityHeaders({ dev, tools }).map((h) => [h.key, h.value]));

describe("securityHeaders", () => {
  it("sends HSTS, nosniff, frame and permissions policies", () => {
    const h = byKey(false);
    expect(h["Strict-Transport-Security"]).toBe("max-age=63072000; includeSubDomains; preload");
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["X-Frame-Options"]).toBe("DENY");
    expect(h["Permissions-Policy"]).toContain("camera=()");
  });

  it("lets pictures load from the media bucket when one is named, and from nowhere else", () => {
    const csp = (mediaOrigin?: string): string => securityHeaders({ dev: false, tools: [], mediaOrigin }).find((h) => h.key === "Content-Security-Policy")?.value ?? "";
    expect(csp("https://media.brandbasket.in")).toContain("img-src 'self' data: blob: https://media.brandbasket.in;");
    expect(csp()).toContain("img-src 'self' data: blob:;");
  });

  it("allows eval only in development", () => {
    expect(byKey(false)["Content-Security-Policy"]).not.toContain("unsafe-eval");
    expect(byKey(true)["Content-Security-Policy"]).toContain("unsafe-eval");
  });

  it("serves Vercel analytics same origin in production and allows no third party", () => {
    const csp = byKey(false)["Content-Security-Policy"];
    // On Vercel, @vercel/analytics and @vercel/speed-insights load from and post to /_vercel/* on this origin.
    expect(csp).toContain("script-src 'self' 'unsafe-inline';");
    expect(csp).toContain("connect-src 'self';");
    expect(csp).not.toContain("https://");
    expect(csp).toContain("frame-ancestors 'none'");
  });

  it("allows the analytics debug scripts in development only", () => {
    expect(byKey(true)["Content-Security-Policy"]).toContain("https://va.vercel-scripts.com");
  });

  it("opens Tag Manager and only the origins of the container's tools", () => {
    const measurement = byKey(false, ["ga4", "clarity"])["Content-Security-Policy"];
    expect(measurement).toContain("script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://tagmanager.google.com https://*.clarity.ms;");
    expect(measurement).toContain("https://*.google-analytics.com");
    expect(measurement).toContain("https://c.bing.com");
    expect(measurement).not.toContain("facebook");
    expect(measurement).not.toContain("googleadservices");
    expect(measurement).not.toContain("unsafe-eval");
  });

  it("lists each origin once and frames only Google", () => {
    const csp = byKey(false, ["ga4", "clarity", "googleAds", "metaPixel"])["Content-Security-Policy"];
    expect(csp).toContain("frame-src https://www.googletagmanager.com https://td.doubleclick.net;");
    expect(csp).toContain("https://connect.facebook.net");
    const directive = (name: string): string => csp.split("; ").find((part) => part.startsWith(`${name} `)) ?? "";
    for (const name of ["script-src", "img-src", "connect-src"]) {
      const sources = directive(name).split(" ").slice(1);
      expect(new Set(sources).size).toBe(sources.length);
    }
  });
});
