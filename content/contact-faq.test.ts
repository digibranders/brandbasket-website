import { describe, expect, it } from "vitest";
import { CURRENCIES } from "@/lib/currency";
import { CONTACT_FAQ_QUESTIONS } from "./contact";
import { contactFaqFor } from "./contact-faq";
import { homeFaqFor } from "./home";

describe("contact FAQ", () => {
  for (const currency of CURRENCIES) {
    it(`asks the chosen questions in order, with the homepage's answers (${currency})`, () => {
      const items = contactFaqFor(currency);
      expect(items.map((item) => item.q)).toEqual([...CONTACT_FAQ_QUESTIONS]);
      for (const item of items) expect(homeFaqFor(currency)).toContainEqual(item);
    });
  }
});
