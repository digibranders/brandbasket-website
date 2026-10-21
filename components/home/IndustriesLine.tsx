import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { INDUSTRIES_LINE } from "@/content/home";
import { HOME_ICONS } from "./icons";
import "./industries.css";

type Industry = (typeof INDUSTRIES_LINE.industries)[number];

const SPLIT = Math.ceil(INDUSTRIES_LINE.industries.length / 2);
/** Four copies per track: at the smaller text size two copies are narrower than a wide screen. The track moves by half, two copies. */
const COPIES = [0, 1, 2, 3] as const;
const ROWS: readonly (readonly Industry[])[] = [INDUSTRIES_LINE.industries.slice(0, SPLIT), INDUSTRIES_LINE.industries.slice(SPLIT)];

/** One copy of a row. The extra copies only make the loop seamless, so screen readers skip them. */
function Row({ items, copy }: { readonly items: readonly Industry[]; readonly copy: boolean }): ReactElement {
  return (
    <ul aria-hidden={copy || undefined} className="flex shrink-0">
      {items.map((industry) => {
        const IndustryIcon = HOME_ICONS[industry.icon];
        return (
          <li key={industry.slug} className="inline-flex items-center gap-2.5 whitespace-nowrap pr-[34px] font-display text-[clamp(20px,2.2vw,28px)] leading-none tracking-[-0.03em] text-ink">
            <IndustryIcon aria-hidden="true" weight="light" className="size-[26px] text-rattan-text" />
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
    <section id="industries" aria-labelledby="h-ind" className="grid scroll-mt-24 grid-cols-[minmax(0,1fr)] gap-5 overflow-hidden pb-[clamp(40px,4.5vw,56px)] pt-[clamp(36px,4vw,48px)]">
      <Reveal className="text-center">
        <h2 id="h-ind" className="font-display text-[15px] font-medium text-ink-2">{INDUSTRIES_LINE.title}</h2>
      </Reveal>
      <Reveal>
        <div className="ind-rows">
          {ROWS.map((items, i) => (
            <div key={i} className="ind-track" data-reverse={i % 2 === 1 || undefined}>
              {COPIES.map((copy) => <Row key={copy} items={items} copy={copy > 0} />)}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
