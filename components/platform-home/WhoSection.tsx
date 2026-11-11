import Image from "next/image";
import type { ReactElement } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { WHO } from "@/content/platform-home";

interface Tile {
  /** Photo in public/home/who (made with agy, 2026-11-11; the "-2" set replaced the first, brown one the same day and renamed so caches refresh). */
  readonly photo: string;
  /** Place in the mosaic (components/platform-home/platform-home.css, .who-*). */
  readonly area: "a" | "b" | "c" | "d" | "e" | "f";
  readonly sizes: string;
}

/** One tile per kind of business, in the order of WHO.segments. Tall: a, c, e. Wide: f. */
const TILES: readonly Tile[] = [
  { photo: "startups-2", area: "a", sizes: "(min-width: 1000px) 300px, 46vw" },
  { photo: "small-businesses-2", area: "b", sizes: "(min-width: 1000px) 300px, 46vw" },
  { photo: "professional-services-2", area: "c", sizes: "(min-width: 1000px) 300px, 46vw" },
  { photo: "retail-ecommerce-2", area: "d", sizes: "(min-width: 1000px) 300px, 46vw" },
  { photo: "restaurants-hospitality-2", area: "f", sizes: "(min-width: 1000px) 600px, 92vw" },
  { photo: "growing-companies-2", area: "e", sizes: "(min-width: 1000px) 300px, 46vw" },
];

/**
 * "Built for Businesses That Want to Grow Online.": one mosaic, the headline in its own tile and the six kinds of
 * business as photos of different sizes, each named on a soft fade at its foot. Places and objects only, no portraits.
 */
export function WhoSection(): ReactElement {
  return (
    <section id="who" aria-labelledby="h-who" className="in-wrap py-16 min-[640px]:py-24">
      <ul className="who-bento">
        <li className="who-head">
          <Reveal>
            <h2 id="h-who" className="max-w-[16ch] font-display text-[clamp(34px,3.8vw,54px)] font-semibold leading-[1.02] tracking-[-0.042em]">
              {WHO.heading} <em className="font-light not-italic text-rattan-text">{WHO.headingAccent}</em>
            </h2>
          </Reveal>
        </li>
        {WHO.segments.map((segment, i) => {
          const tile = TILES[i];
          if (!tile) return null;
          return (
            <li key={segment} className={`who-tile who-${tile.area} group`}>
              <Image src={`/home/who/${tile.photo}.jpg`} alt="" fill sizes={tile.sizes} className="object-cover transition-transform duration-700 ease-[var(--ease)] group-hover:scale-[1.04]" />
              <span className="absolute inset-x-0 bottom-0 bg-[linear-gradient(to_top,rgba(21,22,26,0.78),rgba(21,22,26,0.32)_55%,transparent)] px-5 pb-4 pt-14 font-display text-[clamp(17px,1.5vw,21px)] font-medium leading-[1.15] tracking-[-0.02em] text-action-ink">
                {segment.replace("-", "‑")}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
