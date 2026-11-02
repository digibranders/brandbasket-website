import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { openStart } from "@/lib/start-token";

// `after` only runs inside a Next request; here the callbacks are kept so a test can run them once the reply is in hand.
const afterCallbacks = vi.hoisted<Array<() => unknown>>(() => []);
vi.mock("next/server", async (importOriginal) => ({ ...(await importOriginal<typeof import("next/server")>()), after: (callback: () => unknown) => void afterCallbacks.push(callback) }));

const SECRET = "t".repeat(40);
const ENV = { BREVO_API_KEY: "xkeysib-test", FORM_SECRET: "s".repeat(32), CONTACT_INBOX: "hello@brandbasket.in", MAIL_SENDER: "hello@brandbasket.in", PLATFORM_LEADS_URL: "https://app.example.test", LEADS_API_TOKEN: SECRET };
/** No platform address and no shared secret: local work without the platform. */
const LOCAL = { ...ENV, PLATFORM_LEADS_URL: "", LEADS_API_TOKEN: "" };
const LEAD = { name: "Rahul Mehta", phone: "98765 43210", email: "Rahul@Mehta.in", consent: true, noticeVersion: "2026-10-26.3", ads: { utm_source: "google" } };
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
  afterCallbacks.length = 0;
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

  it("seals the ad attribution into the sign-up address, cleaned, and leaves it out when there is none", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    const attribution = { values: { utm_source: "meta", utm_campaign: "diwali", evil: "x" }, consentMeasurement: true, consentAdvertising: false };
    const { POST, request } = await human(ENV, { attribution });
    const { next } = (await (await POST(request)).json()) as { next: string };
    expect(openStart(new URL(next).searchParams.get("start") ?? "", SECRET)?.attr).toEqual({
      values: { utm_source: "meta", utm_campaign: "diwali" },
      consentMeasurement: true,
      consentAdvertising: false,
    });
    const plain = await human(ENV, { attribution: "junk" });
    const sent = (await (await plain.POST(plain.request)).json()) as { next: string };
    expect(openStart(new URL(sent.next).searchParams.get("start") ?? "", SECRET)).not.toHaveProperty("attr");
  });

  it("never holds a paying visitor up when the platform is down", async () => {
    fetchMock.mockRejectedValue(new Error("network"));
    const { POST, request } = await human(ENV);
    const res = await POST(request);
    expect(res.status).toBe(200);
    expect(((await res.json()) as { next: string }).next).toContain("start=");
  });

  it("sends a paying visitor to the plain sign-up when no platform is configured", async () => {
    const { POST, request } = await human(LOCAL);
    expect(await (await POST(request)).json()).toEqual({ ok: true, next: "https://app.brandbasket.in/login?plan=website" });
  });

  describe("when the platform copy of the lead is dropped", () => {
    const TEAMS = "https://prod-12.centralindia.logic.azure.com/workflows/abc/triggers/manual/paths/invoke?sig=secret";
    const urls = (): string[] => fetchMock.mock.calls.map(([target]) => String(target));
    const runAfter = async (): Promise<void> => {
      for (const callback of afterCallbacks.splice(0)) await callback();
    };
    /** The platform answers with `platform`; Brevo and Teams answer 2xx unless told otherwise. */
    const answer = (platform: () => Response | Promise<Response>, others: () => Response = () => new Response("{}", { status: 200 })): void => {
      fetchMock.mockImplementation(async (target) => (String(target).startsWith("https://app.example.test") ? platform() : others()));
    };

    it.each([
      ["rate limits the request", () => new Response("slow down", { status: 429 })],
      ["cannot be reached", () => { throw new Error("network"); }],
    ])("tells the team by email and Teams, after the reply, when the platform %s", async (_case, platform) => {
      vi.stubEnv("TEAMS_ENQUIRIES_WEBHOOK_URL", TEAMS);
      answer(platform);
      const { POST, request } = await human(ENV);
      const res = await POST(request);
      expect(res.status).toBe(200);
      expect(((await res.json()) as { next: string }).next).toContain("start=");
      expect(urls()).toEqual(["https://app.example.test/api/leads"]);
      expect(afterCallbacks).toHaveLength(1);

      await runAfter();
      expect(urls()).toEqual(["https://app.example.test/api/leads", "https://api.brevo.com/v3/smtp/email", TEAMS]);
      const brevo = JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body)) as { to: Array<{ email: string }>; textContent: string };
      expect(brevo.to).toEqual([{ email: "hello@brandbasket.in", name: "Brandbasket" }]);
      expect(brevo.textContent).toContain("Rahul@Mehta.in");
      expect(brevo.textContent).toContain("+919876543210");
      expect(brevo.textContent).toContain("utm_source=google");
    });

    it("sends no alert when the platform kept the lead", async () => {
      answer(() => new Response("{}", { status: 200 }));
      const { POST, request } = await human(ENV);
      await POST(request);
      expect(afterCallbacks).toHaveLength(0);
      expect(fetchMock).toHaveBeenCalledOnce();
    });

    it("still tells Teams, and never throws or logs the address, when the alert email fails", async () => {
      vi.stubEnv("TEAMS_ENQUIRIES_WEBHOOK_URL", TEAMS);
      answer(() => new Response("no", { status: 429 }), () => new Response("denied", { status: 401 }));
      const { POST, request } = await human(ENV);
      await POST(request);
      await expect(runAfter()).resolves.toBeUndefined();
      expect(urls()).toContain(TEAMS);
      expect(JSON.stringify(vi.mocked(console.error).mock.calls).toLowerCase()).not.toContain("rahul@mehta.in");
    });

    it("sends no alert when no platform is configured", async () => {
      const { POST, request } = await human(LOCAL);
      await POST(request);
      expect(afterCallbacks).toHaveLength(0);
    });
  });
});
