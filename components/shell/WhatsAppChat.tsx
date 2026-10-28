"use client";

import { ArrowUpRight, WhatsappLogo, X } from "@phosphor-icons/react";
import { usePagePath } from "@/components/currency/usePagePath";
import { useEffect, useId, useRef, useState, type ReactElement } from "react";
import { WHATSAPP_CHAT } from "@/content/whatsapp";
import { OYECHATS_BOT_KEY } from "@/lib/oyechats";
import { trackAttrs } from "@/lib/analytics";
import { businessDetails } from "@/lib/site-config";

/** A new page starts with the launcher closed, including client-side navigation. The contact page has the OyeChats bubble in this corner and WhatsApp as a channel beside the form, so the launcher steps aside there. */
export function WhatsAppChat(): ReactElement | null {
  const pathname = usePagePath();
  if (OYECHATS_BOT_KEY !== null && pathname === "/contact") return null;
  return <ChatPanel key={pathname} />;
}

function ChatPanel(): ReactElement {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const titleId = useId();
  const widgetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const continueRef = useRef<HTMLAnchorElement>(null);

  function dismiss(): void {
    setOpen(false);
    toggleRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;
    continueRef.current?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent): void => {
      if (event.target instanceof Node && !widgetRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={widgetRef} data-whatsapp-chat className="whatsapp-chat fixed right-[max(16px,env(safe-area-inset-right,0px))] z-40 grid justify-items-end gap-3">
      {open && (
        <section id={panelId} role="region" aria-labelledby={titleId} className="absolute bottom-[calc(100%+12px)] right-0 w-[340px] max-w-[calc(100vw-32px)] max-h-[calc(100dvh-12rem)] overflow-y-auto overscroll-contain rounded-[22px] border border-line bg-surface shadow-[var(--shadow-sheet)]">
          <header className="flex items-start gap-3 bg-ink p-5 text-action-ink">
            <WhatsappLogo aria-hidden="true" className="mt-0.5 size-7 shrink-0" />
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="font-display text-lg font-medium leading-tight tracking-[-0.02em]">{WHATSAPP_CHAT.title}</h2>
              <p className="mt-1.5 text-xs leading-relaxed text-white/80">{WHATSAPP_CHAT.subtitle}</p>
            </div>
            <button type="button" aria-label={WHATSAPP_CHAT.dismissLabel} onClick={dismiss} className="-mr-2 -mt-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-colors hover:bg-white/10">
              <X aria-hidden="true" className="size-5" />
            </button>
          </header>
          <div className="grid gap-5 p-5">
            <div className="rounded-[16px] rounded-tl-[4px] bg-bg p-4 text-sm leading-relaxed">
              <p className="font-semibold">{WHATSAPP_CHAT.greeting}</p>
              <p className="mt-2 text-ink-2">{WHATSAPP_CHAT.body}</p>
            </div>
            <a ref={continueRef} href={businessDetails.whatsappHref} target="_blank" rel="noopener noreferrer" {...trackAttrs("whatsapp_click", "chat_widget")} className="flex min-h-12 items-center justify-between gap-3 rounded-full bg-action px-5 py-3 text-sm font-semibold text-action-ink transition-colors hover:bg-ink-2">
              {WHATSAPP_CHAT.continueLabel}
              <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
            </a>
            <p className="text-center text-xs leading-relaxed text-ink-2">{WHATSAPP_CHAT.reply}</p>
          </div>
        </section>
      )}
      <button ref={toggleRef} type="button" aria-expanded={open} aria-controls={open ? panelId : undefined} aria-label={open ? WHATSAPP_CHAT.closeLabel : WHATSAPP_CHAT.openLabel} onClick={() => setOpen((current) => !current)} className="grid size-14 cursor-pointer place-items-center rounded-full border border-line bg-surface text-[var(--whatsapp)] shadow-[var(--shadow-bar)] transition-[background-color,transform] hover:bg-sunken active:scale-95">
        {open ? <X aria-hidden="true" className="size-6 text-ink" /> : <WhatsappLogo aria-hidden="true" weight="fill" className="size-8" />}
      </button>
    </div>
  );
}
