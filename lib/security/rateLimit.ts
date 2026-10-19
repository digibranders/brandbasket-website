/**
 * A small fixed-window rate limiter, held in memory (vendored from fynix-digital-v2).
 *
 * On Vercel each serverless instance has its own memory, so this is a soft limit: a burst spread over several
 * instances gets through. The honeypot and the signed form token are the real filter; this only slows one caller
 * hammering one instance.
 */

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

/** Stop the map growing without bound on a long-running process. */
function sweep(now: number): void {
  if (windows.size < 5_000) return;
  for (const [key, window] of windows) {
    if (window.resetAt <= now) windows.delete(key);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the window resets. Only meaningful when blocked. */
  retryAfter: number;
};

/**
 * Count one hit against `key`. Allows up to `limit` within `windowMs`.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): RateLimitResult {
  sweep(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }
  return { allowed: true, retryAfter: 0 };
}

/**
 * Best-effort client address.
 *
 * `x-forwarded-for` is a client-supplied header and can be spoofed, so this
 * cannot be trusted for anything that matters. It is here to separate ordinary
 * callers from each other, which is all a speed bump needs. The LEFTMOST entry
 * is the original client; a proxy appends its own.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Testing seam: drop all counters. */
export function resetRateLimits(): void {
  windows.clear();
}
