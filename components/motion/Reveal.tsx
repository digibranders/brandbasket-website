"use client";
import { type CSSProperties, type ReactElement, type ReactNode, useLayoutEffect, useRef } from "react";

interface RevealProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly className?: string;
}

/**
 * Fades content up once when it scrolls into view. Elements already on screen at mount, hidden tabs and browsers
 * without IntersectionObserver show immediately, so nothing is ever stuck invisible.
 */
export function Reveal({ children, delay = 0, className = "" }: RevealProps): ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window) || document.hidden) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92) return;
    el.dataset.reveal = "pending";
    const io = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      el.dataset.reveal = "done";
      io.disconnect();
    }, { rootMargin: "0px 0px -80px 0px", threshold: 0.14 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={className} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}
