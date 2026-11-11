// content/basket-card.test.ts
import { describe, expect, it } from "vitest";
import { CURRENCIES } from "@/lib/currency";
import type { BasketPick } from "@/lib/pricing";
import { BASKET_CARD, headline } from "./basket-card";

const pick = (website: boolean, social: boolean, ads: boolean): BasketPick => ({ website, social, ads });
const ALL_PICKS: readonly BasketPick[] = [pick(true, false, false), pick(false, false, true), pick(true, true, false), pick(true, false, true), pick(true, true, true)];

describe("Basket Card copy", () => {
  it("has no line under each plan name", () => {
    expect(BASKET_CARD).not.toHaveProperty("slots");
  });
  it("has a one-word phone label for the checkout button", () => {
    expect(BASKET_CARD.checkoutCta).toBe("Continue to checkout");
    expect(BASKET_CARD.checkoutCtaShort).toBe("Checkout");
  });
  it("has no em or en dashes", () => {
    const all: unknown[] = [BASKET_CARD];
    for (const currency of CURRENCIES) {
      for (const p of ALL_PICKS) all.push([headline(p, currency)]);
    }
    expect(JSON.stringify(all)).not.toMatch(/[\u2013\u2014]/);
  });
  it("never mentions tax in dollars", () => {
    const all: unknown[] = [BASKET_CARD];
    for (const p of ALL_PICKS) all.push([headline(p, "USD")]);
    expect(JSON.stringify(all)).not.toMatch(/gst|tax|incl\./i);
  });
});

describe("headline", () => {
  it("says the one offer: monitoring comes with all three plans, otherwise it is priced (rupees)", () => {
    expect(headline(pick(true, true, true), "INR")).toBe("Dedicated Expert Monitoring is included with all three plans.");
    expect(headline(pick(true, false, false), "INR")).toBe("Pick all three plans and Dedicated Expert Monitoring is included. Otherwise it is ₹6,000 a month.");
    expect(headline(pick(true, true, false), "INR")).toBe(headline(pick(true, false, false), "INR"));
  });
  it("says the same in dollars, at $99", () => {
    expect(headline(pick(true, true, true), "USD")).toBe("Dedicated Expert Monitoring is included with all three plans.");
    expect(headline(pick(false, false, true), "USD")).toBe("Pick all three plans and Dedicated Expert Monitoring is included. Otherwise it is $99 a month.");
  });
  it("offers no discount and no ad money", () => {
    for (const currency of CURRENCIES) for (const p of ALL_PICKS) expect(headline(p, currency)).not.toMatch(/% off|save|ad money|for your ads/i);
  });
});
