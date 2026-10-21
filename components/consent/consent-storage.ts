// components/consent/consent-storage.ts
import { CONSENT_KEY, type ConsentChoice, type ConsentRecord, decodeRecord, encodeRecord, TOOLS } from "@/lib/consent";

let cached: ConsentRecord | null | undefined;
const listeners = new Set<() => void>();

/** The saved choice for useSyncExternalStore; read once, then served from memory so the snapshot stays stable. */
export function readConsent(): ConsentRecord | null {
  if (cached === undefined) {
    try {
      cached = decodeRecord(window.localStorage.getItem(CONSENT_KEY), TOOLS, new Date());
    } catch {
      cached = null;
    }
  }
  return cached;
}

export function saveConsent(choice: ConsentChoice): void {
  const raw = encodeRecord(choice, TOOLS, new Date());
  try {
    window.localStorage.setItem(CONSENT_KEY, raw);
  } catch {
    // Storage blocked (private mode, site data off): the choice still holds for this page view.
  }
  cached = decodeRecord(raw, TOOLS, new Date());
  listeners.forEach((listener) => listener());
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
