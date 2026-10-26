// content/legal/legal.test.ts
import { describe, expect, it } from "vitest";
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { AD_BUDGET_CAP, EXTRA_HOURLY_RATE, formatInr, PLANS } from "@/lib/pricing";
import { businessDetails } from "@/lib/site-config";
import { CANCEL_ANSWER, PLAN_CHANGE, CANCELLATION_RULE, HOSTED_SERVICE, PAYMENT_FAILURE, RENEWAL_REMINDER } from "./cancellation";
import { AD_CREDIT_TERMS, PACKAGE_TERMS } from "./fees";
import { dataNotice } from "./notice";
import { privacyPolicy } from "./privacy";
import { refundPolicy } from "./refund";
import { shippingPolicy } from "./shipping";
import { termsOfService } from "./terms";

const ALL = [privacyPolicy, termsOfService, refundPolicy, shippingPolicy, dataNotice];

describe("legal documents", () => {
  it("carry the current version", () => {
    for (const doc of [privacyPolicy, termsOfService, refundPolicy, shippingPolicy]) expect(doc.version).toBe(LEGAL_TEXT_VERSION);
  });
  it("cite the law behind every privacy section", () => {
    for (const s of privacyPolicy.sections) expect(s.requiredBy?.length ?? 0).toBeGreaterThan(0);
  });
  it("name the Grievance Officer with a brandbasket.in address", () => {
    const text = JSON.stringify(privacyPolicy);
    const { name, designation, email } = businessDetails.grievanceOfficer;
    expect(text).toContain(`${designation}, ${name}, at ${email}`);
    expect(businessDetails.grievanceOfficer.email.endsWith("@brandbasket.in")).toBe(true);
  });
  it("list every processor in the privacy policy", () => {
    const text = JSON.stringify(privacyPolicy);
    for (const p of businessDetails.processors) expect(text).toContain(p.name);
  });
  it("never mention another brand or use dashes", () => {
    const text = JSON.stringify(ALL);
    expect(text).not.toMatch(/firstfold|fynix/i);
    expect(text).not.toMatch(/[\u2013\u2014]/);
  });
  it("never show a placeholder", () => {
    const visible = ALL.flatMap((d) => [d.title, d.intro, ...d.sections.flatMap((s) => [s.heading, ...s.paragraphs, s.link?.label ?? ""])]).join("\n");
    expect(visible).not.toMatch(/\bTBD\b|\[[^\]]*\]/);
  });
  it("state the entity, CIN and GSTIN in the terms", () => {
    const text = JSON.stringify(termsOfService);
    for (const fact of [businessDetails.legalName, businessDetails.cin, businessDetails.gstNumber]) expect(text).toContain(fact);
  });
  it("quote every plan, the extra work rate and the ad budget cap from the pricing module", () => {
    const text = JSON.stringify(termsOfService);
    for (const plan of Object.values(PLANS)) {
      expect(text).toContain(plan.name);
      expect(text).toContain(formatInr(plan.monthly));
    }
    expect(text).toContain(formatInr(EXTRA_HOURLY_RATE));
    expect(text).toContain(formatInr(AD_BUDGET_CAP));
    expect(text).toContain(businessDetails.courts);
  });
  it("state the package price and ad credit terms in the fees section", () => {
    const fees = JSON.stringify(termsOfService.sections.find((s) => s.heading === "5. Fees and payment"));
    expect(fees).toContain(PACKAGE_TERMS);
    expect(fees).toContain(AD_CREDIT_TERMS);
  });
  it("say each plan can be bought on its own and drop the sign-up offer", () => {
    expect(JSON.stringify(termsOfService)).toContain("each plan can be bought on its own");
    expect(JSON.stringify(ALL)).not.toMatch(/chosen at sign-up|needs the Managed Website/i);
  });
  it("keep the package price and ad credit when a payment fails", () => {
    expect(PAYMENT_FAILURE).toContain("Your package price and ad credit stay.");
  });
  it("states cancellation and failed payments for any plan, not only the website", () => {
    for (const rule of [CANCEL_ANSWER, CANCELLATION_RULE, PAYMENT_FAILURE]) expect(rule).not.toMatch(/^[^.]*\b[Yy]our website\b/);
    expect(CANCELLATION_RULE).toContain("your plans keep running");
    expect(PAYMENT_FAILURE).toContain("Your plans pause");
  });

  it("ships the 2026-10-26.1 text version", () => {
    expect(LEGAL_TEXT_VERSION).toBe("2026-10-26.1");
  });
  it("use one cancellation, payment and ownership policy in the terms and the refund policy", () => {
    const section = (heading: string): string => JSON.stringify(ALL.flatMap((d) => d.sections).find((s) => s.heading === heading));
    for (const heading of ["9. Cancellation and termination", "How to cancel", "When we don't refund"]) expect(section(heading)).toContain(CANCELLATION_RULE);
    for (const heading of ["9. Cancellation and termination", "How to cancel"]) {
      expect(section(heading)).toContain("Your domain stays yours.");
      expect(section(heading)).toContain(HOSTED_SERVICE);
      expect(section(heading)).toContain(PLAN_CHANGE);
    }
    expect(section("6. Ownership")).toContain(HOSTED_SERVICE);
    for (const heading of ["5. Fees and payment", "If a payment fails"]) expect(section(heading)).toContain(PAYMENT_FAILURE);
    for (const heading of ["5. Fees and payment", "How billing works"]) expect(section(heading)).toContain(RENEWAL_REMINDER);
  });
  it("drop the placeholder notice period and the claim that the website and content stay the customer's", () => {
    const text = JSON.stringify(ALL);
    expect(text).not.toMatch(/days' notice|website, domain and content stay yours|nothing is taken back|may pause your services/);
  });
  it("give one response time for complaints and requests", () => {
    expect(JSON.stringify(ALL)).not.toMatch(/within one month/);
  });
  it("say that nothing physical is shipped", () => {
    expect(JSON.stringify(shippingPolicy)).toMatch(/nothing physical/i);
  });
});
