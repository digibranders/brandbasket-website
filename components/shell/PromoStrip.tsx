"use client";
import type { Icon } from "@phosphor-icons/react";
import { ArrowRight, Globe, MagnifyingGlass, TrendUp, X } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { type CSSProperties, type ReactElement, useEffect, useRef, useState } from "react";
import { PLAN_INK } from "@/components/basket/basket-view";
import { RichText } from "@/components/basket/BasketCard";
import { useBasket } from "@/components/basket/useBasket";
import { BASKET_CARD, stripLine } from "@/content/basket-card";
import { PLAN_IDS, type PlanId } from "@/lib/pricing";

const ICON: Readonly<Record<PlanId, Icon>> = { website: Globe, growth: TrendUp, search: MagnifyingGlass };

/**
 * The live stamps strip above the nav (mock: .promo .pr-stamps; owner's pick, 2026-10-21). Its stamps follow the
 * basket. It sits in the page flow, so it scrolls away; while it is on screen it sets data-promo="shown" on <html> and
 * the fixed nav moves down to clear it. Closing it lasts until the next full page load.
 */
export function PromoStrip(): ReactElement | null {
  const pick = useBasket();
  const [closed, setClosed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = ref.current;
    const root = document.documentElement;
    if (closed || !strip) {
      root.dataset.promo = "closed";
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      root.dataset.promo = entry?.isIntersecting ? "shown" : "away";
    });
    io.observe(strip);
    return () => io.disconnect();
  }, [closed]);

  if (closed) return null;
  const line = stripLine(pick);
  return (
    <div ref={ref} className="relative h-11 border-b border-rattan/30 bg-rattan-wash text-rattan-ink">
      <div className="mx-auto flex h-full max-w-[1280px] items-center gap-3.5 pl-[clamp(14px,4vw,56px)] pr-[52px] text-sm max-[760px]:gap-2.5 max-[760px]:pr-11 max-[760px]:text-[13px]">
        <span aria-hidden="true" className="flex flex-none gap-[5px]">
          {PLAN_IDS.map((id) => {
            const StampIcon = ICON[id];
            return pick[id] ? (
              <i key={`${id}-on`} style={{ "--c": PLAN_INK[id], "--r": "-8deg" } as CSSProperties} className="stamp-in grid size-[26px] place-items-center rounded-full border-[3px] border-double border-[var(--c)] bg-surface text-[var(--c)] max-[760px]:size-[22px]">
                <StampIcon weight="bold" className="size-[13px]" />
              </i>
            ) : (
              <i key={`${id}-off`} className="size-[26px] rounded-full border-[1.5px] border-dashed border-rattan-ink/40 max-[760px]:size-[22px]" />
            );
          })}
        </span>
        <p className="min-w-0 flex-1 truncate">
          <span className="max-[1179px]:hidden"><RichText line={line.long} /></span>
          <span className="min-[1180px]:hidden"><RichText line={line.short} /></span>
        </p>
        <Link href={`/#${BASKET_CARD.id}`} className="group inline-flex flex-none items-center gap-1.5 py-1.5 font-semibold underline decoration-[1.5px] underline-offset-4">
          <span className="max-[760px]:sr-only">{BASKET_CARD.stripCta}</span>
          <ArrowRight aria-hidden="true" className="size-[17px] transition-transform duration-300 ease-[var(--ease)] group-hover:translate-x-[3px]" />
        </Link>
      </div>
      <button
        type="button"
        onClick={() => setClosed(true)}
        aria-label={BASKET_CARD.stripClose}
        className="absolute right-[clamp(8px,2vw,20px)] top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full opacity-75 transition-opacity hover:opacity-100"
      >
        <X aria-hidden="true" className="size-[18px]" />
      </button>
    </div>
  );
}
