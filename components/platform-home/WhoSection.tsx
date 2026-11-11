import Image from "next/image";
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Section } from "@/components/ui/Section";
import { WHO } from "@/content/platform-home";

/** One photo per kind of business, in the order of WHO.segments (public/home/who, made with agy, 2026-11-11). */
const PHOTOS: readonly string[] = ["startups", "small-businesses", "professional-services", "retail-ecommerce", "restaurants-hospitality", "growing-companies"];

/**
 * "Built for Businesses That Want to Grow Online.": six photo cards, one per kind of business, each named underneath.
 * Places and objects only, no portraits. On a phone the row scrolls sideways and snaps card by card.
 */
export function WhoSection(): ReactElement {
  return (
    <Section id="who" labelledBy="h-who" className="overflow-x-clip">
      <Reveal>
        <h2 id="h-who" className="max-w-[20ch] font-display text-[clamp(34px,3.8vw,52px)] font-semibold leading-[1.02] tracking-[-0.042em]">
          {WHO.heading} <em className="font-light not-italic text-rattan-text">{WHO.headingAccent}</em>
        </h2>
      </Reveal>
      {/* Focusable so a keyboard can scroll the row on a phone (axe: scrollable-region-focusable). */}
      <ul tabIndex={0} aria-label="Kinds of business" className="mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] max-[999px]:-mx-[clamp(18px,4vw,56px)] max-[999px]:px-[clamp(18px,4vw,56px)] max-[999px]:scroll-px-[clamp(18px,4vw,56px)] min-[1000px]:grid min-[1000px]:grid-cols-6 min-[1000px]:overflow-visible [&::-webkit-scrollbar]:hidden">
        {WHO.segments.map((segment, i) => (
          <li key={segment} className="w-[min(62vw,240px)] flex-none snap-start min-[1000px]:w-auto">
            <Reveal delay={i * 70} className="grid gap-3">
              <div className="overflow-hidden rounded-[22px] bg-sunken">
                <Image
                  src={`/home/who/${PHOTOS[i] ?? "startups"}.jpg`}
                  alt=""
                  width={800}
                  height={1000}
                  sizes="(min-width: 1280px) 200px, (min-width: 1000px) 16vw, 62vw"
                  className="aspect-[4/5] w-full object-cover transition-transform duration-700 ease-[var(--ease)] hover:scale-[1.04]"
                />
              </div>
              <span className="font-display text-[clamp(16px,1.3vw,18px)] font-medium leading-[1.2] tracking-[-0.02em]">{segment.replace("-", "‑")}</span>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  );
}
