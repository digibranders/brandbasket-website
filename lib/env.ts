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
