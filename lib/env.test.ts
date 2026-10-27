import { describe, expect, it } from "vitest";
import { parsePlatformLeadsEnv, parseServerEnv } from "./env";

describe("parseServerEnv", () => {
  it("accepts a complete production environment", () => {
    const env = parseServerEnv({
      BREVO_API_KEY: "xkeysib-abc",
      FORM_SECRET: "a".repeat(32),
      CONTACT_INBOX: "hello@brandbasket.in",
      MAIL_SENDER: "hello@brandbasket.in",
    });
    expect(env.CONTACT_INBOX).toBe("hello@brandbasket.in");
  });

  it("rejects a short form secret", () => {
    expect(() => parseServerEnv({ BREVO_API_KEY: "k", FORM_SECRET: "short", CONTACT_INBOX: "a@b.in", MAIL_SENDER: "a@b.in" }))
      .toThrow(/FORM_SECRET/);
  });
});

describe("parsePlatformLeadsEnv", () => {
  it("is off when neither variable is set", () => {
    expect(parsePlatformLeadsEnv({})).toBeNull();
    expect(parsePlatformLeadsEnv({ PLATFORM_LEADS_URL: "", LEADS_API_TOKEN: "" })).toBeNull();
  });

  it("reads the address without a trailing slash, and the token", () => {
    expect(parsePlatformLeadsEnv({ PLATFORM_LEADS_URL: "https://app.brandbasket.in/", LEADS_API_TOKEN: "t".repeat(32) })).toEqual({ url: "https://app.brandbasket.in", token: "t".repeat(32) });
  });

  it("refuses one without the other, and a short token", () => {
    expect(() => parsePlatformLeadsEnv({ PLATFORM_LEADS_URL: "https://app.brandbasket.in" })).toThrow(/LEADS_API_TOKEN/);
    expect(() => parsePlatformLeadsEnv({ PLATFORM_LEADS_URL: "https://app.brandbasket.in", LEADS_API_TOKEN: "short" })).toThrow(/LEADS_API_TOKEN/);
  });
});

