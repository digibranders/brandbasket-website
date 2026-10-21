"use client";
import { Tag } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { offerNote } from "@/content/basket";
import { useBasket } from "./useBasket";

/**
 * The live offer strip under the plan rows (mock: .offer-note). `rounded` is the pricing hero's card (mock:
 * .phc-act .offer-note); the default is the homepage panel's full-width band.
 */
export function OfferNote({ rounded = false }: { readonly rounded?: boolean }): ReactElement {
  return (
    <p className={`flex items-start gap-2.5 bg-rattan-wash text-[15px] font-medium text-rattan-ink ${rounded ? "rounded-2xl px-4 py-3" : "border-t border-line px-[26px] py-3.5"}`}>
      <Tag weight="fill" aria-hidden="true" className="mt-px size-5 flex-none" />
      <span>{offerNote(useBasket())}</span>
    </p>
  );
}
