// app/share/home/route.tsx
// The homepage share image (see HOME_SHARE_IMAGE_META in lib/seo/metadata.ts).
import type { ImageResponse } from "next/og";
import { HOME_SHARE_IMAGE } from "@/content/share-images";
import { servicesShareImage } from "@/lib/og/share-image";

export const dynamic = "force-static";

export function GET(): ImageResponse {
  return servicesShareImage(HOME_SHARE_IMAGE);
}
