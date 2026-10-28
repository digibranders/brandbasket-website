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
/** The OyeChats bot for this site's contact page. Null: no chat widget, and no OyeChats origin in the security policy. */
export const OYECHATS_BOT_KEY: string | null = parseBotKey({ [BOT_KEY_ENV]: process.env.NEXT_PUBLIC_OYECHATS_BOT_KEY });

/** The widget script, and the only OyeChats address the browser may talk to besides its API. */
export const OYECHATS_SCRIPT_SRC = "https://cdn.oyechats.com/oyechats-widget.js";

/** Origins the widget loads from and reports to (its loader, styles, chat API and live-chat socket). */
export const OYECHATS_ORIGINS = {
  script: ["https://cdn.oyechats.com"],
  style: ["https://cdn.oyechats.com"],
  img: ["https://cdn.oyechats.com", "https://api.oyechats.com"],
  font: ["https://cdn.oyechats.com"],
  connect: ["https://api.oyechats.com", "wss://api.oyechats.com"],
} as const;
