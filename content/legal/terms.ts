// content/legal/terms.ts
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { formatMoney } from "@/lib/currency";
import { extrasFor, GST_RATE, MONITORING, monitoringPrice, planPrice, PLANS } from "@/lib/pricing";
import { businessDetails } from "@/lib/site-config";
import { PLAN_CHANGE, CANCELLATION_RULE, HOSTED_SERVICE, PAYMENT_FAILURE, RENEWAL_REMINDER } from "./cancellation";
import { PLAN_BILLING_TERMS } from "./fees";
import type { LegalDocument } from "./types";

const { legalName, tradeName, cin, gstNumber, email, courts } = businessDetails;
const { website, social, ads } = PLANS;
/** The terms are an Indian contract: they always quote rupees with GST inside, on dollar pages too. */
const rupees = (id: keyof typeof PLANS): string => formatMoney(planPrice(id, "INR"), "INR");
const { hour, adBudgetCap } = extrasFor("INR");
const gstPercent = Math.round(GST_RATE * 100);

export const termsOfService: LegalDocument = {
  title: "Terms and conditions",
  updated: "October 2026",
  version: LEGAL_TEXT_VERSION,
  intro: `${tradeName} is a brand of ${legalName} (CIN ${cin}, GSTIN ${gstNumber}), "we", "us" or "our". These terms govern your use of this website and the services we provide to you.`,
  sections: [
    {
      heading: "1. Overview",
      paragraphs: ["These terms apply to your use of this website and to any services we provide to you."],
    },
    {
      heading: "2. Services",
      paragraphs: [
        `We build your website free of charge. You can take ${website.name} at ${rupees("website")} a month, ${social.name} at ${rupees("social")} a month and ${ads.name} at ${rupees("ads")} a month; each plan can be bought on its own. ${MONITORING.name} is included with all three plans, or ${formatMoney(monitoringPrice("INR"), "INR")} a month with one or two.`,
        `The ${website.name} plan includes 2 edits a month of up to 15 minutes each. We quote any other work before we start it, at ${formatMoney(hour, "INR")} an hour, and do it only once you agree.`,
        `${ads.name} manages Facebook and Instagram ad budgets of up to ${formatMoney(adBudgetCap, "INR")} a month of your own money. Ad spend, domain fees and paid tools are not part of any plan; you pay them directly to the provider.`,
        "What each plan includes is shown on our Pricing page when you sign up. If we agree a written proposal with you, it governs that engagement where it differs from these terms.",
      ],
    },
    {
      heading: "3. Acceptance and changes",
      paragraphs: [
        "By starting a plan, you accept these terms as they apply to it. The version in effect when your plan begins governs it until we tell you of a change; a change applies from your next billing month.",
      ],
    },
    {
      heading: "4. Your part",
      paragraphs: [
        "You agree to give us, on time, the content, photos, logo, feedback and account access we need to build and run your services, and to tell us when something changes.",
        "Delays caused by missing content or access are not our responsibility.",
      ],
    },
    {
      heading: "5. Fees and payment",
      paragraphs: [
        `Plans are billed monthly, in advance, at the prices above, which include ${gstPercent}% GST. Your first payment covers your first month, and the plan then renews each month until you cancel. ${RENEWAL_REMINDER}`,
        PLAN_BILLING_TERMS,
        PAYMENT_FAILURE,
        "When we refund a payment, and when we don't, is set out in our Refund and cancellation policy.",
      ],
    },
    {
      heading: "6. Ownership",
      paragraphs: [
        "Your domain name is yours. It is registered in your name, and you can point it wherever you like at any time.",
        "Your business name, logo and any text, photos or other material you give us stay yours. You give us permission to use them on your website and in your services while your plan is active.",
        `${HOSTED_SERVICE} When your plan ends, the hosted service ends with it; your domain and the material you gave us stay yours.`,
      ],
    },
    {
      heading: "7. Confidentiality",
      paragraphs: ["Each party keeps confidential the information the other discloses to it. This duty lasts for three years after your plan ends."],
    },
    {
      heading: "8. What we promise and our liability",
      paragraphs: [
        "We provide our services with reasonable care and skill.",
        "Search engines, AI assistants and ad platforms decide for themselves what they show. We don't guarantee search rankings, mentions or citations in AI answers, leads, calls or traffic.",
        "Our total liability for anything arising from our services is limited to the fees you paid us in the 12 months before the claim.",
      ],
    },
    {
      heading: "9. Cancellation and termination",
      paragraphs: [
        `You can cancel anytime by writing to ${email}. ${CANCELLATION_RULE} Your domain stays yours. ${HOSTED_SERVICE}`,
        `You can add or drop a plan at any time. ${PLAN_CHANGE}`,
        "Either party may end an engagement by written notice for a material breach that is not put right within 30 days of the notice. On termination, payment is due for the services provided up to that date.",
      ],
    },
    {
      heading: "10. Your customers' personal data",
      paragraphs: [
        "Some of what your website collects is about other people, such as the enquiries your customers send. For that data you decide what is collected and why, and we process it only on your instructions, to run your services. We keep it confidential, protect it with reasonable security and don't use it for anything of our own.",
        "You are responsible for telling those people how their data is used and for having a lawful reason to collect it. We tell you without delay if their data is involved in a breach, help you answer their requests, and delete their data within 30 days after your plan ends, unless the law requires us to keep it longer.",
      ],
    },
    {
      heading: "11. Governing law",
      paragraphs: [`These terms are governed by the laws of India. The courts at ${courts} have exclusive jurisdiction.`],
    },
    {
      heading: "12. Contact",
      paragraphs: [`Questions about these terms can be sent to ${email}, or to our registered office below.`],
    },
  ],
};
