import { GlobeHemisphereWest, Globe, Megaphone, MagnifyingGlass, TrendUp } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Band } from "@/components/ui/Band";
import { DecorIcon } from "@/components/ui/DecorIcon";
import { OutlineButton } from "@/components/ui/OutlineButton";
import { TwoTierHead } from "@/components/ui/TwoTierHead";
import { type IncludedPanel, WHAT_YOU_GET } from "@/content/home";
import { HOME_ICONS } from "./icons";

interface PanelProps {
  readonly panel: IncludedPanel;
  readonly warm?: boolean;
}

/** One frosted panel. The monthly one has a large, very faint icon bleeding off its corner, behind the text. */
function Panel({ panel, warm = false }: PanelProps): ReactElement {
  return (
    <article className={`glass-panel relative flex flex-col gap-6 overflow-clip rounded-[28px] p-[clamp(24px,3vw,36px)] ${warm ? "glass-panel-warm" : ""}`}>
      {warm ? (
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-11 -right-7 z-0 rotate-[8deg] text-[190px] leading-none text-rattan-text/[0.10] min-[761px]:text-[290px]">
          <GlobeHemisphereWest weight="thin" />
        </span>
      ) : null}
      <div className="relative z-10 flex items-center justify-between gap-3">
        <h3 className="font-display text-[clamp(24px,2.4vw,32px)] font-semibold leading-[1.1] tracking-[-0.035em]">{panel.title}</h3>
        <span className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-semibold leading-none text-rattan-ink ${warm ? "bg-surface" : "bg-rattan-wash"}`}>{panel.pill}</span>
      </div>
      <ul className="relative z-10 grid gap-4">
        {panel.items.map((item) => {
          const Glyph = HOME_ICONS[item.icon];
          return (
            <li key={item.text} className="flex items-center gap-3.5 font-display text-[17px] font-medium leading-[1.3] tracking-[-0.015em]">
              <span aria-hidden="true" className={`grid size-[42px] flex-none place-items-center rounded-full text-rattan-text ${warm ? "bg-surface" : "bg-rattan-wash"}`}><Glyph weight="duotone" className="size-[22px]" /></span>
              {item.text}
            </li>
          );
        })}
      </ul>
    </article>
  );
}

/**
 * "What you get.": the free build and the monthly run as frosted panels on a soft glow, with large faint icons around
 * and inside them, then one outline button (docs/design/homepage-v2.html, #s-included). The main button is left out here
 * on purpose: the page already has it in the nav, hero, plans and closing.
 */
export function WhatYouGet(): ReactElement {
  return (
    <Band tone="glow" className="py-[clamp(56px,7vw,96px)]">
      <DecorIcon icon={MagnifyingGlass} size={193} rotate={10} className="right-[5%] top-0" />
      <DecorIcon icon={TrendUp} size={143} rotate={-10} className="left-[42%] top-3.5" />
      <DecorIcon icon={Megaphone} size={160} rotate={9} className="bottom-[26px] right-[8%] max-[760px]:hidden" />
      <DecorIcon icon={Globe} size={130} rotate={-7} faint className="bottom-10 left-[9%] max-[760px]:hidden" />
      <section id="included" aria-labelledby="h-included" className="in-wrap">
        <Reveal>
          <TwoTierHead id="h-included" small={WHAT_YOU_GET.small} large={WHAT_YOU_GET.heading} tier="step" className="mb-[clamp(24px,3vw,36px)]" />
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-5 min-[900px]:grid-cols-2 min-[900px]:gap-6">
            <Panel panel={WHAT_YOU_GET.build} />
            <Panel panel={WHAT_YOU_GET.run} warm />
          </div>
          <div className="cta-pair mt-[clamp(36px,4.5vw,52px)] justify-center">
            <OutlineButton href="/pricing#included" location="included_more">{WHAT_YOU_GET.more}</OutlineButton>
          </div>
        </Reveal>
      </section>
    </Band>
  );
}
