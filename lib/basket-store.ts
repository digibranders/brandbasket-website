import type { AddonId, AddonPick } from "./pricing";

export const EMPTY_BASKET: AddonPick = Object.freeze({ growth: false, search: false });

export interface BasketStore {
  get(): AddonPick;
  set(id: AddonId, on: boolean): void;
  setAll(pick: AddonPick): void;
  subscribe(listener: () => void): () => void;
}

export function createBasketStore(initial: AddonPick = EMPTY_BASKET): BasketStore {
  let state = initial;
  const listeners = new Set<() => void>();
  const commit = (next: AddonPick): void => {
    if (next.growth === state.growth && next.search === state.search) return;
    state = Object.freeze({ ...next });
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

/** The page-wide basket. One module instance is shared by every client island, and survives client navigation. */
export const basket = createBasketStore();
