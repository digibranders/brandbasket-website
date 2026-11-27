"use client";

import type { ReactElement } from "react";
import { useSiteKind } from "@/components/basket/useSiteKind";
import { startFactsFor } from "@/content/start";
import { START_ICONS } from "./icons";

/** The four basics under the start hero; the launch time follows the kind of website chosen in the price card. */
export function StartFacts(): ReactElement {
  return (
    <section aria-label="The basics" className="border-y border-line bg-surface">
      <ul className="in-wrap grid grid-cols-2 gap-x-4 gap-y-[18px] py-[22px] min-[760px]:grid-cols-4">
        {startFactsFor(useSiteKind()).map((fact) => {
          const Icon = START_ICONS[fact.icon];
          return (
            <li key={fact.text} className="flex items-center gap-3 font-display text-base font-medium leading-tight tracking-[-0.015em]">
              <span aria-hidden="true" className="grid size-[42px] flex-none place-items-center rounded-full bg-rattan-wash text-rattan-ink"><Icon className="size-[22px]" /></span>
              {fact.text}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
