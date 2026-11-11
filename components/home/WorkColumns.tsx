"use client";
import { ArrowsVertical, Lock } from "@phosphor-icons/react";
import Image from "next/image";
import { type CSSProperties, type ReactElement, useEffect, useRef, useState } from "react";
import { WORK } from "@/content/home";
import "./work-columns.css";

/** Each site's ground, from the plan colours the site already uses: rattan, teal, navy. */
const GROUNDS = ["var(--rattan-wash)", "color-mix(in srgb, var(--c-growth) 15%, var(--surface))", "color-mix(in srgb, var(--c-search) 15%, var(--surface))"];

/**
 * Homepage work showcase (owner's pick, 2026-11-11): three tall panels edge to edge, one per site. The one you hover,
 * focus or tap opens wide and shows the site in a browser window; the others close up and show it in a phone. Every screen
 * scrolls its site by itself, pauses while the pointer is over it, and can be scrolled by drag (with inertia), wheel, touch
 * or keyboard, as the earlier showcase did; at either end the page scrolls on. One loop drives all six screens and only
 * runs while the row is on screen and the tab is visible. The other pages keep WorkShowcase.
 */
export function WorkColumns(): ReactElement {
  const [open, setOpen] = useState(0);
  const rowRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const views = [...row.querySelectorAll<HTMLElement>("[data-run]")];
    interface Run { phase: number; hold: number; hover: boolean; drag: boolean; v: number; written: number; startY: number; startTop: number; lastY: number; lastT: number; readonly seconds: number }
    const runs = new Map<HTMLElement, Run>(views.map((el) => [el, { phase: 0, hold: 0, hover: false, drag: false, v: 0, written: 0, startY: 0, startTop: 0, lastY: 0, lastT: 0, seconds: Number(el.dataset.seconds) || 20 }]));
    const max = (el: HTMLElement): number => Math.max(1, el.scrollHeight - el.clientHeight);
    const shown = (el: HTMLElement): boolean => {
      const screen = el.closest(".wc-screen");
      return screen !== null && getComputedStyle(screen).visibility !== "hidden";
    };
    const syncPhase = (el: HTMLElement, run: Run): void => { run.phase = Math.acos(Math.min(1, Math.max(-1, 1 - (2 * el.scrollTop) / max(el)))); };
    const ac = new AbortController();
    const on = { signal: ac.signal };
    let inView = false;
    let raf = 0;
    let last = 0;

    const tick = (now: number): void => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      for (const [el, run] of runs) {
        if (run.drag || !shown(el)) continue;
        if (Math.abs(run.v) > 0.04) {
          // Inertia after a drag: keep moving, slowing down, and stop at either end.
          el.scrollTop += run.v * dt * 60;
          run.v *= Math.pow(0.004, dt);
          run.written = el.scrollTop;
          if (el.scrollTop <= 0 || el.scrollTop >= max(el) - 1) run.v = 0;
          syncPhase(el, run);
        } else if (!motion.matches && !run.hover && now > run.hold) {
          run.phase += (dt * Math.PI) / run.seconds;
          el.scrollTop = ((1 - Math.cos(run.phase)) / 2) * max(el);
          run.written = el.scrollTop;
        }
      }
      raf = inView && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const wake = (): void => {
      if (raf || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    for (const el of views) {
      const run = runs.get(el);
      if (!run) continue;
      // Wheel, touch and keys scroll natively; follow them so the auto-scroll carries on from where the visitor left off.
      el.addEventListener("scroll", () => {
        if (run.drag || Math.abs(el.scrollTop - run.written) < 2) return;
        run.written = el.scrollTop;
        run.v = 0;
        syncPhase(el, run);
        run.hold = performance.now() + 2500;
      }, on);
      el.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") run.hover = true; }, on);
      el.addEventListener("pointerleave", (e) => {
        if (e.pointerType !== "mouse") return;
        run.hover = false;
        run.hold = performance.now() + 600;
      }, on);
      el.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "touch" || e.button !== 0) return;
        run.drag = true;
        run.v = 0;
        run.startY = e.clientY;
        run.startTop = el.scrollTop;
        run.lastY = e.clientY;
        run.lastT = performance.now();
        el.dataset.dragging = "";
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
      }, on);
      el.addEventListener("pointermove", (e) => {
        if (!run.drag) return;
        const now = performance.now();
        el.scrollTop = run.startTop - (e.clientY - run.startY) * 1.5;
        run.written = el.scrollTop;
        syncPhase(el, run);
        if (now > run.lastT) run.v = run.v * 0.4 + (0.6 * -(e.clientY - run.lastY) * 1.5) / Math.max(1, (now - run.lastT) / 16);
        run.lastY = e.clientY;
        run.lastT = now;
      }, on);
      const end = (): void => {
        if (!run.drag) return;
        run.drag = false;
        delete el.dataset.dragging;
        if (performance.now() - run.lastT > 80) run.v = 0;
        run.hold = performance.now() + 2500;
        wake();
      };
      el.addEventListener("pointerup", end, on);
      el.addEventListener("pointercancel", end, on);
    }

    document.addEventListener("visibilitychange", () => (document.hidden ? cancelAnimationFrame(raf) : wake()), on);
    const io = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      if (inView) wake();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }, { threshold: 0.1 });
    io.observe(row);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ac.abort();
    };
  }, []);

  return (
    <section id="work" aria-labelledby="h-work" className="in-wrap scroll-mt-24">
      <h2 id="h-work" className="mb-[clamp(28px,4vw,56px)] max-w-[14ch] font-display text-[clamp(40px,5.6vw,88px)] font-semibold leading-[0.98] tracking-[-0.052em]">{WORK.heading}</h2>
      <ul ref={rowRef} className="wc-row" aria-label={WORK.tabsLabel}>
        {WORK.cases.map((c, i) => (
          <li key={c.id} className="wc-item" data-open={open === i} style={{ "--dur": `${c.scrollSeconds}s`, "--ground": GROUNDS[i] ?? GROUNDS[0] } as CSSProperties}>
            <button type="button" className="wc-panel" aria-pressed={open === i} onClick={() => setOpen(i)} onMouseEnter={() => setOpen(i)} onFocus={() => setOpen(i)}>
              <span aria-hidden="true" className="wc-screen wc-screen-desk">
                <span className="wc-bar"><i /><i /><i /><span><Lock weight="fill" size={11} />{c.url}</span></span>
                <span className="wc-view" data-run data-seconds={c.scrollSeconds} tabIndex={-1}>
                  <Image src={c.desktop.src} alt="" width={c.desktop.width} height={c.desktop.height} sizes="(min-width: 1000px) 640px, 92vw" draggable={false} className="wc-img" />
                </span>
                <span className="wc-chip"><ArrowsVertical size={15} />{WORK.dragChip}</span>
              </span>
              <span aria-hidden="true" className="wc-screen wc-screen-phone">
                <span className="wc-view" data-run data-seconds={c.scrollSeconds} tabIndex={-1}>
                  <Image src={c.phone.src} alt="" width={c.phone.width} height={c.phone.height} sizes="(min-width: 1000px) 200px, 120px" draggable={false} className="wc-img" />
                </span>
              </span>
              <span className="wc-text">
                <b>{c.name}</b>
                <span>{c.category}</span>
              </span>
              <span className="sr-only">{c.desktopAlt}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
