import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { issueFormToken } from "@/lib/security/honeypot";
import { resetRateLimits } from "@/lib/security/rateLimit";
import { GET, POST } from "./route";

const address = "https://brandbasket.in/api/ecommerce-campaign/booking";
const start = "2026-12-03T05:30:00.000Z";
const attendee = { name: "Sample Merchant", email: "merchant@example.com", timeZone: "Asia/Kolkata" };

beforeEach(() => {
  resetRateLimits();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-11-28T00:00:00Z"));
  vi.stubEnv("CALCOM_ECOMMERCE_EVENT_TYPE_ID", "123");
  vi.stubEnv("CALCOM_API_KEY", "");
  vi.stubEnv("FORM_SECRET", "test-form-secret".repeat(3));
  vi.stubEnv("BREVO_API_KEY", "test-key");
  vi.stubEnv("CONTACT_INBOX", "hello@example.com");
  vi.stubEnv("MAIL_SENDER", "hello@example.com");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

function book(fields: Record<string, unknown> = {}): Request {
  const formToken = issueFormToken();
  vi.advanceTimersByTime(2000);
  return new Request(address, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start, ...attendee, source: "instagram", testimonialOptIn: true, formToken, ...fields }),
  });
}

describe("Ecommerce campaign calendar", () => {
  it("uses the configured event and returns time slots in the visitor's zone", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ data: { "2026-12-03": [{ start }] } }));
    vi.stubGlobal("fetch", fetcher);
    const response = await GET(new Request(address + "?timeZone=Asia%2FKolkata"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ days: [{ date: "2026-12-03", times: [start] }] });
    expect(fetcher.mock.calls[0]?.[0].toString()).toContain("eventTypeId=123");
  });

  it("sends a booking with the normalized source and opt-in in Cal.com metadata", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ data: { uid: "booking-one", start, status: "accepted" } }, { status: 201 }));
    vi.stubGlobal("fetch", fetcher);
    const response = await POST(book({ eventTypeId: 456 }));
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ start, status: "accepted" });
    expect(JSON.parse(fetcher.mock.calls[0]?.[1].body)).toMatchObject({
      eventTypeId: 123, attendee, metadata: { source: "instagram", testimonialOptIn: "true" },
    });
  });

  it("rejects an invalid zone and never claims a taken slot was booked", async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ error: { message: "Slot unavailable" } }, { status: 409 }));
    vi.stubGlobal("fetch", fetcher);
    expect((await POST(book({ timeZone: "Not/AZone" }))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
    expect((await POST(book())).status).toBe(409);
    expect(fetcher).toHaveBeenCalledTimes(1);
  });

  it("rejects booking submissions that bypass the public form protection", async () => {
    const fetcher = vi.fn();
    vi.stubGlobal("fetch", fetcher);
    expect((await POST(book({ formToken: null }))).status).toBe(400);
    expect((await POST(book({ company_website: "bot.example.com" }))).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("reports missing configuration before reaching Cal.com", async () => {
    vi.stubEnv("CALCOM_ECOMMERCE_EVENT_TYPE_ID", "");
    expect((await GET(new Request(address + "?timeZone=UTC"))).status).toBe(503);
  });
});
