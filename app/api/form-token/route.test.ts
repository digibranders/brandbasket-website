import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const get = (): Request => new Request("http://localhost/api/form-token", { headers: { "x-forwarded-for": "198.51.100.4" } });

beforeEach(() => {
  vi.resetModules();
  vi.stubEnv("BREVO_API_KEY", "xkeysib-test");
  vi.stubEnv("FORM_SECRET", "s".repeat(32));
  vi.stubEnv("CONTACT_INBOX", "hello@brandbasket.in");
  vi.stubEnv("MAIL_SENDER", "hello@brandbasket.in");
});

afterEach(() => vi.unstubAllEnvs());

describe("GET /api/form-token", () => {
  it("issues an uncached token", async () => {
    const { GET } = await import("./route");
    const res = GET(get());
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect((await res.json()).token).toMatch(/^\d+\./);
  });

  it("limits one caller to 20 tokens per 10 minutes", async () => {
    const { GET } = await import("./route");
    for (let i = 0; i < 20; i++) expect(GET(get()).status).toBe(200);
    const blocked = GET(get());
    expect(blocked.status).toBe(429);
    expect(Number(blocked.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(blocked.headers.get("cache-control")).toBe("no-store");
  });
});
