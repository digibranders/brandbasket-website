// components/shell/nav-scroll.ts

/** Where the page last was and whether the nav is out of the way. */
export interface NavScroll {
  readonly lastY: number;
  readonly hidden: boolean;
}

/** Within this many pixels of the top the nav always shows. */
const TOP_ZONE = 120;
/** Movement smaller than this is jitter (trackpads, the iOS address bar) and changes nothing. */
const JITTER = 6;

export const NAV_SHOWN: NavScroll = Object.freeze({ lastY: 0, hidden: false });

/** The nav steps away when the page scrolls down and comes back on any scroll up (owner's pick, 2026-10-26). */
export function nextNavScroll(prev: NavScroll, y: number): NavScroll {
  if (y < TOP_ZONE) return { lastY: y, hidden: false };
  const moved = y - prev.lastY;
  if (Math.abs(moved) <= JITTER) return prev;
  return { lastY: y, hidden: moved > 0 };
}
