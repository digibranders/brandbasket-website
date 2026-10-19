import { ADDONS, type AddonPick } from "./pricing";

/**
 * Where every "Get my free website" button goes. The plan list format must match what the rebranded platform reads
 * (open question D10); change it here only.
 */
export function signupHref(pick: AddonPick, base: string | undefined = process.env.NEXT_PUBLIC_SIGNUP_URL): string {
  const plan = ["website", ...ADDONS.filter((id) => pick[id])].join(",");
  if (!base) return `/contact?${new URLSearchParams({ plan }).toString()}#start`;
  const url = new URL("/login", base);
  url.searchParams.set("plan", plan);
  return url.toString();
}
