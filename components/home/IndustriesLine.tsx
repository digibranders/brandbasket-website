import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { INDUSTRIES_LINE } from "@/content/home";
import { HOME_ICONS } from "./icons";
import "./industries.css";

type Industry = (typeof INDUSTRIES_LINE.industries)[number];

const SPLIT = Math.ceil(INDUSTRIES_LINE.industries.length / 2);
const ROWS: readonly (readonly Industry[])[] = [INDUSTRIES_LINE.industries.slice(0, SPLIT), INDUSTRIES_LINE.industries.slice(SPLIT)];

/** One copy of a row. The second copy only makes the loop seamless, so screen readers skip it. */
function Row({ items, copy }: { readonly items: readonly Industry[]; readonly copy: boolean }): ReactElement {
  return (
    <ul aria-hidden={copy || undefined} className="flex shrink-0">
      {items.map((industry) => {
        const IndustryIcon = HOME_ICONS[industry.icon];
        return (
          <li key={industry.slug} className="inline-flex items-center gap-3 whitespace-nowrap pr-12 font-display text-[clamp(26px,3.4vw,44px)] tracking-[-0.03em] text-ink">
            <IndustryIcon aria-hidden="true" weight="light" className="size-[0.8em] text-rattan-text" />
            {industry.label}
          </li>
        );
      })}
    </ul>
  );
}

/** The industries we serve, as two rows drifting in opposite directions (mock: .inds-sec). Plain items, not links, so the list can name trades that have no page. */
export function IndustriesLine(): ReactElement {
  return (
    <section id="industries" aria-labelledby="h-ind" className="grid scroll-mt-24 gap-[26px] overflow-hidden pb-[88px] pt-[72px]">
      <Reveal className="text-center">
        <h2 id="h-ind" className="font-display text-[15px] font-medium text-ink-2">{INDUSTRIES_LINE.title}</h2>
      </Reveal>
      <Reveal>
        <div className="ind-rows">
          {ROWS.map((items, i) => (
            <div key={i} className="ind-track" data-reverse={i % 2 === 1 || undefined}>
              <Row items={items} copy={false} />
              <Row items={items} copy />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
