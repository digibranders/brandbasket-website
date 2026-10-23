import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { INDUSTRIES_LINE } from "@/content/home";
import { HOME_ICONS } from "./icons";

/**
 * The trades we build for, as icon tiles (owner picked option B over the drifting rows, then removed the industry pages
 * and the tile links, 2026-10-22). Eight across on wide screens, four by two below 1000 px.
 */
export function IndustriesLine(): ReactElement {
  return (
    <section id="industries" aria-labelledby="h-ind" className="in-wrap grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-6 pb-[clamp(40px,4.5vw,56px)] pt-[clamp(36px,4vw,48px)]">
      <Reveal className="text-center">
        <h2 id="h-ind" className="font-display text-[15px] font-medium text-ink-2">{INDUSTRIES_LINE.title}</h2>
      </Reveal>
      <Reveal>
        <ul className="grid grid-cols-8 gap-3 max-[999px]:grid-cols-4 max-[999px]:gap-y-6 max-[639px]:gap-x-1">
          {INDUSTRIES_LINE.industries.map((industry) => {
            const IndustryIcon = HOME_ICONS[industry.icon];
            return (
              <li key={industry.slug} className="grid">
                <div className="grid justify-items-center gap-2.5 py-2 text-center">
                  <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-rattan-wash text-rattan-text">
                    <IndustryIcon className="size-[26px]" />
                  </span>
                  <span className="font-display text-[15px] font-medium leading-tight max-[639px]:text-[13.5px] tracking-[-0.01em] text-ink">{industry.label}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
