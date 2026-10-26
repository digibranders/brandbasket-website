// content/contact.ts
// Copy for /contact, word for word from the mock view "Contact" (docs/design/mock.html, #view-contact).

export const CONTACT_PAGE = {
  title: "Contact us.",
  lede: "Ask about a free website, a plan, or the site you already have. We reply within one working day.",
  whatsappNote: "the fastest way to reach us",
  officeLabel: "Registered office",
} as const;

export const CONTACT_LABELS = {
  name: "Your name",
  phone: "Phone",
  business: "Business name",
  city: "City",
  email: "Email",
  message: "Message",
  optional: "optional",
} as const;

/** An example in each text field, in the owner's market: a made-up clinic in Thane. Labels still name the fields; these only show the shape. */
export const CONTACT_PLACEHOLDERS = {
  name: "Asha Rao",
  phone: "98765 43210",
  business: "Rao Dental Care",
  city: "Thane",
  email: "asha@raodental.in",
  message: "Tell us a little about your business and what you need",
} as const;

export const CONTACT_ERRORS = {
  name: "Please enter your name",
  phone: "Please check the phone number",
  business: "Please enter your business name",
  message: "Tell us a little about what you need.",
  consent: "Please agree to the privacy policy to send your message.",
  email: "Please check the email address",
  form: "Please check the form",
  invalid: "Invalid request",
  tooLarge: "Request too large",
  tooMany: "Too many requests. Try again shortly.",
  send: "We could not send this. Please WhatsApp us instead.",
} as const;

export const CONTACT_FORM_COPY = {
  title: "Send us a message",
  guidance: "Fields marked optional can be left blank.",
  /** The checkbox reads: consent + privacyLink + ".", with notice under it. */
  consent: "I agree to the",
  privacyLink: "privacy policy",
  notice: "We use these details only to reply to you.",
  submit: "Send message",
  submitting: "Sending",
  doneTitle: "Thanks, your message is in.",
  doneBody: "We will reply within one working day. For anything urgent, WhatsApp us.",
} as const;
