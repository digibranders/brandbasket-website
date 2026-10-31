// lib/start-schema.ts
import { z } from "zod";
import { START_ERRORS } from "@/content/start";

// zod 4 otherwise probes `new Function` on load, which production CSP (no 'unsafe-eval') reports as a violation.
z.config({ jitless: true });

/** No control characters (CR, LF, NUL and friends): the name reaches the team's alert and the platform's console. */
const NO_CONTROL = /^\P{Cc}*$/u;

/** Field length caps, shared with the inputs' maxLength so the browser never lets a visitor exceed them. */
export const START_MAX = { name: 60, phone: 20, email: 120 } as const;

export const START_INTENTS = ["pay", "callback"] as const;
export type StartIntent = (typeof START_INTENTS)[number];

/** The campaign parameters kept from the ad's address; anything else in it is dropped. */
export const ADS_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"] as const;
export type AdsKey = (typeof ADS_KEYS)[number];

export interface Mobile {
  /** The number as the platform reads it: +91 and ten digits for an Indian mobile, otherwise the visitor's own +country form. */
  readonly e164: string;
  /** Ten digits when the number is an Indian mobile, otherwise empty: what the sign-up page can prefill. */
  readonly indian: string;
}

/** An Indian mobile (ten digits starting 6 to 9, with or without +91, 91 or 0 in front) or an international number written with its + and country code. Null for anything else. */
export function readMobile(value: string): Mobile | null {
  const compact = value.replace(/[\s-]/g, "");
  const ten = compact.replace(/^(\+91|91|0)(?=\d{10}$)/, "");
  if (/^[6-9]\d{9}$/.test(ten)) return { e164: `+91${ten}`, indian: ten };
  return /^\+\d{8,14}$/.test(compact) ? { e164: compact, indian: "" } : null;
}

export const startFields = {
  name: z.string().trim().min(2, START_ERRORS.name).max(START_MAX.name, START_ERRORS.name).regex(NO_CONTROL, START_ERRORS.name),
  phone: z.string().trim().max(START_MAX.phone, START_ERRORS.phoneWorld).refine((value) => readMobile(value) !== null, START_ERRORS.phoneWorld),
  email: z.email(START_ERRORS.email).max(START_MAX.email, START_ERRORS.email),
} as const;

const adsParam = z.string().max(120).optional();

export const startSchema = z.object({
  intent: z.enum(START_INTENTS),
  name: startFields.name,
  phone: startFields.phone,
  email: startFields.email,
  // Ticked on the form: the server refuses a lead that did not agree to the privacy policy.
  consent: z.literal(true, { error: START_ERRORS.consent }),
  noticeVersion: z.string().min(1).max(40),
  ads: z.object({ utm_source: adsParam, utm_medium: adsParam, utm_campaign: adsParam, utm_term: adsParam, utm_content: adsParam, gclid: adsParam, fbclid: adsParam }).optional(),
});

export type StartInput = z.infer<typeof startSchema>;
