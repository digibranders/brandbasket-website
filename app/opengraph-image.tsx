// app/opengraph-image.tsx
// The site's default share image: three tiles for the three services. Every route without its own share image uses it.
// The Website service page and the website landing page use the "website for FREE" card (/share/website); Social Media has its own (/share/social).
import type { ImageResponse } from "next/og";
import { HOME_SHARE_IMAGE } from "@/content/share-images";
import { SHARE_IMAGE_ALT, SHARE_IMAGE_SIZE, servicesShareImage } from "@/lib/og/share-image";

export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image(): ImageResponse {
  return servicesShareImage(HOME_SHARE_IMAGE);
}
