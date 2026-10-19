"use client";
// components/analytics/ConversionTracking.tsx
import { track } from "@vercel/analytics";
import { useEffect } from "react";
import { clickEvent } from "@/lib/analytics";

/**
 * One document listener reports clicks on links marked with trackAttrs(), so server-rendered buttons stay server
 * components. Capture phase, so it runs before a client-side navigation replaces the page.
 */
export function ConversionTracking(): null {
  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[data-track]") : null;
      const conversion = link ? clickEvent(link.dataset, link.href) : null;
      if (conversion) track(conversion.name, conversion.properties);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
