import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ContactInput } from "@/lib/contact-schema";
import { forwardEnquiry, forwardStart, pageOf, startMessage } from "./platform-leads";
import type { StartInput } from "./start-schema";

const LEAD: ContactInput = { name: "Asha Rao", phone: "98200 11111", email: "asha@example.in", business: "Rao Dental Care", city: "Thane", message: "Please call me", consent: true, noticeVersion: "2026-10-19.1" };
const ENV = { url: "https://app.example.test", token: "t".repeat(32) };
const fetchMock = vi.fn<typeof fetch>();

function visit(referer: string | null): Request {
  const headers: Record<string, string> = { "x-forwarded-for": "203.0.113.9" };
  if (referer !== null) headers.referer = referer;
  return new Request("http://localhost/api/contact", { method: "POST", headers });
}

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("forwardEnquiry", () => {
  it("posts the enquiry to the platform with the token", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    await forwardEnquiry(LEAD, visit("https://brandbasket.in/contact?plan=website"), ENV);
    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe("https://app.example.test/api/leads");
    expect(new Headers(init?.headers).get("authorization")).toBe(`Bearer ${"t".repeat(32)}`);
    expect(JSON.parse(String(init?.body))).toEqual({
      kind: "contact",
      contact: { name: "Asha Rao", business: "Rao Dental Care", email: "asha@example.in", phone: "98200 11111", city: "Thane", plans: [], message: "Please call me", page: "/contact" },
      clientIp: "203.0.113.9",
      noticeVersion: "2026-10-19.1",
    });
  });

  it("never throws, and logs no personal field, when the platform refuses or cannot be reached", async () => {
    fetchMock.mockResolvedValueOnce(new Response("no", { status: 500 }));
    await expect(forwardEnquiry(LEAD, visit(null), ENV)).resolves.toBeUndefined();
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    await expect(forwardEnquiry(LEAD, visit(null), ENV)).resolves.toBeUndefined();
    expect(JSON.stringify(vi.mocked(console.error).mock.calls)).not.toContain("asha@example.in");
  });
});

describe("pageOf", () => {
  it("keeps only the path of the page the form was sent from", () => {
    expect(pageOf(visit("https://brandbasket.in/contact?plan=website#form"))).toBe("/contact");
    expect(pageOf(visit(null))).toBeNull();
    expect(pageOf(visit("not a url"))).toBeNull();
  });
});

const START: StartInput = { name: "Rahul Mehta", phone: "98765 43210", email: "rahul@mehta.in", consent: true, noticeVersion: "2026-10-26.3", ads: { utm_source: "google", utm_campaign: "diwali", gclid: "g1" } };
const MOBILE = { e164: "+919876543210", indian: "9876543210" };

describe("startMessage", () => {
  it("says the visitor went on to payment and which ad brought them", () => {
    expect(startMessage(START.ads)).toBe("Ad landing page. Going to payment. utm_source=google, utm_campaign=diwali, gclid=g1");
    expect(startMessage(undefined)).toBe("Ad landing page. Going to payment.");
  });
});

describe("forwardStart", () => {
  it("posts the lead as a website plan lead and says it was stored", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    expect(await forwardStart(START, MOBILE, visit("https://www.brandbasket.in/start?utm_source=google"), ENV)).toBe(true);
    const [, init] = fetchMock.mock.calls[0] ?? [];
    expect(JSON.parse(String(init?.body))).toEqual({
      kind: "contact",
      contact: { name: "Rahul Mehta", business: "Not given yet", email: "rahul@mehta.in", phone: "+919876543210", city: "", plans: ["website"], message: "Ad landing page. Going to payment. utm_source=google, utm_campaign=diwali, gclid=g1", page: "/start" },
      clientIp: "203.0.113.9",
      noticeVersion: "2026-10-26.3",
    });
  });

  it("says it was not stored when the platform refuses or is down, and never throws", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 500 }));
    expect(await forwardStart(START, MOBILE, visit(null), ENV)).toBe(false);
    fetchMock.mockRejectedValueOnce(new Error("network"));
    expect(await forwardStart(START, MOBILE, visit(null), ENV)).toBe(false);
  });
});
