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
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders({ dev: process.env.NODE_ENV !== "production", mediaOrigin: BLOG_MEDIA_ORIGIN }) },
      // A preview is private: no search engine may keep it, whatever launch state the site is in.
      { source: "/blog/preview/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // Until launch is approved, every host is noindex (see isProductionSite).
      ...(isProductionSite() ? [] : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }]),
      // The vercel.app copies stay out of search permanently, after launch too. Listed last so it wins on those hosts.
      { source: "/:path*", has: [{ type: "host" as const, value: ".*\\.vercel\\.app" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
