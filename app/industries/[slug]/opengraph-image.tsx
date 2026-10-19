import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import { ImageResponse } from "next/og";
import { INDUSTRIES, industryBySlug } from "@/content/industries";
import { formatInr, PLANS } from "@/lib/pricing";
import { siteConfig } from "@/lib/site-config";

export const alt = `${siteConfig.name} logo and the page headline`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

// Only the eight industries have an image; any other slug is a 404 (route handlers take the same segment config).
export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return INDUSTRIES.map(({ slug }) => ({ slug }));
}

export default async function Image({ params }: { readonly params: Promise<{ readonly slug: string }> }): Promise<ImageResponse> {
  const { slug } = await params;
  const industry = industryBySlug(slug) ?? notFound();

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: BONE, color: INK, fontFamily: "Red Hat Display" }}>
        {/* The lockup's viewBox is 312.66 by 55. */}
        <img src={`data:image/svg+xml;base64,${lockup}`} width={341} height={60} alt="" />
        <div style={{ display: "flex", fontSize: 68, lineHeight: 1.04, letterSpacing: "-0.045em", maxWidth: 980 }}>{industry.h1}</div>
        <div style={{ display: "flex", fontSize: 34, letterSpacing: "-0.02em", color: RATTAN_TEXT }}>{`Built free. From ${formatInr(PLANS.website.monthly)} a month.`}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Red Hat Display", data: redHatDisplay, weight: 400, style: "normal" },
        { name: "Geist", data: rupeeFallback, weight: 400, style: "normal" },
      ],
    },
  );
}
