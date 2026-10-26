"use client";
import { useEffect } from "react";
import { NAV_SHOWN, type NavScroll, nextNavScroll } from "./nav-scroll";

/**
 * Writes the nav's scroll state on <html>, outside React so scrolling never re-renders anything: data-scrolled once the
 * page has moved off the top, and data-nav="hidden" while the page is scrolling down (components/shell/nav-scroll.ts).
 * Scroll direction needs the scroll position, so this is a passive listener batched to one read per frame.
 */
export function NavScrollState(): null {
  useEffect(() => {
    const root = document.documentElement;
    let state: NavScroll = NAV_SHOWN;
    let frame = 0;
    const update = (): void => {
      frame = 0;
      const y = window.scrollY;
      state = nextNavScroll(state, y);
      root.dataset.scrolled = String(y > 8);
      root.dataset.nav = state.hidden ? "hidden" : "shown";
    };
    const onScroll = (): void => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      delete root.dataset.nav;
    };
  }, []);
  return null;
}
