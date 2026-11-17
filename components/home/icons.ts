import type { Icon } from "@phosphor-icons/react";
import { CalendarCheck, ChartBar, CloudCheck, CurrencyDollar, CurrencyInr, DeviceMobile, FileText, Headset, LockKey, LockOpen, Megaphone, PencilSimple, PencilSimpleLine, Phone, Prohibit, RocketLaunch, Scroll, ShareNetwork, ShieldCheck, ThumbsUp, Wallet, Wrench } from "@phosphor-icons/react/dist/ssr";
import type { HomeIconKey } from "@/content/home";

/** Phosphor icons for the keys in content/home.ts (they replace the mock's Material Symbols). */
export const HOME_ICONS: Readonly<Record<HomeIconKey, Icon>> = {
  CurrencyInr, CurrencyDollar, RocketLaunch, Wrench, FileText, DeviceMobile, Phone, Prohibit, PencilSimpleLine, Scroll, CloudCheck, ShieldCheck, LockKey, Headset, PencilSimple, ChartBar, LockOpen, CalendarCheck, ShareNetwork, ThumbsUp, Megaphone, Wallet,
};
