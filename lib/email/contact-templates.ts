import { CONTACT_LABELS, CONTACT_TOPIC_LABELS } from "@/content/contact";
import type { ContactInput } from "@/lib/contact-schema";
import { PLANS } from "@/lib/pricing";

export interface LeadEmail {
  readonly subject: string;
  readonly html: string;
  readonly text: string;
}

const HTML_ESCAPES: Readonly<Record<string, string>> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

const NOT_GIVEN = "not given";

/**
 * The lead notification sent to the Brandbasket inbox. There is no auto-reply to the visitor: that would let anyone
 * use the endpoint to mail strangers. The thank-you state on the page does that job.
 */
export function buildLeadEmail(input: ContactInput): LeadEmail {
  const topic = CONTACT_TOPIC_LABELS[input.topic];
  const basket = input.plans.map((id) => PLANS[id].name).join(" + ");
  // A subject is one line: collapse any whitespace the visitor typed.
  const subject = `New enquiry, ${topic}: ${input.business}${basket ? ` (${basket})` : ""}`.replace(/\s+/g, " ");

  const rows: readonly (readonly [string, string])[] = [
    ["Topic", topic],
    [CONTACT_LABELS.name, input.name],
    [CONTACT_LABELS.phone, input.phone],
    [CONTACT_LABELS.email, input.email || NOT_GIVEN],
    [CONTACT_LABELS.business, input.business],
    [CONTACT_LABELS.city, input.city || NOT_GIVEN],
    ["Basket", basket || "none, general enquiry"],
    [CONTACT_LABELS.message, input.message || NOT_GIVEN],
    ["Privacy notice version", input.noticeVersion],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .map(([label, value]) => `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`)
    .join("")}</table>`;

  return { subject, html, text };
}
