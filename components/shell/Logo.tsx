// components/shell/Logo.tsx
import Image from "next/image";
import type { ReactElement } from "react";

/** The Soft bB horizontal logo for light backgrounds (brand/web-assets). 32 px high keeps the mark clear; the SVG is outlined, so no font is needed. */
export function Logo({ priority = false }: { readonly priority?: boolean }): ReactElement {
  return <Image src="/brand/brandbasket-logo-horizontal-light.svg" alt="Brandbasket" width={190} height={32} priority={priority} className="h-8 w-auto" />;
}
