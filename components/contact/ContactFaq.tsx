// components/contact/ContactFaq.tsx
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Faq } from "@/components/ui/Faq";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { contactFaqFor } from "@/content/contact-faq";
import { HOME_FAQ_HEADING } from "@/content/home";
import type { Currency } from "@/lib/currency";

/** A few questions under the form, laid out like the homepage's FAQ. Faq renders the FAQPage JSON-LD. */
export function ContactFaq({ currency }: { readonly currency: Currency }): ReactElement {
  return (
    <Section labelledBy="h-contact-faq" tight>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
        <div className="min-[980px]:sticky min-[980px]:top-28 min-[980px]:self-start">
          <Reveal><SectionHead id="h-contact-faq" title={HOME_FAQ_HEADING} step /></Reveal>
        </div>
        <Reveal className="min-w-0"><Faq items={contactFaqFor(currency)} id="contact-faq" /></Reveal>
      </div>
    </Section>
  );
}
