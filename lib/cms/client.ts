// lib/cms/client.ts: one way to read the CMS (plan 22, section 8). Sends the bearer token, caches under the tag "blog"
// for an hour (the CMS purges it sooner on every change), retries network errors and 5xx, and checks the JSON with Zod.
// It returns "not found" only when the CMS itself answered 404 (or 410); every other failure throws.
import type { ZodType } from "zod";
import { cmsEnv, type CmsEnv } from "@/lib/env";

/** The cache tag every CMS read carries; app/api/revalidate purges it. */
export const BLOG_TAG = "blog";
const REVALIDATE_SECONDS = 3600;
const ATTEMPTS = 3;
const TIMEOUT_MS = 8000;
const RETRY_DELAY_MS = 250;

export class CmsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CmsError";
  }
}

export type CmsResult<T> = { readonly ok: true; readonly data: T } | { readonly ok: false; readonly status: 404 | 410 };

export interface CmsFetchOptions {
  /** Preview reads are never cached or tagged. */
  readonly fresh?: boolean;
  /** For tests. */
  readonly env?: CmsEnv;
  readonly fetcher?: typeof fetch;
  readonly sleep?: (ms: number) => Promise<void>;
}

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function cmsGet<T>(path: string, schema: ZodType<T>, options: CmsFetchOptions = {}): Promise<CmsResult<T>> {
  const { url, token } = options.env ?? cmsEnv();
  const fetcher = options.fetcher ?? fetch;
  const sleep = options.sleep ?? wait;
  const cache = options.fresh === true ? { cache: "no-store" as const } : { next: { tags: [BLOG_TAG], revalidate: REVALIDATE_SECONDS } };
  let failure = "no attempt was made";
  for (let attempt = 1; attempt <= ATTEMPTS; attempt += 1) {
    if (attempt > 1) await sleep(RETRY_DELAY_MS * (attempt - 1));
    let response: Response;
    try {
      response = await fetcher(`${url}${path}`, { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" }, signal: AbortSignal.timeout(TIMEOUT_MS), ...cache });
    } catch (error) {
      failure = error instanceof Error ? error.message : String(error);
      continue;
    }
    if (response.status === 404 || response.status === 410) return { ok: false, status: response.status };
    if (response.status >= 500) {
      failure = `HTTP ${response.status}`;
      continue;
    }
    // 401 or 400 means this site is misconfigured: retrying cannot help.
    if (!response.ok) throw new CmsError(`The CMS refused ${path}: HTTP ${response.status}.`);
    const parsed = schema.safeParse(await response.json());
    if (!parsed.success) throw new CmsError(`The CMS answered ${path} in a shape this site does not know: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}.`);
    return { ok: true, data: parsed.data };
  }
  throw new CmsError(`The CMS could not be reached for ${path} after ${ATTEMPTS} tries: ${failure}.`);
}
