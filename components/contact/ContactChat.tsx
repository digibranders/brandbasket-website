"use client";
// components/contact/ContactChat.tsx: the OyeChats bot as a card in the contact column. Closed it looks like the other contact rows;
// opened it becomes a conversation in place. It calls the OyeChats API itself (lib/oyechats-chat.ts), so there is no floating bubble.
import { ArrowUp, CaretDown, ChatCircleDots } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { type FormEvent, type ReactElement, useEffect, useId, useRef, useState } from "react";
import { CONTACT_CHAT } from "@/content/contact";
import { type Block, type Inline, parseChatText } from "@/lib/chat-format";
import { OYECHATS_BOT_KEY, OYECHATS_SITE_URL } from "@/lib/oyechats";
import { askBot, ChatError } from "@/lib/oyechats-chat";

type Role = "bot" | "user";
interface Message {
  readonly id: number;
  readonly role: Role;
  readonly text: string;
  readonly error?: true;
}

const SESSION_KEY = "bb_chat_session";
const MAX_QUESTION = 1000;

function readSession(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function writeSession(id: string): void {
  try {
    window.sessionStorage.setItem(SESSION_KEY, id);
  } catch {
    // Private mode or blocked storage: the chat still works, it just starts a new conversation after a reload.
  }
}

function InlineText({ parts }: { readonly parts: readonly Inline[] }): ReactElement {
  return (
    <>
      {parts.map((part, index) => {
        if (part.kind === "bold") return <strong key={index}>{part.text}</strong>;
        if (part.kind === "link") return <a key={index} href={part.href} target="_blank" rel="noopener noreferrer">{part.text}</a>;
        return <span key={index}>{part.text}</span>;
      })}
    </>
  );
}

function BotText({ blocks }: { readonly blocks: readonly Block[] }): ReactElement {
  return (
    <>
      {blocks.map((block, index) =>
        block.kind === "list" ? (
          <ul key={index}>{block.items.map((item, itemIndex) => <li key={itemIndex}><InlineText parts={item} /></li>)}</ul>
        ) : (
          <p key={index}><InlineText parts={block.inline} /></p>
        ),
      )}
    </>
  );
}

/** The assistant's picture beside its messages: the Brandbasket mark on the rattan tint. */
function Avatar(): ReactElement {
  return (
    <span aria-hidden="true" className="ct-avatar">
      <Image src="/brand/brandbasket-mark.svg" alt="" width={18} height={18} className="size-[18px]" />
    </span>
  );
}

export function ContactChat(): ReactElement | null {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<readonly Message[]>([{ id: 0, role: "bot", text: CONTACT_CHAT.greeting }]);
  const nextId = useRef(1);
  const sessionRef = useRef<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const panelId = useId();
  const titleId = useId();

  // Keep the newest message in view.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, sending]);

  // Leaving the page cancels a question still on its way.
  useEffect(() => () => requestRef.current?.abort(), []);

  if (OYECHATS_BOT_KEY === null) return null;
  const botKey = OYECHATS_BOT_KEY;
  /** The starter questions are offered until the visitor has asked something. */
  const started = messages.some((message) => message.role === "user");

  const add = (role: Role, text: string, error = false): void => {
    const id = nextId.current++;
    setMessages((current) => [...current, { id, role, text, ...(error ? { error: true as const } : {}) }]);
  };

  function toggle(): void {
    setOpen((current) => !current);
    if (!open) window.requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function ask(question: string): Promise<void> {
    if (question === "" || sending) return;
    add("user", question);
    setSending(true);
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const result = await askBot({ question, sessionId: sessionRef.current ?? readSession(), botKey, signal: controller.signal });
      sessionRef.current = result.sessionId;
      writeSession(result.sessionId);
      add("bot", result.answer);
    } catch (error) {
      if (controller.signal.aborted) return;
      add("bot", CONTACT_CHAT.errors[error instanceof ChatError ? error.kind : "failed"], true);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const question = draft.trim();
    if (question === "") return;
    setDraft("");
    void ask(question);
  }

  return (
    <section aria-labelledby={titleId} className="ct-chat">
      <button type="button" aria-expanded={open} aria-controls={panelId} onClick={toggle} className="ct-chat-head">
        <span aria-hidden="true" className="grid size-[46px] place-items-center rounded-2xl bg-rattan-wash text-rattan-ink"><ChatCircleDots weight="duotone" className="size-[23px]" /></span>
        <span>
          <b id={titleId} className="block font-display text-lg font-medium tracking-[-0.02em]">{CONTACT_CHAT.title}</b>
          <span className="text-sm text-ink-2">{CONTACT_CHAT.subtitle}</span>
        </span>
        <CaretDown aria-hidden="true" className={`size-[18px] text-ink-2 transition-transform duration-[400ms] ease-[var(--ease)] ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={panelId} hidden={!open} className="ct-chat-panel">
        <div ref={logRef} role="log" aria-live="polite" aria-label={CONTACT_CHAT.logLabel} className="ct-chat-log">
          {messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="ct-row ct-row-user">
                <div className="ct-bubble ct-bubble-user">{message.text}</div>
              </div>
            ) : (
              <div key={message.id} className="ct-row">
                <Avatar />
                <div className={`ct-bubble ct-bubble-bot ${message.error === true ? "ct-bubble-error" : ""}`}>
                  <BotText blocks={parseChatText(message.text)} />
                </div>
              </div>
            ),
          )}
          {started ? null : (
            <div role="group" aria-label={CONTACT_CHAT.startersLabel} className="ct-starters">
              {CONTACT_CHAT.starters.map((question) => (
                <button key={question} type="button" disabled={sending} onClick={() => void ask(question)} className="ct-starter">{question}</button>
              ))}
            </div>
          )}
          {sending ? (
            <div className="ct-row" role="status" aria-label={CONTACT_CHAT.typing}>
              <Avatar />
              <div className="ct-bubble ct-bubble-bot"><span aria-hidden="true" className="ct-typing"><i /><i /><i /></span></div>
            </div>
          ) : null}
        </div>
        <form onSubmit={submit} className="ct-chat-form">
          <input ref={inputRef} type="text" value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={MAX_QUESTION} autoComplete="off" aria-label={CONTACT_CHAT.placeholder} placeholder={CONTACT_CHAT.placeholder} className="ct-chat-input" />
          <button type="submit" disabled={sending || draft.trim() === ""} aria-label={CONTACT_CHAT.send} className="ct-chat-send"><ArrowUp aria-hidden="true" weight="bold" className="size-5" /></button>
        </form>
        <div className="ct-chat-foot">
          <span className="ct-powered">
            {CONTACT_CHAT.poweredBy}
            <a href={OYECHATS_SITE_URL} target="_blank" rel="noopener noreferrer" aria-label={`${CONTACT_CHAT.provider} website`} className="ct-powered-link">
              <Image src="/brand/oyechats-wordmark.png" alt={CONTACT_CHAT.provider} width={1390} height={424} className="h-[17px] w-auto" />
            </a>
          </span>
          <p>{CONTACT_CHAT.notice} <Link href="/privacy">{CONTACT_CHAT.privacyLink}</Link>.</p>
        </div>
      </div>
    </section>
  );
}
