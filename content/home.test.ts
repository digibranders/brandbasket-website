// content/home.test.ts
import * as Phosphor from "@phosphor-icons/react";
import { describe, expect, it } from "vitest";
import { formatInr, PLANS } from "@/lib/pricing";
import { CANCEL_ANSWER, PAYMENT_FAILURE } from "./legal/cancellation";
import { FACTS, HERO, HOME_FAQ, INDUSTRIES_LINE, OFFER, REPORT, SHARE_IMAGE, STEPS, WORK } from "./home";

describe("home content", () => {
  it("keeps the locked hero copy", () => {
    expect(`${HERO.headline} ${HERO.headlineAccent}`).toBe("Before They Visit You, They Visit Your Website.");
    expect(HERO.subhead).toBe("Your Business Has a Name. Give It a Place on the Internet for free.");
  });
  it("puts the subhead without \"for free\" and the offer line on the default share image", () => {
    expect(SHARE_IMAGE.headline).toBe("Your Business Has a Name. Give It a Place on the Internet.");
    expect(SHARE_IMAGE.line).toBe("₹0 to build your website + ₹2,999/month to keep it running, + GST");
  });
  it("builds the offer line from the managed website price", () => {
    expect(OFFER.build.price).toBe("₹0");
    expect(OFFER.run.price).toBe(formatInr(PLANS.website.monthly));
    expect(OFFER.ariaLabel).toContain(OFFER.run.price);
  });
  it("has the section counts of the mock", () => {
    expect(FACTS).toHaveLength(4);
    expect(WORK.cases).toHaveLength(3);
    expect(STEPS).toHaveLength(3);
    expect(REPORT.kpis).toHaveLength(4);
    expect(INDUSTRIES_LINE.industries).toHaveLength(16);
    expect(HOME_FAQ).toHaveLength(11);
  });
  it("keeps the Example report chip", () => {
    expect(REPORT.chip).toBe("Example report");
  });
  it("gives every industry a unique slug and no href yet", () => {
    const slugs = INDUSTRIES_LINE.industries.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z]+(-[a-z]+)*$/);
    expect(JSON.stringify(INDUSTRIES_LINE)).not.toContain("href");
  });
  it("points every work case at a desktop and phone image", () => {
    for (const c of WORK.cases) {
      expect(c.desktop.src).toBe(`/work/full-${c.id}-desk.jpg`);
      expect(c.phone.src).toBe(`/work/full-${c.id}-mob.jpg`);
    }
  });
  it("builds the FAQ prices from lib/pricing", () => {
    expect(HOME_FAQ[0]?.a).toContain(`${formatInr(PLANS.website.monthly)} a month + GST`);
    expect(HOME_FAQ[2]?.a).toContain(`${formatInr(PLANS.website.monthly)} + GST`);
  });
  it("answers cancel and failed payment with the shared policy and says only the domain stays the customer's", () => {
    const answer = (q: string): string | undefined => HOME_FAQ.find((f) => f.q === q)?.a;
    expect(answer("Can I cancel?")).toBe(CANCEL_ANSWER);
    expect(answer("What happens if a payment fails?")).toBe(PAYMENT_FAILURE);
    expect(answer("Who owns the domain and the content?")).toContain("provided as a hosted service while you are subscribed.");
  });
  it("uses Phosphor icons that exist", () => {
    const keys = [...FACTS.map((f) => f.icon), ...INDUSTRIES_LINE.industries.map((i) => i.icon)];
    for (const key of keys) expect(Phosphor).toHaveProperty(key);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify({ HERO, FACTS, INDUSTRIES_LINE, WORK, REPORT, STEPS, HOME_FAQ })).not.toMatch(/[\u2013\u2014]/);
  });
});
