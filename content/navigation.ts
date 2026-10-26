import { DEFAULT_BASKET } from "@/lib/basket-store";
import { TOOLS } from "@/lib/consent";
import { loginHref, signupHref } from "@/lib/signup";

// content/navigation.ts
export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/#work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// Mock footer order.
export const FOOTER_NAV: readonly NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/#work" },
  { label: "Blog", href: "/blog" },
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

export const PRIMARY_CTA: NavLink = { label: "Start my plan", href: signupHref(DEFAULT_BASKET) };

/** The nav and menu link for returning customers. It goes to the app's sign-in with no plan chosen. */
export const LOGIN_LINK: NavLink = { label: "Log in", href: loginHref() };

export const PRICING_CTA: NavLink = { label: "View pricing", href: "/pricing" };
