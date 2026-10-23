import type { ReactElement } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { Reveal } from "@/components/motion/Reveal";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { TwoTierHead } from "@/components/ui/TwoTierHead";
import { type IncludedPanel, WHAT_YOU_GET } from "@/content/home";
import { HOME_ICONS } from "./icons";

function Panel({ panel, warm = false }: { readonly panel: IncludedPanel; readonly warm?: boolean }): ReactElement {
  const bubble = warm ? "bg-surface" : "bg-rattan-wash";
  return (
    <article className={`flex flex-col gap-6 rounded-[28px] p-[clamp(24px,3vw,36px)] ${warm ? "bg-[linear-gradient(180deg,color-mix(in_srgb,var(--rattan-wash)_55%,var(--surface)),var(--rattan-wash))] shadow-[0_0_0_1px_color-mix(in_srgb,var(--rattan)_28%,transparent),0_40px_70px_-52px_rgba(40,28,14,0.4)]" : "bg-surface shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_40px_70px_-52px_rgba(40,28,14,0.4)]"}`}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[clamp(24px,2.4vw,32px)] font-semibold leading-[1.1] tracking-[-0.035em]">{panel.title}</h3>
        <span className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold leading-none text-rattan-ink ${bubble}`}>{panel.pill}</span>
      </div>
      <ul className="grid gap-4">
        {panel.items.map((item) => {
          const Glyph = HOME_ICONS[item.icon];
          return (
            <li key={item.text} className="flex items-center gap-3.5 font-display text-[17px] font-medium leading-[1.3] tracking-[-0.015em]">
              <span aria-hidden="true" className={`grid size-[42px] flex-none place-items-center rounded-full text-rattan-text ${bubble}`}><Glyph weight="duotone" className="size-[22px]" /></span>
              {item.text}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

/** "What you get.": the free build and the monthly run side by side, then the button pair (mock: #s-included, option 1). */
export function WhatYouGet(): ReactElement {
  return (
    <section id="included" aria-labelledby="h-included" className="in-wrap pb-0 pt-[clamp(48px,6vw,80px)]">
      <Reveal>
        <TwoTierHead id="h-included" small={WHAT_YOU_GET.small} large={WHAT_YOU_GET.heading} className="mb-[clamp(24px,3vw,36px)]" />
      </Reveal>
      <Reveal>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-5 min-[900px]:grid-cols-2 min-[900px]:gap-6">
          <Panel panel={WHAT_YOU_GET.build} />
          <Panel panel={WHAT_YOU_GET.run} warm />
        </div>
        <div className="cta-pair mt-[clamp(36px,4.5vw,52px)] justify-center">
          <BasketCta location="included" />
          <OutlineButton href="/pricing#details" location="included_more">{WHAT_YOU_GET.more}</OutlineButton>
        </div>
      </Reveal>
    </section>
  );
}
