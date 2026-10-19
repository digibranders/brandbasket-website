import { type AddonId, type AddonPick, basketPlans } from "@/lib/pricing";

/** Short names of the plans in the basket, e.g. "Website + Growth" (mock: #calc-names, #pbar-names). */
export function basketNames(pick: AddonPick): string {
  return basketPlans(pick).map((plan) => plan.short).join(" + ");
}

/** Background class for each add-on's colour mark (tokens --c-growth, --c-search). */
export const ADDON_COLOUR = {
  growth: "bg-[var(--c-growth)]",
  search: "bg-[var(--c-search)]",
} as const satisfies Readonly<Record<AddonId, string>>;
