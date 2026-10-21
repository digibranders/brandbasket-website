import { type BasketPick, basketPlans, type PlanId } from "@/lib/pricing";

/** Short names of the plans in the basket, e.g. "Website + Social" (mock: #calc-names, #pbar-names). */
export function basketNames(pick: BasketPick): string {
  return basketPlans(pick).map((plan) => plan.short).join(" + ");
}

/** Background class for each plan's colour mark (tokens --c-site, --c-growth, --c-search). */
export const PLAN_COLOUR = {
  website: "bg-[var(--c-site)]",
  growth: "bg-[var(--c-growth)]",
  search: "bg-[var(--c-search)]",
} as const satisfies Readonly<Record<PlanId, string>>;
