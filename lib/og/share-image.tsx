// lib/og/share-image.tsx
// The share-image design (1200x630). flapShareImage: the site's default card, a headline over four split-flap tiles with an italic line and the logo underneath.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { ReactElement } from "react";
import { SHARE_IMAGE_META } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

export const SHARE_IMAGE_ALT = SHARE_IMAGE_META.alt;
export const SHARE_IMAGE_SIZE = { width: SHARE_IMAGE_META.width, height: SHARE_IMAGE_META.height } as const;

// ImageResponse cannot read CSS variables: these mirror --bg, --ink, --ink-2 and --rattan-text in app/globals.css.
const BONE = "#f6f5f2";
const INK = "#15161a";
const INK_2 = "#4e5057";
const RATTAN_TEXT = "#a46c2f";

const RATTAN = "#c48a47";

// The tiles are an illustration, not page UI: dark flaps with a hinge across the middle, in the Fynix split-flap style.
const FLAP_TOP = "#2b2c33";
const FLAP_BOTTOM = "#1d1e23";
const FLAP_HINGE = "#0d0e11";

const root = process.cwd();
const [lockup, redHatDisplay, redHatDisplaySemiBold, redHatDisplayLightItalic, rupeeFallback] = await Promise.all([
  readFile(join(root, "public/brand/brandbasket-logo-horizontal-light.svg"), "base64"),
  // Static instances of the variable font (the parser in next/og cannot read variable fonts).
  readFile(join(root, "assets/fonts/RedHatDisplay-Regular.ttf")),
  readFile(join(root, "assets/fonts/RedHatDisplay-SemiBold.ttf")),
  readFile(join(root, "assets/fonts/RedHatDisplay-LightItalic.ttf")),
  // Red Hat Display has no ₹ glyph. Geist (next/og's own default font) has one, so the sign renders offline.
  readFile(join(root, "assets/fonts/Geist-Regular.ttf")),
]);

const FONTS = [
  { name: "Red Hat Display", data: redHatDisplay, weight: 400, style: "normal" },
  { name: "Red Hat Display", data: redHatDisplaySemiBold, weight: 600, style: "normal" },
  { name: "Red Hat Display", data: redHatDisplayLightItalic, weight: 300, style: "italic" },
  { name: "Geist", data: rupeeFallback, weight: 400, style: "normal" },
] as const;

const lockupSrc = `data:image/svg+xml;base64,${lockup}`;

export interface FlapCopy {
  readonly lead: string;
  /** Four letters, one per tile. */
  readonly word: string;
  readonly line: string;
  readonly lineAccent: string;
}

/** One split-flap tile: two halves, a hinge line with a notch at each end, and the letter centred over both. */
function Flap({ letter }: { readonly letter: string }): ReactElement {
  return (
    <div
      style={{
        position: "relative", width: 190, height: 250, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 18,
        backgroundImage: `linear-gradient(180deg, ${FLAP_TOP} 0%, ${FLAP_TOP} 50%, ${FLAP_BOTTOM} 50%, ${FLAP_BOTTOM} 100%)`,
        boxShadow: "0 30px 40px -24px rgba(21, 22, 26, 0.55)", color: RATTAN, fontSize: 214, fontWeight: 600, lineHeight: 1, letterSpacing: "-0.02em",
      }}
    >
      <div style={{ display: "flex", transform: "translateY(-6px)", textShadow: "0 6px 0 rgba(0, 0, 0, 0.25)" }}>{letter}</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 122, height: 5, background: FLAP_HINGE }} />
      <div style={{ position: "absolute", left: -6, top: 119, width: 12, height: 12, borderRadius: 6, background: FLAP_HINGE }} />
      <div style={{ position: "absolute", right: -6, top: 119, width: 12, height: 12, borderRadius: 6, background: FLAP_HINGE }} />
    </div>
  );
}

export function flapShareImage({ lead, word, line, lineAccent }: FlapCopy): ImageResponse {
  const domain = new URL(siteConfig.url).hostname.replace(/^www\./, "");
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", background: `radial-gradient(ellipse 60% 70% at 50% 42%, #ffffff, ${BONE} 75%)`, color: INK, fontFamily: "Red Hat Display" }}>
        <div style={{ display: "flex", marginTop: 58, fontSize: 60, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.05 }}>{lead}</div>
        <div style={{ display: "flex", marginTop: 30 }}>
          {[...word].map((letter, i) => (
            <div key={i} style={{ display: "flex", marginLeft: i === 0 ? 0 : 22 }}>
              <Flap letter={letter} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginTop: 30, fontSize: 40, fontStyle: "italic", fontWeight: 300, letterSpacing: "-0.02em" }}>
          {line}
          <span style={{ marginLeft: 10, color: RATTAN_TEXT }}>{lineAccent}</span>
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, bottom: 44, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lockupSrc} width={202} height={34} alt="" />
          <div style={{ display: "flex", fontSize: 24, fontWeight: 600, letterSpacing: "-0.01em", color: INK_2 }}>{domain}</div>
        </div>
      </div>
    ),
    { ...SHARE_IMAGE_SIZE, fonts: [...FONTS] },
  );
}
