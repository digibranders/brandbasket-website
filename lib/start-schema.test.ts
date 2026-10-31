import { describe, expect, it } from "vitest";
import { readMobile, startSchema } from "./start-schema";

const VALID = { intent: "pay", name: "Rahul Mehta", phone: "98765 43210", email: "rahul@mehta.in", consent: true, noticeVersion: "2026-10-26.3" };

describe("readMobile", () => {
  it.each([
    ["9876543210", "+919876543210", "9876543210"],
    ["98765 43210", "+919876543210", "9876543210"],
    ["+91 98765-43210", "+919876543210", "9876543210"],
    ["919876543210", "+919876543210", "9876543210"],
    ["09876543210", "+919876543210", "9876543210"],
    ["+44 7700 900123", "+447700900123", ""],
  ])("reads %s", (input, e164, indian) => {
    expect(readMobile(input)).toEqual({ e164, indian });
  });

  it.each(["", "12345", "5876543210", "98765432", "abcdefghij", "447700900123", "+1"])("refuses %s", (input) => {
    expect(readMobile(input)).toBeNull();
  });
});

describe("startSchema", () => {
  it("accepts a complete lead for either intent", () => {
    expect(startSchema.safeParse(VALID).success).toBe(true);
    expect(startSchema.safeParse({ ...VALID, intent: "callback" }).success).toBe(true);
  });

  it("needs a name, a mobile number, an email and the consent tick", () => {
    for (const patch of [{ name: "A" }, { phone: "123" }, { email: "rahul@mehta" }, { consent: false }, { intent: "other" }]) {
      expect(startSchema.safeParse({ ...VALID, ...patch }).success, JSON.stringify(patch)).toBe(false);
    }
  });

  it("refuses control characters in the name", () => {
    expect(startSchema.safeParse({ ...VALID, name: "Rahul\nBcc: x@y.z" }).success).toBe(false);
  });

  it("keeps only the campaign parameters it knows", () => {
    const parsed = startSchema.parse({ ...VALID, ads: { utm_source: "google", gclid: "abc", evil: "x" } });
    expect(parsed.ads).toEqual({ utm_source: "google", gclid: "abc" });
  });
});
