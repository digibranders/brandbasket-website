import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { INDUSTRIES_LINE } from "@/content/home";
import { HOME_ICONS } from "./icons";

/** The industries we serve, as one centred line (mock: .inds-sec). Plain items until the industry pages exist. */
export function IndustriesLine(): ReactElement {
  return (
    <section
      id="industries"
      aria-labelledby="h-ind"
      className="in-wrap grid scroll-mt-24 justify-items-center gap-[22px] pb-[88px] pt-[72px] text-center"
    >
      <Reveal>
        <h2 id="h-ind" className="font-display text-[15px] font-medium text-ink-2">{INDUSTRIES_LINE.title}</h2>
      </Reveal>
      <Reveal className="max-w-[980px]">
        <ul className="flex flex-wrap justify-center gap-x-[34px] gap-y-3">
          {INDUSTRIES_LINE.industries.map((industry) => {
            const IndustryIcon = HOME_ICONS[industry.icon];
            return (
              <li key={industry.slug} className="inline-flex items-center gap-2.5 font-display text-[clamp(20px,2.2vw,28px)] tracking-[-0.03em] text-ink">
                <IndustryIcon aria-hidden="true" weight="light" className="size-[26px] text-rattan-text" />
                {industry.label}
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
