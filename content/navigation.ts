import { EMPTY_BASKET } from "@/lib/basket-store";
import { signupHref } from "@/lib/signup";

// content/navigation.ts
export interface NavLink {
  readonly label: string;
  readonly href: string;
}

export const PRIMARY_NAV: readonly NavLink[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/#work" },
  { label: "Industries", href: "/#industries" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/contact" },
];

// Mock footer order. "About us" and "Industries" return when /about and /industries exist (owner, Phase 7).
export const FOOTER_NAV: readonly NavLink[] = [
  { label: "Home", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Our work", href: "/#work" },
  { label: "Contact us", href: "/contact" },
];

export const LEGAL_NAV: readonly NavLink[] = [
  { label: "Privacy policy", href: "/privacy" },
  { label: "Terms and conditions", href: "/terms" },
  { label: "Refund and cancellation", href: "/refund" },
  { label: "Shipping and delivery", href: "/shipping" },
];

export const PRIMARY_CTA: NavLink = { label: "Get my free website", href: signupHref(EMPTY_BASKET) };
