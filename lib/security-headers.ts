export interface Header {
  readonly key: string;
  readonly value: string;
}

/**
 * One place for every response header. 'unsafe-inline' for scripts stays because Next.js injects inline bootstrap
 * scripts and JSON-LD; move to nonces only if a third-party script is ever added. Vercel Web Analytics and Speed
 * Insights load from and post to /_vercel/* on this origin in production; only their development debug scripts come
 * from va.vercel-scripts.com.
 */
export function securityHeaders({ dev }: { readonly dev: boolean }): Header[] {
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
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
