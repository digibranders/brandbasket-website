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

/** A phone-width bar with the price and the pay button, shown only while the form is off screen. Wide screens keep the form in view and never show it. */
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
      className={`fixed inset-x-0 bottom-0 z-20 flex items-center justify-between gap-3 border-t border-line bg-bg/90 px-[max(16px,env(safe-area-inset-left))] pt-2.5 pb-[calc(10px+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-[400ms] ease-[var(--ease)] min-[980px]:hidden ${away ? "translate-y-0" : "translate-y-[110%]"}`}
    >
      <p className="grid leading-[1.15]">
        <span className="num font-display text-xl font-medium tracking-[-0.03em]">{price}<small className="ml-1 font-sans text-[13px] font-medium text-ink-2">{unit}</small></span>
        <span className="text-[12.5px] text-ink-2">{note}</span>
      </p>
      <a href="#start" {...trackAttrs("cta_click", "start_bar")} className={`${pillClasses("sm", "action")} h-12 text-[15px]`}>
        {label}
        <Arrow size="sm" />
      </a>
    </div>
  );
}
