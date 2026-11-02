import type { ContactInput } from "@/lib/contact-schema";
import type { PlanId } from "@/lib/pricing";
import { clientKey } from "@/lib/security/rateLimit";
import { ADS_KEYS, type Mobile, type StartInput } from "@/lib/start-schema";

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

/** What the platform's contact intake takes (its contactEnquiryRequestSchema), without the page, which comes from the request. */
interface PlatformContact {
  readonly name: string;
  readonly business: string;
  readonly email: string;
  readonly phone: string;
  readonly city: string;
  readonly plans: readonly PlanId[];
  readonly message: string;
}

/** Posts one lead to the platform. True when it was stored. Never throws; a failure is logged without any personal field. */
async function postContact(contact: PlatformContact, noticeVersion: string, request: Request, env: PlatformLeadsEnv, label: string): Promise<boolean> {
  try {
    const response = await fetch(`${env.url}/api/leads`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${env.token}` },
      body: JSON.stringify({ kind: "contact", contact: { ...contact, page: pageOf(request) }, clientIp: clientKey(request), noticeVersion }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) console.error(`${label}: platform copy failed`, `status ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error(`${label}: platform copy failed`, error instanceof Error ? error.name : "unknown");
    return false;
  }
}

/**
 * Copies an enquiry the team has already been emailed into the platform, so it shows in the staff console. Never throws:
 * the message is safe in the inbox whatever happens here, so a failure is logged without any personal field.
 */
export async function forwardEnquiry(lead: ContactInput, request: Request, env: PlatformLeadsEnv): Promise<void> {
  // The form no longer takes a basket; the platform's intake still wants the list.
  await postContact({ name: lead.name, business: lead.business, email: lead.email, phone: lead.phone ?? "", city: lead.city ?? "", plans: [], message: lead.message }, lead.noticeVersion, request, env, "contact");
}

/** The ad page's business name until the sign-up asks for it: the platform's intake wants one. */
export const START_BUSINESS = "Not given yet";

/** The line the team reads first: that the visitor went on to payment, and which ad brought them. */
export function startMessage(ads: StartInput["ads"]): string {
  const asked = "Ad landing page. Going to payment.";
  const source = ADS_KEYS.flatMap((key) => (ads?.[key] ? [`${key}=${ads[key]}`] : [])).join(", ");
  return source === "" ? asked : `${asked} ${source}`;
}

/**
 * Sends an ad landing page lead to the staff console: someone on the way to payment, whom the team can follow up if they never
 * finish. Never throws, and the visitor is never held up by it.
 */
export async function forwardStart(lead: StartInput, mobile: Mobile, request: Request, env: PlatformLeadsEnv): Promise<boolean> {
  const contact: PlatformContact = {
    name: lead.name,
    business: START_BUSINESS,
    email: lead.email,
    phone: mobile.e164,
    city: "",
    plans: ["website"],
    message: startMessage(lead.ads),
  };
  return postContact(contact, lead.noticeVersion, request, env, "start");
}
