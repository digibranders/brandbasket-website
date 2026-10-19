// lib/contact-schema.test.ts
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { contactSchema, parsePlanParam, parseTopicParam } from "./contact-schema";

const valid = { topic: "website", name: "Asha Rao", phone: "", email: "asha@example.in", business: "Rao Dental Care", city: "Thane", plans: ["website"], message: "", noticeVersion: "2026-10-20.1" };

describe("contactSchema", () => {
  it("runs zod without code generation, which a CSP without unsafe-eval would report", () => expect(z.config().jitless).toBe(true));
  it("accepts a minimal lead with no phone", () => expect(contactSchema.safeParse(valid).success).toBe(true));
  it("accepts a phone number when given", () => expect(contactSchema.safeParse({ ...valid, phone: "+91 98200 12345" }).success).toBe(true));
  it("rejects a short phone number", () => expect(contactSchema.safeParse({ ...valid, phone: "12345" }).success).toBe(false));
  it("requires an email", () => expect(contactSchema.safeParse({ ...valid, email: "" }).success).toBe(false));
  it("requires the website plan in every basket", () => expect(contactSchema.safeParse({ ...valid, plans: ["growth"] }).success).toBe(false));
  it("rejects an unknown plan", () => expect(contactSchema.safeParse({ ...valid, plans: ["website", "seo"] }).success).toBe(false));
  it("requires the notice version", () => expect(contactSchema.safeParse({ ...valid, noticeVersion: "" }).success).toBe(false));
  it("accepts a general question with no basket", () => expect(contactSchema.safeParse({ ...valid, topic: "other", plans: [] }).success).toBe(true));
  it("rejects an unknown topic", () => expect(contactSchema.safeParse({ ...valid, topic: "jobs" }).success).toBe(false));
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
  it("adds the website when only add-ons arrive", () => expect(parsePlanParam("search")).toEqual(["website", "search"]));
  it("drops unknown and repeated ids", () => expect(parsePlanParam("website,seo,growth,growth")).toEqual(["website", "growth"]));
  it("returns an empty basket for a missing or junk value", () => {
    expect(parsePlanParam(null)).toEqual([]);
    expect(parsePlanParam("seo")).toEqual([]);
  });
});

describe("parseTopicParam", () => {
  it("accepts a known topic", () => expect(parseTopicParam("help")).toBe("help"));
  it("ignores anything else", () => {
    expect(parseTopicParam("jobs")).toBeNull();
    expect(parseTopicParam(null)).toBeNull();
  });
});
