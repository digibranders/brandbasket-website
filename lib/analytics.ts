// lib/analytics.ts
import { PLAN_IDS, type PlanId } from "./pricing";

/**
 * Conversion events for Vercel Web Analytics, and for Tag Manager once a visitor allows tracking. Properties hold page
 * locations and plan ids only, never anything a visitor typed, so the privacy policy's "counts visits without cookies"
 * stays true.
 */
export type ConversionEvent =
  | { readonly name: "cta_click"; readonly properties: { readonly location: string; readonly plans: string } }
  | { readonly name: "whatsapp_click"; readonly properties: { readonly location: string } }
  | { readonly name: "contact_submit"; readonly properties: { readonly plans: string } };

type ClickName = "cta_click" | "whatsapp_click";

export interface TrackAttrs {
  readonly "data-track": ClickName;
  readonly "data-location": string;
}

/** Spread on a link so the one delegated listener (components/analytics/ConversionTracking.tsx) reports its click. */
export function trackAttrs(name: ClickName, location: string): TrackAttrs {
  return { "data-track": name, "data-location": location };
}

/** Plan ids in sign-up link order, comma separated. */
export function planList(ids: readonly PlanId[]): string {
  return PLAN_IDS.filter((id) => ids.includes(id)).join(",");
}

/** The event for a click on a tracked link, from its data attributes and href. Plans come from the link's own ?plan=. */
export function clickEvent(data: { readonly track?: string; readonly location?: string }, href: string): ConversionEvent | null {
  const { track, location } = data;
  if (!location) return null;
  if (track === "whatsapp_click") return { name: track, properties: { location } };
  if (track !== "cta_click") return null;
  const picked = new URL(href, "https://brandbasket.invalid").searchParams.get("plan")?.split(",") ?? [];
  const plans = PLAN_IDS.filter((id) => picked.includes(id));
  return { name: track, properties: { location, plans: plans.length > 0 ? planList(plans) : "none" } };
}

/** Sent after the contact API accepts a message. An empty list is a general enquiry. */
export function submitEvent(plans: readonly PlanId[]): ConversionEvent {
  return { name: "contact_submit", properties: { plans: plans.length > 0 ? planList(plans) : "none" } };
}
