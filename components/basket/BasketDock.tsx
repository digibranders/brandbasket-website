"use client";
import { Basket } from "@phosphor-icons/react/dist/ssr";
import { usePagePath } from "@/components/currency/usePagePath";
import { type CSSProperties, type ReactElement, useEffect, useRef, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { BASKET_COPY } from "@/content/basket";
import { trackAttrs } from "@/lib/analytics";
import { basket } from "@/lib/basket-store";
import { formatMoney } from "@/lib/currency";
import { basketPlans, monthlyTotal, PLAN_IDS } from "@/lib/pricing";
import { dockLabel, PLAN_INK } from "./basket-view";
import { BasketCta } from "./BasketCta";
import { showsDock } from "./dock-paths";
import { FLY_MS, flyDot } from "./fly";
import { basketPanel } from "./basket-panel";
import { Roll } from "./Roll";
import { useBasket } from "./useBasket";
import { useBasketPanel } from "./useBasketPanel";

/** One change to the basket, for the motion: which way it went and how long to wait for a flying dot to land. */
interface Pulse {
  readonly id: number;
  readonly dir: 1 | -1;
  readonly delay: number;
}

/** A click this recent counts as the cause of a basket change. */
const CLICK_WINDOW_MS = 600;

/**
 * The floating basket, like the cart on a shop: how many plans are picked, what they cost each month (GST included on rupee pages), and the
 * way to start. The ink island (owner's pick, 2026-10-26; docs/design/phone-dock-options.html) at the foot of the screen on
 * phones and tablets: a rattan basket with its count, the total and one bar per plan in its colour, and a white button.
 * From 1000px up the Woven basket (BasketWall) does this job.
 * It is always there below the top of the page (owner, 2026-10-26): hidden only while the hero or a [data-dock-hide] dark
 * section (the homepage's "We Take Responsibility", the pricing page's basket band) is on screen, which already say it. It stays over the
 * Basket Card, the closing band and everything else. Inert while hidden, so its link leaves the tab order.
 *
 * It also answers every change. Adding a plan sends a dot in that plan's colour from the control you clicked into the
 * basket; the basket then squashes, the count pops, a ring leaves the pill and the total rolls to its new value. Removing
 * a plan sags the basket and rolls the total down. Nothing moves on first paint or
 * when a saved basket is restored, and reduced motion gets no flight.
 */
export function BasketDock(): ReactElement | null {
  const pathname = usePagePath();
  const pick = useBasket();
  const currency = useCurrency();
  const panel = useBasketPanel();
  const [hidden, setHidden] = useState(true);
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const hiddenRef = useRef(true);
  const iconRef = useRef<HTMLSpanElement>(null);
  const active = showsDock(pathname);

  useEffect(() => {
    hiddenRef.current = hidden;
  }, [hidden]);

  // Bind again on every page: the hero, the totals and #closing are different elements on each one.
  useEffect(() => {
    if (!active) return;
    const seen = new Set<Element>();
    const update = (): void => setHidden(seen.size > 0);
    const watched = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
      update();
    });
    const els = document.querySelectorAll("#hero, [data-dock-hide]");
    els.forEach((el) => watched.observe(el));
    // Otherwise the first observer callback sets the state; updating now would flash the dock before it runs.
    if (els.length === 0) update();
    return () => { watched.disconnect(); setHidden(true); };
  }, [active, pathname]);

  // React to real changes only (not the first paint, not a restored basket): fly, then pulse.
  useEffect(() => {
    if (!active) return;
    let last: { readonly el: Element; readonly at: number } | null = null;
    let prev = basket.get();
    let counter = 0;
    const onClick = (event: MouseEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest("button, a, label, [role='switch'], input");
      if (el) last = { el, at: performance.now() };
    };
    document.addEventListener("click", onClick, true);
    const off = basket.subscribe(() => {
      const next = basket.get();
      const before = basketPlans(prev).length;
      const after = basketPlans(next).length;
      const added = PLAN_IDS.filter((id) => next[id] && !prev[id]);
      prev = next;
      if (before === after) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const icon = iconRef.current;
      const source = last && performance.now() - last.at < CLICK_WINDOW_MS && last.el.isConnected ? last.el : null;
      let delay = 0;
      if (!reduced && !hiddenRef.current && icon && source && added.length > 0) {
        added.forEach((id, i) => flyDot(source.getBoundingClientRect(), icon.getBoundingClientRect(), PLAN_INK[id], i * 90));
        delay = Math.round(FLY_MS * 0.78);
      }
      counter += 1;
      setPulse({ id: counter, dir: after > before ? 1 : -1, delay });
    });
    return () => { document.removeEventListener("click", onClick, true); off(); };
  }, [active]);

  if (!active) return null;
  const count = basketPlans(pick).length;
  const dir = pulse?.dir ?? 1;
  const delay = pulse?.delay ?? 0;
  const delayStyle = { "--d": `${delay}ms` } as CSSProperties;
  const total = formatMoney(monthlyTotal(pick, currency), currency);
  return (
    <div
      data-basket-dock
      role="region"
      aria-label={BASKET_COPY.dockLabel}
      inert={hidden}
      className={`dock-isle fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom,0px))] z-30 mx-auto flex max-w-[480px] items-center gap-3 rounded-full py-2 pl-2.5 pr-2 transition-[transform,opacity] duration-[450ms] min-[1000px]:hidden ${hidden ? "pointer-events-none translate-y-[150%] opacity-0 ease-[var(--ease)]" : "ease-[cubic-bezier(0.34,1.4,0.64,1)]"}`}
    >
      {pulse ? <span key={`ring${pulse.id}`} aria-hidden="true" style={delayStyle} className="dock-ring" /> : null}
      <button
        type="button"
        data-basket-trigger
        aria-haspopup="dialog"
        aria-expanded={panel.open && panel.anchor === "dock"}
        aria-label={dockLabel(count, total, currency)}
        {...(panel.open && panel.anchor === "dock" ? {} : trackAttrs("basket_open", "dock"))}
        onClick={(event) => basketPanel.toggle("dock", event.currentTarget)}
        className="flex min-w-0 flex-auto cursor-pointer items-center gap-3 rounded-full text-left"
      >
      <span ref={iconRef} aria-hidden="true" className="relative grid size-[46px] flex-none place-items-center rounded-full bg-rattan text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
        <span key={`icon${pulse?.id ?? 0}`} style={delayStyle} className={`grid place-items-center ${pulse ? (dir > 0 ? "dock-bump" : "dock-shrink") : ""}`}>
          <Basket weight="fill" className="size-6" />
        </span>
        <span key={`badge${pulse?.id ?? 0}`} style={delayStyle} className={`num absolute -right-1.5 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-action-ink px-1 text-[11px] font-semibold leading-none text-action shadow-[0_0_0_2px_var(--action)] ${pulse ? (dir > 0 ? "dock-badge-add" : "dock-badge-drop") : ""}`}>{count}</span>
      </span>
      <div className="grid min-w-0 flex-auto gap-1 leading-[1.15]">
        <b className="num whitespace-nowrap font-display text-xl font-medium tracking-[-0.025em] text-action-ink">
          <Roll value={total} dir={dir} delay={delay} />
        </b>
        <span aria-hidden="true" className="flex gap-1">
          {PLAN_IDS.map((id) => <i key={id} style={{ "--c": PLAN_INK[id] } as CSSProperties} className={`dock-seg ${pick[id] ? "is-on" : ""}`} />)}
        </span>
      </div>
      </button>
      <div className="flex-none">
        <BasketCta location="dock" size="sm" tone="inverse" label={BASKET_COPY.startPlan} anchor="dock" />
      </div>
    </div>
  );
}
