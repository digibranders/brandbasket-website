// lib/oyechats-chat.ts: one question to the OyeChats bot and its answer. The chat on /contact is built on this, not on OyeChats'
// floating widget, which cannot sit inside a page.
import { z } from "zod";
import { OYECHATS_API_URL } from "./oyechats";

export type ChatFailure = "rate_limited" | "over_capacity" | "maintenance" | "timeout" | "failed";

/** A failure the chat can explain to the visitor. `kind` picks the words (content/contact.ts). */
export class ChatError extends Error {
  constructor(readonly kind: ChatFailure) {
    super(`OyeChats chat failed: ${kind}`);
    this.name = "ChatError";
  }
}

export interface ChatAnswer {
  readonly answer: string;
  /** Sent back with the next question so the bot keeps the conversation. */
  readonly sessionId: string;
}

export interface AskParams {
  readonly question: string;
  readonly sessionId: string | null;
  readonly botKey: string;
  readonly signal?: AbortSignal;
  readonly timeoutMs?: number;
  /** Replaceable in tests. */
  readonly fetchFn?: typeof fetch;
}

const answerSchema = z.object({ answer: z.string().min(1), session_id: z.string().min(1) });

/** The status codes OyeChats uses for the cases a visitor should hear about in plain words. */
const FAILURE_BY_STATUS: Readonly<Record<number, ChatFailure>> = { 402: "over_capacity", 429: "rate_limited", 503: "maintenance" };

export async function askBot({ question, sessionId, botKey, signal, timeoutMs = 45_000, fetchFn = fetch }: AskParams): Promise<ChatAnswer> {
  const timeout = AbortSignal.timeout(timeoutMs);
  let response: Response;
  try {
    response = await fetchFn(`${OYECHATS_API_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Bot-Key": botKey },
      body: JSON.stringify({ question, session_id: sessionId }),
      signal: signal === undefined ? timeout : AbortSignal.any([signal, timeout]),
    });
  } catch (error) {
    // A visitor who closes the chat cancels the request: that is not a failure to report.
    if (signal?.aborted === true) throw error;
    throw new ChatError(timeout.aborted ? "timeout" : "failed");
  }
  if (!response.ok) throw new ChatError(FAILURE_BY_STATUS[response.status] ?? "failed");
  let body: unknown;
  try {
    body = await response.json();
  } catch {
    throw new ChatError("failed");
  }
  const parsed = answerSchema.safeParse(body);
  if (!parsed.success) throw new ChatError("failed");
  return { answer: parsed.data.answer, sessionId: parsed.data.session_id };
}
