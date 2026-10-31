"use client";
// components/start/WorkHand.tsx
import { Lock } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactElement, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { WORK } from "@/content/home";
import "./work-hand.css";

const SITES = WORK.cases;
const COUNT = SITES.length;
const STAGE_ID = "work-hand-stage";
const tabId = (site: string): string => `work-hand-tab-${site}`;

/** How far a finger must travel sideways to count as a swipe, and how little movement still counts as a tap. */
const SWIPE_PX = 40;
const TAP_PX = 10;

/** Where site `index` sits when `active` is in front: -1 left, 0 centre, 1 right. */
function positionOf(index: number, active: number): -1 | 0 | 1 {
  return (((index - active + 1 + COUNT) % COUNT) - 1) as -1 | 0 | 1;
}

/**
 * The ad landing page's work section on a phone: a hand of three phones with the chosen one in front and scrolling its page.
 * Swipe the stage, tap a side phone, press a bar or use the arrow keys to change site. Desktop keeps the laptop showcase
 * (components/home/WorkShowcase.tsx); the page shows one or the other by width.
 */
export function WorkHand(): ReactElement {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const gesture = useRef<{ readonly x: number; moved: number } | null>(null);
  const current = SITES[active] ?? SITES[0];

  const go = (index: number): void => setActive(((index % COUNT) + COUNT) % COUNT);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>): void => {
    gesture.current = { x: event.clientX, moved: 0 };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
    if (gesture.current) gesture.current.moved = event.clientX - gesture.current.x;
  };
  const onPointerEnd = (): void => {
    const moved = gesture.current?.moved ?? 0;
    gesture.current = null;
    if (Math.abs(moved) >= SWIPE_PX) go(active + (moved < 0 ? 1 : -1));
  };
  /** A tap on a side phone brings it forward; a drag that happens to end on one does not. */
  const onPhoneClick = (index: number): void => {
    if (index !== active && Math.abs(gesture.current?.moved ?? 0) < TAP_PX) go(index);
  };

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    const next = event.key === "Home" ? 0 : event.key === "End" ? COUNT - 1 : step === 0 ? -1 : (index + step + COUNT) % COUNT;
    if (next < 0) return;
    event.preventDefault();
    tabRefs.current[next]?.focus();
    go(next);
  };

  return (
    <Section id="work-phone" labelledBy="h-work-phone" tight className="scroll-mt-24 pb-0! min-[640px]:hidden">
      <SectionHead id="h-work-phone" title={WORK.heading} step />
      <Reveal>
        <div
          id={STAGE_ID}
          role="tabpanel"
          aria-labelledby={tabId(current.id)}
          className="wh-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          {SITES.map((site, index) => {
            const pos = positionOf(index, active);
            return (
              <div
                key={site.id}
                data-pos={pos}
                aria-hidden={pos === 0 ? undefined : true}
                onClick={() => onPhoneClick(index)}
                className="wh-phone"
                style={{ "--dur": `${site.scrollSeconds}s` } as CSSProperties}
              >
                <div className="wh-screen">
                  <Image src={site.phone.src} width={site.phone.width} height={site.phone.height} alt={pos === 0 ? site.phoneAlt : ""} sizes="200px" draggable={false} className="wh-shot" />
                </div>
              </div>
            );
          })}
        </div>

        <div key={current.id} aria-live="polite" className="wh-cap mt-1 grid justify-items-center gap-1.5 text-center">
          <b className="font-display text-[clamp(24px,7vw,30px)] font-medium leading-[1.1] tracking-[-0.03em]">{current.name}</b>
          <span className="text-[15px] text-ink-2">{current.category}</span>
          <span className="mt-0.5 inline-flex items-center gap-1.5 font-mono text-[12.5px] text-ink-2">
            <Lock aria-hidden="true" size={13} weight="fill" className="text-sage" />
            {current.url}
          </span>
        </div>

        <div role="tablist" aria-label={WORK.tabsLabel} className="mt-3 flex justify-center gap-1">
          {SITES.map((site, index) => (
            <button
              key={site.id}
              ref={(el) => { tabRefs.current[index] = el; }}
              id={tabId(site.id)}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-controls={STAGE_ID}
              aria-label={site.name}
              tabIndex={index === active ? 0 : -1}
              onClick={() => go(index)}
              onKeyDown={(event) => onTabKey(event, index)}
              className="wh-dot"
            >
              <i />
            </button>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
