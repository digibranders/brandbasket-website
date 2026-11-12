// content/platform-home.test.ts
import { describe, expect, it } from "vitest";
import { CURRENCIES } from "@/lib/currency";
import { platformFaqFor } from "./platform-home";

describe("homepage FAQ", () => {
  it.each(CURRENCIES)("has at most ten distinct questions (%s)", (currency) => {
    const faq = platformFaqFor(currency);
    expect(faq.length).toBeLessThanOrEqual(10);
    expect(new Set(faq.map((item) => item.q)).size).toBe(faq.length);
  });
  it("answers the price in the page's currency, with GST only on rupee pages", () => {
    const inr = platformFaqFor("INR").find((item) => item.q === "How much does it cost?")?.a ?? "";
    const usd = platformFaqFor("USD").find((item) => item.q === "How much does it cost?")?.a ?? "";
    expect(inr).toContain("₹2,999 a month each, GST included");
    expect(inr).toContain("₹6,000 a month");
    expect(usd).toContain("$59 a month each, billed monthly");
    expect(usd).toContain("$99 a month");
    expect(JSON.stringify(platformFaqFor("USD"))).not.toMatch(/gst|tax|incl\./i);
  });
  it("offers no discount and no ad money", () => {
    for (const currency of CURRENCIES) expect(JSON.stringify(platformFaqFor(currency))).not.toMatch(/% off|discount|ad money|ad credit/i);
  });
  it("has no em or en dashes", () => {
    for (const currency of CURRENCIES) expect(JSON.stringify(platformFaqFor(currency))).not.toMatch(/[\u2013\u2014]/);
  });
});
