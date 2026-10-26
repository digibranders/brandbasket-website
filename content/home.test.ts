// content/home.test.ts
import * as Phosphor from "@phosphor-icons/react";
import { describe, expect, it } from "vitest";
import { formatInr, GST_LABEL, PLANS } from "@/lib/pricing";
import { CLOSING_COPY } from "./closing";
import { CANCEL_ANSWER, PAYMENT_FAILURE } from "./legal/cancellation";
import { FACTS, HERO, HOME_FAQ, OFFER, PROMISES, REPORT, RESPONSIBILITY, SHARE_IMAGE, STEPS, WHAT_YOU_GET, WORK } from "./home";

describe("home content", () => {
  it("keeps the locked hero copy", () => {
    expect(`${HERO.headline} ${HERO.headlineAccent}`).toBe("Before They Visit You, They Visit Your Website.");
    // The owner removed the subhead line, 2026-10-21.
    expect(HERO).not.toHaveProperty("subhead");
  });
  it("puts the owner's letterboard copy on the default share image", () => {
    expect(SHARE_IMAGE.board).toEqual({ kicker: "Today's special", headline: "Free website", note: "+ hosting and care, monthly" });
    expect(`${SHARE_IMAGE.line} ${SHARE_IMAGE.lineAccent}`).toBe("Live in about a week. Just ask.");
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
    expect(WHAT_YOU_GET.build.items).toHaveLength(5);
    expect(WHAT_YOU_GET.run.items).toHaveLength(6);
    expect(RESPONSIBILITY.worries).toHaveLength(9);
    expect(PROMISES.cards).toHaveLength(2);
    expect(HOME_FAQ).toHaveLength(11);
  });
  it("keeps the Example report chip", () => {
    expect(REPORT.chip).toBe("Example report");
  });
  it("shows the phone basket's jobs as a subset of the full list", () => {
    for (const w of RESPONSIBILITY.phoneWorries) expect(RESPONSIBILITY.worries).toContain(w);
  });
  it("points every work case at a desktop and phone image", () => {
    for (const c of WORK.cases) {
      expect(c.desktop.src).toBe(`/work/full-${c.id}-desk.jpg`);
      expect(c.phone.src).toBe(`/work/full-${c.id}-mob.jpg`);
    }
  });
  it("tells the same page limit in the FAQ and the included list", () => {
    expect(HOME_FAQ.find((f) => f.q === "How many pages do I get?")?.a).toContain("Up to 10 pages.");
    expect(WHAT_YOU_GET.build.items[0].text).toContain("Up to 10 pages");
  });
  it("uses the owner's wording of 2026-10-26", () => {
    expect(RESPONSIBILITY.body).toBe("You’re not just paying for a website; you’re protecting your online reputation with ongoing security, maintenance, and performance.");
    expect(PROMISES.body).toBe("When your website goes down or faces a security breach, our dedicated human support team is here to help.");
    expect(STEPS[0]).toEqual({ when: "Day 1", what: "A 15-minute call" });
    expect(CLOSING_COPY.body).toBe("A 15-minute call, a clear plan and a price. No obligation.");
    expect(CLOSING_COPY.whatsappShort).toBe("WhatsApp");
    expect(WHAT_YOU_GET.run.items.map((i) => i.text)).toContain("2 edits a month, 15 minutes each");
  });
  it("no longer claims a dashboard to edit your own site or calls the edits small", () => {
    const text = JSON.stringify({ WHAT_YOU_GET, HOME_FAQ }).toLowerCase();
    expect(text).not.toContain("dashboard");
    expect(text).not.toContain("small edits");
  });
  it("builds the FAQ prices from lib/pricing", () => {
    expect(HOME_FAQ[0]?.a).toContain(`${formatInr(PLANS.website.monthly)} a month, GST included`);
    expect(HOME_FAQ[2]?.a).toBe(`Just your first month. The price already includes ${GST_LABEL} GST. After that you pay monthly.`);
  });
  it("answers cancel and failed payment with the shared policy and says only the domain stays the customer's", () => {
    const answer = (q: string): string | undefined => HOME_FAQ.find((f) => f.q === q)?.a;
    expect(answer("Can I cancel?")).toBe(CANCEL_ANSWER);
    expect(answer("What happens if a payment fails?")).toBe(PAYMENT_FAILURE);
    expect(answer("Who owns the domain and the content?")).toContain("provided as a hosted service while you are subscribed.");
  });
  it("uses Phosphor icons that exist", () => {
    const keys = [...FACTS, ...WHAT_YOU_GET.build.items, ...WHAT_YOU_GET.run.items, ...PROMISES.cards].map((f) => f.icon);
    for (const key of keys) expect(Phosphor).toHaveProperty(key);
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify({ HERO, FACTS, RESPONSIBILITY, WHAT_YOU_GET, PROMISES, WORK, REPORT, STEPS, HOME_FAQ })).not.toMatch(/[\u2013\u2014]/);
  });
});
