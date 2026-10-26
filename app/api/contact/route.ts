// app/api/contact/route.ts
import { z } from "zod";
import { CONTACT_ERRORS } from "@/content/contact";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { BrevoSendError, sendTransactionalEmail } from "@/lib/email/brevo";
import { buildConfirmationEmail, buildLeadEmail } from "@/lib/email/contact-templates";
import { platformLeadsEnv, serverEnv, type ServerEnv } from "@/lib/env";
import { forwardEnquiry, type PlatformLeadsEnv } from "@/lib/platform-leads";
import { screenSubmission } from "@/lib/security/honeypot";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

/** A real lead is under 3 KB; anything near this is not a person typing. */
const MAX_BODY_BYTES = 16_384;

const invalid = (): Response => Response.json({ error: CONTACT_ERRORS.invalid }, { status: 400 });
const tooLarge = (): Response => Response.json({ error: CONTACT_ERRORS.tooLarge }, { status: 413 });
const sendFailed = (): Response => Response.json({ error: CONTACT_ERRORS.send }, { status: 502 });

/** Logs why a send failed without any personal field: Brevo error bodies can echo the reply-to address. */
function logFailure(stage: string, error: unknown): void {
  const reason = error instanceof BrevoSendError ? `Brevo status ${error.status}` : error instanceof Error ? error.message : "unknown";
  console.error(`contact: ${stage} failed`, reason);
}

/** Copies the enquiry into the staff console. A broken platform setting is logged and skipped: the team inbox has it. */
async function copyToPlatform(lead: ContactInput, request: Request): Promise<void> {
  let env: PlatformLeadsEnv | null;
  try {
    env = platformLeadsEnv();
  } catch (error) {
    logFailure("platform settings", error);
    return;
  }
  if (env !== null) await forwardEnquiry(lead, request, env);
}

export async function POST(request: Request): Promise<Response> {
  const limit = rateLimit(`contact:${clientKey(request)}`, 5, 10 * 60_000);
  if (!limit.allowed) return Response.json({ error: CONTACT_ERRORS.tooMany }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) return tooLarge();
  let raw: string;
  try { raw = await request.text(); } catch { return invalid(); }
  // The declared length can be missing (chunked) or wrong, so measure what actually arrived.
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return tooLarge();

  let body: unknown;
  try { body = JSON.parse(raw); } catch { return invalid(); }
  if (typeof body !== "object" || body === null || Array.isArray(body)) return invalid();

  // Without mail settings nothing can be delivered, so say so before screening (which needs FORM_SECRET too).
  let env: ServerEnv;
  try { env = serverEnv(); } catch (error) { logFailure("environment", error); return sendFailed(); }

  // Bots get a normal-looking success so they do not learn what tripped them.
  if (!screenSubmission(body as Record<string, unknown>).human) return Response.json({ ok: true });

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: CONTACT_ERRORS.form, fields: z.flattenError(parsed.error).fieldErrors }, { status: 422 });

  const mail = buildLeadEmail(parsed.data);
  try {
    await sendTransactionalEmail({
      to: [{ email: env.CONTACT_INBOX, name: "Brandbasket" }],
      sender: { email: env.MAIL_SENDER, name: "Brandbasket website" },
      replyTo: { email: parsed.data.email, name: parsed.data.name },
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
    });
  } catch (error) {
    logFailure("mail send", error);
    return sendFailed();
  }

  // The lead is with us now, so a failed confirmation is logged rather than shown to the visitor as a failure.
  const confirmation = buildConfirmationEmail(parsed.data);
  try {
    await sendTransactionalEmail({
      to: [{ email: parsed.data.email, name: parsed.data.name }],
      sender: { email: env.MAIL_SENDER, name: "Brandbasket" },
      replyTo: { email: env.CONTACT_INBOX, name: "Brandbasket" },
      subject: confirmation.subject,
      htmlContent: confirmation.html,
      textContent: confirmation.text,
    });
  } catch (error) {
    logFailure("confirmation send", error);
  }
  await copyToPlatform(parsed.data, request);
  return Response.json({ ok: true });
}
