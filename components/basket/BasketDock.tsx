"use client";
import { Basket } from "@phosphor-icons/react/dist/ssr";
import { usePathname } from "next/navigation";
import { type CSSProperties, type ReactElement, useEffect, useRef, useState } from "react";
import { BASKET_COPY, saveLine } from "@/content/basket";
import { basket } from "@/lib/basket-store";
import { basketPlans, firstPayment, formatInr, PLAN_IDS, packageTotal } from "@/lib/pricing";
import { PLAN_INK } from "./basket-view";
import { BasketCta } from "./BasketCta";
import { showsDock } from "./dock-paths";
import { FLY_MS, flyDot } from "./fly";
import { Roll } from "./Roll";
import { useBasket } from "./useBasket";

/** One change to the basket, for the motion: which way it went and how long to wait for a flying dot to land. */
interface Pulse {
  readonly id: number;
  readonly dir: 1 | -1;
  readonly delay: number;
}

/** A click this recent counts as the cause of a basket change. */
const CLICK_WINDOW_MS = 600;

/**
 * The floating basket, like the cart on a shop: how many plans are picked, what they cost each month with GST, and the
 * way to start. A pill at the foot of the screen on phones and a centred pill on desktop.
 * It stays out of the way: hidden while the hero is on screen, while any [data-basket-total] is on screen (the totals
 * already say it) and once #closing has been reached. Inert while hidden, so its link leaves the tab order.
 *
 * It also answers every change. Adding a plan sends a dot in that plan's colour from the control you clicked into the
 * basket; the basket then squashes, the count pops, a ring leaves the pill and the total rolls to its new value. Removing
 * a plan sags the basket and rolls the total down. Reaching a package raises a saving tag. Nothing moves on first paint or
 * when a saved basket is restored, and reduced motion gets no flight.
 */
export function BasketDock(): ReactElement | null {
  const pathname = usePathname();
  const pick = useBasket();
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
  const saving = saveLine(pick);
  return (
    <div
      data-basket-dock
      role="region"
      aria-label={BASKET_COPY.dockLabel}
      inert={hidden}
      className={`fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom,0px))] z-30 mx-auto flex items-center gap-3 rounded-full border border-line bg-surface py-[7px] pl-[9px] pr-[7px] shadow-[var(--shadow-bar)] transition-[transform,opacity] duration-[450ms] min-[1000px]:inset-x-0 min-[1000px]:bottom-6 min-[1000px]:w-[min(640px,calc(100vw-200px))] ${hidden ? "pointer-events-none translate-y-[150%] opacity-0 ease-[var(--ease)]" : "ease-[cubic-bezier(0.34,1.4,0.64,1)]"}`}
    >
      {pulse ? <span key={`ring${pulse.id}`} aria-hidden="true" style={delayStyle} className="dock-ring" /> : null}
      {saving ? (
        <span key={saving} aria-hidden="true" style={delayStyle} className={`num absolute -top-3.5 left-16 rounded-full bg-sage px-3 py-1 text-[12.5px] font-semibold leading-none text-action-ink shadow-[0_8px_16px_-8px_rgba(40,28,14,0.5)] ${pulse ? "dock-chip-in" : ""}`}>{saving}</span>
      ) : null}
      <span ref={iconRef} aria-hidden="true" className="relative grid size-11 flex-none place-items-center rounded-full bg-rattan-wash text-rattan-ink">
        <span key={`icon${pulse?.id ?? 0}`} style={delayStyle} className={`grid place-items-center ${pulse ? (dir > 0 ? "dock-bump" : "dock-shrink") : ""}`}>
          <Basket weight="fill" className="size-6" />
        </span>
        <span key={`badge${pulse?.id ?? 0}`} style={delayStyle} className={`num absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-action px-1 text-[11px] font-semibold leading-none text-action-ink ${pulse ? (dir > 0 ? "dock-badge-add" : "dock-badge-drop") : ""}`}>{count}</span>
      </span>
      <div className="grid min-w-0 flex-auto leading-[1.25]">
        <b className="num whitespace-nowrap font-display text-lg font-medium tracking-[-0.02em]">
          <Roll value={formatInr(firstPayment(packageTotal(pick)).total)} dir={dir} delay={delay} />
        </b>
        <span className="truncate text-xs text-ink-2">{count} {count === 1 ? BASKET_COPY.planOne : BASKET_COPY.planMany} · {BASKET_COPY.phoneBarCaption}</span>
      </div>
      <div className="flex-none">
        <BasketCta location="dock" size="sm" label={BASKET_COPY.startPlan} />
      </div>
    </div>
  );
}
