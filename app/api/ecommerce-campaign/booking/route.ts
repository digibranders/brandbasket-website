import { screenSubmission } from "@/lib/security/honeypot";
import { bookingTimeZone } from "@/lib/ecommerce-booking";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";
import { BOOKING_WINDOW_MS, bookCampaignCall, bookingRequest, campaignCalendarConfig, campaignSlots } from "@/lib/server-ecommerce-calendar";

const NO_STORE = { "Cache-Control": "no-store" };

function problem(error: string, status: number, headers: HeadersInit = {}): Response {
  return Response.json({ error }, { status, headers: { ...NO_STORE, ...headers } });
}

export async function GET(request: Request): Promise<Response> {
  const { eventTypeId } = campaignCalendarConfig();
  if (eventTypeId === null) return problem("unconfigured", 503);
  const zone = bookingTimeZone.safeParse(new URL(request.url).searchParams.get("timeZone"));
  if (!zone.success) return problem("invalid", 400);
  const limit = rateLimit(`ecommerce-calendar:${clientKey(request)}`, 30, 10 * 60_000);
  if (!limit.allowed) return problem("rate-limited", 429, { "Retry-After": String(limit.retryAfter) });

  try {
    const days = await campaignSlots(eventTypeId, zone.data, new Date());
    return Response.json({ days }, { headers: NO_STORE });
  } catch {
    return problem("unavailable", 502);
  }
}

export async function POST(request: Request): Promise<Response> {
  const { eventTypeId } = campaignCalendarConfig();
  if (eventTypeId === null) return problem("unconfigured", 503);
  const limit = rateLimit(`ecommerce-booking:${clientKey(request)}`, 5, 10 * 60_000);
  if (!limit.allowed) return problem("rate-limited", 429, { "Retry-After": String(limit.retryAfter) });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return problem("invalid", 415);
  if (Number(request.headers.get("content-length") ?? 0) > 4096) return problem("invalid", 413);

  const raw = await request.text().catch(() => "");
  if (new TextEncoder().encode(raw).byteLength > 4096) return problem("invalid", 413);
  const input = bookingRequest.safeParse(parseJson(raw));
  if (!input.success) return problem("invalid", 400);
  const now = Date.now();
  const start = Date.parse(input.data.start);
  if (start <= now || start > now + BOOKING_WINDOW_MS) return problem("taken", 409);

  try {
    if (!screenSubmission(input.data).human) return problem("invalid", 400);
    const result = await bookCampaignCall(eventTypeId, input.data);
    if (result.kind !== "booked") return problem(result.kind, result.kind === "taken" ? 409 : 502);
    return Response.json(result.booking, { status: 201, headers: NO_STORE });
  } catch {
    return problem("unavailable", 502);
  }
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
