"use client";
import { type ReactElement, useEffect, useState } from "react";
import { BASKET_COPY } from "@/content/basket";
import { basketPlans, firstPayment, formatInr, monthlyTotal } from "@/lib/pricing";
import { BasketCta } from "./BasketCta";
import { useBasket } from "./useBasket";

/**
 * Sticky phone total (mock: .pbar), below 1000 px only. Hidden while any [data-basket-total] is on screen and once
 * #closing has been reached; inert while hidden so its link leaves the tab order.
 */
export function PhoneTotalBar(): ReactElement {
  const pick = useBasket();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const seen = new Set<Element>();
    let closePassed = false;
    const update = (): void => setHidden(seen.size > 0 || closePassed);
    const totals = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      update();
    });
    document.querySelectorAll("[data-basket-total]").forEach((el) => totals.observe(el));
    const closing = new IntersectionObserver(([e]) => {
      closePassed = Boolean(e && (e.isIntersecting || e.boundingClientRect.top < 0));
      update();
    });
    const closingEl = document.getElementById("closing");
    if (closingEl) closing.observe(closingEl);
    update();
    return () => { totals.disconnect(); closing.disconnect(); };
  }, []);

  const names = basketPlans(pick).map((plan) => plan.short).join(" + ");
  return (
    <div
      inert={hidden}
      className={`fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom,0px))] z-30 flex items-center justify-between gap-3 rounded-full border border-line bg-surface py-[7px] pl-[18px] pr-[7px] shadow-[var(--shadow-bar)] transition-[transform,opacity] duration-[450ms] ease-[var(--ease)] min-[1000px]:hidden ${hidden ? "pointer-events-none translate-y-[150%] opacity-0" : ""}`}
    >
      <div className="grid min-w-0 leading-[1.25]">
        <b className="num whitespace-nowrap font-display text-lg font-medium tracking-[-0.02em]">{formatInr(firstPayment(monthlyTotal(pick)).total)} {BASKET_COPY.perMonth}</b>
        <span className="truncate text-xs text-ink-2">{names}, {BASKET_COPY.withGst}</span>
      </div>
      <BasketCta size="sm" />
    </div>
  );
}
