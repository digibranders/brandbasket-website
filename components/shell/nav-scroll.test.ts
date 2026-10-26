import { describe, expect, it } from "vitest";
import { NAV_SHOWN, nextNavScroll } from "./nav-scroll";

describe("nextNavScroll", () => {
  it("always shows the nav near the top of the page, including an overscroll bounce", () => {
    expect(nextNavScroll({ lastY: 600, hidden: true }, 40).hidden).toBe(false);
    expect(nextNavScroll({ lastY: 600, hidden: true }, -30).hidden).toBe(false);
  });

  it("hides the nav when the page scrolls down past the top zone", () => {
    expect(nextNavScroll({ lastY: 300, hidden: false }, 380)).toEqual({ lastY: 380, hidden: true });
  });

  it("brings the nav back on any scroll up", () => {
    expect(nextNavScroll({ lastY: 2400, hidden: true }, 2360)).toEqual({ lastY: 2360, hidden: false });
  });

  it("ignores a few pixels of jitter in either direction", () => {
    const hidden = { lastY: 900, hidden: true };
    expect(nextNavScroll(hidden, 896)).toBe(hidden);
    const shown = { lastY: 900, hidden: false };
    expect(nextNavScroll(shown, 905)).toBe(shown);
  });

  it("starts shown", () => {
    expect(NAV_SHOWN).toEqual({ lastY: 0, hidden: false });
  });
});
