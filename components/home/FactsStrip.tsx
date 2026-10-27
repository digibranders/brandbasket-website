import type { ReactElement } from "react";
import { factsFor } from "@/content/home";
import type { Currency } from "@/lib/currency";
import { HOME_ICONS } from "./icons";

/**
 * Four short facts under the hero, set straight on the page with no box: a rattan icon over each line, in columns that
 * line up with the hero text. Two across on a phone, four across from 900px.
 */
export function FactsStrip({ currency }: { readonly currency: Currency }): ReactElement {
  return (
    <div className="in-wrap pb-[clamp(48px,5.5vw,80px)] pt-3">
      <ul className="grid grid-cols-2 gap-x-6 gap-y-9 min-[900px]:grid-cols-4">
        {factsFor(currency).map((fact) => {
          const FactIcon = HOME_ICONS[fact.icon];
          return (
            <li key={fact.text} className="flex flex-col items-start gap-3.5">
              <FactIcon aria-hidden="true" weight="fill" className="size-[clamp(30px,3vw,38px)] text-rattan-text" />
              <span className="font-display text-[clamp(18px,1.9vw,25px)] font-medium leading-[1.15] tracking-[-0.03em]">{fact.text}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
