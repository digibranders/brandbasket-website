// lib/start-alert.ts
import type { ContactInput } from "@/lib/contact-schema";
import { buildLeadEmail } from "@/lib/email/contact-templates";
import { BrevoSendError, sendTransactionalEmail } from "@/lib/email/brevo";
import { serverEnv } from "@/lib/env";
import { START_BUSINESS, startMessage } from "@/lib/platform-leads";
import type { Mobile, StartInput } from "@/lib/start-schema";
import { postEnquiryToTeams } from "@/lib/teams-alert";

/** An ad page lead in the shape the contact alerts take, so the team gets the same email and Teams card as for a contact form enquiry. */
export function startEnquiry(lead: StartInput, mobile: Mobile): ContactInput {
  return {
    name: lead.name,
    business: START_BUSINESS,
    email: lead.email,
    phone: mobile.e164,
    city: "",
    message: `Not in the staff console, add it by hand. ${startMessage(lead.ads)}`,
    consent: true,
    noticeVersion: lead.noticeVersion,
  };
}

/**
 * Tells the team about an ad page lead the platform did not keep, by the same inbox email and Teams card the contact form uses.
 * Never throws: it runs after the visitor has been answered, and a failure is logged without any personal field.
 */
export async function alertDroppedStart(lead: StartInput, mobile: Mobile): Promise<void> {
  const enquiry = startEnquiry(lead, mobile);
  try {
    const env = serverEnv();
    const mail = buildLeadEmail(enquiry);
    await sendTransactionalEmail({
      to: [{ email: env.CONTACT_INBOX, name: "Brandbasket" }],
      sender: { email: env.MAIL_SENDER, name: "Brandbasket website" },
      replyTo: { email: enquiry.email, name: enquiry.name },
      subject: mail.subject,
      htmlContent: mail.html,
      textContent: mail.text,
    });
  } catch (error) {
    console.error("start: lead alert mail failed", error instanceof BrevoSendError ? `Brevo status ${error.status}` : error instanceof Error ? error.name : "unknown");
  }
  await postEnquiryToTeams(enquiry);
}
