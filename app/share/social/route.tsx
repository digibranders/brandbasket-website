// app/share/social/route.tsx
// The Social Media Management page share image (see SOCIAL_SHARE_IMAGE_META in lib/seo/metadata.ts).
import type { ImageResponse } from "next/og";
import { SOCIAL_SHARE_IMAGE } from "@/content/share-images";
import { platformsShareImage } from "@/lib/og/share-image";

export const dynamic = "force-static";

export function GET(): ImageResponse {
  return platformsShareImage(SOCIAL_SHARE_IMAGE);
}
