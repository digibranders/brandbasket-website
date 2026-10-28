// lib/oyechats.ts

const BOT_KEY_ENV = "NEXT_PUBLIC_OYECHATS_BOT_KEY";

/** Throws naming the variable when the key is malformed, so a typo fails the build instead of loading nothing. */
export function parseBotKey(source: Readonly<Record<string, string | undefined>>): string | null {
  const value = source[BOT_KEY_ENV]?.trim();
  if (!value) return null;
  if (!/^bot-[A-Za-z0-9_-]+$/.test(value)) throw new Error(`${BOT_KEY_ENV} is not a valid OyeChats bot key: "${value}"`);
  return value;
}

// A literal process.env read, so Next.js inlines it into the client bundle.
/** The OyeChats bot behind the chat on /contact. Null: no chat card, and no OyeChats address in the security policy. */
export const OYECHATS_BOT_KEY: string | null = parseBotKey({ [BOT_KEY_ENV]: process.env.NEXT_PUBLIC_OYECHATS_BOT_KEY });

/** Where the chat messages go. The page talks to this API itself: OyeChats' own floating widget cannot sit inside a page. */
export const OYECHATS_API_URL = "https://api.oyechats.com";

/** OyeChats' website, linked from the logo in the chat footer. */
export const OYECHATS_SITE_URL = "https://www.oyechats.com";

/** The only OyeChats address the browser may connect to (lib/security-headers.ts). */
export const OYECHATS_ORIGINS = { connect: [OYECHATS_API_URL] } as const;
