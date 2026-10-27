import { describe, expect, it } from "vitest";
import type { ContactInput } from "@/lib/contact-schema";
import { buildConfirmationEmail, buildLeadEmail, dialDigits, escapeHtml } from "./contact-templates";

const lead: ContactInput = {
  name: "Asha Rao",
  phone: "+91 98200 12345",
  email: "asha@example.in",
  business: "<script>alert(1)</script> Dental",
  city: "Thane",
  message: "Call after 5 & before 8",
  consent: true,
  noticeVersion: "2026-10-19.1",
};

describe("escapeHtml", () => {
  it("escapes every character that can break out of HTML", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe("&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;");
  });
});

describe("dialDigits", () => {
  it("reads a 10 digit number as Indian and keeps a number that carries its country code", () => {
    expect(dialDigits("98765 43210")).toBe("919876543210");
    expect(dialDigits("098765 43210")).toBe("919876543210");
    expect(dialDigits("+91 98200 12345")).toBe("919820012345");
    expect(dialDigits("+1 415 555 0100")).toBe("14155550100");
    expect(dialDigits("91 98200 12345")).toBe("919820012345");
  });

  it("gives nothing for a number that cannot be dialled", () => {
    expect(dialDigits("")).toBeUndefined();
    expect(dialDigits("12345")).toBeUndefined();
    expect(dialDigits("+12345")).toBeUndefined();
  });
});

describe("buildLeadEmail", () => {
  const mail = buildLeadEmail(lead);

  it("escapes user values in the html body", () => {
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt; Dental");
    expect(mail.html).toContain("Call after 5 &amp; before 8");
  });

  it("puts the business in the subject", () => {
    expect(mail.subject).toBe("New enquiry: <script>alert(1)</script> Dental");
  });

  it("has no basket row", () => {
    expect(mail.text).not.toContain("Basket");
    expect(mail.html).not.toContain("Basket");
  });

  it("ends with Reply, Call and WhatsApp links when a phone number was given", () => {
    expect(mail.html).toContain('href="mailto:asha@example.in"');
    expect(mail.html).toContain(">Reply to Asha<");
    expect(mail.html).toContain('href="tel:+919820012345"');
    expect(mail.html).toContain('href="https://wa.me/919820012345"');
  });

  it("offers only Reply when no phone number was given, and a plain Reply for an odd name", () => {
    const noPhone = buildLeadEmail({ ...lead, phone: "", name: "spam.example now" });
    expect(noPhone.html).toContain(">Reply<");
    expect(noPhone.html).not.toContain("wa.me");
    expect(noPhone.html).not.toContain("tel:");
    expect(noPhone.html).toContain("not given");
  });

  it("has no topic row", () => {
    expect(mail.text).not.toContain("Topic");
    expect(mail.html).not.toContain("Topic");
  });

  it("lists the phone, the agreement to the privacy policy and its version in the text version", () => {
    expect(mail.text).toContain("+91 98200 12345");
    expect(mail.text).toContain("Privacy policy: agreed, notice version 2026-10-19.1");
  });

  it("marks empty optional fields instead of printing nothing", () => {
    expect(buildLeadEmail({ ...lead, phone: "", city: "" }).text).toContain("Phone: not given");
  });
});

describe("buildConfirmationEmail", () => {
  it("greets by first name", () => {
    const mail = buildConfirmationEmail(lead);
    expect(mail.subject).toBe("We have your message. Brandbasket");
    expect(mail.text).toContain("Hi Asha,");
    expect(mail.text).toContain("within one working day");
    expect(mail.html).toContain("https://brandbasket.in/email/brandbasket-logo.png");
  });

  it("offers a WhatsApp button and the phone number", () => {
    const mail = buildConfirmationEmail(lead);
    expect(mail.html).toContain(">Chat on WhatsApp<");
    expect(mail.html).toContain("https://wa.me/917897896607");
    expect(mail.html).toContain("Hi Asha, we have your message.");
  });

  it("does not say what the visitor asked about", () => {
    const mail = buildConfirmationEmail(lead);
    expect(mail.text).not.toContain("You asked about");
    expect(mail.html).not.toContain("You asked about");
  });

  it("repeats nothing else the visitor typed", () => {
    const mail = buildConfirmationEmail({ ...lead, name: "spam.example now", business: "Cheap pills", message: "click here" });
    expect(mail.text).toContain("Hello,");
    for (const typed of ["spam.example", "Cheap pills", "click here"]) {
      expect(mail.text).not.toContain(typed);
      expect(mail.html).not.toContain(typed);
    }
  });
});
