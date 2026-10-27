import type { ContactInput } from "@/lib/contact-schema";
import { clientKey } from "@/lib/security/rateLimit";

/** Where the platform takes enquiries (its POST /api/leads), and the shared secret it checks (its LEADS_API_TOKEN). */
export interface PlatformLeadsEnv {
  readonly url: string;
  readonly token: string;
}

/** Long enough for the platform to answer; short enough that a slow platform never keeps the visitor waiting long. */
const TIMEOUT_MS = 5_000;
const MAX_PAGE_LENGTH = 200;

/** The page the form was sent from, as a path, or null. Only the path is kept: a query can carry personal data. */
export function pageOf(request: Request): string | null {
  const referer = request.headers.get("referer");
  if (referer === null) return null;
  try {
    return new URL(referer).pathname.slice(0, MAX_PAGE_LENGTH);
  } catch {
    return null;
  }
}

/**
 * Copies an enquiry the team has already been emailed into the platform, so it shows in the staff console. Never throws:
 * the message is safe in the inbox whatever happens here, so a failure is logged without any personal field.
 */
export async function forwardEnquiry(lead: ContactInput, request: Request, env: PlatformLeadsEnv): Promise<void> {
  try {
    const response = await fetch(`${env.url}/api/leads`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.token}` },
      body: JSON.stringify({
        kind: "contact",
        contact: {
          name: lead.name,
          business: lead.business,
          email: lead.email,
          phone: lead.phone ?? "",
          city: lead.city ?? "",
          // The form no longer takes a basket; the platform's intake still wants the list.
          plans: [],
          message: lead.message,
          page: pageOf(request),
        },
        clientIp: clientKey(request),
        noticeVersion: lead.noticeVersion,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) console.error("contact: platform copy failed", `status ${response.status}`);
  } catch (error) {
    console.error("contact: platform copy failed", error instanceof Error ? error.name : "unknown");
  }
}
