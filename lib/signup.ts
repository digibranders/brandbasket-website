import { type BasketPick, PLAN_IDS } from "./pricing";
import { siteConfig } from "./site-config";

/**
 * Where every "Get my free website" button goes: the app's sign-in, with the picked plans. The plan list format must match
 * what brandbasket-platform reads from `?plan=` (docs/plans/16, Task P2.4); change it here only.
 */
export function signupHref(pick: BasketPick): string {
  const url = new URL("/login", siteConfig.appUrl);
  url.searchParams.set("plan", PLAN_IDS.filter((id) => pick[id]).join(","));
  return url.toString();
}
