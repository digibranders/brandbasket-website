import type { Icon } from "@phosphor-icons/react";
import { ChartBar, Headset, Lifebuoy, Target, TrendUp } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { monitoringCopy } from "@/content/pricing";
import type { Currency } from "@/lib/currency";

/** One icon per pillar, in the order of monitoringCopy().pillars. */
const PILLAR_ICONS: readonly Icon[] = [ChartBar, Target, Lifebuoy, TrendUp];

/**
 * Dedicated Expert Monitoring under the plans (homepage and pricing page): what it costs, that all three plans include
 * it, and its four parts. A dark panel, so it reads as the one extra beside the three plans.
 */
export function MonitoringBand({ currency, headingId }: { readonly currency: Currency; readonly headingId: string }): ReactElement {
  const copy = monitoringCopy(currency);
  return (
    <section aria-labelledby={headingId} className="grid items-center gap-7 rounded-[28px] bg-ink px-[clamp(22px,3vw,40px)] py-[clamp(24px,3vw,36px)] text-action-ink min-[1000px]:grid-cols-[auto_1fr_auto] min-[1000px]:gap-10">
      <span aria-hidden="true" className="grid size-16 place-items-center rounded-[20px] bg-rattan text-ink"><Headset weight="duotone" className="size-9" /></span>
      <div className="grid gap-2">
        <h3 id={headingId} className="font-display text-[clamp(24px,2.4vw,32px)] font-semibold leading-[1.1] tracking-[-0.03em]">{copy.title}</h3>
        <p className="num font-display text-[19px] font-medium tracking-[-0.01em]">
          {copy.price} <span className="font-sans text-[15px] text-action-ink/70">{copy.priceNote}</span>
          <span className="ml-3 inline-block rounded-full bg-rattan/20 px-3 py-1 align-middle font-sans text-[13px] font-semibold text-rattan">{copy.included}</span>
        </p>
        <p className="max-w-[52ch] text-[15.5px] leading-[1.55] text-action-ink/72">{copy.body}</p>
      </div>
      <ul className="grid grid-cols-2 gap-2 min-[560px]:grid-cols-4" aria-label={`${copy.title} covers`}>
        {copy.pillars.map((pillar, i) => {
          const PillarIcon = PILLAR_ICONS[i] ?? ChartBar;
          return (
            <li key={pillar} className="grid justify-items-center gap-2 rounded-[18px] bg-action-ink/[0.06] px-4 py-4 text-[14.5px] font-semibold min-[1000px]:w-[104px]">
              <PillarIcon aria-hidden="true" weight="duotone" className="size-7 text-rattan" />
              {pillar}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
