"use client";
import { useSyncExternalStore } from "react";
import { ecommerce, siteKindOf } from "@/lib/basket-store";
import type { SiteKind } from "@/lib/pricing";

/** The kind of website the visitor chose (B2B or ecommerce), shared by every price on the page. B2B on the server and the first render. */
export function useSiteKind(): SiteKind {
  return siteKindOf(useSyncExternalStore(ecommerce.subscribe, ecommerce.get, () => false));
}

export function setSiteKind(kind: SiteKind): void {
  ecommerce.set(kind === "ecommerce");
}
