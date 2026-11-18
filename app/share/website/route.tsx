// app/share/website/route.tsx
// The "website for FREE" share image (see WEBSITE_SHARE_IMAGE_META in lib/seo/metadata.ts): the Website service page and the website landing page.
import type { ImageResponse } from "next/og";
import { SHARE_IMAGE } from "@/content/home";
import { flapShareImage } from "@/lib/og/share-image";

export const dynamic = "force-static";

export function GET(): ImageResponse {
  return flapShareImage(SHARE_IMAGE);
}
