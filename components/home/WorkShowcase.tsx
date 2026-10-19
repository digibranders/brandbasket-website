// components/home/WorkShowcase.tsx
"use client";
import { ArrowsVertical, Lock } from "@phosphor-icons/react";
import Image from "next/image";
import { type KeyboardEvent, type ReactElement, useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionHead } from "@/components/ui/SectionHead";
import { WORK } from "@/content/home";

type Screen = "desk" | "mob";

interface Engine {
  readonly select: (site: string, seconds: number) => void;
}

const STAGE_ID = "work-stage";
const tabId = (site: string): string => `work-tab-${site}`;

// Rendered widths of the laptop and phone screens (mock: .desk is 88% of the stage, .phone 25% with a 110px floor).
const DESK_SIZES = "(min-width: 1280px) 720px, (min-width: 1000px) 56vw, 82vw";
const PHONE_SIZES = "(min-width: 1280px) 205px, (min-width: 1000px) 16vw, (min-width: 480px) 23vw, 110px";

const LAYER = "absolute inset-0 cursor-grab overflow-y-auto [scrollbar-width:none] [touch-action:pan-y] focus-visible:outline-offset-[-3px] group-data-[dragging]/stage:cursor-grabbing [&::-webkit-scrollbar]:hidden";
const LAYER_ON = "visible opacity-100 [transition:opacity_500ms_var(--ease)]";
const LAYER_OFF = "invisible opacity-0 [transition:opacity_500ms_var(--ease),visibility_0s_linear_500ms]";
const SHOT = "pointer-events-none block h-auto w-full max-w-none select-none";

/**
 * Homepage work showcase (mock: #h-work). Autoscrolls the chosen site, pauses on hover, and scrolls by drag (with
 * inertia), wheel, touch or keyboard. One position from 0 to 1 drives the laptop and the phone, so they stay in sync.
 * The animation loop only runs while the stage is on screen, the tab is visible and something is moving.
 */
export function WorkShowcase(): ReactElement {
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const engine = useRef<Engine | null>(null);
  // Mirrors `active` so a re-run effect (remount, Fast Refresh) starts from the selected case.
  const activeRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const first = WORK.cases[activeRef.current] ?? WORK.cases[0];
    if (!root || !stage) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduce = motion.matches;
    let site: string = first.id;
    let seconds: number = first.scrollSeconds;
    let phase = 0;
    let pos = 0;
    let target = 0;
    let hovering = false;
    let dragging = false;
    let holdUntil = 0;
    let inView = false;
    let autoVisible = false;
    let raf = 0;
    let last = 0;
    const drag: { el: HTMLElement | null; y: number; start: number; v: number; t: number } = { el: null, y: 0, start: 0, v: 0, t: 0 };
    // scrollTop values the engine wrote, so the scroll listener can tell them from native scrolls.
    const written = new WeakMap<HTMLElement, number>();

    const clamp = (f: number): number => Math.min(1, Math.max(0, f));
    const layer = (screen: Screen): HTMLElement | null => stage.querySelector<HTMLElement>(`[data-screen="${screen}"] [data-site="${site}"]`);
    const max = (el: HTMLElement): number => Math.max(1, el.scrollHeight - el.clientHeight);
    const apply = (): void => {
      for (const screen of ["desk", "mob"] as const) {
        const el = layer(screen);
        if (!el) continue;
        el.scrollTop = pos * max(el);
        written.set(el, el.scrollTop);
      }
      const bar = root.querySelector<HTMLElement>(`[data-track="${site}"]`);
      if (bar) bar.style.transform = `scaleX(${pos.toFixed(4)})`;
    };
    const syncPhase = (): void => { phase = Math.acos(1 - 2 * pos); };
    const hold = (ms: number): void => { holdUntil = Math.max(holdUntil, performance.now() + ms); };
    const autoplaying = (): boolean => !reduce && autoVisible && !hovering && !dragging;
    const moving = (): boolean => Math.abs(drag.v) > 0.00002 || Math.abs(target - pos) > 0.00005;

    const tick = (now: number): void => {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      if (autoplaying() && now > holdUntil) {
        phase += (dt * Math.PI) / seconds;
        pos = target = (1 - Math.cos(phase)) / 2;
        apply();
      } else if (!dragging && Math.abs(drag.v) > 0.00002) {
        target = clamp(target + drag.v * dt * 60);
        drag.v *= Math.pow(0.004, dt);
        if (target === 0 || target === 1) drag.v = 0;
      }
      if (Math.abs(target - pos) > 0.00005) {
        pos += (target - pos) * (1 - Math.exp(-dt * 14));
        apply();
        syncPhase();
      }
      raf = (autoplaying() || moving()) && inView && !document.hidden ? requestAnimationFrame(tick) : 0;
    };
    const wake = (): void => {
      if (raf || !inView || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(tick);
    };
    const sleep = (): void => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    engine.current = {
      select: (next, nextSeconds) => {
        site = next;
        seconds = nextSeconds;
        phase = pos = target = 0;
        drag.v = 0;
        apply();
        hold(900);
        wake();
      },
    };

    const ac = new AbortController();
    const on = { signal: ac.signal };

    for (const el of stage.querySelectorAll<HTMLElement>("[data-site]")) {
      const current = (): boolean => el.dataset.site === site;
      // Wheel scrolls the screen 1:1 in its own pixels; at either end the page scrolls on.
      el.addEventListener("wheel", (e) => {
        if (!current() || e.ctrlKey) return;
        const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el.clientHeight : 1);
        // Horizontal swipes (browser back and forward) pass through untouched.
        if (dy === 0) return;
        if ((dy < 0 && target <= 0) || (dy > 0 && target >= 1)) {
          // At an end: settle the screen there so the page takes over at once.
          if (pos !== target) {
            pos = target;
            apply();
            syncPhase();
          }
          return;
        }
        e.preventDefault();
        drag.v = 0;
        target = clamp(target + dy / max(el));
        hold(2500);
        wake();
      }, { signal: ac.signal, passive: false });
      // Touch and keyboard scroll natively; follow them unless the scroll is one the engine set.
      el.addEventListener("scroll", () => {
        if (dragging || !current() || Math.abs(el.scrollTop - (written.get(el) ?? 0)) < 2) return;
        pos = target = clamp(el.scrollTop / max(el));
        drag.v = 0;
        apply();
        syncPhase();
        hold(2500);
        wake();
      }, on);
      el.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "touch" || e.button !== 0) return;
        dragging = true;
        drag.el = el;
        drag.y = e.clientY;
        drag.start = target;
        drag.v = 0;
        drag.t = performance.now();
        stage.dataset.dragging = "";
        el.setPointerCapture(e.pointerId);
        e.preventDefault();
      }, on);
      el.addEventListener("pointermove", (e) => {
        if (!dragging || drag.el !== el) return;
        const now = performance.now();
        const prev = target;
        target = clamp(drag.start - ((e.clientY - drag.y) * 1.5) / max(el));
        pos = target;
        apply();
        syncPhase();
        if (now - drag.t > 0) drag.v = drag.v * 0.4 + (0.6 * (target - prev)) / Math.max(1, (now - drag.t) / 16);
        drag.t = now;
      }, on);
      const end = (): void => {
        if (!dragging) return;
        dragging = false;
        delete stage.dataset.dragging;
        if (performance.now() - drag.t > 80) drag.v = 0;
        hold(2500);
        wake();
      };
      el.addEventListener("pointerup", end, on);
      el.addEventListener("pointercancel", end, on);
      el.addEventListener("touchstart", () => {
        stage.dataset.touched = "";
        hold(4000);
      }, { signal: ac.signal, passive: true });
    }
    // Only a mouse pauses on hover; a touch tap would otherwise leave the showcase paused.
    stage.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") hovering = true;
    }, on);
    stage.addEventListener("pointerleave", (e) => {
      if (e.pointerType !== "mouse") return;
      hovering = false;
      hold(600);
      wake();
    }, on);
    motion.addEventListener("change", () => {
      reduce = motion.matches;
      wake();
    }, on);
    document.addEventListener("visibilitychange", () => (document.hidden ? sleep() : wake()), on);

    // Ratio 0 decides whether the loop may run at all; 0.2 is the mock's threshold for autoplay.
    const io = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting);
      autoVisible = (entry?.intersectionRatio ?? 0) >= 0.2;
      if (inView) wake();
      else sleep();
    }, { threshold: [0, 0.2] });
    io.observe(stage);

    return () => {
      sleep();
      io.disconnect();
      ac.abort();
      engine.current = null;
    };
  }, []);

  const select = (index: number): void => {
    const next = WORK.cases[index];
    if (!next) return;
    activeRef.current = index;
    setActive(index);
    engine.current?.select(next.id, next.scrollSeconds);
  };
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const last = WORK.cases.length - 1;
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    const next = e.key === "Home" ? 0 : e.key === "End" ? last : step ? (index + step + WORK.cases.length) % WORK.cases.length : -1;
    if (next < 0) return;
    e.preventDefault();
    tabRefs.current[next]?.focus();
    select(next);
  };

  const current = WORK.cases[active] ?? WORK.cases[0];

  return (
    <Section id="work" labelledBy="h-work" tight className="scroll-mt-24">
      <SectionHead id="h-work" title={WORK.heading} />
      <Reveal>
        <div ref={rootRef} className="grid grid-cols-1 items-center gap-8 min-[1000px]:grid-cols-[0.36fr_1fr] min-[1000px]:gap-14">
          <ul role="tablist" aria-label={WORK.tabsLabel} className="m-0 grid list-none p-0 max-[999px]:auto-cols-[minmax(0,1fr)] max-[999px]:grid-flow-col max-[999px]:gap-3.5">
            {WORK.cases.map((c, i) => (
              <li key={c.id} role="presentation">
                <button
                  ref={(el) => { tabRefs.current[i] = el; }}
                  id={tabId(c.id)}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-controls={STAGE_ID}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                  className={`group/case grid w-full cursor-pointer gap-1 border-0 border-t border-line bg-transparent pb-4 pt-[18px] text-left font-sans leading-[1.55] text-ink-2 transition-colors duration-300 ease-[var(--ease)] max-[999px]:pt-3 ${i === WORK.cases.length - 1 ? "min-[1000px]:border-b" : ""}`}
                >
                  <b className="font-display text-[clamp(22px,2.2vw,30px)] font-medium leading-[1.1] tracking-[-0.03em] text-[color-mix(in_srgb,var(--ink)_45%,transparent)] transition-colors duration-300 ease-[var(--ease)] group-hover/case:text-ink group-aria-selected/case:text-ink">{c.name}</b>
                  <span className="text-sm">{c.category}</span>
                  <span aria-hidden="true" className="mt-2.5 h-0.5 overflow-hidden rounded-[2px] bg-line opacity-0 transition-opacity duration-300 ease-[var(--ease)] group-aria-selected/case:opacity-100">
                    <i data-track={c.id} className="block h-full w-full origin-left bg-rattan [transform:scaleX(0)]" />
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div
            ref={stageRef}
            id={STAGE_ID}
            role="tabpanel"
            aria-labelledby={tabId(current.id)}
            className="group/stage relative min-w-0 pb-12 before:absolute before:inset-[8%_-4%_0_12%] before:rounded-[40px] before:bg-[radial-gradient(ellipse_at_60%_60%,var(--rattan-wash),transparent_70%)] before:content-['']"
          >
            <div className="group/desk relative z-[1] w-[88%] overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow),0_0_0_1px_var(--line-2)]">
              <div className="flex items-center gap-1.5 bg-sunken px-3.5 py-2.5">
                <i className="size-2.5 rounded-full bg-[color-mix(in_srgb,var(--ink)_10%,var(--line))]" />
                <i className="size-2.5 rounded-full bg-[color-mix(in_srgb,var(--ink)_10%,var(--line))]" />
                <i className="size-2.5 rounded-full bg-[color-mix(in_srgb,var(--ink)_10%,var(--line))]" />
                <span className="ml-3 flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden whitespace-nowrap rounded-[7px] bg-surface px-2.5 py-1 text-xs leading-[1.55] text-ink-2">
                  <Lock aria-hidden="true" size={14} weight="fill" className="flex-none text-[color-mix(in_srgb,var(--sage),var(--whatsapp))]" />
                  <span>{current.url}</span>
                </span>
              </div>
              <div data-screen="desk" className="relative aspect-[16/10.4] overflow-hidden bg-sunken">
                {WORK.cases.map((c, i) => (
                  <div key={c.id} data-site={c.id} role="group" aria-label={`${c.desktopAlt}${WORK.scrollableSuffix}`} tabIndex={i === active ? 0 : -1} className={`${LAYER} ${i === active ? LAYER_ON : LAYER_OFF}`}>
                    <Image src={c.desktop.src} width={c.desktop.width} height={c.desktop.height} alt={c.desktopAlt} sizes={DESK_SIZES} draggable={false} className={SHOT} />
                  </div>
                ))}
              </div>
              <span aria-hidden="true" className="pointer-events-none absolute bottom-3.5 left-1/2 z-[3] inline-flex -translate-x-1/2 translate-y-1.5 items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--ink)_82%,transparent)] px-3 py-[7px] text-[12.5px] font-semibold text-action-ink opacity-0 transition-[opacity,translate] duration-300 ease-[var(--ease)] group-hover/desk:translate-y-0 group-hover/desk:opacity-100 group-data-[dragging]/stage:opacity-0! group-data-[touched]/stage:opacity-0!">
                <ArrowsVertical size={16} />
                {WORK.dragChip}
              </span>
            </div>
            <div className="absolute bottom-0 right-0 z-[2] w-1/4 min-w-[110px] rounded-[34px] bg-ink p-[7px] shadow-[0_30px_60px_-24px_rgba(0,0,0,0.55),inset_0_0_0_1.5px_color-mix(in_srgb,var(--ink),white_10%)] after:pointer-events-none after:absolute after:left-1/2 after:top-3.5 after:z-[3] after:h-3.5 after:w-[30%] after:-translate-x-1/2 after:rounded-full after:bg-ink after:content-['']">
              <div data-screen="mob" className="relative aspect-[9/19.5] overflow-hidden rounded-[27px] bg-sunken">
                {WORK.cases.map((c, i) => (
                  <div key={c.id} data-site={c.id} role="group" aria-label={`${c.phoneAlt}${WORK.scrollableSuffix}`} tabIndex={i === active ? 0 : -1} className={`${LAYER} ${i === active ? LAYER_ON : LAYER_OFF}`}>
                    <Image src={c.phone.src} width={c.phone.width} height={c.phone.height} alt={c.phoneAlt} sizes={PHONE_SIZES} draggable={false} className={SHOT} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
