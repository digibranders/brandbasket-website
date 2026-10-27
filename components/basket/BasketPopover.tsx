"use client";
import { usePagePath } from "@/components/currency/usePagePath";
import { type ReactElement, useEffect, useRef } from "react";
import { BASKET_COPY } from "@/content/basket";
import { basketPanel, type PanelAnchor } from "./basket-panel";
import { BasketSummary } from "./BasketSummary";
import { useBasketPanel } from "./useBasketPanel";

/** Where the panel sits from 640px up. Literal strings so Tailwind generates them. Below 640px it is a bottom sheet. */
const PLACE: Readonly<Record<PanelAnchor, string>> = {
  nav: "sm:inset-x-auto sm:bottom-auto sm:top-[84px] sm:right-[max(clamp(18px,4vw,56px),calc((100vw-1280px)/2+clamp(18px,4vw,56px)))] sm:origin-top-right",
  dock: "sm:inset-x-0 sm:mx-auto sm:bottom-[100px] sm:origin-bottom",
};

/**
 * The basket pop-up: the basket card (BasketSummary) in its glass tray. Opened by the nav button and the menu (under the nav) and by the dock's
 * basket icon (above the dock). A bottom sheet on phones. Esc, the close button and a click outside close it, and focus goes
 * back to what opened it.
 */
export function BasketPopover(): ReactElement | null {
  const { open, anchor } = useBasketPanel();
  const pathname = usePagePath();
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
        className={`basket-pop fixed inset-x-3 bottom-3 z-40 max-h-[calc(100dvh-24px)] overflow-y-auto bc-shell is-shown outline-none sm:w-[380px] ${PLACE[anchor]}`}
      >
        <BasketSummary location="basket_popover" onClose={() => basketPanel.close()} />
      </div>
    </>
  );
}
