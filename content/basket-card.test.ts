// content/basket-card.test.ts
import { describe, expect, it } from "vitest";
import type { BasketPick } from "@/lib/pricing";
import { BASKET_CARD, benefits, headline, nextStamp, oneTimeNote, type Rich } from "./basket-card";

const pick = (website: boolean, growth: boolean, search: boolean): BasketPick => ({ website, growth, search });
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
    for (const p of [pick(true, false, false), pick(false, false, true), pick(true, true, false), pick(true, false, true), pick(true, true, true)]) {
      all.push([headline(p), benefits(p), oneTimeNote(p), nextStamp(p)]);
    }
    expect(JSON.stringify(all)).not.toMatch(/[\u2013\u2014]/);
  });
});

describe("headline", () => {
  it("asks a single plan to add one more, with the saving that brings", () => {
    // Website + Social saves 1,299 a month and Website + SEO saves 2,799 (docs/plans/25): the plan worth adding most is named.
    expect(headline(pick(true, false, false))).toBe("Add one more plan to get 10% off, save ₹1,299/month.");
    expect(headline(pick(false, false, true))).toBe("Add one more plan to get 10% off, save ₹2,799/month.");
  });
  it("names the package offer and its ad money", () => {
    expect(headline(pick(true, true, false))).toBe("10% off and ₹1,500 a month for your ads.");
    expect(headline(pick(true, false, true))).toBe("10% off on both plans.");
    expect(headline(pick(true, true, true))).toBe("Full basket. 20% off and ₹3,000 a month for your ads.");
  });
});

describe("benefits", () => {
  it("lists the saving, the ad money and the first year for a package", () => {
    expect(benefits(pick(true, true, true)).map(text)).toEqual([
      "You save ₹7,599 every month",
      "We add ₹3,000 a month to your ads",
      "₹1,27,188 back in your first year",
    ]);
    expect(benefits(pick(true, false, true)).map((b) => b.kind)).toEqual(["saving", "year"]);
  });
  it("lists nothing for a single plan, so the card does not repeat that the website is built free", () => {
    expect(benefits(pick(true, false, false))).toEqual([]);
    expect(benefits(pick(false, true, false))).toEqual([]);
  });
});

describe("oneTimeNote", () => {
  it("says the ad money is only for plans started together at this checkout", () => {
    expect(text(oneTimeNote(pick(true, true, false)))).toBe(
      "The ₹1,500 a month for your ads comes only when you start these plans together, here at this checkout.",
    );
  });
  it("tells a single plan what starting together earns", () => {
    expect(text(oneTimeNote(pick(true, false, false)))).toBe(
      "Start two or three plans together at this checkout and we add up to ₹3,000 a month to your ads.",
    );
  });
  it("says nothing for a package without ad money", () => {
    expect(oneTimeNote(pick(true, false, true))).toBeNull();
  });
});

describe("nextStamp", () => {
  it("names the next plan and the full basket it leads to, in the owner's words", () => {
    // All three save 7,599 a month at 20% (docs/plans/25).
    expect(nextStamp(pick(true, false, false))).toEqual({
      id: "growth",
      name: "Social Media and Ads",
      body: "Add two more plans to get 20% off, save ₹7,599/month.",
    });
    expect(nextStamp(pick(true, true, false))?.body).toBe("Add one more plan to get 20% off, save ₹7,599/month.");
    expect(nextStamp(pick(true, false, true))?.body).toBe("Add one more plan to get 20% off, save ₹7,599/month.");
    expect(nextStamp(pick(false, false, true))?.body).toBe("Add two more plans to get 20% off, save ₹7,599/month.");
  });
  it("is null on a full card", () => {
    expect(nextStamp(pick(true, true, true))).toBeNull();
  });
});
