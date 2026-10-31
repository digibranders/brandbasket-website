// app/api/start/route.ts
import { z } from "zod";
import { START_ERRORS } from "@/content/start";
import { platformLeadsEnv, serverEnv } from "@/lib/env";
import { forwardStart, type PlatformLeadsEnv } from "@/lib/platform-leads";
import { screenSubmission } from "@/lib/security/honeypot";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";
import { startHref } from "@/lib/signup";
import { readMobile, startSchema } from "@/lib/start-schema";
import { cleanAttribution, sealStart } from "@/lib/start-token";

export const runtime = "nodejs";

/** A real submission is under 1 KB; anything near this is not a person typing. */
const MAX_BODY_BYTES = 4_096;

const NO_STORE = { "Cache-Control": "no-store" };
const invalid = (): Response => Response.json({ error: START_ERRORS.invalid }, { status: 400, headers: NO_STORE });
const tooLarge = (): Response => Response.json({ error: START_ERRORS.tooLarge }, { status: 413, headers: NO_STORE });
const sendFailed = (): Response => Response.json({ error: START_ERRORS.send }, { status: 502, headers: NO_STORE });

/** The shared secret and platform address, or null when they are not set (local work without the platform). A wrong setting is logged and treated as not set. */
function platform(): PlatformLeadsEnv | null {
  try {
    return platformLeadsEnv();
  } catch (error) {
    console.error("start: platform settings", error instanceof Error ? error.message : "unknown");
    return null;
  }
}

/**
 * The ad landing page's form. Keeps the lead in the staff console, then answers with where the sign-up page is: the visitor's
 * details sealed into its address so it opens already filled in.
 */
export async function POST(request: Request): Promise<Response> {
  const limit = rateLimit(`start:${clientKey(request)}`, 8, 10 * 60_000);
  if (!limit.allowed) return Response.json({ error: START_ERRORS.tooMany }, { status: 429, headers: { ...NO_STORE, "Retry-After": String(limit.retryAfter) } });

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return tooLarge();
  let raw: string;
  try { raw = await request.text(); } catch { return invalid(); }
  // The declared length can be missing (chunked) or wrong, so measure what actually arrived.
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return tooLarge();

  let body: unknown;
  try { body = JSON.parse(raw); } catch { return invalid(); }
  if (typeof body !== "object" || body === null || Array.isArray(body)) return invalid();

  // Screening needs FORM_SECRET; without it nothing can be told from a bot, so say so rather than crash.
  try { serverEnv(); } catch (error) {
    console.error("start: environment", error instanceof Error ? error.message : "unknown");
    return sendFailed();
  }
  // Bots get a normal-looking success so they do not learn what tripped them.
  if (!screenSubmission(body as Record<string, unknown>).human) return Response.json({ ok: true, next: startHref(null) }, { headers: NO_STORE });

  const parsed = startSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: START_ERRORS.form, fields: z.flattenError(parsed.error).fieldErrors }, { status: 422, headers: NO_STORE });
  const lead = parsed.data;
  const mobile = readMobile(lead.phone);
  if (mobile === null) return invalid();

  const env = platform();
  // Someone paying is never held up by the staff console: the lead is kept if it can be, and the sign-up page needs only the sealed details.
  if (env !== null) await forwardStart(lead, mobile, request, env);
  const attr = cleanAttribution(lead.attribution);
  const token = env === null ? null : sealStart({ name: lead.name, email: lead.email.toLowerCase(), phone: mobile.indian, ...(attr === null ? {} : { attr }) }, env.token);
  return Response.json({ ok: true, next: startHref(token) }, { headers: NO_STORE });
}
