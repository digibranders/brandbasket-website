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
          <li key={industry.slug} className="inline-flex items-center gap-[0.4em] whitespace-nowrap pr-[34px] font-display text-[clamp(20px,2.2vw,28px)] leading-none tracking-[-0.03em] text-ink">
            <span aria-hidden="true" className="grid size-[1.3em] place-items-center rounded-full bg-rattan-wash text-rattan-text">
              <IndustryIcon weight="light" className="size-[0.62em]" />
            </span>
            {industry.label}
          </li>
        );
      })}
    </ul>
  );
}

/** The industries we serve, as two rows drifting in opposite directions inside a hairline band (mock: .inds-sec). Plain items, not links, so the list can name trades that have no page. */
export function IndustriesLine(): ReactElement {
  return (
    <section id="industries" aria-labelledby="h-ind" className="grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-7 overflow-hidden pb-[clamp(56px,7vw,88px)] pt-[clamp(48px,6vw,72px)]">
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
