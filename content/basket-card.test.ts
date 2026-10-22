// content/basket-card.test.ts
import { describe, expect, it } from "vitest";
import { type BasketPick, PLAN_IDS } from "@/lib/pricing";
import { BASKET_CARD, benefits, headline, nextStamp, oneTimeNote, type Rich } from "./basket-card";

const pick = (website: boolean, growth: boolean, search: boolean): BasketPick => ({ website, growth, search });
const text = (rich: Rich | null): string | null => (rich ? `${rich.before}${rich.strong}${rich.after}` : null);

describe("Basket Card copy", () => {
  it("has a line for every plan", () => {
    expect(Object.keys(BASKET_CARD.slots).sort()).toEqual([...PLAN_IDS].sort());
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
  it("asks a single plan to add one more at the next package's percent", () => {
    expect(headline(pick(true, false, false))).toBe("Add one more plan for 20% off.");
    // SEO alone: Social is the best next plan, and Social + SEO is 30% off.
    expect(headline(pick(false, false, true))).toBe("Add one more plan for 30% off.");
  });
  it("names the package offer and its ad money", () => {
    expect(headline(pick(true, true, false))).toBe("20% off and ₹2,000 a month for your ads.");
    expect(headline(pick(true, false, true))).toBe("20% off on both plans.");
    expect(headline(pick(true, true, true))).toBe("Full basket. 30% off and ₹5,000 a month for your ads.");
  });
});

describe("benefits", () => {
  it("lists the saving, the ad money and the first year for a package", () => {
    expect(benefits(pick(true, true, true)).map(text)).toEqual([
      "You save ₹11,400 every month",
      "We add ₹5,000 a month to your ads",
      "₹1,96,800 back in your first year",
    ]);
    expect(benefits(pick(true, false, true)).map((b) => b.kind)).toEqual(["saving", "year"]);
  });
  it("promises the free build only when the website is in the basket", () => {
    expect(benefits(pick(true, false, false)).map(text)).toEqual(["Your website is built free"]);
    expect(benefits(pick(false, true, false))).toEqual([]);
  });
});

describe("oneTimeNote", () => {
  it("says the ad money is only for plans started together at this checkout", () => {
    expect(text(oneTimeNote(pick(true, true, false)))).toBe(
      "The ₹2,000 a month for your ads comes only when you start these plans together, here at this checkout. Add a plan later and you get the package price, but no ad money.",
    );
  });
  it("tells a single plan what starting together earns", () => {
    expect(text(oneTimeNote(pick(true, false, false)))).toBe(
      "Start two or three plans together at this checkout and we add up to ₹5,000 a month to your ads. Add a plan later and the ad money is gone.",
    );
  });
  it("says nothing for a package without ad money", () => {
    expect(oneTimeNote(pick(true, false, true))).toBeNull();
  });
});

describe("nextStamp", () => {
  it("prices the next plan and what it gains", () => {
    expect(nextStamp(pick(true, false, false))).toEqual({
      id: "growth",
      name: "Social Media and Ads",
      body: "With 20% off both plans, your total goes from ₹2,999 to ₹10,398 a month. You save ₹2,600 a month, and we add ₹2,000 a month to your ads.",
      button: "Add Social",
    });
    expect(nextStamp(pick(true, true, false))?.body).toBe(
      "With 30% off all three plans, your total goes from ₹10,398 to ₹26,597 a month. Your saving goes from ₹2,600 to ₹11,400 a month, and your ad money from ₹2,000 to ₹5,000.",
    );
    expect(nextStamp(pick(true, false, true))?.body).toBe(
      "With 30% off all three plans, your total goes from ₹22,398 to ₹26,597 a month. Your saving goes from ₹5,600 to ₹11,400 a month, and we add ₹5,000 a month to your ads.",
    );
  });
  it("says when the next plan costs less than the basket now", () => {
    expect(nextStamp(pick(false, false, true))?.body).toBe(
      "With 30% off both plans, your total drops from ₹24,999 to ₹24,498 a month. You save ₹10,500 a month, and we add ₹2,000 a month to your ads.",
    );
  });
  it("is null on a full card", () => {
    expect(nextStamp(pick(true, true, true))).toBeNull();
  });
});
