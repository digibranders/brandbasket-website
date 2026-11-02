// proxy.ts
import { NextResponse, type NextRequest, userAgent } from "next/server";
import { CURRENCY_COOKIE, CURRENCY_COOKIE_MAX_AGE_SECONDS, type Currency, currencyForCountry, currencyFromSegment, currencySegment, DEFAULT_CURRENCY, isCurrency } from "@/lib/currency";

/**
 * Picks the price currency for a page request and serves the page's `/inr` or `/usd` copy (app/[currency]) at the plain URL, so
 * the address never shows it (owner, 2026-10-27). In order: the visitor's own choice (the footer switch, kept in a cookie), then the country
 * Vercel puts on the request, then rupees. Search engines and other bots always get rupees, so what is indexed and quoted is the
 * rupee page. Pages are prebuilt per currency, so there is no flash of the wrong price.
 */
export function currencyFor(request: NextRequest): Currency {
  if (userAgent(request).isBot) return DEFAULT_CURRENCY;
  const chosen = request.cookies.get(CURRENCY_COOKIE)?.value;
  if (isCurrency(chosen)) return chosen;
  return currencyForCountry(request.headers.get("x-vercel-ip-country"));
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname, search } = request.nextUrl;
  const chosen = request.nextUrl.searchParams.get("currency")?.toUpperCase();
  if (isCurrency(chosen)) {
    // The footer switch: keep the visitor's choice in a cookie and come back to the same page without the query.
    const back = request.nextUrl.clone();
    back.searchParams.delete("currency");
    const response = NextResponse.redirect(back, 307);
    response.cookies.set(CURRENCY_COOKIE, chosen, { path: "/", maxAge: CURRENCY_COOKIE_MAX_AGE_SECONDS, sameSite: "lax", secure: back.protocol === "https:" });
    return response;
  }
  const [, first = "", ...rest] = pathname.split("/");
  if (currencyFromSegment(first) !== null) {
    // The currency copies are not addresses of their own: /usd/pricing is only ever served as /pricing.
    const url = request.nextUrl.clone();
    url.pathname = `/${rest.join("/")}`;
    url.search = search;
    return NextResponse.redirect(url, 308);
  }
  const url = request.nextUrl.clone();
  url.pathname = `/${currencySegment(currencyFor(request))}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

/** Pages only: the API, built assets, files with an extension (robots.txt, sitemap.xml, llms.txt, icons), the feed and the share image carry no price. CMS preview tokens contain a dot, so that one path is let through the extension rule. */
export const config = {
  matcher: ["/((?!api/|_next/|opengraph-image|blog/feed\\.xml|(?!blog/preview/).*\\..*).*)"],
};
