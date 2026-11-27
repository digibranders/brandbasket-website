// content/basket-card.test.ts
import { describe, expect, it } from "vitest";
import { CURRENCIES } from "@/lib/currency";
import { BASKET_CARD, headline } from "./basket-card";

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
      all.push([headline(currency, false), headline(currency, true)]);
    }
    expect(JSON.stringify(all)).not.toMatch(/[\u2013\u2014]/);
  });
  it("never mentions tax in dollars", () => {
    const all: unknown[] = [BASKET_CARD];
    all.push([headline("USD", false), headline("USD", true)]);
    expect(JSON.stringify(all)).not.toMatch(/gst|tax|incl\./i);
  });
});

describe("headline", () => {
  it("prices monitoring as an optional extra, whatever is in the basket (rupees)", () => {
    expect(headline("INR", false)).toBe("Dedicated Expert Monitoring is an optional extra at ₹6,000 a month.");
  });
  it("says the same in dollars, at $99", () => {
    expect(headline("USD", false)).toBe("Dedicated Expert Monitoring is an optional extra at $99 a month.");
  });
  it("says monitoring is in the basket at its price once added", () => {
    expect(headline("INR", true)).toBe("Dedicated Expert Monitoring is in your basket at ₹6,000 a month.");
    expect(headline("USD", true)).toBe("Dedicated Expert Monitoring is in your basket at $99 a month.");
  });
  it("offers no discount and no ad money", () => {
    for (const currency of CURRENCIES) for (const added of [false, true]) expect(headline(currency, added)).not.toMatch(/% off|save|ad money|for your ads/i);
  });
});
