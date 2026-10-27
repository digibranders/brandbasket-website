import { CONTACT_LABELS } from "@/content/contact";
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

// Email apps cannot read CSS variables or load our fonts, so these mirror --bg, --surface, --ink, --ink-2, --line, --rattan and
// --rattan-text in app/globals.css, and the type is the Arial every inbox has.
const BONE = "#f6f5f2";
const SURFACE = "#ffffff";
const INK = "#15161a";
const INK_2 = "#4e5057";
const LINE = "#e3e0d9";
const RATTAN = "#c48a47";
const RATTAN_TEXT = "#a46c2f";
const FONT = "Arial,Helvetica,sans-serif";

/**
 * Digits for a tel: or wa.me link, or undefined when the number cannot be dialled. A 10 digit number is read as Indian, our market;
 * a number typed with a + or with 11 to 15 digits is taken to carry its country code already.
 */
export function dialDigits(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (digits === "") return undefined;
  if (phone.trim().startsWith("+")) return digits.length >= 10 && digits.length <= 15 ? digits : undefined;
  const national = digits.replace(/^0+/, "");
  if (national.length === 10) return `91${national}`;
  return national.length >= 11 && national.length <= 15 ? national : undefined;
}

const linkStyle = `color:${RATTAN_TEXT};text-decoration:underline`;

/** A pill link. The dark one is the main action; the outlined ones sit beside it. */
function button(href: string, label: string, primary: boolean): string {
  const look = primary ? `background:${INK};color:#ffffff;border:1.5px solid ${INK}` : `background:${SURFACE};color:${INK};border:1.5px solid #c9c5bb`;
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:11px 20px;border-radius:999px;${look};font-family:${FONT};font-size:14.5px;font-weight:bold;line-height:1.2;text-decoration:none">${escapeHtml(label)}</a>`;
}

/** One label and value row with a hairline above it. `value` is HTML the caller has already escaped. */
function row(label: string, value: string): string {
  return `<tr><td width="116" valign="top" style="padding:11px 16px 11px 0;border-top:1px solid ${LINE};font-family:${FONT};font-size:14.5px;line-height:1.5;color:${INK_2}">${escapeHtml(label)}</td><td valign="top" style="padding:11px 0;border-top:1px solid ${LINE};font-family:${FONT};font-size:14.5px;line-height:1.5;color:${INK}">${value}</td></tr>`;
}

interface Receipt {
  readonly title: string;
  readonly kicker: string;
  readonly heading: string;
  /** A line under the heading. HTML, already escaped. */
  readonly intro: string;
  /** The table rows from row(), the buttons and anything else inside the card. HTML, already escaped. */
  readonly body: string;
  /** Small print under the card. HTML, already escaped. */
  readonly footer: string;
}

/** The Receipt layout: the logo, one white card with a small rattan label, a heading and hairline rows, then small print. */
function receipt({ title, kicker, heading, intro, body, footer }: Receipt): string {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${BONE}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BONE};padding:32px 16px">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${FONT}">
<tr><td style="padding:0 0 22px"><img src="${siteConfig.url}/email/brandbasket-logo.png" width="180" height="30" alt="Brandbasket" style="display:block;border:0"></td></tr>
<tr><td style="background:${SURFACE};border:1px solid ${LINE};border-radius:12px;padding:30px">
<p style="margin:0 0 6px;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:0.08em;text-transform:uppercase;color:${RATTAN_TEXT}">${escapeHtml(kicker)}</p>
<h1 style="margin:0 0 6px;font-family:${FONT};font-size:24px;line-height:1.25;font-weight:bold;color:${INK}">${escapeHtml(heading)}</h1>
<p style="margin:0 0 22px;font-family:${FONT};font-size:14.5px;line-height:1.6;color:${INK_2}">${intro}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>
</td></tr>
<tr><td style="padding:18px 6px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${INK_2}">${footer}</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}

/** The lead notification sent to the Brandbasket inbox, with every field the visitor gave. */
export function buildLeadEmail(input: ContactInput): LeadEmail {
  const basket = input.plans.map((id) => PLANS[id].name).join(" + ");
  // A subject is one line: collapse any whitespace the visitor typed.
  const subject = `New enquiry: ${input.business}${basket ? ` (${basket})` : ""}`.replace(/\s+/g, " ");

  const rows: readonly (readonly [string, string])[] = [
    [CONTACT_LABELS.name, input.name],
    [CONTACT_LABELS.email, input.email],
    [CONTACT_LABELS.phone, input.phone || NOT_GIVEN],
    [CONTACT_LABELS.business, input.business],
    [CONTACT_LABELS.city, input.city || NOT_GIVEN],
    ["Basket", basket || "none, general enquiry"],
    [CONTACT_LABELS.message, input.message],
    ["Privacy policy", `agreed, notice version ${input.noticeVersion}`],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");

  const firstName = input.name.trim().split(/\s+/)[0] ?? "";
  const phoneGiven = input.phone ?? "";
  const cityGiven = input.city ?? "";
  const dial = dialDigits(phoneGiven);
  const place = cityGiven ? `, ${cityGiven}` : "";
  const message = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:14px 16px;border-left:3px solid ${RATTAN};background:${BONE};font-family:${FONT};font-size:14.5px;line-height:1.6;color:${INK};white-space:pre-wrap">${escapeHtml(input.message)}</td></tr></table>`;
  const body = [
    row(CONTACT_LABELS.email, `<a href="mailto:${escapeHtml(input.email)}" style="${linkStyle}">${escapeHtml(input.email)}</a>`),
    row(CONTACT_LABELS.phone, dial ? `<a href="tel:+${dial}" style="${linkStyle}">${escapeHtml(phoneGiven)}</a>` : escapeHtml(phoneGiven || NOT_GIVEN)),
    row(CONTACT_LABELS.city, escapeHtml(cityGiven || NOT_GIVEN)),
    row("Basket", escapeHtml(basket || "none, general enquiry")),
    row(CONTACT_LABELS.message, message),
    row("Privacy policy", escapeHtml(`agreed, notice version ${input.noticeVersion}`)),
    `<tr><td colspan="2" style="padding:22px 0 0;border-top:1px solid ${LINE}">${button(`mailto:${input.email}`, PERSON_NAME.test(firstName) ? `Reply to ${firstName}` : "Reply", true)}${dial ? `${button(`tel:+${dial}`, "Call", false)}${button(`https://wa.me/${dial}`, "WhatsApp", false)}` : ""}</td></tr>`,
  ].join("");
  const html = receipt({
    title: subject,
    kicker: "New enquiry",
    heading: input.business,
    intro: `${escapeHtml(input.name)}${escapeHtml(place)}. Sent through the contact form.`,
    body,
    footer: "",
  });

  return { subject, html, text };
}

/** A first name we are happy to print back: letters, ' and - only, so the form cannot carry a link to a stranger. */
const PERSON_NAME = /^\p{L}[\p{L}'-]{0,39}$/u;

/**
 * The confirmation sent to the address on the form. Anyone can type someone else's address, so it repeats nothing the
 * visitor wrote except a plain first name: the plans come from a fixed list, and the rest is our own wording.
 */
export function buildConfirmationEmail(input: ContactInput): LeadEmail {
  const firstName = input.name.trim().split(/\s+/)[0] ?? "";
  const greeting = PERSON_NAME.test(firstName) ? `Hi ${firstName},` : "Hello,";
  const basket = input.plans.map((id) => PLANS[id].name).join(" + ");
  const { phone, whatsappHref, email, legalName, address, hours } = businessDetails;
  const subject = "We have your message. Brandbasket";

  const paragraphs = [
    "Thanks for getting in touch with Brandbasket. Your message has reached our team, and we will reply within one working day.",
    ...(basket ? [`You asked about: ${basket}.`] : []),
    `For anything urgent, WhatsApp or call us on ${phone}, ${hours}.`,
  ];
  const ignore = `You are getting this email because this address was entered on the contact form at ${siteConfig.url.replace("https://", "")}. If that was not you, you can ignore it and we will not write again.`;

  const text = [greeting, "", ...paragraphs.flatMap((line) => [line, ""]), "The Brandbasket team", email, "", ignore, "", `Brandbasket is a brand of ${legalName}. ${address.join(" ")}`].join("\n");

  const heading = PERSON_NAME.test(firstName) ? `Hi ${firstName}, we have your message.` : "We have your message.";
  const body = [
    ...(basket ? [row("You asked about", escapeHtml(basket))] : []),
    row("In a hurry?", `WhatsApp or call <a href="tel:${businessDetails.phoneHref}" style="${linkStyle}">${escapeHtml(phone)}</a>, ${escapeHtml(hours)}.`),
    `<tr><td colspan="2" style="padding:22px 0 0;border-top:1px solid ${LINE}">${button(whatsappHref, "Chat on WhatsApp", true)}</td></tr>`,
    `<tr><td colspan="2" style="padding:14px 0 0;font-family:${FONT};font-size:14.5px;line-height:1.6;color:${INK_2}">The Brandbasket team<br><a href="mailto:${email}" style="${linkStyle}">${email}</a></td></tr>`,
  ].join("");
  const html = receipt({
    title: subject,
    kicker: "Message received",
    heading,
    intro: escapeHtml(paragraphs[0] ?? ""),
    body,
    footer: `<p style="margin:0 0 8px">${escapeHtml(ignore)}</p><p style="margin:0">Brandbasket is a brand of ${escapeHtml(legalName)}. ${escapeHtml(address.join(" "))}</p>`,
  });

  return { subject, html, text };
}
