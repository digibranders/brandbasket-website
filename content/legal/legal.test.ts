// content/legal/legal.test.ts
import { describe, expect, it } from "vitest";
import { LEGAL_TEXT_VERSION } from "@/lib/legal-version";
import { AD_BUDGET_CAP, EXTRA_HOURLY_RATE, formatInr, PLANS } from "@/lib/pricing";
import { businessDetails } from "@/lib/site-config";
import { CANCELLATION_NOTICE, OWNERSHIP_ON_CANCEL } from "./cancellation";
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
    expect(text).toContain(businessDetails.grievanceOfficer.name);
    expect(text).toContain(businessDetails.grievanceOfficer.email);
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
  it("use one cancellation rule in the terms and the refund policy", () => {
    for (const doc of [termsOfService, refundPolicy]) {
      const text = JSON.stringify(doc);
      expect(text).toContain(CANCELLATION_NOTICE);
      expect(text).toContain(OWNERSHIP_ON_CANCEL);
    }
  });
  it("say that nothing physical is shipped", () => {
    expect(JSON.stringify(shippingPolicy)).toMatch(/nothing physical/i);
  });
});
