/** The form token contract shared by the contact form (client) and the honeypot screen (server). No server imports here. */

/** Hidden decoy field names. Any non-empty value flags a bot. */
export const HONEYPOT_FIELDS = ["company_website", "fax_number"] as const;

/** Body key carrying the signed form token. */
export const FORM_TOKEN_FIELD = "formToken";

/**
 * Minimum time between the form loading and submitting. Faster means a bot. Kept low enough that browser autofill
 * users are not false-flagged; the signed token and decoy fields are the primary defences.
 */
export const MIN_FILL_MS = 1_500;
/** Token lifetime. Older means stale or replayed. */
export const MAX_TOKEN_AGE_MS = 2 * 60 * 60 * 1_000;

/** The client counts age from when the token arrived, which is after the server stamped it, so it can only err safe. */
const MIN_AGE_MARGIN_MS = 250;
/** Swap tokens well before the server would reject one as expired. */
export const TOKEN_REFRESH_AGE_MS = MAX_TOKEN_AGE_MS - 10 * 60 * 1_000;

export type TokenPlan = { readonly kind: "use" } | { readonly kind: "refresh" } | { readonly kind: "wait"; readonly ms: number };

/**
 * What the form must do with its token before posting, so the server never silently drops a real lead as a bot:
 * fetch one when missing or near expiry, or wait until it is older than the minimum fill time.
 */
export function planTokenUse(receivedAt: number | null, now: number): TokenPlan {
  if (receivedAt === null) return { kind: "refresh" };
  const age = now - receivedAt;
  if (age >= TOKEN_REFRESH_AGE_MS) return { kind: "refresh" };
  const gap = MIN_FILL_MS + MIN_AGE_MARGIN_MS - age;
  return gap > 0 ? { kind: "wait", ms: gap } : { kind: "use" };
}
