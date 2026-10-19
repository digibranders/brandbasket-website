// content/contact.ts
// Copy for /contact, word for word from the mock view "Contact" (docs/design/mock.html, #view-contact).
import type { ContactTopic } from "@/lib/contact-schema";

export const CONTACT_PAGE = {
  title: "Contact us.",
  lede: "Ask about a free website, a plan, or the site you already have. We reply within one working day.",
  whatsappNote: "the fastest way to reach us",
  hoursLabel: "Hours",
  hours: "Mon to Sat, 10 am to 7 pm IST",
  officeLabel: "Registered office",
} as const;

export const CONTACT_TOPIC_LEGEND = "What can we help with?";

export const CONTACT_TOPIC_LABELS: Readonly<Record<ContactTopic, string>> = {
  website: "A free website",
  plans: "Plans and pricing",
  help: "Help with my website",
  other: "Something else",
};

export const CONTACT_LABELS = {
  name: "Your name",
  phone: "Phone",
  business: "Business name",
  city: "City",
  email: "Email",
  message: "Message",
  optional: "optional",
} as const;

export const CONTACT_ERRORS = {
  name: "Please enter your name",
  phone: "Please enter a phone number we can call",
  business: "Please enter your business name",
  email: "Please check the email address",
  basket: "Every basket starts with the website",
  form: "Please check the form",
  invalid: "Invalid request",
  tooLarge: "Request too large",
  tooMany: "Too many requests. Try again shortly.",
  send: "We could not send this. Please WhatsApp us instead.",
} as const;

export const CONTACT_FORM_COPY = {
  notice: "We use these details only to reply to you. See our",
  privacyLink: "privacy policy",
  submit: "Send message",
  submitting: "Sending",
  doneTitle: "Thanks, your message is in.",
  doneBody: "We will reply within one working day. For anything urgent, WhatsApp us.",
} as const;
