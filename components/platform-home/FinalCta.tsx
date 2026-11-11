import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { BasketCta } from "@/components/basket/BasketCta";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { FINAL_CTA } from "@/content/platform-home";

/** The homepage's own closing call on the woven panel. The layout's closing band is left off the homepage (components/shell/closing-paths.ts). */
export function FinalCta(): ReactElement {
  return (
    <section aria-labelledby="h-final" className="in-wrap pb-10 min-[640px]:pb-24">
      <Reveal>
        <div className="basket-weave grid justify-items-center gap-6 rounded-[36px] px-[clamp(20px,5vw,72px)] py-[clamp(56px,8vw,120px)] text-center">
          <h2 id="h-final" className="max-w-[14ch] font-display text-[clamp(40px,6vw,84px)] font-semibold leading-[0.98] tracking-[-0.05em]">
            {FINAL_CTA.heading} <em className="font-light not-italic text-rattan-text">{FINAL_CTA.headingAccent}</em>
          </h2>
          <p className="max-w-[40ch] text-[clamp(17px,1.4vw,19.5px)] text-ink-2">{FINAL_CTA.body}</p>
          <div className="cta-pair mt-2 justify-center">
            <BasketCta location="final" label={FINAL_CTA.primary.label} anchor="dock" />
            <OutlineButton href={FINAL_CTA.secondary.href} location="final">{FINAL_CTA.secondary.label}</OutlineButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
