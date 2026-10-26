import { TOOLS, type VendorId } from "./consent";

export interface Header {
  readonly key: string;
  readonly value: string;
}

/**
 * One place for every response header. 'unsafe-inline' for scripts stays because Next.js injects inline bootstrap
 * scripts and JSON-LD; move to nonces only if a third-party script is ever added. Vercel Web Analytics and Speed
 * Insights load from and post to /_vercel/* on this origin in production; only their development debug scripts come
 * from va.vercel-scripts.com. Google Tag Manager and its tools' origins are added only when a container is configured
 * (plan 12); the consent banner still keeps GTM from loading until a purpose is allowed. A tool added to the container
 * needs its origins here too, or the browser blocks it. Blog pictures come from the CMS's public media bucket (`mediaOrigin`).
 */
export function securityHeaders({ dev, tools = TOOLS, mediaOrigin }: { readonly dev: boolean; readonly tools?: readonly VendorId[]; readonly mediaOrigin?: string }): Header[] {
  const origins = tagOrigins(tools);
  const extra = (list: readonly string[]): string => list.map((origin) => ` ${origin}`).join("");
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}${extra(origins.script)}`,
    `style-src 'self' 'unsafe-inline'${extra(origins.style)}`,
    `img-src 'self' data: blob:${mediaOrigin === undefined ? "" : ` ${mediaOrigin}`}${extra(origins.img)}`,
    `font-src 'self'${extra(origins.font)}`,
    `connect-src 'self'${extra(origins.connect)}`,
    ...(origins.frame.length > 0 ? [`frame-src${extra(origins.frame)}`] : []),
    "frame-ancestors 'none'",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join("; ");
  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" },
  ];
}

interface TagOrigins {
  readonly script: readonly string[];
  readonly style: readonly string[];
  readonly img: readonly string[];
  readonly font: readonly string[];
  readonly connect: readonly string[];
  readonly frame: readonly string[];
}

const NONE: TagOrigins = { script: [], style: [], img: [], font: [], connect: [], frame: [] };

// Google's CSP guide (developers.google.com/tag-platform/security/guides/csp), with India's TLD for <TLD>. Tag
// Manager's Preview mode origins are included so the container can be debugged on the live site. Custom JavaScript
// variables would need 'unsafe-eval'; the container must not use them.
const GOOGLE_TLDS = ["https://www.google.com", "https://www.google.co.in"];
const TAG_MANAGER: TagOrigins = {
  script: ["https://www.googletagmanager.com", "https://tagmanager.google.com"],
  style: ["https://www.googletagmanager.com", "https://tagmanager.google.com", "https://fonts.googleapis.com"],
  img: ["https://www.googletagmanager.com", "https://ssl.gstatic.com", "https://www.gstatic.com"],
  font: ["https://fonts.gstatic.com", "data:"],
  connect: ["https://www.googletagmanager.com", "https://www.google.com"],
  frame: ["https://www.googletagmanager.com"],
};
const TOOL_ORIGINS: Readonly<Record<VendorId, TagOrigins>> = {
  ga4: {
    ...NONE,
    img: ["https://*.google-analytics.com", "https://*.g.doubleclick.net", ...GOOGLE_TLDS],
    connect: ["https://*.google-analytics.com", "https://*.analytics.google.com", "https://*.g.doubleclick.net", "https://pagead2.googlesyndication.com", ...GOOGLE_TLDS],
  },
  // Microsoft's Clarity CSP guide.
  clarity: { ...NONE, script: ["https://*.clarity.ms"], img: ["https://*.clarity.ms", "https://c.bing.com"], connect: ["https://*.clarity.ms", "https://c.bing.com"] },
  googleAds: {
    ...NONE,
    script: ["https://www.googleadservices.com", "https://www.google.com"],
    img: ["https://www.googleadservices.com", "https://googleads.g.doubleclick.net", "https://pagead2.googlesyndication.com", ...GOOGLE_TLDS],
    connect: ["https://www.googleadservices.com", "https://googleads.g.doubleclick.net", "https://pagead2.googlesyndication.com", "https://ad.doubleclick.net", ...GOOGLE_TLDS],
    frame: ["https://td.doubleclick.net"],
  },
  // Meta's pixel loads from connect.facebook.net and reports to www.facebook.com.
  metaPixel: { ...NONE, script: ["https://connect.facebook.net"], img: ["https://www.facebook.com"], connect: ["https://www.facebook.com", "https://connect.facebook.net"] },
};

function tagOrigins(tools: readonly VendorId[]): TagOrigins {
  if (tools.length === 0) return NONE;
  const used = [TAG_MANAGER, ...tools.map((tool) => TOOL_ORIGINS[tool])];
  const merge = (key: keyof TagOrigins): string[] => [...new Set(used.flatMap((set) => set[key]))];
  return { script: merge("script"), style: merge("style"), img: merge("img"), font: merge("font"), connect: merge("connect"), frame: merge("frame") };
}
