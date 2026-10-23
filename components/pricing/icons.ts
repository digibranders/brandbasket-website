import type { Icon } from "@phosphor-icons/react";
import { CalendarCheck, Clock, SignOut, Wallet } from "@phosphor-icons/react/dist/ssr";
import type { PricingIconKey } from "@/content/pricing";

/** Phosphor icons for the keys in content/pricing.ts (they replace the mock's Material Symbols). */
export const PRICING_ICONS: Readonly<Record<PricingIconKey, Icon>> = { CalendarCheck, Clock, SignOut, Wallet };
