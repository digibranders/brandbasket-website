// components/platform-home/service-meta.ts
import type { Icon } from "@phosphor-icons/react";
import { Browser, InstagramLogo, MegaphoneSimple } from "@phosphor-icons/react/dist/ssr";
import type { HomeServiceId } from "@/content/platform-home";

/** Each service's icon and colour. The colours are the plan tokens the pricing cards and the basket already use. */
export const SERVICE_META: Readonly<Record<HomeServiceId, { readonly icon: Icon; readonly tone: string }>> = {
  website: { icon: Browser, tone: "var(--c-site)" },
  social: { icon: InstagramLogo, tone: "var(--c-growth)" },
  ads: { icon: MegaphoneSimple, tone: "var(--c-growth-2)" },
};
