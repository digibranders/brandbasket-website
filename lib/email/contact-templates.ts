import { CONTACT_LABELS, CONTACT_TOPIC_LABELS } from "@/content/contact";
import type { ContactInput } from "@/lib/contact-schema";
import { PLANS } from "@/lib/pricing";
import { businessDetails, siteConfig } from "@/lib/site-config";

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

/** The lead notification sent to the Brandbasket inbox, with every field the visitor gave. */
export function buildLeadEmail(input: ContactInput): LeadEmail {
  const topic = CONTACT_TOPIC_LABELS[input.topic];
  const basket = input.plans.map((id) => PLANS[id].name).join(" + ");
  // A subject is one line: collapse any whitespace the visitor typed.
  const subject = `New enquiry, ${topic}: ${input.business}${basket ? ` (${basket})` : ""}`.replace(/\s+/g, " ");

  const rows: readonly (readonly [string, string])[] = [
    ["Topic", topic],
    [CONTACT_LABELS.name, input.name],
    [CONTACT_LABELS.email, input.email],
    [CONTACT_LABELS.phone, input.phone || NOT_GIVEN],
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

/** A first name we are happy to print back: letters, ' and - only, so the form cannot carry a link to a stranger. */
const PERSON_NAME = /^\p{L}[\p{L}'-]{0,39}$/u;

/**
 * The confirmation sent to the address on the form. Anyone can type someone else's address, so it repeats nothing the
 * visitor wrote except a plain first name: the topic and plans come from fixed lists, and the rest is our own wording.
 */
export function buildConfirmationEmail(input: ContactInput): LeadEmail {
  const firstName = input.name.trim().split(/\s+/)[0] ?? "";
  const greeting = PERSON_NAME.test(firstName) ? `Hi ${firstName},` : "Hello,";
  const topic = CONTACT_TOPIC_LABELS[input.topic];
  const basket = input.plans.map((id) => PLANS[id].name).join(" + ");
  const { phone, whatsappHref, email, legalName, address, hours } = businessDetails;
  const subject = "We have your message. Brandbasket";

  const paragraphs = [
    "Thanks for getting in touch with Brandbasket. Your message has reached our team, and we will reply within one working day.",
    `You asked about: ${topic}${basket ? ` (${basket})` : ""}.`,
    `For anything urgent, WhatsApp or call us on ${phone}, ${hours}.`,
  ];
  const ignore = `You are getting this email because this address was entered on the contact form at ${siteConfig.url.replace("https://", "")}. If that was not you, you can ignore it and we will not write again.`;

  const text = [greeting, "", ...paragraphs.flatMap((line) => [line, ""]), "The Brandbasket team", email, "", ignore, "", `Brandbasket is a brand of ${legalName}. ${address.join(" ")}`].join("\n");

  const p = (content: string, extra = ""): string => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#15161a;${extra}">${content}</p>`;
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:#f6f5f2">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f2;padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:Arial,Helvetica,sans-serif">
<tr><td style="padding:0 0 24px"><img src="${siteConfig.url}/email/brandbasket-logo.png" width="180" height="32" alt="Brandbasket" style="display:block;border:0"></td></tr>
<tr><td style="background:#ffffff;border:1px solid #e3e0d9;border-radius:12px;padding:32px">
${p(escapeHtml(greeting))}
${p(escapeHtml(paragraphs[0] ?? ""))}
${p(`You asked about: <strong>${escapeHtml(topic)}</strong>${basket ? ` (${escapeHtml(basket)})` : ""}.`)}
${p(`For anything urgent, <a href="${whatsappHref}" style="color:#a46c2f">WhatsApp</a> or call us on <a href="tel:${businessDetails.phoneHref}" style="color:#a46c2f">${escapeHtml(phone)}</a>, ${escapeHtml(hours)}.`)}
${p(`The Brandbasket team<br><a href="mailto:${email}" style="color:#a46c2f">${email}</a>`, "margin-bottom:0")}
</td></tr>
<tr><td style="padding:24px 8px 0;font-size:12px;line-height:1.6;color:#4e5057">
<p style="margin:0 0 8px">${escapeHtml(ignore)}</p>
<p style="margin:0">Brandbasket is a brand of ${escapeHtml(legalName)}. ${escapeHtml(address.join(" "))}</p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

  return { subject, html, text };
}
