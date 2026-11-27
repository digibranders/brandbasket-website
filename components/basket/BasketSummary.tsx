"use client";
import { Check, Globe, Headset, InstagramLogo, Megaphone, Plus, X } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import Link from "next/link";
import { type CSSProperties, type ReactElement, useId, useState } from "react";
import { useCurrency } from "@/components/currency/CurrencyProvider";
import { Arrow, pillClasses } from "@/components/ui/ArrowButton";
import { BASKET_COPY, moneyCopy, offerNote, planCount } from "@/content/basket";
import { monitoringSlotLabel, slotLabel } from "@/content/basket-card";
import { trackAttrs } from "@/lib/analytics";
import { basket, monitoring } from "@/lib/basket-store";
import { type Currency, formatMoney } from "@/lib/currency";
import { basketPlans, isPlanPaused, MONITORING, monitoringPrice, monthlyTotal, PLAN_IDS, PLANS, type PlanId, planPrice, samePick } from "@/lib/pricing";
import { ComingSoonChip } from "../ui/ComingSoonChip";
import { signupHref } from "@/lib/signup";
import { PLAN_INK } from "./basket-view";
import { Roll } from "./Roll";
import { useBasket } from "./useBasket";
import { useMonitoring } from "./useMonitoring";
import { useSiteKind } from "./useSiteKind";

export const PLAN_ICON: Readonly<Record<PlanId, Icon>> = { website: Globe, social: InstagramLogo, ads: Megaphone };

interface BasketSummaryProps {
  /** Reported with the checkout click, e.g. "basket_wall" or "basket_popover". */
  readonly location: string;
  /** Shown as a close button in the header when the card can be dismissed on its own. */
  readonly onClose?: () => void;
}

/** One change to the basket, so the plan just added stamps in and the total rolls the right way. */
interface Change {
  readonly n: number;
  readonly added: PlanId | null;
  readonly dir: 1 | -1;
}

/**
 * The basket card (docs/design/nav-cart-options.html, Woven): what is in the basket on a three-part meter, the one offer
 * (monitoring with all three plans), every plan with add and remove, the monthly total (GST included) and the checkout button. The white core of a glass
 * tray; the tray (.bc-shell) belongs to whoever shows the card. Styles in wall.css. Its parts rise in turn whenever an
 * ancestor carries data-open="true".
 */
export function BasketSummary({ location, onClose }: BasketSummaryProps): ReactElement {
  const pick = useBasket();
  const withMonitoring = useMonitoring();
  const kind = useSiteKind();
  const currency = useCurrency();
  const titleId = useId();
  const [seen, setSeen] = useState(pick);
  const [change, setChange] = useState<Change>({ n: 0, added: null, dir: 1 });
  // Adjusting state while rendering is React's pattern for reacting to a changed value without an extra render pass.
  if (!samePick(pick, seen)) {
    const grew = basketPlans(pick).length > basketPlans(seen).length;
    setChange({ n: change.n + 1, added: PLAN_IDS.find((id) => pick[id] && !seen[id]) ?? null, dir: grew ? 1 : -1 });
    setSeen(pick);
  }
  const empty = basketPlans(pick).length === 0;
  return (
    <section aria-labelledby={titleId} className="bc-core">
      <div className="bc-head bc-rise" style={{ "--i": 0 } as CSSProperties}>
        <h2 id={titleId}>{BASKET_COPY.dockLabel}</h2>
        <span className="flex items-center gap-2.5">
          <span className="bc-count">{planCount(pick)}</span>
          {onClose ? (
            <button type="button" aria-label={BASKET_COPY.panelClose} onClick={onClose} className="grid size-9 cursor-pointer place-items-center rounded-full bg-surface/70 text-ink-2 transition-colors duration-300 hover:text-ink">
              <X aria-hidden="true" weight="bold" className="size-4" />
            </button>
          ) : null}
        </span>
      </div>
      <div aria-hidden="true" className="bc-meter bc-rise" style={{ "--i": 1 } as CSSProperties}>
        {PLAN_IDS.map((id) => <i key={id} className={pick[id] ? "is-on" : undefined} style={{ "--c": PLAN_INK[id] } as CSSProperties} />)}
      </div>
      <p className="bc-nudge bc-rise" style={{ "--i": 2 } as CSSProperties}>{offerNote(currency, withMonitoring)}</p>
      <ul className="bc-rows bc-rise" style={{ "--i": 3 } as CSSProperties}>
        {PLAN_IDS.map((id) => {
          const on = pick[id];
          const PlanIcon = PLAN_ICON[id];
          const stamp = on && change.added === id;
          return (
            <li key={id} className={`bc-row ${on ? "is-on" : ""}`} style={{ "--c": PLAN_INK[id] } as CSSProperties}>
              <span key={stamp ? `stamp${change.n}` : "still"} aria-hidden="true" data-row-icon={id} className={`bc-row-icon ${stamp ? "bc-stamp" : ""}`}>
                <PlanIcon weight="fill" className="size-[19px]" />
              </span>
              <div className="min-w-0">
                <b>{PLANS[id].name}</b>
                <small className="num">{formatMoney(planPrice(id, currency, kind), currency)} {BASKET_COPY.perMonth}</small>
              </div>
              {isPlanPaused(id) ? <ComingSoonChip /> : (
                <button
                  type="button"
                  aria-pressed={on}
                  aria-label={slotLabel(id, on)}
                  onClick={() => basket.set(id, !on)}
                  className="bc-toggle"
                >
                  {on ? <Check aria-hidden="true" weight="bold" className="size-4" /> : <Plus aria-hidden="true" weight="light" className="size-4" />}
                </button>
              )}
            </li>
          );
        })}
        <MonitoringRow added={withMonitoring} currency={currency} />
      </ul>
      <div className="bc-total bc-rise" style={{ "--i": 4 } as CSSProperties}>
        <div>
          <p aria-live="polite" aria-atomic="true" className="num"><Roll value={formatMoney(monthlyTotal(pick, currency, withMonitoring, kind), currency)} dir={change.dir} /></p>
          <small>{moneyCopy(currency).phoneBarCaption}</small>
        </div>
      </div>
      {empty ? (
        // Nothing to buy yet: the same button, switched off until a plan is picked.
        <button type="button" disabled style={{ "--i": 5 } as CSSProperties} className={`${pillClasses("md", "action")} bc-rise w-full cursor-not-allowed opacity-45`}>
          {BASKET_COPY.proceed}
          <Arrow size="md" />
        </button>
      ) : (
        <Link href={signupHref(pick, withMonitoring)} {...trackAttrs("cta_click", location)} style={{ "--i": 5 } as CSSProperties} className={`${pillClasses("md", "action")} bc-rise w-full`}>
          {BASKET_COPY.proceed}
          <Arrow size="md" />
        </Link>
      )}
    </section>
  );
}

/**
 * Dedicated Expert Monitoring under the plans: added or removed like a plan, at its own price.
 */
function MonitoringRow({ added, currency }: { readonly added: boolean; readonly currency: Currency }): ReactElement {
  const on = added;
  return (
    <li className={`bc-row ${on ? "is-on" : ""}`} style={{ "--c": "var(--ink)" } as CSSProperties}>
      <span aria-hidden="true" className="bc-row-icon"><Headset weight="fill" className="size-[19px]" /></span>
      <div className="min-w-0">
        <b>{MONITORING.name}</b>
        <small className="num">{`${formatMoney(monitoringPrice(currency), currency)} ${BASKET_COPY.perMonth}`}</small>
      </div>
      <button
        type="button"
        aria-pressed={on}
        aria-label={monitoringSlotLabel(on)}
        onClick={() => monitoring.set(!added)}
        className="bc-toggle"
      >
        {on ? <Check aria-hidden="true" weight="bold" className="size-4" /> : <Plus aria-hidden="true" weight="light" className="size-4" />}
      </button>
    </li>
  );
}
