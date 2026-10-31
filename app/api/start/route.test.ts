import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { openStart } from "@/lib/start-token";

const SECRET = "t".repeat(40);
const ENV = { BREVO_API_KEY: "xkeysib-test", FORM_SECRET: "s".repeat(32), CONTACT_INBOX: "hello@brandbasket.in", MAIL_SENDER: "hello@brandbasket.in", PLATFORM_LEADS_URL: "https://app.example.test", LEADS_API_TOKEN: SECRET };
/** No platform address and no shared secret: local work without the platform. */
const LOCAL = { ...ENV, PLATFORM_LEADS_URL: "", LEADS_API_TOKEN: "" };
const LEAD = { intent: "pay", name: "Rahul Mehta", phone: "98765 43210", email: "Rahul@Mehta.in", consent: true, noticeVersion: "2026-10-26.3", ads: { utm_source: "google" } };
const T0 = new Date("2026-10-31T10:00:00Z");

const post = (body: unknown): Request =>
  new Request("http://localhost/api/start", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.9" }, body: JSON.stringify(body) });

// serverEnv() caches, so every test loads fresh modules after setting the environment it needs.
async function load(env: Record<string, string>): Promise<{ POST: (r: Request) => Promise<Response>; token: () => string }> {
  vi.resetModules();
  for (const [key, value] of Object.entries(env)) vi.stubEnv(key, value);
  const route = await import("./route");
  const honeypot = await import("@/lib/security/honeypot");
  return { POST: route.POST, token: honeypot.issueFormToken };
}

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  vi.useFakeTimers({ now: T0 });
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
  for (const key of Object.keys(ENV)) vi.stubEnv(key, "");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** A request a person could have sent: the token was issued a few seconds ago. */
async function human(env: Record<string, string>, patch: Record<string, unknown> = {}): Promise<{ POST: (r: Request) => Promise<Response>; request: Request }> {
  const { POST, token } = await load(env);
  const formToken = token();
  vi.advanceTimersByTime(5_000);
  return { POST, request: post({ ...LEAD, formToken, ...patch }) };
}

describe("POST /api/start", () => {
  it("refuses a body larger than 4 KB", async () => {
    const { POST } = await load(ENV);
    const req = new Request("http://localhost/api/start", { method: "POST", headers: { "content-type": "application/json", "content-length": "4097" }, body: "{}" });
    expect((await POST(req)).status).toBe(413);
  });

  it("rejects a body that is not a JSON object", async () => {
    const { POST } = await load(ENV);
    expect((await POST(post([1]))).status).toBe(400);
  });

  it("answers a bot with a quiet success and stores nothing", async () => {
    const { POST } = await load(ENV);
    const res = await POST(post(LEAD));
    expect(await res.json()).toEqual({ ok: true, next: "https://app.brandbasket.in/login?plan=website" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid lead with field errors", async () => {
    const { POST, request } = await human(ENV, { phone: "123", email: "nope" });
    const res = await POST(request);
    expect(res.status).toBe(422);
    const body = (await res.json()) as { fields: Record<string, string[]> };
    expect(Object.keys(body.fields).sort()).toEqual(["email", "phone"]);
  });

  it("keeps the lead, then sends a paying visitor to the sign-up with their details sealed in the address", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const { POST, request } = await human(ENV);
    const res = await POST(request);
    expect(res.status).toBe(200);
    const { next } = (await res.json()) as { next: string };
    const url = new URL(next);
    expect(`${url.origin}${url.pathname}`).toBe("https://app.brandbasket.in/login");
    expect(url.searchParams.get("plan")).toBe("website");
    expect(next).not.toContain("rahul");
    expect(openStart(url.searchParams.get("start") ?? "", SECRET)).toEqual({ name: "Rahul Mehta", email: "rahul@mehta.in", phone: "9876543210" });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("never holds a paying visitor up when the platform is down", async () => {
    fetchMock.mockRejectedValue(new Error("network"));
    const { POST, request } = await human(ENV);
    const res = await POST(request);
    expect(res.status).toBe(200);
    expect(((await res.json()) as { next: string }).next).toContain("start=");
  });

  it("confirms a call back only once the lead is stored", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const ok = await human(ENV, { intent: "callback" });
    expect(await (await ok.POST(ok.request)).json()).toEqual({ ok: true });

    fetchMock.mockResolvedValue(new Response("{}", { status: 500 }));
    const failed = await human(ENV, { intent: "callback" });
    const res = await failed.POST(failed.request);
    expect(res.status).toBe(502);
    expect(((await res.json()) as { error: string }).error).toContain("call or WhatsApp");
  });

  it("says the same when no platform is configured and someone asks for a call", async () => {
    const { POST, request } = await human(LOCAL, { intent: "callback" });
    expect((await POST(request)).status).toBe(502);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends a paying visitor to the plain sign-up when no platform is configured", async () => {
    const { POST, request } = await human(LOCAL);
    expect(await (await POST(request)).json()).toEqual({ ok: true, next: "https://app.brandbasket.in/login?plan=website" });
  });
});
