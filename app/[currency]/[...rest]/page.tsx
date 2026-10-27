// app/[currency]/[...rest]/page.tsx
import { notFound } from "next/navigation";

/**
 * Any address with no page of its own. proxy.ts puts every page request under /inr or /usd, so the 404 has to be raised here, inside
 * the layout, for the not-found screen to carry the nav and footer (an unmatched route would show the bare default 404).
 */
export default function UnknownPage(): never {
  notFound();
}
