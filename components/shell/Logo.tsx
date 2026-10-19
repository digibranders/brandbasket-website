// components/shell/Logo.tsx
import Image from "next/image";
import type { ReactElement } from "react";

/** The approved Basket Pin lockup. 32 px high keeps the full mark (the guide's minimum); the SVG is outlined, so no font is needed. */
export function Logo({ priority = false }: { readonly priority?: boolean }): ReactElement {
  return <Image src="/brand/brandbasket-lockup-horizontal-light.svg" alt="Brandbasket" width={182} height={32} priority={priority} className="h-8 w-auto" />;
}
