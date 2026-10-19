import { describe, expect, it } from "vitest";
import type { ContactInput } from "@/lib/contact-schema";
import { buildConfirmationEmail, buildLeadEmail, escapeHtml } from "./contact-templates";

const lead: ContactInput = {
  topic: "website",
  name: "Asha Rao",
  phone: "+91 98200 12345",
  email: "asha@example.in",
  business: "<script>alert(1)</script> Dental",
  city: "Thane",
  plans: ["website", "growth"],
  message: "Call after 5 & before 8",
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

  it("puts the topic, business and basket in the subject", () => {
    expect(mail.subject).toBe("New enquiry, A free website: <script>alert(1)</script> Dental (Managed Website + Digital Growth)");
  });

  it("leaves the basket out of the subject for a general enquiry", () => {
    expect(buildLeadEmail({ ...lead, topic: "other", plans: [] }).subject).toBe("New enquiry, Something else: <script>alert(1)</script> Dental");
  });

  it("lists the phone and the notice version in the text version", () => {
    expect(mail.text).toContain("+91 98200 12345");
    expect(mail.text).toContain("2026-10-19.1");
  });

  it("marks empty optional fields instead of printing nothing", () => {
    expect(buildLeadEmail({ ...lead, phone: "", city: "", message: undefined }).text).toContain("Phone: not given");
  });
});

describe("buildConfirmationEmail", () => {
  it("greets by first name and names the topic and plans from fixed lists", () => {
    const mail = buildConfirmationEmail(lead);
    expect(mail.subject).toBe("We have your message. Brandbasket");
    expect(mail.text).toContain("Hi Asha,");
    expect(mail.text).toContain("within one working day");
    expect(mail.html).toContain("https://brandbasket.in/email/brandbasket-logo.png");
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
