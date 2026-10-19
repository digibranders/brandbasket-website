"use client";
import { type ReactElement, useEffect, useState } from "react";
import { BASKET_COPY } from "@/content/basket";
import { firstPayment, formatInr, signupTotal } from "@/lib/pricing";
import { BasketCta } from "./BasketCta";
import { useBasket } from "./useBasket";

/**
 * Sticky phone total (mock: .pbar), below 1000 px only. Hidden while any [data-basket-total] is on screen and once
 * #closing has been reached; inert while hidden so its link leaves the tab order.
 */
export function PhoneTotalBar(): ReactElement {
  const pick = useBasket();
  const [hidden, setHidden] = useState(true);

  // The observers bind once at mount, so mount the bar on the page that renders the totals and #closing.
  useEffect(() => {
    const seen = new Set<Element>();
    let closePassed = false;
    const update = (): void => setHidden(seen.size > 0 || closePassed);
    const totals = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      update();
    });
    const totalEls = document.querySelectorAll("[data-basket-total]");
    totalEls.forEach((el) => totals.observe(el));
    const closing = new IntersectionObserver(([e]) => {
      closePassed = Boolean(e && (e.isIntersecting || e.boundingClientRect.top < 0));
      update();
    });
    const closingEl = document.getElementById("closing");
    if (closingEl) closing.observe(closingEl);
    // Otherwise the first observer callback sets the state; updating now would flash the bar before it runs.
    if (totalEls.length === 0 && !closingEl) update();
    return () => { totals.disconnect(); closing.disconnect(); };
  }, []);

  return (
    <div
      data-phone-total-bar
      inert={hidden}
      className={`fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom,0px))] z-30 flex items-center justify-between gap-3 rounded-full border border-line bg-surface py-[7px] pl-[18px] pr-[7px] shadow-[var(--shadow-bar)] transition-[transform,opacity] duration-[450ms] ease-[var(--ease)] min-[1000px]:hidden ${hidden ? "pointer-events-none translate-y-[150%] opacity-0" : ""}`}
    >
      <div className="grid min-w-0 flex-auto overflow-hidden leading-[1.25]">
        <b className="num whitespace-nowrap font-display text-lg font-medium tracking-[-0.02em]">{formatInr(firstPayment(signupTotal(pick)).total)}</b>
        <span className="truncate text-xs text-ink-2">{BASKET_COPY.phoneBarCaption}</span>
      </div>
      <div className="flex-none">
        <BasketCta location="phone_bar" size="sm" />
      </div>
    </div>
  );
}
