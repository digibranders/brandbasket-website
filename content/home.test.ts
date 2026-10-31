// content/home.test.ts
import * as Phosphor from "@phosphor-icons/react";
import { describe, expect, it } from "vitest";
import { type Currency, formatMoney } from "@/lib/currency";
import { GST_LABEL, planPrice } from "@/lib/pricing";
import { CLOSING_COPY } from "./closing";
import { CANCEL_ANSWER, PAYMENT_FAILURE } from "./legal/cancellation";
import { factsFor, HERO, homeFaqFor, offerFor, PROMISES, REPORT, reportFor, RESPONSIBILITY, SHARE_IMAGE, STEPS, WHAT_YOU_GET, WORK } from "./home";

const CURRENCIES: readonly Currency[] = ["INR", "USD"];
const TAX_WORDS = /gst|tax|incl\./i;
const HOME_FAQ = homeFaqFor("INR");
const FACTS = factsFor("INR");

describe("home content", () => {
  it("keeps the locked hero copy", () => {
    expect(`${HERO.headline} ${HERO.headlineAccent}`).toBe("Before They Visit You, They Visit Your Website.");
    // The owner removed the subhead line, 2026-10-21.
    expect(HERO).not.toHaveProperty("subhead");
  });
  it("puts the owner's split-flap copy on the default share image", () => {
    expect(`${SHARE_IMAGE.lead} ${SHARE_IMAGE.word}`).toBe("Get your business website for FREE");
    expect(SHARE_IMAGE.word).toHaveLength(4);
    expect(`${SHARE_IMAGE.line} ${SHARE_IMAGE.lineAccent}`).toBe("Built for you. Live in 7 working days.");
  });
  it("builds the offer line from the managed website price in each currency", () => {
    for (const currency of CURRENCIES) {
      const offer = offerFor(currency);
      expect(offer.build.price).toBe(formatMoney(0, currency));
      expect(offer.run.price).toBe(formatMoney(planPrice("website", currency), currency));
      expect(offer.ariaLabel).toContain(offer.run.price);
    }
  });
  it("keeps the rupee offer line word for word", () => {
    expect(offerFor("INR")).toEqual({
      ariaLabel: "₹0 to build your website, usually ₹35,000, plus ₹2,999 a month, GST included, to keep it running, usually ₹4,999",
      build: { was: "₹35,000", price: "₹0", label: "to build your website" },
      run: { was: "₹4,999", price: "₹2,999", unit: "/month", label: "to keep it running, incl. GST" },
    });
  });
  it("prints the dollar offer line without any tax wording", () => {
    expect(offerFor("USD")).toEqual({
      ariaLabel: "$0 to build your website, usually $1,200, plus $65 a month to keep it running, usually $99",
      build: { was: "$1,200", price: "$0", label: "to build your website" },
      run: { was: "$99", price: "$65", unit: "/month", label: "to keep it running" },
    });
  });
  it("has the section counts of the mock", () => {
    expect(FACTS).toHaveLength(4);
    expect(WORK.cases).toHaveLength(3);
    expect(STEPS).toHaveLength(3);
    for (const currency of CURRENCIES) expect(reportFor(currency).kpis).toHaveLength(4);
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
      // The files are named after the client: "Curry Cook" is /work/curry-cook-website-desktop.jpg.
      const slug = c.name.toLowerCase().replace(/\s+/g, "-");
      expect(c.desktop.src).toBe(`/work/${slug}-website-desktop.jpg`);
      expect(c.phone.src).toBe(`/work/${slug}-website-phone.jpg`);
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
    expect(HOME_FAQ[0]?.a).toContain(`${formatMoney(planPrice("website", "INR"), "INR")} a month, GST included, which keeps`);
    expect(HOME_FAQ[2]?.a).toBe(`Just your first month. The price already includes ${GST_LABEL} GST. After that you pay monthly.`);
    expect(homeFaqFor("USD")[0]?.a).toContain("$65 a month, which keeps it hosted");
    expect(homeFaqFor("USD")[2]?.a).toBe("Just your first month. After that you pay monthly.");
  });
  it("shows the facts and the sample report in dollars for USD", () => {
    expect(factsFor("INR")[0]).toEqual({ icon: "CurrencyInr", text: "₹0 to build" });
    expect(factsFor("USD")[0]).toEqual({ icon: "CurrencyDollar", text: "$0 to build" });
    expect(reportFor("INR").kpis[2]?.delta).toBe("₹214 a lead");
    expect(reportFor("USD").kpis[2]?.delta).toBe("$5 a lead");
  });
  it("never mentions tax in the dollar copy", () => {
    expect(JSON.stringify({ offer: offerFor("USD"), facts: factsFor("USD"), report: reportFor("USD"), faq: homeFaqFor("USD") })).not.toMatch(TAX_WORDS);
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
    const text = CURRENCIES.map((c) => JSON.stringify({ HERO, offer: offerFor(c), facts: factsFor(c), RESPONSIBILITY, WHAT_YOU_GET, PROMISES, WORK, report: reportFor(c), STEPS, faq: homeFaqFor(c) }));
    for (const t of text) expect(t).not.toMatch(/[\u2013\u2014]/);
  });
});
