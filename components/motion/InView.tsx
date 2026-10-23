"use client";
import { type ReactElement, type ReactNode, useEffect, useRef } from "react";

/**
 * Sets data-in="true" while a quarter of the block is on screen and clears it once it has fully left, so CSS can
 * replay an entrance each time. Use as a wrapper; the CSS reads [data-in="true"] on an ancestor.
 */
export function InView({ children, className = "" }: { readonly children: ReactNode; readonly className?: string }): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      const e = es[es.length - 1];
      if (!e) return;
      if (e.intersectionRatio >= 0.25) el.dataset.in = "true";
      else if (e.intersectionRatio === 0) delete el.dataset.in;
    }, { threshold: [0, 0.25] });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
}
