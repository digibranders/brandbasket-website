import { type BasketPick, PLAN_IDS, type PlanId, samePick } from "./pricing";

/** What every "Get my free website" button starts from: the website plan on its own. */
export const DEFAULT_BASKET: BasketPick = Object.freeze({ website: true, growth: false, search: false });

export interface BasketStore {
  get(): BasketPick;
  set(id: PlanId, on: boolean): void;
  setAll(pick: BasketPick): void;
  subscribe(listener: () => void): () => void;
}

export function createBasketStore(initial: BasketPick = DEFAULT_BASKET): BasketStore {
  let state: BasketPick = Object.freeze({ ...initial });
  const listeners = new Set<() => void>();
  const commit = (next: BasketPick): void => {
    // A basket always holds at least one plan, so the last switch on cannot turn off.
    if (!PLAN_IDS.some((id) => next[id])) return;
    if (samePick(next, state)) return;
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
