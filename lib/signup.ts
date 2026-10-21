import { type BasketPick, PLAN_IDS } from "./pricing";

/**
 * Where every "Get my free website" button goes. The plan list format must match what brandbasket-platform reads
 * from `?plan=` (docs/plans/16, Task P2.4); change it here only.
 */
export function signupHref(pick: BasketPick, base: string | undefined = process.env.NEXT_PUBLIC_SIGNUP_URL): string {
  const plan = PLAN_IDS.filter((id) => pick[id]).join(",");
  if (!base) return `/contact?${new URLSearchParams({ plan }).toString()}#start`;
  const url = new URL("/login", base);
  url.searchParams.set("plan", plan);
  return url.toString();
}
