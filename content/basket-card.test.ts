// content/basket-card.test.ts
import { describe, expect, it } from "vitest";
import { CURRENCIES } from "@/lib/currency";
import type { BasketPick } from "@/lib/pricing";
import { BASKET_CARD, benefits, headline, nextStamp, oneTimeNote, type Rich } from "./basket-card";

const pick = (website: boolean, social: boolean, ads: boolean): BasketPick => ({ website, social, ads });
const ALL_PICKS: readonly BasketPick[] = [pick(true, false, false), pick(false, false, true), pick(true, true, false), pick(true, false, true), pick(true, true, true)];
const text = (rich: Rich | null): string | null => (rich ? `${rich.before}${rich.strong}${rich.after}` : null);

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
      for (const p of ALL_PICKS) all.push([headline(p, currency), benefits(p, currency), oneTimeNote(p, currency), nextStamp(p, currency)]);
    }
    expect(JSON.stringify(all)).not.toMatch(/[\u2013\u2014]/);
  });
  it("never mentions tax in dollars", () => {
    const all: unknown[] = [BASKET_CARD];
    for (const p of ALL_PICKS) all.push([headline(p, "USD"), benefits(p, "USD"), oneTimeNote(p, "USD"), nextStamp(p, "USD")]);
    expect(JSON.stringify(all)).not.toMatch(/gst|tax|incl\./i);
  });
});

describe("headline", () => {
  it("asks a single plan to add one more, with the saving that brings (rupees)", () => {
    // Website + Social saves 1,299 a month and Website + Ads saves 2,799 (docs/plans/25): the plan worth adding most is named.
    expect(headline(pick(true, false, false), "INR")).toBe("Add one more plan to get 10% off, save ₹1,299/month.");
    expect(headline(pick(false, false, true), "INR")).toBe("Add one more plan to get 10% off, save ₹2,799/month.");
  });
  it("names the package offer and its ad money (rupees)", () => {
    expect(headline(pick(true, true, false), "INR")).toBe("10% off and ₹1,500 a month for your ads.");
    expect(headline(pick(true, false, true), "INR")).toBe("10% off on both plans.");
    expect(headline(pick(true, true, true), "INR")).toBe("Full basket. 20% off and ₹3,000 a month for your ads.");
  });
  it("asks a single plan to add one more, with the saving that brings (dollars)", () => {
    expect(headline(pick(true, false, false), "USD")).toBe("Add one more plan to get 10% off, save $21/month.");
    expect(headline(pick(false, false, true), "USD")).toBe("Add one more plan to get 10% off, save $41/month.");
  });
  it("names the package offer and its ad money (dollars)", () => {
    expect(headline(pick(true, true, false), "USD")).toBe("10% off and $30 a month for your ads.");
    expect(headline(pick(true, false, true), "USD")).toBe("10% off on both plans.");
    expect(headline(pick(true, true, true), "USD")).toBe("Full basket. 20% off and $60 a month for your ads.");
  });
});

describe("benefits", () => {
  it("lists the saving, the ad money and the first year for a package", () => {
    expect(benefits(pick(true, true, true), "INR").map(text)).toEqual([
      "You save ₹7,599 every month",
      "We add ₹3,000 a month to your ads",
      "₹1,27,188 back in your first year",
    ]);
    expect(benefits(pick(true, true, true), "USD").map(text)).toEqual([
      "You save $113 every month",
      "We add $60 a month to your ads",
      "$2,076 back in your first year",
    ]);
    for (const currency of CURRENCIES) expect(benefits(pick(true, false, true), currency).map((b) => b.kind)).toEqual(["saving", "year"]);
  });
  it("lists nothing for a single plan, so the card does not repeat that the website is built free", () => {
    for (const currency of CURRENCIES) {
      expect(benefits(pick(true, false, false), currency)).toEqual([]);
      expect(benefits(pick(false, true, false), currency)).toEqual([]);
    }
  });
});

describe("oneTimeNote", () => {
  it("says the ad money is only for plans started together at this checkout", () => {
    expect(text(oneTimeNote(pick(true, true, false), "INR"))).toBe(
      "The ₹1,500 a month for your ads comes only when you start these plans together, here at this checkout.",
    );
    expect(text(oneTimeNote(pick(true, true, false), "USD"))).toBe(
      "The $30 a month for your ads comes only when you start these plans together, here at this checkout.",
    );
  });
  it("tells a single plan what starting together earns", () => {
    expect(text(oneTimeNote(pick(true, false, false), "INR"))).toBe(
      "Start two or three plans together at this checkout and we add up to ₹3,000 a month to your ads.",
    );
    expect(text(oneTimeNote(pick(true, false, false), "USD"))).toBe(
      "Start two or three plans together at this checkout and we add up to $60 a month to your ads.",
    );
  });
  it("says nothing for a package without ad money", () => {
    for (const currency of CURRENCIES) expect(oneTimeNote(pick(true, false, true), currency)).toBeNull();
  });
});

describe("nextStamp", () => {
  it("names the next plan and the full basket it leads to, in the owner's words", () => {
    // All three save 7,599 a month at 20% (docs/plans/25); in dollars 113.
    expect(nextStamp(pick(true, false, false), "INR")).toEqual({
      id: "social",
      name: "Social Media Management",
      body: "Add two more plans to get 20% off, save ₹7,599/month.",
    });
    expect(nextStamp(pick(true, false, false), "USD")).toEqual({
      id: "social",
      name: "Social Media Management",
      body: "Add two more plans to get 20% off, save $113/month.",
    });
    expect(nextStamp(pick(true, true, false), "INR")?.body).toBe("Add one more plan to get 20% off, save ₹7,599/month.");
    expect(nextStamp(pick(true, false, true), "INR")?.body).toBe("Add one more plan to get 20% off, save ₹7,599/month.");
    expect(nextStamp(pick(false, false, true), "INR")?.body).toBe("Add two more plans to get 20% off, save ₹7,599/month.");
    expect(nextStamp(pick(false, false, true), "USD")?.body).toBe("Add two more plans to get 20% off, save $113/month.");
  });
  it("is null on a full card", () => {
    for (const currency of CURRENCIES) expect(nextStamp(pick(true, true, true), currency)).toBeNull();
  });
});
