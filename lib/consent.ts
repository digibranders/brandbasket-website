// lib/consent.ts
import { z } from "zod";

/**
 * Consent for the optional tags (plan 12). Every tag runs inside one Google Tag Manager container, whose id is a public
 * env var inlined at build time. With no id the site loads no third-party tag, shows no banner and the privacy policy
 * keeps saying it sets no cookies.
 */
export type Purpose = "measurement" | "advertising";
export type VendorId = "ga4" | "clarity" | "googleAds" | "metaPixel";

/**
 * The tools set up inside the GTM container. The banner, the privacy policy and the CSP are built from this list, so
 * it must match the container: add a tool here before publishing it in GTM, and remove it here when it leaves.
 */
export const GTM_CONTAINER_TOOLS: readonly VendorId[] = ["ga4", "clarity", "googleAds", "metaPixel"];

const VENDOR_ORDER: readonly VendorId[] = ["ga4", "clarity", "googleAds", "metaPixel"];
const PURPOSE_ORDER: readonly Purpose[] = ["measurement", "advertising"];

export const PURPOSE_OF: Readonly<Record<VendorId, Purpose>> = { ga4: "measurement", clarity: "measurement", googleAds: "advertising", metaPixel: "advertising" };

const GTM_ENV = "NEXT_PUBLIC_GTM_ID";

/** Throws naming the variable when the id is malformed, so a typo fails the build instead of loading nothing. */
export function parseGtmId(source: Readonly<Record<string, string | undefined>>): string | null {
  const value = source[GTM_ENV]?.trim();
  if (!value) return null;
  if (!/^GTM-[A-Z0-9]{4,12}$/.test(value)) throw new Error(`${GTM_ENV} is not a valid container id: "${value}"`);
  return value;
}

// A literal process.env read, so Next.js inlines it into the client bundle.
export const GTM_ID: string | null = parseGtmId({ [GTM_ENV]: process.env.NEXT_PUBLIC_GTM_ID });

/** Tools that may load on this build, in display order. Empty when no container is configured. */
export function toolsOf(gtmId: string | null, container: readonly VendorId[] = GTM_CONTAINER_TOOLS): VendorId[] {
  return gtmId ? VENDOR_ORDER.filter((vendor) => container.includes(vendor)) : [];
}

export const TOOLS: readonly VendorId[] = toolsOf(GTM_ID);

export function purposesOf(vendors: readonly VendorId[]): Purpose[] {
  return PURPOSE_ORDER.filter((purpose) => vendors.some((vendor) => PURPOSE_OF[vendor] === purpose));
}

export type ConsentChoice = Readonly<Record<Purpose, boolean>>;
export const NO_CONSENT: ConsentChoice = Object.freeze({ measurement: false, advertising: false });

/** Global Privacy Control is a standing no to advertising, whatever was clicked. */
export function allowedVendors(choice: ConsentChoice, vendors: readonly VendorId[], gpc: boolean): VendorId[] {
  return vendors.filter((vendor) => choice[PURPOSE_OF[vendor]] && !(gpc && PURPOSE_OF[vendor] === "advertising"));
}

type Signal = "granted" | "denied";
export interface ConsentSignals {
  readonly analytics_storage: Signal;
  readonly ad_storage: Signal;
  readonly ad_user_data: Signal;
  readonly ad_personalization: Signal;
}

/** Google Consent Mode v2 signals for a choice. GTM tags check these before they fire. */
export function consentSignals(choice: ConsentChoice, gpc: boolean): ConsentSignals {
  const signal = (on: boolean): Signal => (on ? "granted" : "denied");
  const ads = signal(choice.advertising && !gpc);
  return { analytics_storage: signal(choice.measurement), ad_storage: ads, ad_user_data: ads, ad_personalization: ads };
}

export const CONSENT_KEY = "bb-consent";
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;

const recordSchema = z.object({
  measurement: z.boolean(),
  advertising: z.boolean(),
  vendors: z.array(z.enum(VENDOR_ORDER)),
  at: z.iso.datetime(),
});

export type ConsentRecord = z.infer<typeof recordSchema>;

export function encodeRecord(choice: ConsentChoice, vendors: readonly VendorId[], now: Date): string {
  const record: ConsentRecord = { measurement: choice.measurement, advertising: choice.advertising, vendors: [...vendors], at: now.toISOString() };
  return JSON.stringify(record);
}

/** Null means ask: nothing stored, unreadable, older than 12 months, or saved for a different list of tools. */
export function decodeRecord(raw: string | null, vendors: readonly VendorId[], now: Date): ConsentRecord | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return null;
  }
  const parsed = recordSchema.safeParse(data);
  if (!parsed.success) return null;
  const record = parsed.data;
  if (now.getTime() - Date.parse(record.at) > MAX_AGE_MS) return null;
  if (record.vendors.join() !== vendors.join()) return null;
  return record;
}

/** Purposes a new choice turns off, whose cookies must be deleted. */
export function withdrawn(before: ConsentChoice | null, after: ConsentChoice): Purpose[] {
  return before ? PURPOSE_ORDER.filter((purpose) => before[purpose] && !after[purpose]) : [];
}

// First-party cookie name prefixes: GA4 _ga and _ga_<id>; Clarity _clck and _clsk; Google Ads _gcl_*; Meta _fbp and _fbc.
const TRACKING_COOKIES: Readonly<Record<Purpose, readonly string[]>> = { measurement: ["_ga", "_clck", "_clsk"], advertising: ["_gcl_", "_fbp", "_fbc"] };

export function cookiesToClear(names: readonly string[], purposes: readonly Purpose[]): string[] {
  const prefixes = purposes.flatMap((purpose) => TRACKING_COOKIES[purpose]);
  return names.filter((name) => prefixes.some((prefix) => name.startsWith(prefix)));
}
