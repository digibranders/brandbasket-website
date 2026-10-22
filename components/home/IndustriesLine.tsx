import Link from "next/link";
import type { CSSProperties, ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { INDUSTRIES_LINE } from "@/content/home";
import { HOME_ICONS } from "./icons";

const GUTTER = "clamp(18px,4vw,56px)";

/**
 * The industries we have pages for, as icon tiles that open /industries/[slug] (owner picked option B over the drifting
 * rows, 2026-10-22). Eight across on wide screens, four across on tablets, one swipe row on phones.
 */
export function IndustriesLine(): ReactElement {
  return (
    <section id="industries" aria-labelledby="h-ind" className="in-wrap grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-6 pb-[clamp(40px,4.5vw,56px)] pt-[clamp(36px,4vw,48px)]">
      <Reveal className="text-center">
        <h2 id="h-ind" className="font-display text-[15px] font-medium text-ink-2">{INDUSTRIES_LINE.title}</h2>
      </Reveal>
      <Reveal>
        <ul
          style={{ "--g": GUTTER } as CSSProperties}
          className="grid grid-cols-8 gap-3 max-[999px]:grid-cols-4 max-[999px]:gap-y-6 max-[639px]:-mx-[var(--g)] max-[639px]:flex max-[639px]:snap-x max-[639px]:snap-mandatory max-[639px]:gap-1 max-[639px]:overflow-x-auto max-[639px]:px-[var(--g)] max-[639px]:pb-1 max-[639px]:[scrollbar-width:none]"
        >
          {INDUSTRIES_LINE.industries.map((industry) => {
            const IndustryIcon = HOME_ICONS[industry.icon];
            return (
              <li key={industry.slug} className="grid max-[639px]:w-[80px] max-[639px]:flex-none max-[639px]:snap-start">
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group grid justify-items-center gap-2.5 rounded-2xl py-2 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rattan"
                >
                  <span aria-hidden="true" className="grid size-14 place-items-center rounded-full border border-transparent bg-rattan-wash text-rattan-text transition-[transform,background-color,border-color] duration-300 ease-[var(--ease)] group-hover:-translate-y-0.5 group-hover:border-rattan/50 group-hover:bg-surface">
                    <IndustryIcon className="size-[26px]" />
                  </span>
                  <span className="font-display text-[15px] font-medium leading-tight tracking-[-0.01em] text-ink">{industry.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
