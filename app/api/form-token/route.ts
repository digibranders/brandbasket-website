// app/api/form-token/route.ts
import { CONTACT_ERRORS } from "@/content/contact";
import { issueFormToken } from "@/lib/security/honeypot";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export function GET(request: Request): Response {
  // A visitor needs one or two tokens; a script minting them in bulk does not get far.
  const limit = rateLimit(`token:${clientKey(request)}`, 20, 10 * 60_000);
  if (!limit.allowed) return Response.json({ error: CONTACT_ERRORS.tooMany }, { status: 429, headers: { ...NO_STORE, "Retry-After": String(limit.retryAfter) } });

  try {
    return Response.json({ token: issueFormToken() }, { headers: NO_STORE });
  } catch (error) {
    // Only a missing or invalid FORM_SECRET gets here; the form then tells the visitor to use WhatsApp.
    console.error("form-token: could not issue", error instanceof Error ? error.message : "unknown");
    return Response.json({ error: CONTACT_ERRORS.send }, { status: 503, headers: NO_STORE });
  }
}
