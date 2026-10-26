import { describe, expect, it } from "vitest";
import type { ContactInput } from "@/lib/contact-schema";
import { buildConfirmationEmail, buildLeadEmail, escapeHtml } from "./contact-templates";

const lead: ContactInput = {
  name: "Asha Rao",
  phone: "+91 98200 12345",
  email: "asha@example.in",
  business: "<script>alert(1)</script> Dental",
  city: "Thane",
  plans: ["website", "growth"],
  message: "Call after 5 & before 8",
  consent: true,
  noticeVersion: "2026-10-19.1",
};

describe("escapeHtml", () => {
  it("escapes every character that can break out of HTML", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe("&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;");
  });
});

describe("buildLeadEmail", () => {
  const mail = buildLeadEmail(lead);

  it("escapes user values in the html body", () => {
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt; Dental");
    expect(mail.html).toContain("Call after 5 &amp; before 8");
  });

  it("puts the business and basket in the subject", () => {
    expect(mail.subject).toBe("New enquiry: <script>alert(1)</script> Dental (Managed Website + Social Media and Ads)");
  });

  it("leaves the basket out of the subject for a general enquiry", () => {
    expect(buildLeadEmail({ ...lead, plans: [] }).subject).toBe("New enquiry: <script>alert(1)</script> Dental");
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
  it("greets by first name and names the plans from the fixed list", () => {
    const mail = buildConfirmationEmail(lead);
    expect(mail.text).toContain("You asked about: Managed Website + Social Media and Ads.");
    expect(mail.subject).toBe("We have your message. Brandbasket");
    expect(mail.text).toContain("Hi Asha,");
    expect(mail.text).toContain("within one working day");
    expect(mail.html).toContain("https://brandbasket.in/email/brandbasket-logo.png");
  });

  it("leaves the plans line out for a general enquiry", () => {
    const mail = buildConfirmationEmail({ ...lead, plans: [] });
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
