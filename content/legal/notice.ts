// content/legal/notice.ts
import { businessDetails } from "@/lib/site-config";
import type { LegalDocument } from "./types";

const { legalName, tradeName, grievanceOfficer } = businessDetails;

/**
 * The page a data notice links to (/notice): the one place a notice about people's personal data is published, such as
 * a breach notice. It says there is none until one is added here as the first section.
 */
export const dataNotice: LegalDocument = {
  title: "Notices about your data",
  updated: "October 2026",
  intro: `If something happens to the personal data ${legalName} holds about you through ${tradeName}, such as a data breach, we email or message you a link to this page and publish the notice here. There is no notice at the moment.`,
  sections: [
    {
      heading: "What a notice tells you",
      requiredBy: ["DPDP Rules 2025 r.7(1)"],
      paragraphs: [
        "What happened, when and where, and how much of your information it affected. What it could mean for you. What we have done to limit the harm, and what you can do to protect yourself.",
      ],
    },
    {
      heading: "Who to contact",
      requiredBy: ["DPDP Rules 2025 r.7(1)(e)", "DPDP Act s.8(9)"],
      paragraphs: [
        `Write to our Grievance Officer, ${grievanceOfficer.name}, at ${grievanceOfficer.email}. We acknowledge your message within 48 hours and resolve it within 30 days.`,
      ],
      link: { href: "/privacy", label: "Read our privacy policy" },
    },
  ],
};
