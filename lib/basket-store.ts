import { type BasketPick, PAUSED_PLAN_IDS, PLAN_IDS, type PlanId, samePick, type SiteKind } from "./pricing";

/** A paused plan never sits in the basket, even from a basket saved before it was paused. */
function withoutPaused(pick: BasketPick): BasketPick {
  return Object.freeze({ ...pick, ...Object.fromEntries(PAUSED_PLAN_IDS.map((id) => [id, false])) });
}

/** What a new visitor's basket holds: nothing. They pick the plans they want (owner, 2026-11-17). */
export const DEFAULT_BASKET: BasketPick = Object.freeze({ website: false, social: false, ads: false });

/** Where the page-wide basket is remembered in the browser. It holds plan ids only. */
export const BASKET_STORAGE_KEY = "brandbasket-basket";

/** A saved basket: a JSON list of plan ids, possibly empty. Anything that is not a list gives null so the default applies. */
export function parseSavedBasket(raw: string | null): BasketPick | null {
  if (!raw) return null;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(value)) return null;
  const ids = new Set<unknown>(value);
  return Object.freeze({ website: ids.has("website"), social: ids.has("social"), ads: ids.has("ads") });
}

export function serialiseBasket(pick: BasketPick): string {
  return JSON.stringify(PLAN_IDS.filter((id) => pick[id]));
}

export interface BasketPersistence {
  save(pick: BasketPick): void;
}

/** Where Dedicated Expert Monitoring's place in the basket is remembered: "1" when added. Beside the plans, not among them. */
export const MONITORING_STORAGE_KEY = "brandbasket-monitoring";

export function serialiseFlag(on: boolean): string {
  return on ? "1" : "0";
}

/** A saved flag: only "1" is on, so anything missing or unexpected leaves monitoring out. */
export function parseSavedFlag(raw: string | null): boolean {
  return raw === "1";
}

export interface FlagStore {
  get(): boolean;
  set(on: boolean): void;
  subscribe(listener: () => void): () => void;
}

/** One on or off choice shared by every client island, like the basket: Dedicated Expert Monitoring. */
export function createFlagStore(initial: boolean, persistence?: { save(on: boolean): void }): FlagStore {
  let state = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => state,
    set(on) {
      if (on === state) return;
      state = on;
      persistence?.save(on);
      listeners.forEach((listener) => listener());
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}

export interface BasketStore {
  get(): BasketPick;
  set(id: PlanId, on: boolean): void;
  setAll(pick: BasketPick): void;
  subscribe(listener: () => void): () => void;
}

export function createBasketStore(initial: BasketPick = DEFAULT_BASKET, persistence?: BasketPersistence): BasketStore {
  let state: BasketPick = withoutPaused(initial);
  const listeners = new Set<() => void>();
  const commit = (wanted: BasketPick): void => {
    const next = withoutPaused(wanted);
    if (samePick(next, state)) return;
    state = next;
    persistence?.save(state);
    listeners.forEach((listener) => listener());
  };
  return {
    get: () => state,
    set: (id, on) => commit({ ...state, [id]: on }),
    setAll: (pick) => commit(pick),
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}

/** Storage can be missing or blocked (private windows, strict settings). Every use is guarded, and the basket works without it. */
function browserStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const browserPersistence: BasketPersistence = {
  save(pick) {
    try {
      browserStorage()?.setItem(BASKET_STORAGE_KEY, serialiseBasket(pick));
    } catch {
      // Full or blocked storage: the basket still works for this visit.
    }
  },
};

function savedBasket(): BasketPick | null {
  try {
    return parseSavedBasket(browserStorage()?.getItem(BASKET_STORAGE_KEY) ?? null);
  } catch {
    return null;
  }
}

const inBrowser = typeof window !== "undefined";

/**
 * The page-wide basket. One module instance is shared by every client island, and survives client navigation.
 * In the browser it starts from the plans saved on this device, so a refresh keeps the choice. The server and the first
 * render always use the default (see useBasket), so the page never mismatches while hydrating.
 */
export const basket = createBasketStore((inBrowser ? savedBasket() : null) ?? DEFAULT_BASKET, inBrowser ? browserPersistence : undefined);

function savedMonitoring(): boolean {
  try {
    return parseSavedFlag(browserStorage()?.getItem(MONITORING_STORAGE_KEY) ?? null);
  } catch {
    return false;
  }
}

const monitoringPersistence = {
  save(on: boolean): void {
    try {
      browserStorage()?.setItem(MONITORING_STORAGE_KEY, serialiseFlag(on));
    } catch {
      // Full or blocked storage: the choice still holds for this visit.
    }
  },
};

/** Whether Dedicated Expert Monitoring is in the page-wide basket. Off on the server and the first render (useMonitoring). */
export const monitoring = createFlagStore(inBrowser && savedMonitoring(), inBrowser ? monitoringPersistence : undefined);

/** Where the kind of website is remembered: "1" when it is an ecommerce store, anything else a B2B website. */
export const ECOMMERCE_STORAGE_KEY = "brandbasket-ecommerce";

function savedEcommerce(): boolean {
  try {
    return parseSavedFlag(browserStorage()?.getItem(ECOMMERCE_STORAGE_KEY) ?? null);
  } catch {
    return false;
  }
}

const ecommercePersistence = {
  save(on: boolean): void {
    try {
      browserStorage()?.setItem(ECOMMERCE_STORAGE_KEY, serialiseFlag(on));
    } catch {
      // Full or blocked storage: the choice still holds for this visit.
    }
  },
};

/** Whether the visitor's website is an ecommerce store (otherwise a B2B website). B2B on the server and the first render (useSiteKind). */
export const ecommerce = createFlagStore(inBrowser && savedEcommerce(), inBrowser ? ecommercePersistence : undefined);

export function siteKindOf(isEcommerce: boolean): SiteKind {
  return isEcommerce ? "ecommerce" : "b2b";
}

// Another tab changed the basket: follow it.
if (inBrowser) {
  window.addEventListener("storage", (event) => {
    if (event.key === ECOMMERCE_STORAGE_KEY) {
      ecommerce.set(parseSavedFlag(event.newValue));
      return;
    }
    if (event.key === MONITORING_STORAGE_KEY) {
      monitoring.set(parseSavedFlag(event.newValue));
      return;
    }
    if (event.key !== BASKET_STORAGE_KEY) return;
    const next = parseSavedBasket(event.newValue);
    if (next) basket.setAll(next);
  });
}
