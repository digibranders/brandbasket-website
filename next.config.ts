import type { NextConfig } from "next";
import { securityHeaders } from "./lib/security-headers";
import { isProductionSite } from "./lib/indexing";

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
      { source: "/:path*", headers: securityHeaders({ dev: process.env.NODE_ENV !== "production" }) },
      // Until launch is approved, every host is noindex (see isProductionSite).
      ...(isProductionSite() ? [] : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] }]),
      // The vercel.app copies stay out of search permanently, after launch too. Listed last so it wins on those hosts.
      { source: "/:path*", has: [{ type: "host" as const, value: ".*\\.vercel\\.app" }], headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
