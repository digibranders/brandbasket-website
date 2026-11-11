import type { Icon } from "@phosphor-icons/react";
import { ClockCountdown, Lightning, SlidersHorizontal, TrendUp } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/ui/Band";
import { WHY } from "@/content/platform-home";

/** One icon per point, in the order of WHY.points. */
const ICONS: readonly Icon[] = [Lightning, ClockCountdown, SlidersHorizontal, TrendUp];

/**
 * "Less Effort. More Control.": the homepage's one dark band, a pause between the plans and the proof. A centred
 * headline over the four points in a row, split by hairlines. The basket dock steps aside over it, as over every dark band.
 */
export function WhySection(): ReactElement {
  return (
    <Band tone="ink">
      <section id="why" data-dock-hide aria-labelledby="h-why" className="in-wrap py-[clamp(48px,9vw,128px)]">
        <Reveal>
          <h2 id="h-why" className="mx-auto max-w-[16ch] text-center font-display text-[clamp(44px,6vw,88px)] font-semibold leading-[0.98] tracking-[-0.05em]">
            {WHY.heading} <em className="font-light not-italic text-rattan">{WHY.headingAccent}</em>
          </h2>
        </Reveal>
        <ul className="mt-[clamp(48px,6vw,88px)] grid grid-cols-[minmax(0,1fr)] gap-y-10 min-[640px]:grid-cols-2 min-[1000px]:grid-cols-4 min-[1000px]:divide-x min-[1000px]:divide-action-ink/12">
          {WHY.points.map((point, i) => {
            const PointIcon = ICONS[i] ?? Lightning;
            return (
              <li key={point.lead} className="min-[1000px]:px-8 min-[1000px]:first:pl-0 min-[1000px]:last:pr-0">
                <Reveal delay={i * 90} className="grid gap-4">
                  <PointIcon aria-hidden="true" weight="duotone" className="size-9 text-rattan" />
                  <h3 className="font-display text-[clamp(24px,2.2vw,30px)] font-medium leading-[1.1] tracking-[-0.03em]">{point.lead}</h3>
                  <p className="max-w-[28ch] text-[16.5px] leading-[1.55] text-action-ink/70">{point.rest}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </section>
    </Band>
  );
}
