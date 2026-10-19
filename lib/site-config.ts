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

export interface Person {
  readonly name: string;
  readonly email: string;
}

/** A service provider that processes personal data on our behalf; the privacy policy lists each one. */
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
  readonly foundingYear: number;
  /** DPDP Act s.8(10) and IT Rules 2021 r.3(2): named in the privacy policy, terms and refund policy. */
  readonly grievanceOfficer: Person;
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
  email: "hello@brandbasket.in",
  foundingYear: 2021,
  // Open input D9: the name is Digibranders' Grievance Officer on its other brand; confirm the person and the mailbox before launch.
  grievanceOfficer: { name: "Siddique Ahmed", email: "grievance@brandbasket.in" },
  courts: "Thane, Maharashtra",
  processors: [
    { name: "Vercel", purpose: "hosts this website and counts visits without cookies", location: "the United States, served from edge locations including India" },
    { name: "Brevo", purpose: "sends our team the messages you send through this website", location: "the European Union" },
    { name: "Razorpay", purpose: "takes payments from clients", location: "India" },
    { name: "Cloudflare", purpose: "runs our domain name system", location: "locations around the world" },
  ],
};

export interface SiteConfig {
  readonly name: string;
  readonly url: string;
  readonly description: string;
}

export const siteConfig: SiteConfig = {
  name: businessDetails.tradeName,
  url: "https://brandbasket.in",
  description: `Website, Google profile, ads and local search for local businesses in India, run for you every month. From ${formatInr(PLANS.website.monthly)} a month.`,
};

/** Only the Vercel production deployment may be indexed. robots.ts and the meta robots tag both use this. */
export function isProductionSite(): boolean {
  return process.env.VERCEL_ENV === "production";
}
