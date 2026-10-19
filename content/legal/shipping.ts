// content/legal/shipping.ts
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { businessDetails } from "@/lib/site-config";
import type { LegalDocument } from "./types";

const { legalName, tradeName, email, phone } = businessDetails;

export const shippingPolicy: LegalDocument = {
  title: "Shipping and delivery policy",
  updated: "October 2026",
  version: LEGAL_TEXT_VERSION,
  intro: `${tradeName}, a brand of ${legalName}, sells digital services. This policy explains how and when they are delivered. Nothing physical is shipped.`,
  sections: [
    {
      heading: "What we deliver",
      requiredBy: ["Razorpay merchant terms"],
      paragraphs: ["Everything we sell is a digital service delivered online. We ship nothing physical, so there are no shipping charges and no delivery address is needed."],
    },
    {
      heading: "Your website",
      requiredBy: ["Razorpay merchant terms"],
      paragraphs: [
        "Your website is delivered online, at your domain. It is usually live within about a week of us receiving your content.",
      ],
    },
    {
      heading: "Monthly services",
      requiredBy: ["Razorpay merchant terms"],
      paragraphs: [
        "The services in your plan run throughout each billing month. Your monthly report arrives by email each month.",
      ],
    },
    {
      heading: "If something is delayed",
      requiredBy: ["Razorpay merchant terms", "Consumer Protection (E-Commerce) Rules 2020 r.6(5)"],
      paragraphs: ["If anything will take longer than we said, we email you to explain why and when to expect it."],
    },
    {
      heading: "Contact",
      requiredBy: ["Consumer Protection (E-Commerce) Rules 2020 r.4(4)"],
      paragraphs: [`Questions about delivery can be sent to ${email} or made by phone on ${phone}.`],
    },
  ],
};
