// components/shell/MobileMenu.tsx
"use client";

import { List, X } from "@phosphor-icons/react";
import Link from "next/link";
import { type ReactElement, useEffect, useId, useRef, useState } from "react";
import { PRIMARY_CTA, PRIMARY_NAV } from "@/content/navigation";
import { trackAttrs } from "@/lib/analytics";

export function MobileMenu(): ReactElement {
  const [open, setOpen] = useState(false);
  const sheetId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => { if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button ref={toggleRef} type="button" aria-expanded={open} aria-controls={sheetId} aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)} className="grid size-10 place-items-center rounded-full border border-[var(--line-2)] bg-sunken min-[1000px]:hidden">
        {open ? <X aria-hidden="true" className="size-5" /> : <List aria-hidden="true" className="size-5" />}
      </button>
      {open && (
        <div id={sheetId} className="absolute inset-x-3 top-[76px] z-20 grid gap-1 rounded-[26px] border border-line bg-surface p-2.5 shadow-[var(--shadow-sheet)] min-[1000px]:hidden">
          {PRIMARY_NAV.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3.5 font-display text-[22px] tracking-tight hover:bg-sunken">{link.label}</Link>
          ))}
          <Link href={PRIMARY_CTA.href} onClick={() => setOpen(false)} {...trackAttrs("cta_click", "menu")} className="m-1.5 rounded-full bg-action px-5 py-3 text-center font-semibold text-action-ink">{PRIMARY_CTA.label}</Link>
        </div>
      )}
    </>
  );
}
