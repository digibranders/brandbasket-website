import { describe, expect, it, vi } from "vitest";
import { askBot, ChatError } from "./oyechats-chat";

const BASE = { question: "What do you do?", sessionId: null, botKey: "bot-abc123" } as const;
const reply = (status: number, body: unknown): typeof fetch => vi.fn(async () => new Response(typeof body === "string" ? body : JSON.stringify(body), { status })) as unknown as typeof fetch;

describe("askBot", () => {
  it("sends the question with the bot key and returns the answer and session", async () => {
    const fetchFn = reply(200, { answer: "We build websites.", session_id: "s-1", sources: [] });
    await expect(askBot({ ...BASE, sessionId: "s-0", fetchFn })).resolves.toEqual({ answer: "We build websites.", sessionId: "s-1" });
    const [url, init] = vi.mocked(fetchFn).mock.calls[0] ?? [];
    expect(url).toBe("https://api.oyechats.com/chat");
    expect((init?.headers as Record<string, string>)["X-Bot-Key"]).toBe("bot-abc123");
    expect(JSON.parse(String(init?.body))).toEqual({ question: "What do you do?", session_id: "s-0" });
  });

  it.each([
    [402, "over_capacity"],
    [429, "rate_limited"],
    [503, "maintenance"],
    [500, "failed"],
  ])("names the failure for status %i", async (status, kind) => {
    await expect(askBot({ ...BASE, fetchFn: reply(status, {}) })).rejects.toMatchObject({ kind });
  });

  it("fails on an answer that is not the expected shape", async () => {
    await expect(askBot({ ...BASE, fetchFn: reply(200, { answer: "" }) })).rejects.toBeInstanceOf(ChatError);
    await expect(askBot({ ...BASE, fetchFn: reply(200, "not json") })).rejects.toMatchObject({ kind: "failed" });
  });

  it("reports a network error as a failure", async () => {
    const fetchFn = vi.fn(async () => {
      throw new TypeError("offline");
    }) as unknown as typeof fetch;
    await expect(askBot({ ...BASE, fetchFn })).rejects.toMatchObject({ kind: "failed" });
  });

  it("reports a slow answer as a timeout", async () => {
    const fetchFn = vi.fn((_url: unknown, init?: RequestInit) => new Promise((_resolve, reject) => init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))))) as unknown as typeof fetch;
    await expect(askBot({ ...BASE, fetchFn, timeoutMs: 10 })).rejects.toMatchObject({ kind: "timeout" });
  });

  it("lets a cancelled request through unchanged, so the chat can ignore it", async () => {
    const controller = new AbortController();
    const fetchFn = vi.fn((_url: unknown, init?: RequestInit) => new Promise((_resolve, reject) => init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError"))))) as unknown as typeof fetch;
    const pending = askBot({ ...BASE, fetchFn, signal: controller.signal });
    controller.abort();
    await expect(pending).rejects.toMatchObject({ name: "AbortError" });
  });
});
