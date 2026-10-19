import { describe, expect, it } from "vitest";
import { parseServerEnv } from "./env";

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
