import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ENV = { BREVO_API_KEY: "xkeysib-test", FORM_SECRET: "s".repeat(32), CONTACT_INBOX: "hello@brandbasket.in", MAIL_SENDER: "hello@brandbasket.in" };
const LEAD = { name: "Asha Rao", phone: "", email: "asha@example.in", business: "Rao Dental Care", city: "", message: "Please call me this week", consent: true, noticeVersion: "2026-10-19.1" };
const T0 = new Date("2026-10-19T10:00:00Z");

const post = (body: unknown): Request =>
  new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json", "x-forwarded-for": "203.0.113.9" }, body: JSON.stringify(body) });

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
  for (const key of [...Object.keys(ENV), "PLATFORM_LEADS_URL", "LEADS_API_TOKEN"]) vi.stubEnv(key, "");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("POST /api/contact", () => {
  it("refuses a body larger than 16 KB by its declared length", async () => {
    const { POST } = await load(ENV);
    const req = new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json", "content-length": "16385" }, body: "{}" });
    expect((await POST(req)).status).toBe(413);
  });

  it("refuses a body larger than 16 KB when no length is declared", async () => {
    const { POST } = await load(ENV);
    const big = new TextEncoder().encode(JSON.stringify({ ...LEAD, message: "x".repeat(20_000) }));
    const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(big); controller.close(); } });
    const req = new Request("http://localhost/api/contact", { method: "POST", headers: { "content-type": "application/json" }, body: stream, duplex: "half" } as RequestInit);
    expect(req.headers.get("content-length")).toBeNull();
    expect((await POST(req)).status).toBe(413);
  });

  it("rejects a body that is not a JSON object", async () => {
    const { POST } = await load(ENV);
    expect((await POST(post([1, 2]))).status).toBe(400);
  });

  it("returns the WhatsApp message, not a crash, when mail is not configured", async () => {
    const { POST } = await load({});
    const res = await POST(post({ ...LEAD, formToken: "x" }));
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "We could not send this. Please WhatsApp us instead." });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers a filled honeypot with a quiet success and sends nothing", async () => {
    const { POST, token } = await load(ENV);
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    const res = await POST(post({ ...LEAD, formToken, company_website: "spam.example" }));
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("answers a missing token with a quiet success and sends nothing", async () => {
    const { POST } = await load(ENV);
    expect(await (await POST(post(LEAD))).json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an invalid lead with field errors", async () => {
    const { POST, token } = await load(ENV);
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    const res = await POST(post({ ...LEAD, formToken, phone: "123" }));
    expect(res.status).toBe(422);
    expect((await res.json()).fields.phone).toEqual(["Please check the phone number"]);
  });

  it("rejects a lead that did not agree to the privacy policy", async () => {
    const { POST, token } = await load(ENV);
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    const res = await POST(post({ ...LEAD, formToken, consent: false }));
    expect(res.status).toBe(422);
    expect((await res.json()).fields.consent).toEqual(["Please agree to the privacy policy to send your message."]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("mails a valid lead to the inbox", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 201 }));
    const { POST, token } = await load(ENV);
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    const res = await POST(post({ ...LEAD, formToken }));
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
    const sent = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(sent.to).toEqual([{ email: "hello@brandbasket.in", name: "Brandbasket" }]);
    expect(sent.replyTo).toEqual({ email: "asha@example.in", name: "Asha Rao" });
    expect(sent.subject).toBe("New enquiry: Rao Dental Care");
    const confirmation = JSON.parse(String(fetchMock.mock.calls[1]?.[1]?.body));
    expect(confirmation.to).toEqual([{ email: "asha@example.in", name: "Asha Rao" }]);
    expect(confirmation.subject).toBe("We have your message. Brandbasket");
  });

  it("also posts the enquiry to Teams when an address is set, and not otherwise", async () => {
    const teams = "https://prod-12.centralindia.logic.azure.com/workflows/abc/triggers/manual/paths/invoke?sig=secret";
    fetchMock.mockResolvedValue(new Response("{}", { status: 202 }));
    const { POST, token } = await load({ ...ENV, TEAMS_ENQUIRIES_WEBHOOK_URL: teams });
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    expect(await (await POST(post({ ...LEAD, formToken }))).json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[2]?.[0]).toBe(teams);
    expect(String(fetchMock.mock.calls[2]?.[1]?.body)).toContain("New website enquiry: Rao Dental Care");
  });

  it("still says the message arrived when Teams is down", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 201 })).mockResolvedValueOnce(new Response("{}", { status: 201 })).mockRejectedValueOnce(new Error("offline"));
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { POST, token } = await load({ ...ENV, TEAMS_ENQUIRIES_WEBHOOK_URL: "https://prod-12.centralindia.logic.azure.com/workflows/abc" });
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    const res = await POST(post({ ...LEAD, formToken }));
    expect(res.status).toBe(200);
  });

  it("still says the message arrived when only the confirmation fails", async () => {
    fetchMock.mockResolvedValueOnce(new Response("{}", { status: 201 })).mockResolvedValueOnce(new Response("bad", { status: 400 }));
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const { POST, token } = await load(ENV);
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    expect(await (await POST(post({ ...LEAD, formToken }))).json()).toEqual({ ok: true });
  });

  it("refuses a lead with no email", async () => {
    const { POST, token } = await load(ENV);
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    const res = await POST(post({ ...LEAD, formToken, email: "" }));
    expect(res.status).toBe(422);
    expect((await res.json()).fields.email).toEqual(["Please check the email address"]);
  });

  it("returns 502 when Brevo refuses the send", async () => {
    fetchMock.mockResolvedValue(new Response("unauthorized", { status: 401 }));
    const { POST, token } = await load(ENV);
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    expect((await POST(post({ ...LEAD, formToken }))).status).toBe(502);
  });

  it("copies a valid lead to the platform before sending emails, when the platform is set", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 201 }));
    const { POST, token } = await load({ ...ENV, PLATFORM_LEADS_URL: "https://app.example.test", LEADS_API_TOKEN: "t".repeat(32) });
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    const res = await POST(post({ ...LEAD, formToken }));
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://app.example.test/api/leads");
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toMatchObject({ kind: "contact", contact: { business: "Rao Dental Care", plans: [] } });
  });

  it("still says the message arrived when the platform copy fails", async () => {
    fetchMock.mockResolvedValueOnce(new Response("down", { status: 503 })).mockResolvedValue(new Response("{}", { status: 201 }));
    const { POST, token } = await load({ ...ENV, PLATFORM_LEADS_URL: "https://app.example.test", LEADS_API_TOKEN: "t".repeat(32) });
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    expect(await (await POST(post({ ...LEAD, formToken }))).json()).toEqual({ ok: true });
  });

  it("skips the platform copy, and still succeeds, when only one platform variable is set", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 201 }));
    const { POST, token } = await load({ ...ENV, PLATFORM_LEADS_URL: "https://app.example.test" });
    const formToken = token();
    vi.setSystemTime(T0.getTime() + 5_000);
    expect(await (await POST(post({ ...LEAD, formToken }))).json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
