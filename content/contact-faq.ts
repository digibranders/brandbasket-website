// content/contact-faq.ts
import type { Currency } from "@/lib/currency";
import { CONTACT_FAQ_QUESTIONS } from "./contact";
import { homeFaqFor } from "./home";
import type { FaqItem } from "./types";

/** The questions under the contact form: a few of the homepage's, so the two pages never give different answers. */
export function contactFaqFor(currency: Currency): readonly FaqItem[] {
  const all = homeFaqFor(currency);
  return CONTACT_FAQ_QUESTIONS.map((question) => {
    const item = all.find((candidate) => candidate.q === question);
    if (item === undefined) throw new RangeError(`The homepage FAQ has no question "${question}"`);
    return item;
  });
}
