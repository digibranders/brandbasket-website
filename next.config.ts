import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security-headers";
import { isProductionSite } from "./lib/indexing";

/** Where blog pictures are served from: the CMS's public media bucket. Set BLOG_MEDIA_ORIGIN to point a preview build elsewhere. */
const BLOG_MEDIA_ORIGIN = process.env.BLOG_MEDIA_ORIGIN ?? "https://media.brandbasket.in";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // The ad landing page first went live at /start; anything still pointing there lands on its new address with its query string.
  async redirects() {
    return [{ source: "/start", destination: "/website-landing-page", permanent: false }];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders({ dev: process.env.NODE_ENV !== "production", mediaOrigin: BLOG_MEDIA_ORIGIN }) },
      // The cover picture is the blog's largest paint and lives on another origin; opening that connection early saves about 0.3 s.
      { source: "/blog/:path*", headers: [{ key: "Link", value: `<${BLOG_MEDIA_ORIGIN}>; rel=preconnect` }] },
      // A preview is private: no search engine may keep it, whatever launch state the site is in.
      { source: "/blog/preview/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // Until launch is approved, every host is noindex (see isProductionSite).
      ...(isProductionSite() ? [] : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }]),
      // The ad landing page is for ad clicks only: never indexed, whatever launch state the site is in (its links may still be followed). Its robots.txt entry stays open so ad reviewers (AdsBot) can still load it and crawlers can read this header.
      { source: "/website-landing-page", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
      // The vercel.app copies stay out of search permanently, after launch too. Listed last so it wins on those hosts.
      { source: "/:path*", has: [{ type: "host" as const, value: ".*\\.vercel\\.app" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
