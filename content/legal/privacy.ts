// content/legal/privacy.ts
import { PURPOSE_OF, TOOLS, type VendorId } from "@/lib/consent";
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { OYECHATS_BOT_KEY } from "@/lib/oyechats";
import { businessDetails } from "@/lib/site-config";
import type { LegalDocument } from "./types";

const { legalName, tradeName, cin, grievanceOfficer, processors } = businessDetails;

/** Named in the policy only while the contact page loads the chat (lib/oyechats.ts). */
const CHAT_PROCESSOR = { name: "OyeChats", purpose: "answers the messages you type into the chat on our contact page", location: "from India" } as const;
const office = businessDetails.address.join(" ");
const writeToOfficer = `our ${grievanceOfficer.designation}, ${grievanceOfficer.name}, at ${grievanceOfficer.email}`;

// The cookie text describes exactly the tools this build can load (plan 12); with none it says no cookies are set.
const tagged = TOOLS.length > 0;
const hasAds = TOOLS.some((tool) => PURPOSE_OF[tool] === "advertising");
const COMPANY: Readonly<Record<VendorId, string>> = { ga4: "Google", clarity: "Microsoft", googleAds: "Google", metaPixel: "Meta" };
const companies = [...new Set(TOOLS.map((tool) => COMPANY[tool]))].join(", ").replace(/, ([^,]*)$/, " and $1");
const TOOL_NOTICE: Readonly<Record<VendorId, string>> = {
  ga4: "Measurement: Google Analytics counts visits and where they come from, so we know which pages help. Its cookies (_ga) last up to 2 years, and Google keeps the data for 14 months.",
  clarity: "Measurement: Microsoft Clarity records how visitors scroll and click, with anything you type hidden, so we can see where a page confuses people. Its cookies (_clck, _clsk) last up to 1 year.",
  googleAds: "Advertising: Google Ads tells us when a visitor from our ads gets in touch, and Google may use this to show you our ads elsewhere. Its cookie (_gcl_au) lasts 90 days.",
  metaPixel: "Advertising: Meta Pixel tells us when a visitor from our Facebook or Instagram ads gets in touch, and Meta may use this to show you our ads elsewhere. Its cookie (_fbp) lasts 90 days.",
};
const cookieParagraphs: string[] = tagged
  ? [
      "This website sets cookies only if you allow them. On your first visit a notice lists each tool, and nothing loads until you choose. Google Tag Manager loads the tools you allow, and starts only once you allow at least one.",
      ...TOOLS.map((tool) => TOOL_NOTICE[tool]),
      ...(hasAds ? ["If your browser sends a Global Privacy Control signal, we treat it as a no to advertising."] : []),
      "We store your choice on your device for 12 months so we don't ask again. It contains no tracking.",
      "Change or withdraw your choice any time from Cookie settings at the foot of every page. When you turn something off, we delete its cookies. Vercel Web Analytics and Speed Insights count visits and measure page speed without cookies either way.",
    ]
  : ["This website sets no cookies. Vercel Web Analytics and Speed Insights count visits and measure page speed without cookies and without storing anything on your device."];

export const privacyPolicy: LegalDocument = {
  title: "Privacy policy",
  updated: "October 2026",
  version: LEGAL_TEXT_VERSION,
  intro: `${tradeName} is a brand of ${legalName}, which is responsible for the personal data described here. This policy explains what we collect when you use this website or become a client, why we use it, who we share it with, how long we keep it and the rights you have under the Digital Personal Data Protection Act, 2023.`,
  sections: [
    {
      heading: "Who we are and how to reach us",
      requiredBy: ["DPDP Act s.8(9) and s.8(10)", "DPDP Rules 2025 r.9", "SPDI Rules r.5(9)"],
      paragraphs: [
        `${tradeName} is run by ${legalName} (CIN ${cin}), registered at ${office}.`,
        `For any question, request or complaint about your personal data, write to ${writeToOfficer}, or to our registered office. We acknowledge your message within 48 hours and resolve it within 30 days.`,
      ],
    },
    {
      heading: "Information we collect",
      requiredBy: ["DPDP Act s.5 and Rule 3(1)(a)"],
      paragraphs: [
        "When you send the form on our Contact page, we collect your name, phone number, business name, and, if you add them, your city, email address and message, with the plans you picked. We also record which version of this policy the form showed you and that you agreed to it.",
        "To stop spam, we briefly use your IP address to limit how often a form can be sent from one place. We don't store it with your message.",
        "If you message us on WhatsApp, call us or email us, we receive your name, number or address and whatever you send. WhatsApp is run by Meta, so a WhatsApp conversation is also covered by WhatsApp's own terms and privacy policy.",
        "When you become a client, we hold your account and billing details, your GSTIN if you give one, and what we need to run your services: your website content, and access to your Google Business Profile, domain and ad accounts.",
        "We count visits to this website in aggregate, without cookies and without identifying you.",
        ...(tagged ? [`If you allow it, ${companies} also collect the cookie identifiers and visit details described under Cookies.`] : []),
      ],
    },
    {
      heading: "How we use your information",
      requiredBy: ["DPDP Act s.5 and Rule 3(1)(a)", "DPDP Act s.7"],
      paragraphs: [
        "We use your details to reply to your enquiry and, if you become a client, to build and run your website and the services in your plan, and to bill you for them. We use technical records to keep this website safe and working.",
        "We use your details only for the purpose you gave them for, and keep a record where the law requires one, for example tax invoices.",
        tagged
          ? `We don't sell personal data. Only if you allow it, we use cookies to measure visits${hasAds ? " and our ads" : ""}, as described under Cookies.`
          : "We don't sell personal data, and we don't use it for advertising.",
      ],
    },
    {
      heading: "Cookies",
      requiredBy: ["DPDP Rules 2025 r.3(1)(a): what we collect must be stated accurately", "DPDP Act s.6: consent and its withdrawal"],
      paragraphs: [
        ...cookieParagraphs,
        `The ${tradeName} client dashboard, where clients sign in, needs a cookie to keep you signed in and explains it there.`,
      ],
    },
    {
      heading: "Who we share it with",
      requiredBy: ["DPDP Act s.8(2)", "DPDP Rules 2025 r.3(1)(b)"],
      paragraphs: [
        "We share personal data only with the service providers that help us run our business, each for one job. They process it on our behalf and only for that purpose.",
        ...[...processors, ...(OYECHATS_BOT_KEY === null ? [] : [CHAT_PROCESSOR])].map((p) => `${p.name} ${p.purpose}, ${p.location}.`),
        ...(tagged ? [`Only if you allow it in Cookie settings, ${companies} receive cookie data from this website, from the United States. They also use it under their own privacy policies.`] : []),
        `We may also disclose information when the law requires it, or to a successor business if ${tradeName} is merged or sold.`,
      ],
    },
    {
      heading: "How long we keep it",
      requiredBy: ["DPDP Act s.8(7)", "DPDP Rules 2025 r.8(3)"],
      paragraphs: [
        "We keep each kind of information only as long as its purpose needs, then delete it.",
        "Enquiries that don't lead to you becoming a client: 12 months after we last heard from you.",
        "Client records, including tax invoices and payment records: 8 years after the financial year they belong to, as company and GST law require.",
        "Support emails and messages: 3 years after the conversation ends.",
      ],
    },
    {
      heading: "Your rights",
      requiredBy: ["DPDP Act ss.11 to 14 and Rule 14", "DPDP Act s.6(4): withdrawing consent"],
      paragraphs: [
        "You can ask us for a summary of the personal data we hold about you and who we have shared it with, ask us to correct, complete or erase it, withdraw any consent you have given, raise a grievance, and name someone to act for you if you die or cannot act for yourself.",
        `To use any of these, write to ${writeToOfficer}. We acknowledge your request within 48 hours and reply within 30 days. Some records can't be erased while the law requires us to keep them, such as tax invoices.`,
        "Withdrawing consent doesn't affect what we did before. If you are not satisfied with our answer, you can complain to the Data Protection Board of India.",
      ],
    },
    {
      heading: "Children",
      requiredBy: ["DPDP Act s.9"],
      paragraphs: [
        `${tradeName} works with businesses and with people aged 18 or over. We don't knowingly collect personal data from children. If you believe a child has given us some, write to ${writeToOfficer} and we'll delete it.`,
      ],
    },
    {
      heading: "Where your information is processed",
      requiredBy: ["DPDP Act s.16", "DPDP Rules 2025 r.3(1)(a)"],
      paragraphs: [
        "Some of the providers listed above process information outside India, where each entry says. We send each one only what its job needs, and never to a country the Government of India has restricted.",
      ],
    },
    {
      heading: "If something goes wrong",
      requiredBy: ["DPDP Act s.8(6) and Rule 7", "CERT-In Directions 2022"],
      paragraphs: [
        "If personal data we hold is exposed, lost or changed without permission, we'll tell you and the Data Protection Board of India without delay, as the law requires, and report it to CERT-In within six hours of finding it. We'll say what happened, what it means for you and what you can do, and publish the notice on our Notices about your data page.",
      ],
      link: { href: "/notice", label: "Notices about your data" },
    },
    {
      heading: "This policy in other languages",
      requiredBy: ["DPDP Act s.5(3)"],
      paragraphs: [
        `You can ask us for this policy in any language listed in the Eighth Schedule to the Constitution of India: write to ${writeToOfficer} and we'll send it to you.`,
      ],
    },
    {
      heading: "Changes to this policy",
      requiredBy: ["DPDP Act s.5 and s.6(10): showing which notice was seen"],
      paragraphs: [
        `This is version ${LEGAL_TEXT_VERSION}. When you send a form, we record which version you saw. If we change how we use your information, we'll update this page and its date, and tell you before the change takes effect where it affects what you already gave us.`,
      ],
    },
  ],
};
