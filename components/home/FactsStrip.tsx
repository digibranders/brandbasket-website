import type { ReactElement } from "react";
import { FACTS } from "@/content/home";
import { HOME_ICONS } from "./icons";

/** Four short facts under the hero (mock: ul.facts; its Material Symbols render filled). */
export function FactsStrip(): ReactElement {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-[clamp(18px,4vw,56px)]">
      <ul className="flex flex-wrap justify-between gap-x-7 gap-y-3.5 border-y border-line py-5">
        {FACTS.map((fact) => {
          const FactIcon = HOME_ICONS[fact.icon];
          return (
            <li key={fact.text} className="inline-flex items-center gap-2.5 font-display text-[19px] font-medium tracking-[-0.02em]">
              <FactIcon aria-hidden="true" weight="fill" className="size-[22px] text-rattan-text" />
              {fact.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
