import { type BasketPick, PLAN_IDS } from "./pricing";
import { siteConfig } from "./site-config";
import { START_PARAM } from "./start-attribution";

/** The app's sign-in with no plan in the address, which opens the Sign in view (a plan opens Create account instead). */
export function loginHref(): string {
  return new URL("/login", siteConfig.appUrl).toString();
}

/**
 * Where every "Start my plan" button goes: the app's sign-in, with the picked plans and, when it was added, Dedicated
 * Expert Monitoring. The list format and ids must match what brandbasket-platform reads from `?plan=`
 * (apps/customer/src/features/entry/rules/account-entry.ts); change it here only.
 */
export function signupHref(pick: BasketPick, monitoring: boolean): string {
  const url = new URL("/login", siteConfig.appUrl);
  const ids: string[] = PLAN_IDS.filter((id) => pick[id]);
  if (monitoring) ids.push(MONITORING_LINK_ID);
  url.searchParams.set("plan", ids.join(","));
  return url.toString();
}

/** Monitoring's id in the plan list. */
const MONITORING_LINK_ID = "monitoring";

/**
 * Where the ad landing page's "Continue to payment" goes: the Managed Website sign-up, opening already filled in from the
 * sealed details in `token` (lib/start-token.ts). With no token (no shared secret set, as in local work) it is the plain sign-up.
 */
export function startHref(token: string | null): string {
  const url = new URL(signupHref({ website: true, social: false, ads: false }, false));
  if (token !== null) url.searchParams.set(START_PARAM, token);
  return url.toString();
}
