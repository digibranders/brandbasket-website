// lib/contact-schema.ts
import { z } from "zod";
import { CONTACT_ERRORS } from "@/content/contact";
import type { PlanId } from "@/lib/pricing";

// zod 4 otherwise probes `new Function` on load, which production CSP (no 'unsafe-eval') reports as a violation.
// Set before any schema below is built; the form and the API route both import this module.
z.config({ jitless: true });

/** No control characters (CR, LF, NUL and friends): these fields reach the mail subject and the reply-to name. */
const NO_CONTROL = /^\P{Cc}*$/u;

const optionalText = (max: number, oneLine = false) => {
  const text = z.string().trim().max(max);
  return z.union([oneLine ? text.regex(NO_CONTROL, CONTACT_ERRORS.form) : text, z.literal("")]).optional();
};

/** The four answers to "What can we help with?" on the contact form. Labels live in content/contact.ts. */
export const CONTACT_TOPICS = ["website", "plans", "help", "other"] as const;
export type ContactTopic = (typeof CONTACT_TOPICS)[number];

const PLAN_IDS = ["website", "growth", "search"] as const satisfies readonly PlanId[];

/** Field length caps, shared with the inputs' maxLength so the browser never lets a visitor exceed them. */
export const CONTACT_MAX = { name: 80, phone: 16, email: 120, business: 120, city: 60, message: 1500 } as const;

export const contactSchema = z.object({
  topic: z.enum(CONTACT_TOPICS),
  name: z.string().trim().min(2, CONTACT_ERRORS.name).max(CONTACT_MAX.name).regex(NO_CONTROL, CONTACT_ERRORS.name),
  phone: z.union([z.string().trim().regex(/^\+?[0-9][0-9 ]{9,14}$/, CONTACT_ERRORS.phone), z.literal("")]).optional(),
  email: z.email(CONTACT_ERRORS.email).max(CONTACT_MAX.email),
  business: z.string().trim().min(2, CONTACT_ERRORS.business).max(CONTACT_MAX.business).regex(NO_CONTROL, CONTACT_ERRORS.business),
  city: optionalText(CONTACT_MAX.city, true),
  // Present when the visitor arrived from a basket (?plan=); an empty list is a general enquiry.
  plans: z.array(z.enum(PLAN_IDS)).refine((p) => p.length === 0 || p.includes("website"), CONTACT_ERRORS.basket),
  message: optionalText(CONTACT_MAX.message),
  noticeVersion: z.string().min(1).max(40),
});

export type ContactInput = z.infer<typeof contactSchema>;

/** Reads `?plan=` as signupHref() writes it ("website,growth"). Unknown ids are dropped; add-ons imply the website. */
export function parsePlanParam(value: string | null): PlanId[] {
  const picked = new Set(PLAN_IDS.filter((id) => value?.split(",").includes(id)));
  if (picked.size === 0) return [];
  return PLAN_IDS.filter((id) => id === "website" || picked.has(id));
}

/** Reads `?topic=`; anything that is not one of the four topics is ignored. */
export function parseTopicParam(value: string | null): ContactTopic | null {
  return CONTACT_TOPICS.find((topic) => topic === value) ?? null;
}
