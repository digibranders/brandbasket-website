// lib/og/share-image.tsx
// The one share-image design (1200x630): logo lockup, a headline and a rattan line. Used by every opengraph-image file.
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SHARE_IMAGE_META } from "@/lib/seo/metadata";

export const SHARE_IMAGE_ALT = SHARE_IMAGE_META.alt;
export const SHARE_IMAGE_SIZE = { width: SHARE_IMAGE_META.width, height: SHARE_IMAGE_META.height } as const;

// ImageResponse cannot read CSS variables: these mirror --bg, --ink and --rattan-text in app/globals.css.
const BONE = "#f6f5f2";
const INK = "#15161a";
const RATTAN_TEXT = "#a46c2f";

const root = process.cwd();
const [lockup, redHatDisplay, rupeeFallback] = await Promise.all([
  readFile(join(root, "public/brand/brandbasket-lockup-horizontal-light.svg"), "base64"),
  // A static 400 instance of the variable font (the parser in next/og cannot read variable fonts).
  readFile(join(root, "assets/fonts/RedHatDisplay-Regular.ttf")),
  // Red Hat Display has no ₹ glyph. Geist (next/og's own default font) has one, so the sign renders offline.
  readFile(join(root, "assets/fonts/Geist-Regular.ttf")),
]);

export function shareImage({ headline, line }: { readonly headline: string; readonly line: string }): ImageResponse {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: BONE, color: INK, fontFamily: "Red Hat Display" }}>
        {/* The lockup's viewBox is 312.66 by 55. next/image cannot render inside ImageResponse, so this is a plain img. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/svg+xml;base64,${lockup}`} width={341} height={60} alt="" />
        <div style={{ display: "flex", fontSize: 68, lineHeight: 1.04, letterSpacing: "-0.045em", maxWidth: 980 }}>{headline}</div>
        <div style={{ display: "flex", fontSize: 34, letterSpacing: "-0.02em", color: RATTAN_TEXT }}>{line}</div>
      </div>
    ),
    {
      ...SHARE_IMAGE_SIZE,
      fonts: [
        { name: "Red Hat Display", data: redHatDisplay, weight: 400, style: "normal" },
        { name: "Geist", data: rupeeFallback, weight: 400, style: "normal" },
      ],
    },
  );
}
