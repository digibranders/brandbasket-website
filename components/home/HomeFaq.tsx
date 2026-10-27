import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Faq } from "@/components/ui/Faq";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { HOME_FAQ_HEADING, homeFaqFor } from "@/content/home";
import type { Currency } from "@/lib/currency";

/**
 * Homepage FAQ (mock: #h-faq, .faq-wrap, .faq.plain). Faq renders the FAQPage JSON-LD. The head sticks below the
 * fixed nav (top 112px) rather than the mock's 24px, which assumes a nav that scrolls away.
 */
export function HomeFaq({ currency }: { readonly currency: Currency }): ReactElement {
  return (
    <Section id="faq" labelledBy="h-faq" tight className="scroll-mt-24">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
        <div className="min-[980px]:sticky min-[980px]:top-28 min-[980px]:self-start">
          <Reveal>
            <SectionHead id="h-faq" title={HOME_FAQ_HEADING} step />
          </Reveal>
        </div>
        <Reveal className="min-w-0">
          <Faq items={homeFaqFor(currency)} id="home-faq" />
        </Reveal>
      </div>
    </Section>
  );
}
