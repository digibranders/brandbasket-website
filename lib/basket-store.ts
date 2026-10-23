import { type BasketPick, PLAN_IDS, type PlanId, samePick } from "./pricing";

/** What every "Get my free website" button starts from: the website plan on its own. */
export const DEFAULT_BASKET: BasketPick = Object.freeze({ website: true, growth: false, search: false });

/** Where the page-wide basket is remembered in the browser. It holds plan ids only. */
export const BASKET_STORAGE_KEY = "brandbasket-basket";

/** A saved basket: a JSON list of plan ids. Anything unexpected, or an empty list, gives null so the default applies. */
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
  const pick: BasketPick = { website: ids.has("website"), growth: ids.has("growth"), search: ids.has("search") };
  return PLAN_IDS.some((id) => pick[id]) ? Object.freeze(pick) : null;
}

export function serialiseBasket(pick: BasketPick): string {
  return JSON.stringify(PLAN_IDS.filter((id) => pick[id]));
}

export interface BasketPersistence {
  save(pick: BasketPick): void;
}

export interface BasketStore {
  get(): BasketPick;
  set(id: PlanId, on: boolean): void;
  setAll(pick: BasketPick): void;
  subscribe(listener: () => void): () => void;
}

export function createBasketStore(initial: BasketPick = DEFAULT_BASKET, persistence?: BasketPersistence): BasketStore {
  let state: BasketPick = Object.freeze({ ...initial });
  const listeners = new Set<() => void>();
  const commit = (next: BasketPick): void => {
    // A basket always holds at least one plan, so the last switch on cannot turn off.
    if (!PLAN_IDS.some((id) => next[id])) return;
    if (samePick(next, state)) return;
    state = Object.freeze({ ...next });
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

// Another tab changed the basket: follow it.
if (inBrowser) {
  window.addEventListener("storage", (event) => {
    if (event.key !== BASKET_STORAGE_KEY) return;
    const next = parseSavedBasket(event.newValue);
    if (next) basket.setAll(next);
  });
}
