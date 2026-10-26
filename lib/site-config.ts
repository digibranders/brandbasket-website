// lib/site-config.ts
import { formatInr, PLANS } from "@/lib/pricing";

/**
 * Registered business facts. Static on purpose: they identify the legal entity on every page, invoice and JSON-LD
 * block, and must never differ between environments.
 */
export interface PostalAddress {
  readonly street: string;
  readonly locality: string;
  readonly region: string;
  readonly postalCode: string;
  readonly country: string;
}

export interface GrievanceOfficer {
  readonly name: string;
  /** Printed with the name wherever the officer is named (Consumer Protection (E-Commerce) Rules 2020 r.4(5)). */
  readonly designation: string;
  readonly email: string;
}

/** A service provider that processes personal data on our behalf. The privacy policy prints "<name> <purpose>, <location>." */
export interface Processor {
  readonly name: string;
  readonly purpose: string;
  readonly location: string;
}

export interface BusinessDetails {
  readonly legalName: string;
  readonly tradeName: string;
  readonly cin: string;
  readonly gstNumber: string;
  readonly address: readonly string[];
  readonly postalAddress: PostalAddress;
  readonly phone: string;
  readonly phoneHref: string;
  readonly whatsappHref: string;
  readonly email: string;
  /** Office hours, shown in the footer and on /contact. */
  readonly hours: string;
  readonly foundingYear: number;
  /** DPDP Act s.8(10) and E-Commerce Rules r.4(5): named in the privacy policy, refund policy and data notice. */
  readonly grievanceOfficer: GrievanceOfficer;
  /** Courts with exclusive jurisdiction in the terms. */
  readonly courts: string;
  readonly processors: readonly Processor[];
}

export const businessDetails: BusinessDetails = {
  legalName: "Digibranders Private Limited",
  tradeName: "Brandbasket",
  cin: "U72900MH2021PTC372344",
  gstNumber: "27AAICD9268J1Z0",
  address: [
    "Office No. 2617, 26th Floor, Solus Building,",
    "Hiranandani Estate, Ghodbunder Road,",
    "Thane West, Maharashtra 400607, India",
  ],
  postalAddress: {
    street: "Office No. 2617, 26th Floor, Solus Building, Hiranandani Estate, Ghodbunder Road",
    locality: "Thane West",
    region: "Maharashtra",
    postalCode: "400607",
    country: "IN",
  },
  // Confirm before launch (plan of action, defaults table).
  phone: "+91 789 789 6607",
  phoneHref: "+917897896607",
  whatsappHref: "https://wa.me/917897896607",
  email: "support@brandbasket.in",
  // D11: the phone and WhatsApp number confirmed by the owner 2026-10-22; the hours are still to confirm.
  hours: "Mon to Sat, 10 am to 7 pm IST",
  foundingYear: 2021,
  // D9, confirmed by the owner 2026-10-22: Siddique Ahmed, reached at the support mailbox (there is no separate grievance mailbox).
  grievanceOfficer: { name: "Siddique Ahmed", designation: "Grievance Officer", email: "support@brandbasket.in" },
  courts: "Thane, Maharashtra",
  processors: [
    { name: "Vercel", purpose: "hosts this website, counts visits without cookies and measures page speed", location: "from the United States and edge servers in India" },
    { name: "Brevo", purpose: "sends our team the messages you send through this website", location: "from the European Union" },
    { name: "Razorpay", purpose: "takes payments from clients", location: "in India" },
    { name: "Cloudflare", purpose: "runs our domain name system", location: "across its worldwide network" },
  ],
};

export interface SiteConfig {
  readonly name: string;
  readonly url: string;
  /** The customer app where "Start my plan" signs people up (brandbasket-platform). */
  readonly appUrl: string;
  readonly description: string;
}

export const siteConfig: SiteConfig = {
  name: businessDetails.tradeName,
  url: "https://brandbasket.in",
  appUrl: "https://app.brandbasket.in",
  description: `Website, Google profile, ads and local search for local businesses in India, run for you every month. From ${formatInr(PLANS.website.monthly)} a month.`,
};

export { isProductionSite } from "./indexing";
