"use client";
import { Lock } from "@phosphor-icons/react";
import Image from "next/image";
import { type CSSProperties, type ReactElement, useState } from "react";
import { WORK } from "@/content/home";
import "./work-columns.css";

/** Each site's ground, from the plan colours the site already uses: rattan, teal, navy. */
const GROUNDS = ["var(--rattan-wash)", "color-mix(in srgb, var(--c-growth) 15%, var(--surface))", "color-mix(in srgb, var(--c-search) 15%, var(--surface))"];

/**
 * Homepage work showcase (owner's pick, 2026-11-11): three tall panels edge to edge, one per site. The one you hover,
 * focus or tap opens wide and shows the site in a browser window; the others close up and show it in a phone. Both screens
 * slide a tall screenshot up and down by themselves (CSS only, see work-columns.css), so there is no animation loop.
 * The other pages keep WorkShowcase.
 */
export function WorkColumns(): ReactElement {
  const [open, setOpen] = useState(0);
  return (
    <section id="work" aria-labelledby="h-work" className="in-wrap scroll-mt-24">
      <h2 id="h-work" className="mb-[clamp(28px,4vw,56px)] max-w-[14ch] font-display text-[clamp(40px,5.6vw,88px)] font-semibold leading-[0.98] tracking-[-0.052em]">{WORK.heading}</h2>
      <ul className="wc-row" aria-label={WORK.tabsLabel}>
        {WORK.cases.map((c, i) => (
          <li key={c.id} className="wc-item" data-open={open === i} style={{ "--dur": `${c.scrollSeconds}s`, "--ground": GROUNDS[i] ?? GROUNDS[0] } as CSSProperties}>
            <button type="button" className="wc-panel" aria-pressed={open === i} onClick={() => setOpen(i)} onMouseEnter={() => setOpen(i)} onFocus={() => setOpen(i)}>
              <span aria-hidden="true" className="wc-screen wc-screen-desk">
                <span className="wc-bar"><i /><i /><i /><span><Lock weight="fill" size={11} />{c.url}</span></span>
                <span className="wc-view">
                  <Image src={c.desktop.src} alt="" width={c.desktop.width} height={c.desktop.height} sizes="(min-width: 1000px) 640px, 92vw" draggable={false} className="wc-run" />
                </span>
              </span>
              <span aria-hidden="true" className="wc-screen wc-screen-phone">
                <span className="wc-view">
                  <Image src={c.phone.src} alt="" width={c.phone.width} height={c.phone.height} sizes="(min-width: 1000px) 200px, 120px" draggable={false} className="wc-run" />
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
