import { EMPTY_BASKET } from "@/lib/basket-store";
import { TOOLS } from "@/lib/consent";
import { signupHref } from "@/lib/signup";

// content/navigation.ts
export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/#work" },
  { label: "Contact", href: "/contact" },
];

// Mock footer order, with the plan's "Industries" link after "Our work".
export const FOOTER_NAV: readonly NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/#work" },
  { label: "Industries", href: "/industries" },
  { label: "About us", href: "/about" },
  { label: "Contact us", href: "/contact" },
];

export const COOKIE_SETTINGS_HREF = "/privacy#cookies";

export const LEGAL_NAV: readonly NavLink[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms and conditions", href: "/terms" },
  { label: "Refund and cancellation", href: "/refund" },
  { label: "Shipping and delivery", href: "/shipping" },
  // Only when a tag needs consent. Without JavaScript it opens the policy's Cookies section; ConsentBanner intercepts it.
  ...(TOOLS.length > 0 ? [{ label: "Cookie settings", href: COOKIE_SETTINGS_HREF }] : []),
];

export const PRIMARY_CTA: NavLink = { label: "Get my free website", href: signupHref(EMPTY_BASKET) };

export const PRICING_CTA: NavLink = { label: "View pricing", href: "/pricing" };
