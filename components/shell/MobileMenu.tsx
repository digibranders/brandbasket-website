// components/shell/MobileMenu.tsx
"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { type ReactElement, useEffect, useId, useRef, useState } from "react";
import { basketPanel } from "@/components/basket/basket-panel";
import { BASKET_COPY } from "@/content/basket";
import { LOGIN_LINK, PRIMARY_NAV } from "@/content/navigation";
import { trackAttrs } from "@/lib/analytics";

export function MobileMenu(): ReactElement {
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => { if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    // A press anywhere outside the menu and its button closes it. The button toggles by itself.
    const onPress = (event: PointerEvent): void => {
      const target = event.target;
      if (!(target instanceof Node) || sheetRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress, true);
    };
  }, [open]);

  return (
    <>
      <button ref={toggleRef} type="button" aria-expanded={open} aria-controls={sheetId} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)} className="grid size-10 place-items-center rounded-full border border-[var(--line-2)] bg-sunken min-[1000px]:hidden">
        {open ? <X aria-hidden="true" className="size-5" /> : <List aria-hidden="true" className="size-5" />}
      </button>
      {open && (
        <div id={sheetId} ref={sheetRef} className="fixed inset-x-0 top-16 z-20 grid max-h-[calc(100dvh-4rem)] overflow-y-auto border-b border-line bg-surface shadow-[var(--shadow-sheet)] min-[1000px]:hidden">
          {PRIMARY_NAV.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block border-b border-line px-[clamp(18px,4vw,56px)] py-4 font-display text-[22px] tracking-tight transition-colors duration-300 hover:bg-sunken">{link.label}</Link>
          ))}
          <a href={LOGIN_LINK.href} className="block border-b border-line px-[clamp(18px,4vw,56px)] py-4 font-display text-[22px] tracking-tight transition-colors duration-300 hover:bg-sunken">{LOGIN_LINK.label}</a>
          <button
            type="button"
            data-basket-trigger
            aria-haspopup="dialog"
            onClick={() => { setOpen(false); basketPanel.open("nav", null); }}
            {...trackAttrs("basket_open", "menu")}
            className="mx-[clamp(18px,4vw,56px)] my-5 cursor-pointer rounded-full bg-action px-5 py-3.5 text-center font-semibold text-action-ink"
          >{BASKET_COPY.startPlan}</button>
        </div>
      )}
    </>
  );
}
