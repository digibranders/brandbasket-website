"use client";
// components/currency/usePagePath.ts
import { usePathname } from "next/navigation";
import { visiblePath } from "@/lib/currency";

/** usePathname, as the address the visitor sees: without the /inr or /usd segment the page is prebuilt under (see visiblePath). */
export function usePagePath(): string {
  return visiblePath(usePathname());
}
