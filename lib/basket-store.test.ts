import { describe, expect, it, vi } from "vitest";
import { BASKET_STORAGE_KEY, createBasketStore, createFlagStore, DEFAULT_BASKET, MONITORING_STORAGE_KEY, parseSavedBasket, parseSavedFlag, serialiseBasket, serialiseFlag } from "./basket-store";

describe("basket store", () => {
  it("starts empty: a new visitor picks the plans they want (owner, 2026-11-17)", () => {
    expect(createBasketStore().get()).toEqual({ website: false, social: false, ads: false });
    expect(DEFAULT_BASKET).toEqual({ website: false, social: false, ads: false });
  });

  it("notifies once per real change and keeps snapshots immutable", () => {
    const store = createBasketStore();
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.get();
    store.set("social", true);
    store.set("social", true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(before).toEqual(DEFAULT_BASKET);
    expect(store.get()).toEqual({ website: false, social: true, ads: false });
  });

  it("lets the website go when another plan is in the basket", () => {
    const store = createBasketStore();
    store.set("website", true);
    store.set("ads", true);
    store.set("website", false);
    expect(store.get()).toEqual({ website: false, social: false, ads: true });
  });

  it("lets the last plan go, so the basket can be empty again", () => {
    const store = createBasketStore();
    store.set("website", true);
    store.set("website", false);
    expect(store.get()).toEqual(DEFAULT_BASKET);
  });

  it("replaces the whole pick, an empty one included", () => {
    const store = createBasketStore();
    store.setAll({ website: true, social: true, ads: true });
    expect(store.get()).toEqual({ website: true, social: true, ads: true });
    store.setAll({ website: false, social: false, ads: false });
    expect(store.get()).toEqual({ website: false, social: false, ads: false });
  });

  it("treats an equal pick as no change", () => {
    const store = createBasketStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.setAll({ website: false, social: false, ads: false });
    expect(listener).not.toHaveBeenCalled();
  });

  it("stops notifying after unsubscribe", () => {
    const store = createBasketStore();
    const listener = vi.fn();
    const off = store.subscribe(listener);
    off();
    store.set("ads", true);
    expect(listener).not.toHaveBeenCalled();
  });
});

describe("saved basket", () => {
  it("round-trips a pick as a list of plan ids", () => {
    const pick = { website: true, social: false, ads: true };
    expect(serialiseBasket(pick)).toBe('["website","ads"]');
    expect(parseSavedBasket(serialiseBasket(pick))).toEqual(pick);
    expect(BASKET_STORAGE_KEY).toBe("brandbasket-basket");
  });

  it("ignores anything that is not a usable list", () => {
    for (const raw of [null, "", "not json", "{}", "42", '"website"']) expect(parseSavedBasket(raw)).toBeNull();
  });

  it("keeps a basket the visitor emptied", () => {
    for (const raw of ["[]", '["nothing"]', "[1,2]"]) expect(parseSavedBasket(raw)).toEqual({ website: false, social: false, ads: false });
  });

  it("keeps the known plans and drops the rest", () => {
    expect(parseSavedBasket('["social","unknown","social"]')).toEqual({ website: false, social: true, ads: false });
  });

  it("saves after every real change, and not after a refused or equal one", () => {
    const save = vi.fn();
    const store = createBasketStore(DEFAULT_BASKET, { save });
    store.set("social", true);
    store.set("social", true);
    store.setAll({ website: false, social: true, ads: false });
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenLastCalledWith({ website: false, social: true, ads: false });
  });
});


describe("monitoring in the basket", () => {
  it("starts off, turns on and off, and tells its listeners once per real change", () => {
    const save = vi.fn();
    const store = createFlagStore(false, { save });
    const listener = vi.fn();
    store.subscribe(listener);
    store.set(true);
    store.set(true);
    store.set(false);
    expect(store.get()).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
    expect(save.mock.calls).toEqual([[true], [false]]);
  });

  it("round-trips through storage under its own key, and reads anything unexpected as off", () => {
    expect(MONITORING_STORAGE_KEY).toBe("brandbasket-monitoring");
    expect(parseSavedFlag(serialiseFlag(true))).toBe(true);
    expect(parseSavedFlag(serialiseFlag(false))).toBe(false);
    for (const raw of [null, "", "yes", "[]", "2"]) expect(parseSavedFlag(raw)).toBe(false);
  });
});
