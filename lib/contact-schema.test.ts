// lib/contact-schema.test.ts
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { CONTACT_ERRORS } from "@/content/contact";
import { contactSchema, parsePlanParam } from "./contact-schema";

const valid = { name: "Asha Rao", phone: "", email: "asha@example.in", business: "Rao Dental Care", city: "Thane", plans: ["website"], message: "Please call me this week", consent: true, noticeVersion: "2026-10-20.1" };

describe("contactSchema", () => {
  it("runs zod without code generation, which a CSP without unsafe-eval would report", () => expect(z.config().jitless).toBe(true));
  it("accepts a minimal lead with no phone", () => expect(contactSchema.safeParse(valid).success).toBe(true));
  it("accepts a phone number when given", () => expect(contactSchema.safeParse({ ...valid, phone: "+91 98200 12345" }).success).toBe(true));
  it("rejects a short phone number", () => expect(contactSchema.safeParse({ ...valid, phone: "12345" }).success).toBe(false));
  it("requires an email", () => expect(contactSchema.safeParse({ ...valid, email: "" }).success).toBe(false));
  it("accepts any basket of known plans", () => {
    expect(contactSchema.safeParse({ ...valid, plans: ["growth"] }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, plans: ["growth", "search"] }).success).toBe(true);
    expect(contactSchema.safeParse({ ...valid, plans: ["nope"] }).success).toBe(false);
  });
  it("rejects an unknown plan", () => expect(contactSchema.safeParse({ ...valid, plans: ["website", "seo"] }).success).toBe(false));
  it("requires the notice version", () => expect(contactSchema.safeParse({ ...valid, noticeVersion: "" }).success).toBe(false));
  it("accepts a general question with no basket", () => expect(contactSchema.safeParse({ ...valid, plans: [] }).success).toBe(true));
  it("no longer has a topic", () => expect(Object.keys(contactSchema.shape)).not.toContain("topic"));
  it("requires agreement to the privacy policy", () => {
    for (const consent of [false, undefined, "on", "true"]) expect(contactSchema.safeParse({ ...valid, consent }).success).toBe(false);
    const result = contactSchema.safeParse({ ...valid, consent: false });
    expect(result.success ? "" : result.error.issues[0]?.message).toBe(CONTACT_ERRORS.consent);
    expect(contactSchema.safeParse({ ...valid, consent: true }).success).toBe(true);
  });
  it("requires a message", () => {
    for (const message of ["", "   ", undefined]) {
      const result = contactSchema.safeParse({ ...valid, message });
      expect(result.success).toBe(false);
    }
    const empty = contactSchema.safeParse({ ...valid, message: "  " });
    expect(empty.success ? "" : empty.error.issues[0]?.message).toBe(CONTACT_ERRORS.message);
    expect(contactSchema.safeParse({ ...valid, message: "Hi" }).success).toBe(true);
  });
  it("caps the message length", () => expect(contactSchema.safeParse({ ...valid, message: "x".repeat(1501) }).success).toBe(false));
  it("rejects control characters that could break a mail header", () => {
    expect(contactSchema.safeParse({ ...valid, name: "Asha\r\nBcc: x@y.in" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, business: "Rao\u0007 Dental" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...valid, city: "Thane\n" + "x" }).success).toBe(false);
  });
  it("still allows line breaks in the message", () => expect(contactSchema.safeParse({ ...valid, message: "Hi\nCall me" }).success).toBe(true));
  it("uses the mock's wording for a bad email", () => {
    const result = contactSchema.safeParse({ ...valid, email: "asha@" });
    expect(result.success ? "" : result.error.issues[0]?.message).toBe("Please check the email address");
  });
});

describe("parsePlanParam", () => {
  it("reads the signupHref format", () => expect(parsePlanParam("website,growth")).toEqual(["website", "growth"]));
  it("keeps a basket without the website", () => {
    expect(parsePlanParam("search")).toEqual(["search"]);
    expect(parsePlanParam("search,website")).toEqual(["website", "search"]);
    expect(parsePlanParam("nope")).toEqual([]);
  });
  it("drops unknown and repeated ids", () => expect(parsePlanParam("website,seo,growth,growth")).toEqual(["website", "growth"]));
  it("returns an empty basket for a missing or junk value", () => {
    expect(parsePlanParam(null)).toEqual([]);
    expect(parsePlanParam("seo")).toEqual([]);
  });
});
