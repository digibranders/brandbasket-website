"use client";
// components/contact/OyeChatsWidget.tsx
import { useEffect } from "react";
import { OYECHATS_BOT_KEY, OYECHATS_SCRIPT_SRC } from "@/lib/oyechats";

const WIDGET_ROOT_ID = "oyechats-widget-root";

/**
 * The OyeChats chat bubble, on the contact page only. The widget adds its own root to the page and keeps it across
 * client-side navigation, so leaving the page removes the script and the root again. Nothing loads without a bot key.
 */
export function OyeChatsWidget(): null {
  useEffect(() => {
    if (OYECHATS_BOT_KEY === null) return;
    const script = document.createElement("script");
    script.src = OYECHATS_SCRIPT_SRC;
    script.async = true;
    script.dataset.botKey = OYECHATS_BOT_KEY;
    document.body.append(script);
    return () => {
      script.remove();
      document.getElementById(WIDGET_ROOT_ID)?.remove();
      delete (window as { OyeChats?: unknown }).OyeChats;
    };
  }, []);
  return null;
}
