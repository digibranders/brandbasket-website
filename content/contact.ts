// content/contact.ts
// Copy for /contact, word for word from the mock view "Contact" (docs/design/mock.html, #view-contact), plus the next steps, social heading and FAQ below it (2026-10-28).

export const CONTACT_PAGE = {
  title: "Contact us.",
  lede: "Ask about a free website, a plan, or the site you already have. We reply within one working day.",
  whatsappNote: "the fastest way to reach us",
} as const;

/** Under the contact rows. The steps are the homepage's (content/home.ts STEPS), so only the heading is new. */
export const CONTACT_NEXT = { heading: "What happens next" } as const;

/** The chat card on /contact (components/contact/ContactChat.tsx). New copy: it goes to the owner before it ships. The answers come from the OyeChats bot. */
export const CONTACT_CHAT = {
  title: "Chat with us",
  subtitle: "Instant answers about plans, pricing and your website",
  greeting: "Hi! I'm the Brandbasket assistant. how can i help ?",
  /** Tap to ask. They are shown only until the visitor sends a first message. */
  starters: ["Is the website really free?", "Can I cancel?"],
  /** Hands the visitor to the team: a link to the contact form further down the page, shown with the starters. */
  support: { label: "Connect with Support Team", href: "#ct-form-title" },
  startersLabel: "Questions to start with",
  logLabel: "Conversation with the Brandbasket assistant",
  placeholder: "Ask us anything",
  send: "Send question",
  typing: "The assistant is typing",
  poweredBy: "Powered by",
  provider: "OyeChats",
  /** Shown as a tooltip on the footer links (components/contact/ContactChat.tsx), so the footer stays on one line. */
  notice: "Your messages are shared with OyeChats, our chat provider.",
  privacyLink: "Privacy policy",
  errors: {
    failed: "Sorry, I could not answer that. Please try again, or use the form to write to us.",
    timeout: "That took too long. Please try again, or use the form to write to us.",
    rate_limited: "You are sending messages quickly. Please wait a moment and try again.",
    over_capacity: "The assistant is busy right now. Please use the form to write to us.",
    maintenance: "The assistant is briefly offline. Please use the form to write to us.",
  },
} as const;

export const CONTACT_FOLLOW = { heading: "Follow us" } as const;

/** The homepage questions a visitor most often has before writing, in the order shown. The answers come from content/home.ts. */
export const CONTACT_FAQ_QUESTIONS = [
  "Is the website really free?",
  "What do I pay for every month?",
  "How long does it take to build my website?",
  "Can I cancel?",
] as const;

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
  /** Shown before the visitor's own email address. */
  doneSentTo: "We sent a confirmation to",
  /** Shown before the visitor's own phone number, when they gave one. */
  doneCallPre: "We will call you on",
  doneCallPost: "or email you within one working day.",
  /** The reply line when no phone was given: the Day 1 step of "What happens next". */
  doneEmailOnly: "We will email you within one working day to arrange your 15-minute call.",
  doneUrgent: "For anything urgent, WhatsApp us.",
  /** The first line of the WhatsApp chat opened from the done card; the business name follows. */
  doneWhatsApp: "Hi Brandbasket, I just sent you a message on your website. My business is",
} as const;
