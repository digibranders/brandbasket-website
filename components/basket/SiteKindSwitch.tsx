"use client";

import type { ReactElement } from "react";
import { SITE_KIND_COPY } from "@/content/home";
import { SITE_KINDS } from "@/lib/pricing";
import { setSiteKind, useSiteKind } from "./useSiteKind";

/** The B2B website / ecommerce store switch. It sets the page-wide choice, so every price on the page follows it (owner, 2026-11-27). */
export function SiteKindSwitch({ className = "" }: { readonly className?: string }): ReactElement {
  const kind = useSiteKind();
  return (
    <div role="radiogroup" aria-label="Type of website" className={`inline-flex rounded-full border border-line bg-sunken p-1 ${className}`}>
      {SITE_KINDS.map((k) => (
        <button
          key={k}
          type="button"
          role="radio"
          aria-checked={k === kind}
          onClick={() => setSiteKind(k)}
          className={`h-9 cursor-pointer rounded-full px-4 text-[14px] font-medium transition-colors max-[420px]:px-3 max-[420px]:text-[13px] ${k === kind ? "bg-surface text-ink shadow-[var(--shadow-offer)]" : "text-ink-2 hover:text-ink"}`}
        >
          {SITE_KIND_COPY[k].tab}
        </button>
      ))}
    </div>
  );
}
