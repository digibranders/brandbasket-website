// lib/contact-schema.ts
import { z } from "zod";
import { CONTACT_ERRORS } from "@/content/contact";
import { PLAN_IDS, type PlanId } from "@/lib/pricing";

// zod 4 otherwise probes `new Function` on load, which production CSP (no 'unsafe-eval') reports as a violation.
// Set before any schema below is built; the form and the API route both import this module.
z.config({ jitless: true });

/** No control characters (CR, LF, NUL and friends): these fields reach the mail subject and the reply-to name. */
const NO_CONTROL = /^\P{Cc}*$/u;

const optionalText = (max: number, oneLine = false) => {
  const text = z.string().trim().max(max);
  return z.union([oneLine ? text.regex(NO_CONTROL, CONTACT_ERRORS.form) : text, z.literal("")]).optional();
};

/** Field length caps, shared with the inputs' maxLength so the browser never lets a visitor exceed them. */
export const CONTACT_MAX = { name: 80, phone: 16, email: 120, business: 120, city: 60, message: 1500 } as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, CONTACT_ERRORS.name).max(CONTACT_MAX.name).regex(NO_CONTROL, CONTACT_ERRORS.name),
  phone: z.union([z.string().trim().regex(/^\+?[0-9][0-9 ]{9,14}$/, CONTACT_ERRORS.phone), z.literal("")]).optional(),
  email: z.email(CONTACT_ERRORS.email).max(CONTACT_MAX.email),
  business: z.string().trim().min(2, CONTACT_ERRORS.business).max(CONTACT_MAX.business).regex(NO_CONTROL, CONTACT_ERRORS.business),
  city: optionalText(CONTACT_MAX.city, true),
  // Present when the visitor arrived from a basket (?plan=); an empty list is a general enquiry.
  plans: z.array(z.enum(PLAN_IDS)),
  // Required since 2026-10-26. A line break is fine, an empty or blank message is not.
  message: z.string().trim().min(1, CONTACT_ERRORS.message).max(CONTACT_MAX.message),
  // Ticked on the form: the server refuses a lead that did not agree to the privacy policy.
  consent: z.literal(true, { error: CONTACT_ERRORS.consent }),
  noticeVersion: z.string().min(1).max(40),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Reads `?plan=` as signupHref() writes it ("website,growth"). Unknown ids are dropped. */
export function parsePlanParam(value: string | null): PlanId[] {
  const picked = value?.split(",") ?? [];
  return PLAN_IDS.filter((id) => picked.includes(id));
}
