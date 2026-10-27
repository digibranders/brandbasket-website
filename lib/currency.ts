// lib/currency.ts
/**
 * The two currencies the site prints (owner, 2026-10-27): rupees with GST inside, dollars with no tax mentioned. A visitor
 * in India (or anywhere we cannot place, or a search engine) sees rupees; everyone else sees dollars, and a footer switch
 * lets them choose. proxy.ts picks the currency and rewrites each page to its `/inr` or `/usd` copy under app/[currency].
 */
export const CURRENCIES = ["INR", "USD"] as const;
export type Currency = (typeof CURRENCIES)[number];

export const DEFAULT_CURRENCY: Currency = "INR";

/** The visitor's own choice, set by the footer switch. It wins over the country. */
export const CURRENCY_COOKIE = "bb_currency";
export const CURRENCY_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function isCurrency(value: unknown): value is Currency {
  return typeof value === "string" && (CURRENCIES as readonly string[]).includes(value);
}

/** India, or a country we could not read, is rupees; every other country is dollars (the platform bills the same way). */
export function currencyForCountry(country: string | null | undefined): Currency {
  const code = country?.trim().toUpperCase();
  return code === undefined || code === "" || code === "IN" ? "INR" : "USD";
}

/** The folder name a currency has under app/[currency]: "inr" or "usd". */
export function currencySegment(currency: Currency): string {
  return currency.toLowerCase();
}

/** The currency a route segment names, or null when it is not one. */
export function currencyFromSegment(segment: string | undefined): Currency | null {
  const upper = segment?.toUpperCase();
  return isCurrency(upper) ? upper : null;
}

const WHOLE: Readonly<Record<Currency, Intl.NumberFormat>> = {
  INR: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }),
};
const WITH_MINOR: Readonly<Record<Currency, Intl.NumberFormat>> = {
  INR: new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 2, maximumFractionDigits: 2 }),
  USD: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2, maximumFractionDigits: 2 }),
};

/** "₹2,999" or "$65". Whole amounts print without decimals; anything else prints exactly two (the site prints none today). */
export function formatMoney(amount: number, currency: Currency): string {
  return (Number.isInteger(amount) ? WHOLE : WITH_MINOR)[currency].format(amount);
}

/** The currency of the `[currency]` route segment a page or layout is rendered under. The layout has already refused any other value. */
export async function currencyParam(params: Promise<{ readonly currency: string }>): Promise<Currency> {
  const currency = currencyFromSegment((await params).currency);
  if (currency === null) throw new RangeError("This page must be rendered under /inr or /usd.");
  return currency;
}

/**
 * The address a visitor sees, from the path a page is rendered at. A prebuilt page is rendered at /inr/pricing or /usd/pricing,
 * and that is the path the server's usePathname reports while the browser's is /pricing, so anything that reads the path to decide
 * what to print must drop the currency segment first or the page will not hydrate.
 */
export function visiblePath(pathname: string): string {
  const [, first = "", ...rest] = pathname.split("/");
  return currencyFromSegment(first) === null ? pathname : `/${rest.join("/")}`;
}
