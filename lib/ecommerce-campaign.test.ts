import { describe, expect, it } from "vitest";
import { campaignSource, campaignWhatsAppMessage } from "@/content/ecommerce-campaign";
import { ecommerceCampaignPrice } from "./pricing";

describe("Ecommerce Store offer", () => {
  it("applies both INR savings only when selected and keeps maintenance separate", () => {
    expect(ecommerceCampaignPrice("INR", false)).toMatchObject({ list: 65000, campaignDiscount: 20000, testimonialDiscount: 0, build: 45000, maintenance: 3999 });
    expect(ecommerceCampaignPrice("INR", true)).toMatchObject({ campaignDiscount: 20000, testimonialDiscount: 10000, build: 35000, maintenance: 3999 });
  });

  it("uses regular USD pricing without applying the INR campaign", () => {
    expect(ecommerceCampaignPrice("USD", true)).toEqual({ list: 4500, campaignDiscount: 0, testimonialDiscount: 0, build: 4500, maintenance: 99 });
  });
});

describe("Ecommerce Store campaign source", () => {
  it("describes Instagram and building QR arrivals in the customer's words", () => {
    expect(campaignWhatsAppMessage(campaignSource(" Instagram ", "building-standee"))).toContain("I saw your ad on Instagram");
    expect(campaignWhatsAppMessage(campaignSource(undefined, "building-standee"))).toContain("I scanned the QR code on your standee in our building");
  });

  it("carries the testimonial selection to WhatsApp alongside the source", () => {
    expect(campaignWhatsAppMessage("instagram", true)).toContain("I opted in to the video testimonial offer");
    expect(campaignWhatsAppMessage("instagram")).not.toContain("I opted in");
  });

  it("uses only configured sources and safely handles ambiguous parameters", () => {
    expect(campaignSource(["instagram", "building-standee"], "instagram")).toBe("instagram");
    expect(campaignWhatsAppMessage(campaignSource("untrusted text"))).toBe("Hi BrandBasket! I'm interested in your managed Ecommerce Store. Can you tell me more?");
  });
});
