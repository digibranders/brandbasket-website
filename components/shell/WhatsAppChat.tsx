import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { WHATSAPP_CHAT } from "@/content/whatsapp";
import { trackAttrs } from "@/lib/analytics";
import { businessDetails } from "@/lib/site-config";

const HREF = `${businessDetails.whatsappHref}?text=${encodeURIComponent(WHATSAPP_CHAT.message)}`;

/** The floating WhatsApp icon on every page. One tap opens the chat; on a mouse the reply time shows beside it. */
export function WhatsAppChat(): ReactElement {
  return (
    <div data-whatsapp-chat className="whatsapp-chat group fixed right-[max(16px,env(safe-area-inset-right,0px))] z-40">
      <a href={HREF} target="_blank" rel="noopener noreferrer" aria-label={WHATSAPP_CHAT.openLabel} aria-describedby="whatsapp-reply" {...trackAttrs("whatsapp_click", "chat_widget")} className="grid size-14 cursor-pointer place-items-center rounded-full border border-line bg-surface text-[var(--whatsapp)] shadow-[var(--shadow-bar)] transition-[background-color,transform] hover:bg-sunken active:scale-95">
        <WhatsappLogo aria-hidden="true" weight="fill" className="size-8" />
      </a>
      <span id="whatsapp-reply" role="tooltip" className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-4 py-2 text-sm text-action-ink opacity-0 shadow-[var(--shadow-bar)] transition-opacity [@media(hover:hover)]:block group-hover:opacity-100 group-focus-within:opacity-100">
        {WHATSAPP_CHAT.reply}
      </span>
    </div>
  );
}
