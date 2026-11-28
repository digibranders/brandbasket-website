import type { FaqItem } from "./types";

export const ECOMMERCE_CAMPAIGN_PATH = "/ecommerce-store-offer";

const WHATSAPP_OPENERS = {
  instagram: "I saw your ad on Instagram",
  "building-standee": "I scanned the QR code on your standee in our building",
} as const;

export type CampaignSource = keyof typeof WHATSAPP_OPENERS;

const SOURCE_ALIASES: ReadonlyMap<string, CampaignSource> = new Map([
  ["instagram", "instagram"],
  ["ig", "instagram"],
  ["building-standee", "building-standee"],
  ["standee", "building-standee"],
]);

/** Only recognized sources can add a first-person statement to the message. */
export function campaignSource(source: unknown, utmSource?: unknown): CampaignSource | null {
  function lookup(value: unknown): CampaignSource | undefined {
    return typeof value === "string" ? SOURCE_ALIASES.get(value.trim().toLowerCase()) : undefined;
  }
  return lookup(source) ?? lookup(utmSource) ?? null;
}

export function campaignWhatsAppMessage(source: CampaignSource | null, optedIn = false): string {
  const intro = source === null ? "" : `${WHATSAPP_OPENERS[source]} and `;
  const choice = optedIn ? " I opted in to the video testimonial offer and can share my experience after launch." : "";
  return `Hi BrandBasket! ${intro}I'm interested in your managed Ecommerce Store.${choice} Can you tell me more?`;
}

export const CAMPAIGN_FAQ: readonly FaqItem[] = [
  { q: "What happens on the store planning call?", a: "We talk through your products, payment and delivery needs, and what it would take to launch. Bring your catalog or an existing store link if you have one." },
  { q: "When do I record the testimonial?", a: "We invite you after your store is live and you have used it. The discount is applied when you opt in. We ask permission separately before publishing a video." },
  { q: "What do I bring to the build?", a: "Bring your logo, product photos, descriptions and prices. We agree on catalog size, payment provider and shipping setup before work starts." },
  { q: "Can you move my existing store?", a: "We can scope a migration after reviewing your catalog, existing platform and data. Larger migrations, integrations and third-party fees are quoted separately." },
  { q: "Who handles orders and returns?", a: "Your team manages stock, dispatch and returns. BrandBasket sets up the agreed store options and maintains the website." },
];

export const CAMPAIGN_STEPS = [
  { when: "Plan the store", what: "Agree the catalog, payment methods and delivery setup with our team." },
  { when: "Test the preview", what: "Review the working store and place a test order before launch." },
  { when: "Go live", what: "Connect your domain, learn how to run the store and start taking orders." },
] as const;
