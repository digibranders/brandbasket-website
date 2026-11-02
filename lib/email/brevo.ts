import { serverEnv } from "@/lib/env";

/** Brevo transactional mail over plain fetch (vendored from fynix-digital-v2, without the kill switch and attachments). */
const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";
/** A hung Brevo call must not hold the function open until the platform kills it. */
const BREVO_TIMEOUT_MS = 10_000;

export type EmailAddress = {
  email: string;
  name?: string;
};

export type SendTransactionalEmailParams = {
  to: EmailAddress[];
  sender: EmailAddress;
  subject: string;
  htmlContent: string;
  textContent: string;
  replyTo?: EmailAddress;
};

export class BrevoSendError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "BrevoSendError";
  }
}

export async function sendTransactionalEmail(params: SendTransactionalEmailParams): Promise<void> {
  const apiKey = serverEnv().BREVO_API_KEY?.trim();
  // Only outside production: a production server without a key must fail loudly, not report mail as sent.
  if (process.env.NODE_ENV !== "production" && (!apiKey || apiKey.startsWith("local-dev"))) {
    console.log("Local development email delivery skipped (no live key):", params.subject, params.to);
    return;
  }
  const response = await fetch(BREVO_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": serverEnv().BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: params.sender,
      to: params.to,
      replyTo: params.replyTo,
      subject: params.subject,
      htmlContent: params.htmlContent,
      textContent: params.textContent,
    }),
    signal: AbortSignal.timeout(BREVO_TIMEOUT_MS),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new BrevoSendError(`Brevo API responded with ${response.status}: ${errorBody}`, response.status);
  }
}
