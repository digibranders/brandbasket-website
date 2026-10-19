import { describe, expect, it } from "vitest";
import { securityHeaders } from "./security-headers";

const byKey = (dev: boolean): Record<string, string> => Object.fromEntries(securityHeaders({ dev }).map((h) => [h.key, h.value]));

describe("securityHeaders", () => {
  it("sends HSTS, nosniff, frame and permissions policies", () => {
    const h = byKey(false);
    expect(h["Strict-Transport-Security"]).toBe("max-age=63072000; includeSubDomains; preload");
    expect(h["X-Content-Type-Options"]).toBe("nosniff");
    expect(h["X-Frame-Options"]).toBe("DENY");
    expect(h["Permissions-Policy"]).toContain("camera=()");
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
});
