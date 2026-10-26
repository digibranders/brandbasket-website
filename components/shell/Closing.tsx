// components/shell/Closing.tsx
import type { ReactElement } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { CLOSING_COPY } from "@/content/closing";

/** Mock: section.closing. BasketDock hides itself once #closing is reached, so the id is load-bearing. */
export function Closing(): ReactElement {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-[clamp(18px,4vw,56px)]">
      <section id="closing" aria-labelledby="h-close" className="relative mb-6 grid justify-items-start gap-[22px] overflow-hidden rounded-[32px] bg-action p-[clamp(32px,6vw,72px)] max-[560px]:p-5 text-action-ink">
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-[60px] -right-[60px] size-[340px] rounded-full opacity-60 [background:repeating-conic-gradient(from_0deg,var(--rattan)_0_6deg,transparent_6deg_12deg)] [mask:radial-gradient(circle,transparent_46%,#000_47%,#000_70%,transparent_71%)]" />
        <h2 id="h-close" className="relative max-w-[16ch] font-display text-[clamp(32px,4.4vw,60px)] font-normal leading-none tracking-[-0.045em]">{CLOSING_COPY.title}</h2>
        <p className="relative max-w-[48ch] text-action-ink/72">{CLOSING_COPY.body}</p>
        <div className="cta-pair relative z-[1]">
          <BasketCta location="closing" tone="inverse" />
          <WhatsAppButton location="closing" tone="inverse" short={CLOSING_COPY.whatsappShort} />
        </div>
      </section>
    </div>
  );
}
