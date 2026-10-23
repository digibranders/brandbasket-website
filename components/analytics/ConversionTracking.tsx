"use client";
// components/analytics/ConversionTracking.tsx
import { track } from "@vercel/analytics";
import { useEffect } from "react";
import { pushConversion } from "@/components/consent/tags";
import { clickEvent } from "@/lib/analytics";

/**
 * One document listener reports clicks on links and buttons marked with trackAttrs(), so server-rendered buttons stay server
 * components. Capture phase, so it runs before a client-side navigation replaces the page.
 */
export function ConversionTracking(): null {
  useEffect(() => {
    const onClick = (event: MouseEvent): void => {
      const marked = event.target instanceof Element ? event.target.closest<HTMLElement>("a[data-track], button[data-track]") : null;
      const conversion = marked ? clickEvent(marked.dataset, marked instanceof HTMLAnchorElement ? marked.href : "") : null;
      if (!conversion) return;
      track(conversion.name, conversion.properties);
      pushConversion(conversion);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);
  return null;
}
