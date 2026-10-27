import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Faq } from "@/components/ui/Faq";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { PRICING_FAQ_HEADING, pricingFaq } from "@/content/pricing";
import type { Currency } from "@/lib/currency";

/**
 * Pricing FAQ (mock: #h-pfaq, .faq-wrap, .faq.plain). Faq renders the FAQPage JSON-LD. The head sticks below the
 * fixed nav (top 112px), as on the homepage FAQ.
 */
export function PricingFaq({ currency }: { readonly currency: Currency }): ReactElement {
  return (
    <Section labelledBy="h-pfaq" tight>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
        <div className="min-[980px]:sticky min-[980px]:top-28 min-[980px]:self-start">
          <Reveal>
            <SectionHead id="h-pfaq" title={PRICING_FAQ_HEADING} />
          </Reveal>
        </div>
        <Reveal className="min-w-0">
          <Faq items={pricingFaq(currency)} id="pricing-faq" />
        </Reveal>
      </div>
    </Section>
  );
}
