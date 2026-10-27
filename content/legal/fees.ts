// content/legal/fees.ts
import { formatMoney } from "@/lib/currency";
import { PACKAGES } from "@/lib/pricing";

const offers = PACKAGES.map((p) => `${p.name} ${p.percent}% off`).join(", ");
const credits = PACKAGES.filter((p) => p.adCredit.INR > 0).map((p) => `${p.name} ${formatMoney(p.adCredit.INR, "INR")}`).join(", ");

/** Owner decisions 2026-10-21: the platform checkout bills exactly this. Shared by the terms and /llms.txt. */
export const PACKAGE_TERMS =
  `Two or more plans on one subscription are billed at a package price, a percentage off the plans' combined listed prices: ${offers}. ` +
  "The package price applies from the bill after a plan is added. If a plan is dropped from a package, the plans you keep are billed at their listed prices from your next bill, and package prices and ad credit no longer apply to your account.";

export const AD_CREDIT_TERMS =
  `When a package is taken in full at your first purchase, we add ad credit to your ad account every month the package runs: ${credits}. ` +
  "We spend it on your ads, on top of the budget you set. Credit not spent in a month does not carry over, has no cash value and is not shown on your invoice. A plan added later does not add ad credit.";
