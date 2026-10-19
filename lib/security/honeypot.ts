import crypto from "crypto";
import { serverEnv } from "@/lib/env";
import { FORM_TOKEN_FIELD, HONEYPOT_FIELDS, MAX_TOKEN_AGE_MS, MIN_FILL_MS } from "./form-fields";

/**
 * Layered bot screening for the contact form (vendored from fynix-digital-v2).
 *
 * A submission must clear all of these to look human:
 *   1. Decoy fields (`HONEYPOT_FIELDS`) must be empty. They are rendered off screen and hidden from assistive tech,
 *      so a real visitor never fills them, but naive bots that populate every field trip the trap.
 *   2. A server-issued, HMAC-signed form token must be present and valid. Bots that POST straight to the API
 *      (skipping the page) have no token.
 *   3. The token's age must sit inside a plausible window: submitting faster than a person can type
 *      (`MIN_FILL_MS`) or on a stale or replayed token (older than `MAX_TOKEN_AGE_MS`) is rejected.
 *
 * Enforced server side only: client checks are trivially bypassed by bots.
 *
 * The signing secret is `FORM_SECRET`, read lazily through `serverEnv()` so a missing variable fails the request
 * that needs it rather than the build. Every Vercel instance reads the same value, so a token issued by one
 * instance verifies on another.
 */

export { FORM_TOKEN_FIELD, HONEYPOT_FIELDS };

export type ScreenResult =
  | { human: true }
  | { human: false; reason: string };

function sign(payload: string): string {
  return crypto.createHmac("sha256", serverEnv().FORM_SECRET).update(payload).digest("base64url");
}

/** Issue a fresh signed token stamped with the current time. */
export function issueFormToken(): string {
  const ts = Date.now().toString();
  return `${ts}.${sign(ts)}`;
}

function verifyToken(token: unknown): ScreenResult {
  if (typeof token !== "string" || !token.includes(".")) {
    return { human: false, reason: "missing-token" };
  }

  const separator = token.indexOf(".");
  const ts = token.slice(0, separator);
  const providedSig = token.slice(separator + 1);
  const expectedSig = sign(ts);

  const provided = Buffer.from(providedSig);
  const expected = Buffer.from(expectedSig);
  if (
    provided.length !== expected.length ||
    !crypto.timingSafeEqual(provided, expected)
  ) {
    return { human: false, reason: "bad-signature" };
  }

  const issuedAt = Number(ts);
  if (!Number.isFinite(issuedAt)) {
    return { human: false, reason: "bad-timestamp" };
  }

  const age = Date.now() - issuedAt;
  if (age < MIN_FILL_MS) return { human: false, reason: "too-fast" };
  if (age > MAX_TOKEN_AGE_MS) return { human: false, reason: "expired" };

  return { human: true };
}

function honeypotTripped(body: Record<string, unknown>): boolean {
  return HONEYPOT_FIELDS.some((field) => {
    const value = body[field];
    return typeof value === "string" && value.trim().length > 0;
  });
}

/**
 * Run the full screen. Returns `{ human: true }` only when the decoy fields are
 * empty AND the token is present, correctly signed, and freshly aged.
 */
export function screenSubmission(body: Record<string, unknown>): ScreenResult {
  if (honeypotTripped(body)) return { human: false, reason: "honeypot" };
  return verifyToken(body[FORM_TOKEN_FIELD]);
}
