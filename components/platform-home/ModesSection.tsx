import { CalendarCheck, Check, SealCheck } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { CSSProperties, ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { BasketCta } from "@/components/basket/BasketCta";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Band } from "@/components/ui/Band";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { MODES } from "@/content/platform-home";
import { SERVICE_META } from "./service-meta";

/** Sample rows in the Do It Yourself picture: what the AI has drafted and where each one stands. */
const QUEUE = [
  { id: "social", title: "Weekend offer post", meta: "Instagram, drafted by AI", state: "Review" },
  { id: "website", title: "New opening hours", meta: "Website, updated", state: "Live" },
  { id: "social", title: "Sunday lunch post", meta: "Facebook, scheduled", state: "Ready" },
  { id: "ads", title: "Weekly ads report", meta: "Ads, ready to read", state: "Open" },
] as const;

/** "Do It Yourself. Or Done For You.": two panels side by side, light for the tools and dark for the team. Both buttons sit at the panel foot. */
export function ModesSection(): ReactElement {
  const { diy, dfy } = MODES;
  return (
    <Band tone="sunken">
      <Section id="ways" labelledBy="h-ways">
        <Reveal>
          <SectionHead id="h-ways" step title={<>{MODES.heading} <em className="font-light not-italic text-rattan-text">{MODES.headingAccent}</em></>} />
        </Reveal>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 min-[900px]:grid-cols-2">
          <Reveal className="grid">
            <article className="grid grid-rows-[auto_auto_1fr_auto] gap-6 rounded-[28px] border border-line bg-surface p-[clamp(22px,3vw,40px)]">
              <h3 className="font-display text-[clamp(30px,3vw,42px)] font-medium leading-none tracking-[-0.04em]">{diy.title}</h3>
              <p className="max-w-[46ch] text-[17px] leading-[1.6] text-ink-2">{diy.body}</p>
              <figure aria-label="Example: AI drafts waiting for review" className="m-0 self-start">
                <ul aria-hidden="true" className="grid gap-1 rounded-[18px] border border-line bg-bg p-1.5">
                  {QUEUE.map((row) => {
                    const { icon: Icon, tone } = SERVICE_META[row.id];
                    const done = row.state === "Live";
                    return (
                      <li key={row.title} style={{ "--tone": tone } as CSSProperties} className="grid grid-cols-[38px_1fr_auto] items-center gap-3 rounded-xl bg-surface py-3 pl-2.5 pr-3">
                        <span className="grid size-[38px] place-items-center rounded-[11px] bg-[color-mix(in_srgb,var(--tone)_11%,var(--surface))] text-[var(--tone)]"><Icon weight="duotone" className="size-[19px]" /></span>
                        <span className="grid min-w-0"><b className="truncate text-[14.5px] font-semibold">{row.title}</b><small className="truncate text-[12.5px] text-ink-2">{row.meta}</small></span>
                        <span className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold ${done ? "bg-[color-mix(in_srgb,var(--sage)_13%,var(--surface))] text-sage" : "border border-ink/20"}`}>
                          {done ? <Check weight="bold" className="size-3.5" /> : row.state === "Ready" ? <CalendarCheck className="size-3.5" /> : null}
                          {row.state}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </figure>
              <div><BasketCta location="ways-diy" label={diy.cta.label} anchor="dock" /></div>
            </article>
          </Reveal>

          <Reveal delay={120} className="grid">
            <article className="grid grid-rows-[auto_1fr] overflow-hidden rounded-[28px] bg-ink text-action-ink">
              <Image src="/images/support-team-member.jpg" alt={dfy.photoAlt} width={1024} height={768} sizes="(min-width: 900px) 600px, 100vw" className="aspect-[16/7.4] w-full object-cover object-[50%_30%]" />
              <div className="grid grid-rows-[auto_auto_auto_1fr] gap-6 p-[clamp(22px,3vw,40px)]">
                <h3 className="font-display text-[clamp(30px,3vw,42px)] font-medium leading-none tracking-[-0.04em]">{dfy.title}</h3>
                <p className="max-w-[46ch] text-[17px] leading-[1.6] text-action-ink/75">{dfy.body}</p>
                <div className="grid gap-1 rounded-[18px] border border-action-ink/12 bg-action-ink/[0.06] px-5 py-4">
                  <b className="flex items-start gap-2.5 font-display text-[18px] font-medium leading-snug tracking-[-0.01em]"><SealCheck weight="fill" aria-hidden="true" className="mt-0.5 size-5 flex-none text-rattan" />{dfy.included}</b>
                  <span className="pl-[30px] text-[14.5px] text-action-ink/65">{dfy.addOn}</span>
                </div>
                <div className="self-end"><ArrowButton href={dfy.cta.href} tone="inverse" location="ways-dfy">{dfy.cta.label}</ArrowButton></div>
              </div>
            </article>
          </Reveal>
        </div>
      </Section>
    </Band>
  );
}
