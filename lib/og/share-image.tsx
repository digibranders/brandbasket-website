// lib/og/share-image.tsx
// The share-image design (1200x630). letterboardShareImage: the site's default card, a café letterboard with an italic line and the logo underneath.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SHARE_IMAGE_META } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";

export const SHARE_IMAGE_ALT = SHARE_IMAGE_META.alt;
export const SHARE_IMAGE_SIZE = { width: SHARE_IMAGE_META.width, height: SHARE_IMAGE_META.height } as const;

// ImageResponse cannot read CSS variables: these mirror --bg, --ink, --ink-2 and --rattan-text in app/globals.css.
const BONE = "#f6f5f2";
const INK = "#15161a";
const INK_2 = "#4e5057";
const RATTAN_TEXT = "#a46c2f";

// The letterboard itself is an illustration, not page UI: an oak frame, ribbed black felt and white peg letters.
const BOARD_FRAME = "#b98a52";
const BOARD_FELT = "#232327";
const BOARD_GROOVE = "#121215";
const BOARD_LETTER = "#f4f1ea";

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

export interface LetterboardCopy {
  readonly board: { readonly kicker: string; readonly headline: string; readonly note: string };
  readonly line: string;
  readonly lineAccent: string;
}

export function letterboardShareImage({ board, line, lineAccent }: LetterboardCopy): ImageResponse {
  const domain = new URL(siteConfig.url).hostname.toUpperCase();
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", background: `radial-gradient(ellipse 60% 70% at 50% 40%, #ffffff, ${BONE} 75%)`, color: INK, fontFamily: "Red Hat Display" }}>
        <div
          style={{
            marginTop: 48, width: 880, height: 380, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            border: `20px solid ${BOARD_FRAME}`, borderRadius: 10, boxShadow: "0 34px 50px -26px rgba(40, 28, 14, 0.6)",
            backgroundImage: `repeating-linear-gradient(180deg, ${BOARD_FELT} 0px, ${BOARD_FELT} 13px, ${BOARD_GROOVE} 13px, ${BOARD_GROOVE} 15px)`,
            color: BOARD_LETTER, fontWeight: 600, textTransform: "uppercase", textShadow: "0 3px 2px rgba(0, 0, 0, 0.55)",
          }}
        >
          <div style={{ display: "flex", fontSize: 54, letterSpacing: "0.14em", lineHeight: 1.2 }}>{board.kicker}</div>
          <div style={{ display: "flex", fontSize: 88, letterSpacing: "0.08em", lineHeight: 1, margin: "6px 0 10px" }}>{board.headline}</div>
          <div style={{ display: "flex", fontSize: 32, letterSpacing: "0.14em", lineHeight: 1.2 }}>{board.note}</div>
        </div>
        <div style={{ display: "flex", marginTop: 30, fontSize: 36, fontStyle: "italic", fontWeight: 300, letterSpacing: "-0.02em" }}>
          {line}
          <span style={{ marginLeft: 9, color: RATTAN_TEXT }}>{lineAccent}</span>
        </div>
        <div style={{ position: "absolute", left: 64, right: 64, bottom: 50, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lockupSrc} width={202} height={34} alt="" />
          <div style={{ display: "flex", fontSize: 18, fontWeight: 600, letterSpacing: "0.16em", color: INK_2 }}>{domain}</div>
        </div>
      </div>
    ),
    { ...SHARE_IMAGE_SIZE, fonts: [...FONTS] },
  );
}
