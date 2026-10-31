import type { Icon } from "@phosphor-icons/react";
import { Browser, ChartBar, CreditCard, CurrencyDollar, CurrencyInr, Devices, FileText, Hammer, LockOpen, MagnifyingGlass, MapPin, PencilSimpleLine, PhoneCall, Prohibit, Pulse, Receipt, RocketLaunch, ShieldCheck, WhatsappLogo, Wrench } from "@phosphor-icons/react/dist/ssr";
import type { StartIconKey } from "@/content/start";

/** Phosphor icons for the keys in content/start.ts. */
export const START_ICONS: Readonly<Record<StartIconKey, Icon>> = {
  CurrencyInr, CurrencyDollar, RocketLaunch, FileText, LockOpen, Browser, MagnifyingGlass, Devices, ShieldCheck, Prohibit, Pulse, WhatsappLogo, MapPin, PhoneCall, PencilSimpleLine, ChartBar, Wrench, CreditCard, Hammer, Receipt,
};
