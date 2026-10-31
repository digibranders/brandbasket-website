// lib/attribution.ts
import { cleanAttribution, type Attribution, type AttributionKey } from "./start-token";

/**
 * Reads the ad a visitor came from (plan 59): the campaign and click ids in the address always, the Meta and Google Analytics
 * ids from their cookies only for the purpose the visitor allowed. Pure: the page passes in what it can see.
 */
export interface AttributionInput {
  /** `location.search`. */
  readonly search: string;
  /** `document.cookie`. */
  readonly cookie: string;
  /** What the visitor allows, with Global Privacy Control already applied to advertising. */
  readonly consent: { readonly measurement: boolean; readonly advertising: boolean };
  /** `location.pathname`. */
  readonly path: string;
  /** `document.referrer`. */
  readonly referrer: string;
  /** `location.hostname`. */
  readonly host: string;
  /** Milliseconds since 1970; stamps an fbc built from a click id. */
  readonly now: number;
}

const FROM_ADDRESS: readonly AttributionKey[] = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "fbclid"];

function cookieValue(cookie: string, matches: (name: string) => boolean): string | null {
  for (const pair of cookie.split(";")) {
    const at = pair.indexOf("=");
    if (at > 0 && matches(pair.slice(0, at).trim())) return pair.slice(at + 1).trim();
  }
  return null;
}

/** `GA1.1.123.456` is client id `123.456`. */
function gaClientId(cookie: string): string | null {
  const parts = cookieValue(cookie, (name) => name === "_ga")?.split(".");
  return parts !== undefined && parts.length >= 4 && parts[2] && parts[3] ? `${parts[2]}.${parts[3]}` : null;
}

/** `GS1.1.<session>.…` and `GS2.1.s<session>$o…` both name the session in their third part. */
function gaSessionId(cookie: string): string | null {
  const value = cookieValue(cookie, (name) => name.startsWith("_ga_") && name.length > 4);
  const third = value?.split(".")[2]?.replace(/^s/, "").split("$")[0];
  return third !== undefined && /^\d+$/.test(third) ? third : null;
}

function otherSite(referrer: string, host: string): string | null {
  try {
    const referrerHost = new URL(referrer).hostname;
    return referrerHost === host ? null : referrerHost;
  } catch {
    return null;
  }
}

/** The attribution to send with the lead, or null when the visitor did not come from an ad (no campaign or click id in the address). */
export function readAttribution(input: AttributionInput): Attribution | null {
  const query = new URLSearchParams(input.search);
  const values: Partial<Record<AttributionKey, string>> = {};
  for (const key of FROM_ADDRESS) {
    const value = query.get(key);
    if (value) values[key] = value;
  }
  if (Object.keys(values).length === 0) return null;

  values.landing_path = input.path;
  const referrerHost = otherSite(input.referrer, input.host);
  if (referrerHost !== null) values.referrer_host = referrerHost;
  if (input.consent.advertising) {
    const fbp = cookieValue(input.cookie, (name) => name === "_fbp");
    const fbc = cookieValue(input.cookie, (name) => name === "_fbc") ?? (values.fbclid ? `fb.1.${String(input.now)}.${values.fbclid}` : null);
    if (fbp) values.fbp = fbp;
    if (fbc) values.fbc = fbc;
  }
  if (input.consent.measurement) {
    const client = gaClientId(input.cookie);
    const session = gaSessionId(input.cookie);
    if (client !== null) values.ga_client_id = client;
    if (session !== null) values.ga_session_id = session;
  }
  return cleanAttribution({ values, consentMeasurement: input.consent.measurement, consentAdvertising: input.consent.advertising });
}
