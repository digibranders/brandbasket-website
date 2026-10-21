// content/legal/refund.ts
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { GST_RATE } from "@/lib/pricing";
import { businessDetails } from "@/lib/site-config";
import { ADDON_CHANGE, CANCELLATION_RULE, HOSTED_SERVICE, PAYMENT_FAILURE, RENEWAL_REMINDER } from "./cancellation";
import type { LegalDocument } from "./types";

const { legalName, tradeName, email, grievanceOfficer } = businessDetails;
const gstPercent = Math.round(GST_RATE * 100);

export const refundPolicy: LegalDocument = {
  title: "Refund and cancellation policy",
  updated: "October 2026",
  version: LEGAL_TEXT_VERSION,
  intro: `How billing, cancellation and refunds work for everything you buy from ${tradeName}, a brand of ${legalName}. This policy forms part of our Terms and conditions. Prices are in Indian rupees, and GST at ${gstPercent}% is added to every price.`,
  sections: [
    {
      heading: "How billing works",
      requiredBy: ["Razorpay merchant terms", "Consumer Protection (E-Commerce) Rules 2020 r.7(1)"],
      paragraphs: [
        `Building your website is free. Your plan is billed monthly, in advance, one month at a time, and renews each month until you cancel. Every plan on your subscription is billed the same way, in one monthly payment. ${RENEWAL_REMINDER}`,
        "If you pay by autopay, your bank or UPI app tells you before each renewal charge, as Reserve Bank of India rules require.",
      ],
    },
    {
      heading: "How to cancel",
      requiredBy: ["Razorpay merchant terms", "Consumer Protection (E-Commerce) Rules 2020 r.7(1)"],
      paragraphs: [
        `You can cancel anytime: write to ${email}. ${CANCELLATION_RULE} Your domain stays yours. ${HOSTED_SERVICE}`,
        `You can add or drop a plan the same way. ${ADDON_CHANGE}`,
      ],
    },
    {
      heading: "When we refund",
      requiredBy: ["Razorpay merchant terms", "Consumer Protection (E-Commerce) Rules 2020 r.7(4)"],
      paragraphs: [
        "We refund the full amount if you were charged twice, charged after your cancellation took effect, or charged in error or for something you did not order.",
        "We also refund the fees for the affected month if we did not provide what your plan promised and did not put it right within 30 days of your complaint.",
      ],
    },
    {
      heading: "When we don't refund",
      requiredBy: ["Razorpay merchant terms"],
      paragraphs: [
        `We don't refund part of a billing month you have already paid for, or work already delivered. ${CANCELLATION_RULE}`,
        "Domain fees, ad spend and paid tools are paid to their providers, not to us, so their refunds follow the provider's rules.",
      ],
    },
    {
      heading: "How refunds are paid",
      requiredBy: ["Razorpay merchant terms"],
      paragraphs: [
        "Refunds go back to the payment method you used, through Razorpay. We start a refund within 5 working days of approving it, and your bank may take a further 5 to 7 working days to show it.",
      ],
    },
    {
      heading: "If a payment fails",
      requiredBy: ["Consumer Protection (E-Commerce) Rules 2020 r.7(1)"],
      paragraphs: [
        `If an autopay charge fails, your bank or Razorpay may try it again. ${PAYMENT_FAILURE}`,
      ],
    },
    {
      heading: "Questions and complaints",
      requiredBy: ["Consumer Protection (E-Commerce) Rules 2020 r.4(5)"],
      paragraphs: [
        `Write to our ${grievanceOfficer.designation}, ${grievanceOfficer.name}, at ${grievanceOfficer.email}. We acknowledge every complaint within 48 hours and resolve it within 30 days.`,
      ],
    },
  ],
};
