"use client";
import { Basket } from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import { type ReactElement, useEffect, useState } from "react";
import { BASKET_COPY } from "@/content/basket";
import { basketPlans, firstPayment, formatInr, packageTotal } from "@/lib/pricing";
import { BasketCta } from "./BasketCta";
import { showsDock } from "./dock-paths";
import { useBasket } from "./useBasket";

/**
 * The floating basket, like the cart on a shop: how many plans are picked, what they cost each month with GST, and the
 * way to start. A pill at the foot of the screen on phones and a centred pill on desktop.
 * It stays out of the way: hidden while the hero is on screen, while any [data-basket-total] is on screen (the totals
 * already say it) and once #closing has been reached. Inert while hidden, so its link leaves the tab order.
 */
export function BasketDock(): ReactElement | null {
  const pathname = usePathname();
  const pick = useBasket();
  const [hidden, setHidden] = useState(true);
  const active = showsDock(pathname);

  // Bind again on every page: the hero, the totals and #closing are different elements on each one.
  useEffect(() => {
    if (!active) return;
    const seen = new Set<Element>();
    let closePassed = false;
    const update = (): void => setHidden(seen.size > 0 || closePassed);
    const watched = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      update();
    });
    const els = document.querySelectorAll("#hero, [data-basket-total]");
    els.forEach((el) => watched.observe(el));
    const closing = new IntersectionObserver(([e]) => {
      closePassed = Boolean(e && (e.isIntersecting || e.boundingClientRect.top < 0));
      update();
    });
    const closingEl = document.getElementById("closing");
    if (closingEl) closing.observe(closingEl);
    // Otherwise the first observer callback sets the state; updating now would flash the dock before it runs.
    if (els.length === 0 && !closingEl) update();
    return () => { watched.disconnect(); closing.disconnect(); setHidden(true); };
  }, [active, pathname]);

  if (!active) return null;
  const count = basketPlans(pick).length;
  return (
    <div
      data-basket-dock
      role="region"
      aria-label={BASKET_COPY.dockLabel}
      inert={hidden}
      className={`fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom,0px))] z-30 mx-auto flex items-center gap-3 rounded-full border border-line bg-surface py-[7px] pl-[9px] pr-[7px] shadow-[var(--shadow-bar)] transition-[transform,opacity] duration-[450ms] ease-[var(--ease)] min-[1000px]:inset-x-0 min-[1000px]:bottom-6 min-[1000px]:w-[min(640px,calc(100vw-200px))] ${hidden ? "pointer-events-none translate-y-[150%] opacity-0" : ""}`}
    >
      <span aria-hidden="true" className="relative grid size-11 flex-none place-items-center rounded-full bg-rattan-wash text-rattan-ink">
        <Basket weight="fill" className="size-6" />
        <span className="num absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-action px-1 text-[11px] font-semibold leading-none text-action-ink">{count}</span>
      </span>
      <div className="grid min-w-0 flex-auto leading-[1.25]">
        <b className="num whitespace-nowrap font-display text-lg font-medium tracking-[-0.02em]">{formatInr(firstPayment(packageTotal(pick)).total)}</b>
        <span className="truncate text-xs text-ink-2">{count} {count === 1 ? BASKET_COPY.planOne : BASKET_COPY.planMany} · {BASKET_COPY.phoneBarCaption}</span>
      </div>
      <div className="flex-none">
        <BasketCta location="dock" size="sm" label={BASKET_COPY.startPlan} />
      </div>
    </div>
  );
}
