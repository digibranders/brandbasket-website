// components/about/HeroPicture.tsx
import type { Icon } from "@phosphor-icons/react";
import { Globe, Megaphone, MapPin, ShareNetwork, Wrench } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { CSSProperties, ReactElement } from "react";
import { ABOUT, type AboutIconKey, type AboutTone } from "@/content/about";
import "./about.css";

const ICON: Readonly<Partial<Record<AboutIconKey, Icon>>> = { Globe, Wrench, ShareNetwork, Megaphone, MapPin };
/** The plan colours the pricing cards and the basket already use. */
const TONE: Readonly<Record<AboutTone, string>> = { site: "var(--c-site)", growth: "var(--c-growth)", search: "var(--c-search)" };

/** Where each tile sits in the picture (percent from the left and top of its centre) and how far it leans. */
const PLACE: readonly { readonly left: number; readonly top: number; readonly tilt: number }[] = [
  { left: 27, top: 15, tilt: -4 },
  { left: 73, top: 14, tilt: 3 },
  { left: 23, top: 58, tilt: 3 },
  { left: 81, top: 56, tilt: -3 },
  { left: 50, top: 87, tilt: -2 },
];

/**
 * The About hero picture: the Brandbasket mark with the five services drifting around it, all in one place. Decorative, so it
 * is hidden from screen readers; the services are listed in words further down the page.
 */
export function HeroPicture(): ReactElement {
  return (
    <div
      aria-hidden="true"
      className="relative aspect-square w-full overflow-clip rounded-[28px] bg-[linear-gradient(160deg,var(--rattan-wash),var(--surface)_70%)] shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_40px_70px_-52px_rgba(40,28,14,0.4)] min-[560px]:aspect-[5/4]"
    >
      <span className="absolute left-1/2 top-[47%] aspect-square h-[68%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[color-mix(in_srgb,var(--rattan-ink)_28%,transparent)]" />
      <span className="absolute left-1/2 top-[47%] aspect-square h-[108%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color-mix(in_srgb,var(--rattan-ink)_14%,transparent)]" />
      <span className="absolute left-1/2 top-[47%] grid size-[24%] min-w-[84px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-surface shadow-[0_24px_50px_-24px_rgba(40,28,14,0.5),0_0_0_10px_rgba(255,255,255,0.55)]">
        <Image src="/brand/brandbasket-mark.svg" alt="" width={96} height={96} className="size-[58%]" />
      </span>
      {ABOUT.heroTiles.map((tile, index) => {
        const TileIcon = ICON[tile.icon];
        const place = PLACE[index];
        if (TileIcon === undefined || place === undefined) return null;
        return (
          <span key={tile.label} style={{ left: `${place.left}%`, top: `${place.top}%` }} className="absolute -translate-x-1/2 -translate-y-1/2">
            <span
              style={{ "--c": TONE[tile.tone], "--i": index, "--tilt": `${place.tilt}deg` } as CSSProperties}
              className="about-orbit-tile flex items-center gap-2 whitespace-nowrap rounded-full bg-surface py-1.5 pl-1.5 pr-3.5 text-[13px] font-semibold shadow-[0_0_0_1px_rgba(21,22,26,0.06),0_18px_30px_-16px_rgba(40,28,14,0.45)] min-[560px]:gap-2.5 min-[560px]:py-2 min-[560px]:pl-2 min-[560px]:pr-4 min-[560px]:text-[15px]"
            >
              <span className="grid size-7 place-items-center rounded-full bg-[var(--c)] text-action-ink min-[560px]:size-9"><TileIcon weight="fill" className="size-4 min-[560px]:size-5" /></span>
              {tile.label}
            </span>
          </span>
        );
      })}
    </div>
  );
}
