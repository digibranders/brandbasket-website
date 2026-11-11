import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Faq } from "@/components/ui/Faq";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { PLATFORM_FAQ, PLATFORM_FAQ_HEADING } from "@/content/platform-home";

/** Homepage FAQ. Faq renders the FAQPage JSON-LD. The head sticks below the fixed nav on wide screens. */
export function PlatformFaq(): ReactElement {
  return (
    <Section id="faq" labelledBy="h-faq" className="scroll-mt-24">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 min-[980px]:grid-cols-[0.8fr_1.2fr] min-[980px]:gap-16">
        <div className="min-[980px]:sticky min-[980px]:top-28 min-[980px]:self-start">
          <Reveal>
            <SectionHead id="h-faq" step title={<>{PLATFORM_FAQ_HEADING.lead} <em className="font-light not-italic text-rattan-text">{PLATFORM_FAQ_HEADING.accent}</em></>} />
          </Reveal>
        </div>
        <Reveal className="min-w-0">
          <Faq items={PLATFORM_FAQ} id="home-faq" />
        </Reveal>
      </div>
    </Section>
  );
}
