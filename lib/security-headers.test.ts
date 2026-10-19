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

  it("allows Vercel analytics and nothing else third party", () => {
    const csp = byKey(false)["Content-Security-Policy"];
    expect(csp).toContain("connect-src 'self' https://vitals.vercel-insights.com");
    expect(csp).toContain("frame-ancestors 'none'");
  });
});
