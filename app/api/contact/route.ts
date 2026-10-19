// app/api/contact/route.ts
import { z } from "zod";
import { CONTACT_ERRORS } from "@/content/contact";
import { contactSchema } from "@/lib/contact-schema";
import { BrevoSendError, sendTransactionalEmail } from "@/lib/email/brevo";
import { buildLeadEmail } from "@/lib/email/contact-templates";
import { serverEnv, type ServerEnv } from "@/lib/env";
import { screenSubmission } from "@/lib/security/honeypot";
import { clientKey, rateLimit } from "@/lib/security/rateLimit";

export const runtime = "nodejs";

const sendFailed = (): Response => Response.json({ error: CONTACT_ERRORS.send }, { status: 502 });

/** Logs why a send failed without any personal field: Brevo error bodies can echo the reply-to address. */
function logFailure(stage: string, error: unknown): void {
  const reason = error instanceof BrevoSendError ? `Brevo status ${error.status}` : error instanceof Error ? error.message : "unknown";
  console.error(`contact: ${stage} failed`, reason);
}

export async function POST(request: Request): Promise<Response> {
  const limit = rateLimit(`contact:${clientKey(request)}`, 5, 10 * 60_000);
  if (!limit.allowed) return Response.json({ error: CONTACT_ERRORS.tooMany }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });

  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }
  if (typeof body !== "object" || body === null || Array.isArray(body)) return Response.json({ error: "Invalid request" }, { status: 400 });

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
      replyTo: parsed.data.email ? { email: parsed.data.email, name: parsed.data.name } : undefined,
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
    });
  } catch (error) {
    logFailure("mail send", error);
    return sendFailed();
  }
  return Response.json({ ok: true });
}
