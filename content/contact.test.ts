// content/contact.test.ts
import { describe, expect, it } from "vitest";
import { CONTACT_ERRORS, CONTACT_FORM_COPY, CONTACT_PLACEHOLDERS } from "./contact";

describe("contact copy", () => {
  it("has an example for every text field and none for the consent box", () => {
    expect(Object.keys(CONTACT_PLACEHOLDERS).sort()).toEqual(["business", "city", "email", "message", "name", "phone"]);
    for (const text of Object.values(CONTACT_PLACEHOLDERS)) expect(text.length).toBeGreaterThan(2);
  });
  it("asks for agreement to the privacy policy with a checkbox label and an error for when it is left empty", () => {
    expect(CONTACT_FORM_COPY.consent).toBe("I agree to the");
    expect(CONTACT_FORM_COPY.privacyLink).toBe("privacy policy");
    expect(CONTACT_FORM_COPY.notice).toBe("We use these details only to reply to you.");
    expect(CONTACT_ERRORS.consent).toBe("Please agree to the privacy policy to send your message.");
  });
  it("has no em or en dashes", () => {
    expect(JSON.stringify({ CONTACT_PLACEHOLDERS, CONTACT_FORM_COPY, CONTACT_ERRORS })).not.toMatch(/[\u2013\u2014]/);
  });
});
