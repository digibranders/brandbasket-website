"use client";

import { CaretDown, GlobeHemisphereWest, InstagramLogo, Megaphone } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import Link from "next/link";
import { type ReactElement, useEffect, useId, useRef, useState } from "react";
import { SERVICES_LABEL, SERVICES_NAV } from "@/content/navigation";
import type { PlanId } from "@/lib/pricing";

/** One plain icon per service, in the ink colour, shared with the phone menu. */
export const SERVICE_ICONS: Readonly<Record<PlanId, Icon>> = { website: GlobeHemisphereWest, social: InstagramLogo, ads: Megaphone };

/**
 * The desktop Services menu. It opens on hover and on a press, closes on Escape, on a press outside and when focus leaves,
 * and its links stay in the page (hidden, not removed) so they can be crawled.
 */
export function ServicesMenu(): ReactElement {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  // A mouse press on a menu that the hover just opened keeps it open instead of closing it again.
  const openedByHover = useRef(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent): void => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    const onPress = (event: PointerEvent): void => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress, true);
    };
  }, [open]);

  return (
    <li
      ref={rootRef}
      className="relative"
      onPointerEnter={(event) => { if (event.pointerType !== "mouse") return;
        openedByHover.current = true;
        setOpen(true);
      }}
      onPointerLeave={(event) => { if (event.pointerType !== "mouse") return;
        openedByHover.current = false;
        setOpen(false);
      }}
      onBlur={(event) => { if (!(event.relatedTarget instanceof Node) || !rootRef.current?.contains(event.relatedTarget)) setOpen(false); }}
    >
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (openedByHover.current) { openedByHover.current = false; return; }
          setOpen((value) => !value);
        }}
        className={`flex cursor-pointer items-center gap-1 px-3.5 py-2 text-[14.5px] transition-colors duration-300 hover:text-ink ${open ? "text-ink" : "text-ink-2"}`}
      >
        {SERVICES_LABEL}
        <CaretDown aria-hidden="true" weight="bold" className={`size-3 transition-transform duration-300 ease-[var(--ease)] ${open ? "rotate-180" : ""}`} />
      </button>
      {/* The padding above the card bridges the gap to the button, so the pointer never leaves the menu on the way down. */}
      <div id={panelId} className={`absolute left-0 top-full z-40 pt-1.5 transition duration-200 ease-[var(--ease)] ${open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}>
        <ul className="w-[248px] rounded-2xl border border-line bg-surface p-1.5 shadow-[var(--shadow)]">
          {SERVICES_NAV.map((link) => {
            const Glyph = SERVICE_ICONS[link.id];
            return (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2 font-display text-[15px] font-medium tracking-[-0.01em] text-ink transition-colors duration-200 hover:bg-sunken focus-visible:bg-sunken">
                  <Glyph aria-hidden="true" className="size-[19px] flex-none" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
