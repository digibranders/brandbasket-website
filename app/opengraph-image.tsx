// app/opengraph-image.tsx
// The site's default share image. Every route without its own opengraph-image file uses it.
import type { ImageResponse } from "next/og";
import { SHARE_IMAGE } from "@/content/home";
import { SHARE_IMAGE_ALT, SHARE_IMAGE_SIZE, shareImage } from "@/lib/og/share-image";

export const alt = SHARE_IMAGE_ALT;
export const size = SHARE_IMAGE_SIZE;
export const contentType = "image/png";

export default function Image(): ImageResponse {
  return shareImage(SHARE_IMAGE);
}
