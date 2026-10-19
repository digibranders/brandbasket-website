"use client";
import { type ReactElement, useEffect } from "react";

/**
 * Sets data-scrolled on <html> when the top sentinel leaves the viewport.
 * Render it outside the fixed header: inside a fixed element the sentinel would never scroll away.
 */
export function NavScrollState(): ReactElement {
  useEffect(() => {
    const sentinel = document.getElementById("top-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([entry]) => {
      document.documentElement.dataset.scrolled = entry?.isIntersecting ? "false" : "true";
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);
  return <span id="top-sentinel" aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-6 w-px" />;
}
