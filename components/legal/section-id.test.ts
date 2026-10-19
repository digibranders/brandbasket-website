// components/legal/section-id.test.ts
import { describe, expect, it } from "vitest";
import { dataNotice } from "@/content/legal/notice";
import { privacyPolicy } from "@/content/legal/privacy";
import { refundPolicy } from "@/content/legal/refund";
import { shippingPolicy } from "@/content/legal/shipping";
import { termsOfService } from "@/content/legal/terms";
import { RESERVED_IDS, sectionId } from "./section-id";

describe("sectionId", () => {
  it("drops the number and apostrophes", () => {
    expect(sectionId({ heading: "10. Your customers' personal data", paragraphs: [] })).toBe("your-customers-personal-data");
    expect(sectionId({ heading: "When we don’t refund", paragraphs: [] })).toBe("when-we-dont-refund");
  });

  it("prefers an explicit id", () => {
    expect(sectionId({ id: "fees", heading: "5. Fees and payment", paragraphs: [] })).toBe("fees");
  });

  it("gives every section a unique anchor that no other element on the page uses", () => {
    for (const doc of [privacyPolicy, termsOfService, refundPolicy, shippingPolicy, dataNotice]) {
      const ids = doc.sections.map(sectionId);
      expect(new Set(ids).size, doc.title).toBe(ids.length);
      for (const id of ids) {
        expect(id, doc.title).not.toBe("");
        expect(RESERVED_IDS, doc.title).not.toContain(id);
      }
    }
  });
});
