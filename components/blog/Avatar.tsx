// components/blog/Avatar.tsx: an author's photo, or their initials in a rattan circle.
import type { ReactElement } from "react";
import type { Image } from "@/lib/cms/schema";
import { initials } from "@/lib/blog/format";

const SIZES = { sm: "size-9 text-[13px]", md: "size-16 text-xl", lg: "size-24 text-[30px]" } as const;

export function Avatar({ name, photo, size = "sm" }: { readonly name: string; readonly photo?: Image | null; readonly size?: keyof typeof SIZES }): ReactElement {
  const box = `grid flex-none place-items-center overflow-hidden rounded-full ${SIZES[size]}`;
  if (photo != null) {
    // eslint-disable-next-line @next/next/no-img-element -- the CMS already made the sizes
    return <img src={photo.src} srcSet={photo.srcSet} sizes="96px" width={photo.width} height={photo.height} alt="" className={`${box} object-cover`} />;
  }
  return <span aria-hidden="true" className={`${box} bg-rattan-wash font-display font-bold text-rattan-ink`}>{initials(name)}</span>;
}
