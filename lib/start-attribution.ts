// lib/start-attribution.ts
/**
 * The parts of the sign-up token (lib/start-token.ts) that browser code also needs. They live apart because start-token.ts
 * imports node:crypto: any client component that imported it pulled a crypto polyfill (about 140 KB gzipped) into every page.
 * Keep this file free of Node imports.
 */

/** The sign-up address's query parameter that carries the token. */
export const START_PARAM = "start";

/** Every attribution value the token may carry, with the longest it may be. Anything else is dropped. */
export const ATTRIBUTION_CAPS = {
  utm_source: 120,
  utm_medium: 120,
  utm_campaign: 120,
  utm_term: 120,
  utm_content: 120,
  gclid: 120,
  fbclid: 120,
  fbp: 60,
  fbc: 120,
  ga_client_id: 40,
  ga_session_id: 20,
  landing_path: 200,
  referrer_host: 100,
} as const;
export type AttributionKey = keyof typeof ATTRIBUTION_CAPS;

/** The ad a visitor came from, and which tracking they had agreed to when the ids were read (plan 59). */
export interface Attribution {
  readonly values: Readonly<Partial<Record<AttributionKey, string>>>;
  readonly consentMeasurement: boolean;
  readonly consentAdvertising: boolean;
}

/** The attribution in `raw` with only the known, short, single-line text values kept; null when none is left. Never throws. */
export function cleanAttribution(raw: unknown): Attribution | null {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  const { values, consentMeasurement, consentAdvertising } = raw as Record<string, unknown>;
  if (typeof values !== "object" || values === null || Array.isArray(values)) return null;
  const kept: Partial<Record<AttributionKey, string>> = {};
  for (const key of Object.keys(ATTRIBUTION_CAPS) as AttributionKey[]) {
    const value = (values as Record<string, unknown>)[key];
    if (typeof value !== "string") continue;
    const text = value.trim();
    if (text !== "" && text.length <= ATTRIBUTION_CAPS[key] && !/\p{Cc}/u.test(text)) kept[key] = text;
  }
  if (Object.keys(kept).length === 0) return null;
  return { values: kept, consentMeasurement: consentMeasurement === true, consentAdvertising: consentAdvertising === true };
}
