import { z } from "zod";
import { campaignSource } from "@/content/ecommerce-campaign";
import { bookingConfirmation, bookingTimeZone } from "./ecommerce-booking";

const API = "https://api.cal.com/v2";
const SLOTS_VERSION = "2024-09-04";
const BOOKINGS_VERSION = "2026-02-25";
const DAY_MS = 86_400_000;
export const BOOKING_WINDOW_MS = 28 * DAY_MS;

const calSlots = z.object({
  data: z.record(z.iso.date(), z.array(z.object({ start: z.iso.datetime({ offset: true }) }))),
});
const calBooking = z.object({ data: bookingConfirmation });
const calProblem = z.object({ message: z.string() });

export const bookingRequest = z.looseObject({
  name: z.string().trim().min(1).max(100),
  email: z.email().max(254),
  timeZone: bookingTimeZone,
  start: z.iso.datetime({ offset: true }),
  source: z.string().max(40).nullish(),
  testimonialOptIn: z.boolean(),
});

export function campaignCalendarConfig(): { readonly eventTypeId: number | null; readonly hostedUrl: string | null } {
  const eventTypeId = Number(process.env.CALCOM_ECOMMERCE_EVENT_TYPE_ID?.trim());
  const configuredUrl = process.env.CALCOM_ECOMMERCE_BOOKING_URL?.trim() ?? "";
  const hostedUrl = URL.canParse(configuredUrl) ? new URL(configuredUrl) : null;
  return {
    eventTypeId: Number.isSafeInteger(eventTypeId) && eventTypeId > 0 ? eventTypeId : null,
    hostedUrl: hostedUrl?.protocol === "https:" && ["cal.com", "app.cal.com"].includes(hostedUrl.hostname) ? hostedUrl.href : null,
  };
}

async function callCal(path: string, version: string, body?: unknown): Promise<Response> {
  const key = process.env.CALCOM_API_KEY?.trim();
  return fetch(`${API}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "cal-api-version": version,
      ...(key ? { Authorization: `Bearer ${key}` } : {}),
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    cache: "no-store",
    signal: AbortSignal.timeout(8_000),
  });
}

export async function campaignSlots(eventTypeId: number, timeZone: string, now: Date): Promise<readonly { readonly date: string; readonly times: readonly string[] }[]> {
  const query = new URLSearchParams({
    eventTypeId: String(eventTypeId),
    start: now.toISOString(),
    end: new Date(now.getTime() + BOOKING_WINDOW_MS).toISOString(),
    timeZone,
    format: "range",
  });
  const response = await callCal(`/slots?${query}`, SLOTS_VERSION);
  if (!response.ok) throw new Error(`Cal.com availability returned ${response.status}`);
  const { data } = calSlots.parse(await response.json());
  return Object.entries(data).sort(([first], [second]) => first.localeCompare(second)).flatMap(([date, slots]) => {
    const times = [...new Set(slots.map(({ start }) => new Date(start).toISOString()))].sort();
    return times.length > 0 ? [{ date, times }] : [];
  });
}

type BookingResponse = { readonly kind: "booked"; readonly booking: z.infer<typeof bookingConfirmation> }
  | { readonly kind: "taken" | "failed" };

export async function bookCampaignCall(eventTypeId: number, input: z.infer<typeof bookingRequest>): Promise<BookingResponse> {
  const { start, name, email, timeZone, source, testimonialOptIn } = input;
  const response = await callCal("/bookings", BOOKINGS_VERSION, {
    eventTypeId,
    start: new Date(start).toISOString(),
    attendee: { name, email, timeZone, language: "en" },
    metadata: { source: campaignSource(source) ?? "direct", testimonialOptIn: String(testimonialOptIn) },
  });
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const problem = z.object({ error: calProblem.optional(), message: z.string().optional() }).safeParse(payload);
    const message = problem.success ? (problem.data.error?.message ?? problem.data.message ?? "") : "";
    return { kind: response.status === 409 || (response.status === 400 && /already booked|slot.*(?:taken|unavailable)|no available users/i.test(message)) ? "taken" : "failed" };
  }
  const { data } = calBooking.parse(await response.json());
  return { kind: "booked", booking: { ...data, start: new Date(data.start).toISOString() } };
}
