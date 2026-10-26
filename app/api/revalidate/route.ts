// app/api/revalidate/route.ts: the CMS calls this after a change, and every cached blog page becomes stale. Only the
// "blog" tag can be purged, so a leaked secret cannot be used to flush anything else.
import { revalidateTag } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { BLOG_TAG } from "@/lib/cms/client";
import { parseRevalidateSecret } from "@/lib/env";

const body = z.object({ tags: z.array(z.literal(BLOG_TAG)).min(1) });

function authorized(header: string | null, secret: string): boolean {
  const given = Buffer.from(header?.startsWith("Bearer ") === true ? header.slice("Bearer ".length) : "");
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: Request): Promise<Response> {
  if (!authorized(request.headers.get("authorization"), parseRevalidateSecret(process.env))) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: `Only the tag "${BLOG_TAG}" can be purged.` }, { status: 400 });
  // "max": visitors keep getting the old page while the new one is built, so a purge never makes a page slow.
  revalidateTag(BLOG_TAG, "max");
  return Response.json({ revalidated: [BLOG_TAG] });
}
