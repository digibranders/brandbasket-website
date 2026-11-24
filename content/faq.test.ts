// content/faq.test.ts
import { describe, expect, it } from "vitest";
import { CANCEL_ANSWER, PAYMENT_FAILURE } from "@/content/legal/cancellation";
import { CURRENCIES } from "@/lib/currency";
import { FAQ_CHIP_LABEL, FAQ_QUICK, answerText, faqCountFor, faqItemsFor, faqLeaveFor, faqPlanFor, faqScopeFor, faqTopicsFor } from "./faq";

/** The words a dollar page must never print (e2e/currency.spec.ts uses the same pattern). */
const NO_TAX_TALK = /\bgst\b|\btax(es)?\b|incl\./i;

const everyText = (currency: (typeof CURRENCIES)[number]): string[] => {
  const topics = faqTopicsFor(currency).flatMap((topic) => topic.groups.flatMap((group) => group.questions.flatMap((item) => [item.q, answerText(item.a)])));
  const plan = faqPlanFor(currency);
  const scope = faqScopeFor(currency);
  const leave = faqLeaveFor(currency);
  return [
    ...topics,
    plan.build.note,
    plan.monthly.figure,
    plan.monthly.note,
    ...plan.facts.flatMap((fact) => [fact.title, fact.note]),
    plan.extra.rate,
    scope.includedNote,
    ...scope.included,
    ...scope.extra,
    leave.fee.figure,
    leave.fee.note,
    ...leave.facts.map((fact) => fact.body),
  ];
};

describe("the FAQ", () => {
  it("has 119 questions in rupees and drops the two GST ones in dollars", () => {
    expect(faqCountFor("INR")).toBe(119);
    expect(faqCountFor("USD")).toBe(117);
    expect(faqTopicsFor("INR")).toHaveLength(10);
  });

  it.each(CURRENCIES)("gives every %s question a unique id, text and answer", (currency) => {
    const items = faqTopicsFor(currency).flatMap((topic) => topic.groups.flatMap((group) => group.questions));
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length);
    expect(new Set(items.map((item) => item.q)).size).toBe(items.length);
    for (const item of items) {
      expect(item.q.trim(), item.id).not.toBe("");
      expect(answerText(item.a).trim(), item.id).not.toBe("");
      if (item.chip !== undefined) expect(Object.keys(FAQ_CHIP_LABEL), item.id).toContain(item.chip);
    }
    expect(faqItemsFor(currency)).toHaveLength(items.length);
  });

  it.each(CURRENCIES)("leaves no unfilled {token} in %s copy", (currency) => {
    for (const text of everyText(currency)) expect(text).not.toMatch(/[{}]/);
  });

  it("opens a real question from every quick link", () => {
    const ids = new Set(faqTopicsFor("INR").flatMap((topic) => topic.groups.flatMap((group) => group.questions.map((item) => item.id))));
    for (const link of FAQ_QUICK) expect(ids.has(link.id), link.id).toBe(true);
  });

  it("never mentions GST or tax in dollars, and never prints a rupee sign there", () => {
    for (const text of everyText("USD")) {
      expect(text).not.toMatch(NO_TAX_TALK);
      expect(text).not.toContain("₹");
    }
  });

  it("never prints a dollar sign in rupees", () => {
    for (const text of everyText("INR")) expect(text).not.toContain("$");
  });

  it("uses the approved cancellation and payment wording, so the page never contradicts the terms", () => {
    const answers = faqTopicsFor("INR").flatMap((topic) => topic.groups.flatMap((group) => group.questions.map((item) => answerText(item.a))));
    expect(answers).toContain(CANCEL_ANSWER);
    expect(answers).toContain(PAYMENT_FAILURE);
  });

  it("prints the source-code fee in rupees and says we confirm it first in dollars", () => {
    expect(faqLeaveFor("INR").fee.figure).toBe("₹15,000");
    expect(faqLeaveFor("USD").fee.note).toContain("We confirm the amount");
  });
});
