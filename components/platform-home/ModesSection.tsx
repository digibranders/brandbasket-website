"use client";
import type { Icon } from "@phosphor-icons/react";
import { CalendarCheck, Check, CursorClick, Headset, SealCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { type CSSProperties, type KeyboardEvent, type ReactElement, useRef, useState } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Band } from "@/components/ui/Band";
import { Section } from "@/components/ui/Section";
import { MODES } from "@/content/platform-home";
import { SERVICE_META } from "./service-meta";

/** Sample rows in the Do It Yourself picture: what the AI has drafted and where each one stands. */
const QUEUE = [
  { id: "social", title: "Weekend offer post", meta: "Instagram, drafted by AI", state: "Review" },
  { id: "website", title: "New opening hours", meta: "Website, updated", state: "Live" },
  { id: "social", title: "Sunday lunch post", meta: "Facebook, scheduled", state: "Ready" },
  { id: "ads", title: "Weekly ads report", meta: "Ads, ready to read", state: "Open" },
] as const;

type Mode = "diy" | "dfy";
const ORDER: readonly Mode[] = ["diy", "dfy"];

const WAY_ICON: Readonly<Record<Mode, Icon>> = { diy: CursorClick, dfy: Headset };

/**
 * "Do It Yourself. Or Done For You.": the headline, then a two-way switch that looks like one: two cards, each with an
 * icon, its name and a radio mark, and a dark pill that slides to the chosen one. The panel below becomes that way of
 * working. Both panels are in the page (the other is only hidden), and arrow keys move between the options
 * (WAI-ARIA tabs, automatic activation).
 */
export function ModesSection(): ReactElement {
  const { diy, dfy } = MODES;
  const [mode, setMode] = useState<Mode>("diy");
  const tabs = useRef<Partial<Record<Mode, HTMLButtonElement | null>>>({});

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    const at = ORDER.indexOf(mode);
    const next = event.key === "ArrowRight" || event.key === "ArrowDown" ? ORDER[(at + 1) % ORDER.length] : event.key === "ArrowLeft" || event.key === "ArrowUp" ? ORDER[(at + ORDER.length - 1) % ORDER.length] : event.key === "Home" ? ORDER[0] : event.key === "End" ? ORDER[ORDER.length - 1] : undefined;
    if (!next) return;
    event.preventDefault();
    setMode(next);
    tabs.current[next]?.focus();
  }

  const title: Readonly<Record<Mode, string>> = { diy: diy.title, dfy: dfy.title };
  return (
    <Band tone="sunken">
      <Section id="ways" labelledBy="h-ways" className="scroll-mt-24">
        <Reveal>
          <h2 id="h-ways" className="mb-[clamp(24px,3vw,40px)] max-w-[16ch] font-display text-[clamp(40px,5.6vw,88px)] font-semibold leading-[0.98] tracking-[-0.052em]">
            {MODES.heading} <em className="font-light not-italic text-rattan-text">{MODES.headingAccent}</em>
          </h2>
        </Reveal>
        <Reveal delay={90}>
          <div role="tablist" aria-labelledby="h-ways" onKeyDown={onKeyDown} data-mode={mode} className="ways-switch">
            <span aria-hidden="true" className="ways-thumb" />
            {ORDER.map((id) => {
              const WayIcon = WAY_ICON[id];
              return (
                <button
                  key={id}
                  ref={(el) => { tabs.current[id] = el; }}
                  type="button"
                  role="tab"
                  id={`way-${id}`}
                  aria-selected={mode === id}
                  aria-controls={`way-panel-${id}`}
                  tabIndex={mode === id ? 0 : -1}
                  onClick={() => setMode(id)}
                  className="ways-opt"
                >
                  <span aria-hidden="true" className="ways-opt-icon"><WayIcon weight="duotone" className="size-[26px]" /></span>
                  <span className="ways-opt-title">{title[id]}</span>
                  <span aria-hidden="true" className="ways-radio"><Check weight="bold" className="size-3.5" /></span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div role="tabpanel" id="way-panel-diy" aria-labelledby="way-diy" hidden={mode !== "diy"} className="ways-panel ways-panel-diy">
          <div className="ways-copy">
            <p className="ways-lead">{diy.body}</p>
            <BasketCta location="ways-diy" label={diy.cta.label} anchor="dock" />
          </div>
          <figure aria-label="Example: AI drafts waiting for review" className="ways-stage basket-weave m-0">
            <span aria-hidden="true" className="ways-spark"><Sparkle weight="fill" className="size-5" /></span>
            <ul aria-hidden="true" className="ways-queue">
              {QUEUE.map((row, i) => {
                const { icon: RowIcon, tone } = SERVICE_META[row.id];
                const done = row.state === "Live";
                return (
                  <li key={row.title} style={{ "--tone": tone, "--n": i } as CSSProperties} className="ways-row">
                    <span className="grid size-11 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--tone)_12%,var(--surface))] text-[var(--tone)]"><RowIcon weight="duotone" className="size-[22px]" /></span>
                    <span className="grid min-w-0"><b className="truncate text-[15.5px] font-semibold">{row.title}</b><small className="truncate text-[13px] text-ink-2">{row.meta}</small></span>
                    <span className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-semibold ${done ? "bg-[color-mix(in_srgb,var(--sage)_14%,var(--surface))] text-ink" : "border border-ink/20 bg-surface"}`}>
                      {done ? <Check weight="bold" className="size-3.5 text-sage" /> : row.state === "Ready" ? <CalendarCheck className="size-3.5" /> : null}
                      {row.state}
                    </span>
                  </li>
                );
              })}
            </ul>
          </figure>
        </div>

        <div role="tabpanel" id="way-panel-dfy" aria-labelledby="way-dfy" hidden={mode !== "dfy"} className="ways-panel ways-panel-dfy">
          <div className="ways-copy">
            <p className="ways-lead">{dfy.body}</p>
            <ArrowButton href={dfy.cta.href} tone="inverse" location="ways-dfy">{dfy.cta.label}</ArrowButton>
          </div>
          <div className="ways-photo">
            <Image src="/images/support-team-member.jpg" alt={dfy.photoAlt} fill sizes="(min-width: 900px) 520px, 100vw" className="object-cover object-[50%_30%]" />
            <div className="ways-note">
              <b className="flex items-start gap-2.5 font-display text-[17px] font-semibold leading-snug tracking-[-0.01em]"><SealCheck weight="fill" aria-hidden="true" className="mt-0.5 size-5 flex-none text-rattan-text" />{dfy.included}</b>
              <span className="pl-[30px] text-[14px] text-ink-2">{dfy.addOn}</span>
            </div>
          </div>
        </div>
      </Section>
    </Band>
  );
}
