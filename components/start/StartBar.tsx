"use client";
// components/start/StartBar.tsx
import { type ReactElement, useEffect, useState } from "react";
import { Arrow, pillClasses } from "@/components/ui/ArrowButton";
import { trackAttrs } from "@/lib/analytics";

interface StartBarProps {
  /** The monthly price as printed, such as "₹2,999". */
  readonly price: string;
  readonly unit: string;
  readonly note: string;
  readonly label: string;
}

/**
 * The main site's phone dock, for this page: the dark floating island (dock-isle, components/basket/dock.css) with the price and a
 * white pay button, shown only while the form is off screen. Wide screens keep the form in view and never show it.
 */
export function StartBar({ price, unit, note, label }: StartBarProps): ReactElement {
  const [away, setAway] = useState(false);

  useEffect(() => {
    const form = document.getElementById("start");
    if (!form) return;
    const io = new IntersectionObserver(([entry]) => setAway(entry ? !entry.isIntersecting : false));
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div
      inert={!away}
      className={`dock-isle fixed inset-x-3 bottom-[max(12px,env(safe-area-inset-bottom,0px))] z-30 mx-auto flex max-w-[480px] items-center justify-between gap-3 rounded-full py-2 pl-5 pr-2 transition-[transform,opacity] duration-[450ms] min-[980px]:hidden ${away ? "ease-[cubic-bezier(0.34,1.4,0.64,1)]" : "pointer-events-none translate-y-[150%] opacity-0 ease-[var(--ease)]"}`}
    >
      <p className="grid min-w-0 gap-0.5 leading-[1.15]">
        <b className="num whitespace-nowrap font-display text-xl font-medium tracking-[-0.025em] text-action-ink">{price}<small className="ml-1 font-sans text-[13px] font-medium text-action-ink/70">{unit}</small></b>
        <span className="truncate text-[12.5px] text-action-ink/70">{note}</span>
      </p>
      <a href="#start" {...trackAttrs("cta_click", "start_bar")} className={`${pillClasses("sm", "inverse")} flex-none`}>
        {label}
        <Arrow size="sm" />
      </a>
    </div>
  );
}
