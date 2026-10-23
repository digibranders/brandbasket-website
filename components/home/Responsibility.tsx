"use client";
import { Check, ExclamationMark } from "@phosphor-icons/react/dist/ssr";
import { type ReactElement, useEffect, useRef } from "react";
import { TwoTierHead } from "@/components/ui/TwoTierHead";
import { RESPONSIBILITY } from "@/content/home";
import { createBasket, type MatterLib } from "./responsibility-physics";

let matterLib: Promise<MatterLib> | null = null;

/** The physics library loads once, on the first need, and never sits in the page's first-load JS. */
function loadMatter(): Promise<MatterLib> {
  matterLib ??= import("matter-js").then((mod) => ((mod as { default?: MatterLib }).default ?? (mod as unknown as MatterLib)));
  return matterLib;
}

/**
 * "More Than a Website. We Take Responsibility." (mock: #s-resp). Nine worries are tossed into a woven basket; the ledger
 * counts them over. Drag-and-throw on fine pointers; reduced motion shows the finished state. The stage is decorative,
 * so the words beside it carry the meaning.
 */
export function Responsibility(): ReactElement {
  const arena = useRef<HTMLDivElement>(null);
  const svgHost = useRef<HTMLDivElement>(null);
  const floor = useRef<HTMLDivElement>(null);
  const onMind = useRef<HTMLElement>(null);
  const caught = useRef<HTMLElement>(null);

  useEffect(() => {
    const arenaEl = arena.current;
    const svgEl = svgHost.current;
    const floorEl = floor.current;
    const leftEl = onMind.current;
    const caughtEl = caught.current;
    if (!arenaEl || !svgEl || !floorEl || !leftEl || !caughtEl) return;
    const chips = [...arenaEl.querySelectorAll<HTMLElement>("[data-chip]")];
    let basket: ReturnType<typeof createBasket> | null = null;
    let playing = false;

    const play = (): void => {
      loadMatter().then((lib) => {
        if (playing || arenaEl.getBoundingClientRect().top >= innerHeight) return;
        basket ??= createBasket(lib, {
          arena: arenaEl, svgHost: svgEl, floor: floorEl, chips,
          onCount: (left, done) => { leftEl.textContent = String(left); caughtEl.textContent = String(done); },
        });
        playing = true;
        basket.start();
      }).catch(() => { /* the section reads fine without the animation */ });
    };
    // Fetch the library a screen early, play once the basket is mostly in view, reset when it leaves.
    const prefetch = new IntersectionObserver((es) => { if (es[es.length - 1]?.isIntersecting) loadMatter().catch(() => undefined); }, { rootMargin: "900px 0px" });
    const watch = new IntersectionObserver((es) => {
      const e = es[es.length - 1];
      if (!e) return;
      if (e.intersectionRatio >= 0.35 && !playing) play();
      else if (e.intersectionRatio === 0 && playing) { basket?.stop(); playing = false; }
    }, { threshold: [0, 0.35] });
    prefetch.observe(arenaEl);
    watch.observe(arenaEl);
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onResize = (): void => { clearTimeout(timer); timer = setTimeout(() => { if (playing) basket?.start(); }, 250); };
    addEventListener("resize", onResize);
    return () => {
      prefetch.disconnect();
      watch.disconnect();
      removeEventListener("resize", onResize);
      clearTimeout(timer);
      basket?.stop();
    };
  }, []);

  const total = RESPONSIBILITY.worries.length;
  return (
    <section id="responsibility" aria-labelledby="h-resp" className="in-wrap pb-[clamp(40px,5vw,64px)] pt-[clamp(56px,6vw,88px)]">
      <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-[clamp(28px,5vw,72px)] min-[1000px]:grid-cols-[0.85fr_1.15fr]">
        <div>
          <TwoTierHead id="h-resp" small={RESPONSIBILITY.small} large={RESPONSIBILITY.large} />
          <p className="mt-[22px] max-w-[46ch] text-pretty text-[17px] leading-[1.65] text-ink-2">{RESPONSIBILITY.body}</p>
          <div className="mt-[34px] flex items-stretch gap-7 max-[640px]:gap-5">
            <div>
              <b ref={onMind} className="num block font-display text-[clamp(48px,5vw,68px)] font-semibold leading-none tracking-[-0.04em]">{total}</b>
              <span className="mt-2 block text-sm text-ink-2">{RESPONSIBILITY.onYourMind}</span>
            </div>
            <i aria-hidden="true" className="w-px bg-line" />
            <div>
              <b ref={caught} className="num block font-display text-[clamp(48px,5vw,68px)] font-semibold leading-none tracking-[-0.04em] text-sage">0</b>
              <span className="mt-2 block text-sm text-ink-2">{RESPONSIBILITY.inBasket}</span>
            </div>
          </div>
        </div>
        <div ref={arena} aria-hidden="true" className="rb-stage">
          <div ref={floor} className="rb-floor" />
          <div ref={svgHost} className="contents" />
          {RESPONSIBILITY.worries.map((label) => (
            <div key={label} data-chip data-phone={(RESPONSIBILITY.phoneWorries as readonly string[]).includes(label) ? "on" : "off"} className="rb-chip">
              <i className="rb-chip-ic">
                <ExclamationMark weight="bold" className="rb-ex" />
                <Check weight="bold" className="rb-ck" />
              </i>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
