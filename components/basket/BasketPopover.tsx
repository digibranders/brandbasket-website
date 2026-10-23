"use client";
import { Check, Globe, Megaphone, MagnifyingGlass, Minus, Plus, X } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type CSSProperties, type ReactElement, useEffect, useRef, useState } from "react";
import { Arrow, pillClasses } from "@/components/ui/ArrowButton";
import { BASKET_COPY, offerNote, saveLine } from "@/content/basket";
import { slotLabel } from "@/content/basket-card";
import { trackAttrs } from "@/lib/analytics";
import { basket } from "@/lib/basket-store";
import { basketPlans, firstPayment, formatInr, PLAN_IDS, packageTotal, PLANS, type PlanId } from "@/lib/pricing";
import { signupHref } from "@/lib/signup";
import { PLAN_INK } from "./basket-view";
import { basketPanel, type PanelAnchor } from "./basket-panel";
import { Roll } from "./Roll";
import { useBasket } from "./useBasket";
import { useBasketPanel } from "./useBasketPanel";

const ICON: Readonly<Record<PlanId, Icon>> = { website: Globe, growth: Megaphone, search: MagnifyingGlass };

/** Where the panel sits from 640px up. Literal strings so Tailwind generates them. Below 640px it is a bottom sheet. */
const PLACE: Readonly<Record<PanelAnchor, string>> = {
  nav: "sm:inset-x-auto sm:bottom-auto sm:top-[84px] sm:right-[max(clamp(18px,4vw,56px),calc((100vw-1280px)/2+clamp(18px,4vw,56px)))] sm:origin-top-right",
  dock: "sm:inset-x-0 sm:mx-auto sm:bottom-[100px] sm:origin-bottom",
};

function Row({ id, pick, onlyOne }: { readonly id: PlanId; readonly pick: ReturnType<typeof useBasket>; readonly onlyOne: boolean }): ReactElement {
  const on = pick[id];
  const PlanIcon = ICON[id];
  const locked = on && onlyOne;
  const label = locked ? BASKET_COPY.rowLast : on ? BASKET_COPY.rowRemove : BASKET_COPY.rowAdd;
  return (
    <li
      style={{ "--c": PLAN_INK[id] } as CSSProperties}
      className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border p-3 transition-colors duration-300 ease-[var(--ease)] ${on ? "border-line bg-surface" : "border-dashed border-line bg-bg"}`}
    >
      <span aria-hidden="true" className={`grid size-10 place-items-center rounded-full ${on ? "bg-[var(--c)] text-action-ink" : "bg-sunken text-ink-2"}`}>
        <PlanIcon weight="fill" className="size-5" />
      </span>
      <div className="min-w-0">
        <b className="block font-display text-base font-medium leading-[1.2] tracking-[-0.015em]">{PLANS[id].name}</b>
        <span className="num text-[13px] text-ink-2">{formatInr(PLANS[id].monthly)} {BASKET_COPY.perMonth}</span>
      </div>
      <button
        type="button"
        aria-pressed={on}
        aria-label={slotLabel(id, on)}
        aria-disabled={locked ? true : undefined}
        onClick={() => basket.set(id, !on)}
        className={`inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3.5 text-[13.5px] font-semibold transition-colors duration-300 ease-[var(--ease)] aria-disabled:cursor-default ${locked ? "border-transparent bg-sunken text-ink-2" : on ? "border-ink/20 text-ink hover:border-ink" : "border-transparent bg-action text-action-ink"}`}
      >
        {locked ? <Check aria-hidden="true" weight="bold" className="size-3.5" /> : on ? <Minus aria-hidden="true" weight="bold" className="size-3.5" /> : <Plus aria-hidden="true" weight="bold" className="size-3.5" />}
        {label}
      </button>
    </li>
  );
}

function Body(): ReactElement {
  const pick = useBasket();
  const count = basketPlans(pick).length;
  const [seen, setSeen] = useState(count);
  const [dir, setDir] = useState<1 | -1>(1);
  // The total rolls up when a plan is added and down when one is removed.
  if (count !== seen) {
    setDir(count > seen ? 1 : -1);
    setSeen(count);
  }
  const saving = saveLine(pick);
  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-[22px] font-semibold tracking-[-0.03em]">{BASKET_COPY.dockLabel}</h2>
        <button type="button" aria-label={BASKET_COPY.panelClose} onClick={() => basketPanel.close()} className="grid size-9 cursor-pointer place-items-center rounded-full text-ink-2 transition-colors duration-300 hover:bg-sunken hover:text-ink">
          <X aria-hidden="true" weight="bold" className="size-[18px]" />
        </button>
      </div>
      <ul className="mt-4 grid gap-2.5">
        {PLAN_IDS.map((id) => <Row key={id} id={id} pick={pick} onlyOne={count === 1} />)}
      </ul>
      <p className="mt-3 rounded-2xl bg-rattan-wash px-3.5 py-3 text-[13.5px] leading-[1.45] text-rattan-ink">{offerNote(pick)}</p>
      <div className="mt-4 border-t border-line pt-4">
        <p className="text-[13px] text-ink-2">{BASKET_COPY.totalLabel}</p>
        <p aria-live="polite" aria-atomic="true" className="num mt-1 font-display text-[34px] font-medium leading-none tracking-[-0.04em]">
          <Roll value={formatInr(firstPayment(packageTotal(pick)).total)} dir={dir} />
        </p>
        {saving ? <p className="mt-1.5 text-[13px] font-semibold text-sage">{saving}</p> : null}
      </div>
      <Link href={signupHref(pick)} {...trackAttrs("cta_click", "basket_popover")} className={`${pillClasses("md", "action")} mt-4 w-full`}>
        {BASKET_COPY.proceed}
        <Arrow size="md" />
      </Link>
    </>
  );
}

/**
 * The basket pop-up: the plans in the basket (add or remove any), the saving, the monthly total with GST and a Proceed
 * button that opens sign-up with those plans. Opened by the nav button and the menu (under the nav) and by the dock's
 * basket icon (above the dock). A bottom sheet on phones. Esc, the close button and a click outside close it, and focus goes
 * back to what opened it.
 */
export function BasketPopover(): ReactElement | null {
  const { open, anchor } = useBasketPanel();
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    basketPanel.close();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const returnTo = basketPanel.trigger();
    panel?.focus();
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") basketPanel.close();
    };
    // From 640px the page behind stays usable, so a press outside closes it; on phones the dimmed backdrop does.
    const onPress = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Element) || panel?.contains(target) || target.closest("[data-basket-trigger]")) return;
      if (window.matchMedia("(min-width: 640px)").matches) basketPanel.close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress, true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress, true);
      if (returnTo?.isConnected) returnTo.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <>
      <div aria-hidden="true" onClick={() => basketPanel.close()} className="basket-pop-backdrop fixed inset-0 z-[39] bg-ink/45 sm:hidden" />
      <div
        ref={panelRef}
        role="dialog"
        aria-label={BASKET_COPY.dockLabel}
        tabIndex={-1}
        className={`basket-pop fixed inset-x-3 bottom-3 z-40 max-h-[calc(100dvh-24px)] overflow-y-auto rounded-[28px] border border-line bg-surface p-5 shadow-[var(--shadow-sheet)] outline-none sm:w-[380px] ${PLACE[anchor]}`}
      >
        <Body />
      </div>
    </>
  );
}
