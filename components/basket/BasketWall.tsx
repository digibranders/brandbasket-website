"use client";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { usePagePath } from "@/components/currency/usePagePath";
import { type CSSProperties, type FocusEvent, type PointerEvent, type ReactElement, useCallback, useEffect, useId, useRef, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { BASKET_COPY, moneyCopy } from "@/content/basket";
import { basket } from "@/lib/basket-store";
import { formatMoney } from "@/lib/currency";
import { basketPlans, packageFor, packageTotal, PLAN_IDS, type PlanId } from "@/lib/pricing";
import { PLAN_INK } from "./basket-view";
import { basketPanel } from "./basket-panel";
import { BasketSummary, PLAN_ICON } from "./BasketSummary";
import { showsDock } from "./dock-paths";
import { FLY_MS, flyDot } from "./fly";
import { Roll } from "./Roll";
import { useBasket } from "./useBasket";

/** A plan landing in the basket: which plans, and how long to wait for their dots to arrive. */
interface Landing {
  readonly n: number;
  readonly added: readonly PlanId[];
  readonly dir: 1 | -1;
  readonly delay: number;
}

/** A click this recent counts as the cause of a basket change. */
const CLICK_WINDOW_MS = 600;
/** Hover intent: a pointer passing by does not open the card, and a short trip off it does not close it. The whole wall is one hover target, so the pointer moving from the basket onto the card it opened never counts as leaving. */
const OPEN_AFTER_MS = 90;
const CLOSE_AFTER_MS = 320;

/**
 * The Woven basket (owner's pick, 2026-10-26; docs/design/nav-cart-options.html): from 1000px up, a small rattan basket
 * hangs on the right wall of the pages that sell the plans, at every scroll position. The plans in the basket sit in
 * it in their colours and the monthly total (GST included on rupee pages) hangs below on a tag. Hover, focus or a click opens the basket card
 * (BasketSummary). A plan added anywhere on the page flies into it as a dot; the basket swings and its tag swings after.
 * Phones and tablets keep BasketDock. Styles in wall.css.
 */
export function BasketWall(): ReactElement | null {
  const pathname = usePagePath();
  const pick = useBasket();
  const currency = useCurrency();
  const cardId = useId();
  const [open, setOpen] = useState(false);
  const [landing, setLanding] = useState<Landing | null>(null);
  const [page, setPage] = useState(pathname);
  // A new page starts with the card closed. Adjusting state while rendering is React's pattern for reacting to a changed value.
  if (page !== pathname) {
    setPage(pathname);
    setOpen(false);
  }
  const rootRef = useRef<HTMLDivElement>(null);
  const faceRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const active = showsDock(pathname);

  const later = useCallback((next: boolean, ms: number): void => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(next), ms);
  }, []);
  const onPointerEnter = (event: PointerEvent): void => { if (event.pointerType === "mouse") later(true, OPEN_AFTER_MS); };
  const onPointerLeave = (event: PointerEvent): void => { if (event.pointerType === "mouse") later(false, CLOSE_AFTER_MS); };

  useEffect(() => () => clearTimeout(timer.current), []);

  // One basket view at a time: opening this card closes the pop-up, and Escape closes the card.
  useEffect(() => {
    if (!open) return;
    basketPanel.close();
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      setOpen(false);
      faceRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Plans added anywhere on the page fly in from the control that was clicked, then the basket answers.
  useEffect(() => {
    if (!active) return;
    let last: { readonly el: Element; readonly at: number } | null = null;
    let prev = basket.get();
    let n = 0;
    const onClick = (event: MouseEvent): void => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest("button, a, label, [role='switch'], input");
      if (el) last = { el, at: performance.now() };
    };
    document.addEventListener("click", onClick, true);
    const off = basket.subscribe(() => {
      const next = basket.get();
      const added = PLAN_IDS.filter((id) => next[id] && !prev[id]);
      const dir = basketPlans(next).length >= basketPlans(prev).length ? 1 : -1;
      prev = next;
      const root = rootRef.current;
      // Hidden below 1000px, where BasketDock answers instead.
      if (!root || root.getClientRects().length === 0) return;
      const source = last && performance.now() - last.at < CLICK_WINDOW_MS && last.el.isConnected && !root.contains(last.el) ? last.el : null;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      let delay = 0;
      if (!reduced && source && added.length > 0) {
        const cardOpen = root.dataset.open === "true";
        added.forEach((id, i) => {
          const target = root.querySelector(cardOpen ? `[data-row-icon="${id}"]` : `[data-wall-item="${id}"]`);
          if (target) flyDot(source.getBoundingClientRect(), target.getBoundingClientRect(), PLAN_INK[id], i * 90);
        });
        delay = Math.round(FLY_MS * 0.78);
      }
      n += 1;
      setLanding({ n, added, dir, delay });
    });
    return () => { document.removeEventListener("click", onClick, true); off(); };
  }, [active]);

  if (!active) return null;

  const count = basketPlans(pick).length;
  const total = formatMoney(packageTotal(pick, currency), currency);
  const percent = packageFor(pick)?.percent;
  const swung = landing !== null && landing.added.length > 0;
  const delayStyle = { "--d": `${landing?.delay ?? 0}ms` } as CSSProperties;

  const onFaceClick = (): void => {
    clearTimeout(timer.current);
    setOpen(true);
    // The card leaves inert on this render; move focus into it on the next frame.
    requestAnimationFrame(() => cardRef.current?.querySelector<HTMLElement>(".bc-toggle:not([aria-disabled])")?.focus());
  };
  const onBlur = (event: FocusEvent<HTMLDivElement>): void => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  };

  return (
    <div ref={rootRef} data-basket-wall data-open={open} role="region" aria-label={BASKET_COPY.dockLabel} onBlur={onBlur} onPointerEnter={onPointerEnter} onPointerLeave={onPointerLeave} className="bw">
      <button
        ref={faceRef}
        type="button"
        aria-expanded={open}
        aria-controls={cardId}
        aria-label={`${BASKET_COPY.reviewBasket}: ${count} ${count === 1 ? BASKET_COPY.planOne : BASKET_COPY.planMany}, ${total} ${moneyCopy(currency).phoneBarCaption}`}
        onClick={onFaceClick}
        className="bw-face"
      >
        <span key={`hang${swung ? landing.n : 0}`} style={delayStyle} className={`bw-hang ${swung ? "bw-swing" : ""}`}>
          <span className="bw-basket">
            <span className="bw-rim" />
            <span className="bw-items">
              {PLAN_IDS.map((id) => {
                const PlanIcon = PLAN_ICON[id];
                const landed = swung && landing.added.includes(id);
                return (
                  <span key={`${id}${landed ? landing.n : 0}`} data-wall-item={id} style={{ "--c": PLAN_INK[id], ...delayStyle } as CSSProperties} className={`bw-item ${pick[id] ? "is-on" : ""} ${landed ? "bc-stamp" : ""}`}>
                    {pick[id] ? <PlanIcon weight="fill" className="size-4" /> : <Plus weight="light" className="size-4" />}
                  </span>
                );
              })}
            </span>
          </span>
          <span className="bw-string" />
          <span className="bw-tag">
            {percent ? <span key={`chip${landing?.n ?? 0}`} style={delayStyle} className={`bc-chip ${landing ? "bw-chip-in" : ""}`}>{percent}% off</span> : null}
            <b className="num"><Roll value={total} dir={landing?.dir ?? 1} delay={landing?.delay ?? 0} /></b>
            <span className="bw-tag-note">{moneyCopy(currency).phoneBarCaption}</span>
          </span>
        </span>
      </button>
      <div id={cardId} ref={cardRef} inert={!open} className="bw-card bc-shell">
        <BasketSummary location="basket_wall" />
      </div>
    </div>
  );
}
