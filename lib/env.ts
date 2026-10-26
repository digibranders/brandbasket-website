import { z } from "zod";

const serverSchema = z.object({
  BREVO_API_KEY: z.string().min(1, "BREVO_API_KEY is required"),
  FORM_SECRET: z.string().min(32, "FORM_SECRET must be at least 32 characters"),
  CONTACT_INBOX: z.email(),
  MAIL_SENDER: z.email(),
});

export type ServerEnv = z.infer<typeof serverSchema>;

/** Throws one readable error naming every bad variable. Call it inside server code paths only. */
export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverSchema.safeParse(source);
  if (!result.success) {
    const names = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid server environment. ${names}`);
  }
  return result.data;
}

let cached: ServerEnv | undefined;
export function serverEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}

const cmsSchema = z.object({
  CMS_URL: z.url("CMS_URL must be the CMS address, such as https://cms.brandbasket.in"),
  CMS_SITE_TOKEN: z.string().min(32, "CMS_SITE_TOKEN must be at least 32 characters"),
});

export interface CmsEnv {
  readonly url: string;
  readonly token: string;
}

/** Where the blog's content comes from. Read only when a blog page renders, so the rest of the site never needs it. */
export function parseCmsEnv(source: Record<string, string | undefined>): CmsEnv {
  const result = cmsSchema.safeParse(source);
  if (!result.success) {
    const names = result.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid CMS environment. ${names}`);
  }
  return { url: result.data.CMS_URL.replace(/\/+$/, ""), token: result.data.CMS_SITE_TOKEN };
}

export const cmsEnv = (): CmsEnv => parseCmsEnv(process.env);

const revalidateSchema = z.string().min(32, "REVALIDATE_SECRET must be at least 32 characters");

/** The secret the CMS sends to /api/revalidate. */
export function parseRevalidateSecret(source: Record<string, string | undefined>): string {
  const result = revalidateSchema.safeParse(source.REVALIDATE_SECRET);
  if (!result.success) throw new Error(`Invalid environment. ${result.error.issues.map((issue) => issue.message).join("; ")}`);
  return result.data;
}
