import { type BasketPick, PLAN_IDS } from "./pricing";
import { siteConfig } from "./site-config";
import { START_PARAM } from "./start-attribution";

/** The app's sign-in with no plan in the address, which opens the Sign in view (a plan opens Create account instead). */
export function loginHref(): string {
  return new URL("/login", siteConfig.appUrl).toString();
}

/**
 * Where every "Start my plan" button goes: the app's sign-in, with the picked plans. The plan list format must match
 * what brandbasket-platform reads from `?plan=` (docs/plans/16, Task P2.4); change it here only.
 */
export function signupHref(pick: BasketPick): string {
  const url = new URL("/login", siteConfig.appUrl);
  url.searchParams.set("plan", PLAN_IDS.filter((id) => pick[id]).join(","));
  return url.toString();
}

/**
 * Where the ad landing page's "Continue to payment" goes: the Managed Website sign-up, opening already filled in from the
 * sealed details in `token` (lib/start-token.ts). With no token (no shared secret set, as in local work) it is the plain sign-up.
 */
export function startHref(token: string | null): string {
  const url = new URL(signupHref({ website: true, growth: false, search: false }));
  if (token !== null) url.searchParams.set(START_PARAM, token);
  return url.toString();
}
