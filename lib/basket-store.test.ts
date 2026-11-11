import { describe, expect, it, vi } from "vitest";
import { BASKET_STORAGE_KEY, createBasketStore, DEFAULT_BASKET, parseSavedBasket, serialiseBasket } from "./basket-store";

describe("basket store", () => {
  it("starts with the website plan only", () => {
    expect(createBasketStore().get()).toEqual({ website: true, social: false, ads: false });
    expect(DEFAULT_BASKET).toEqual({ website: true, social: false, ads: false });
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
    expect(store.get()).toEqual({ website: true, social: true, ads: false });
  });

  it("lets the website go when another plan is in the basket", () => {
    const store = createBasketStore();
    store.set("ads", true);
    store.set("website", false);
    expect(store.get()).toEqual({ website: false, social: false, ads: true });
  });

  it("never empties the basket", () => {
    const store = createBasketStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.set("website", false);
    expect(store.get()).toEqual(DEFAULT_BASKET);
    expect(listener).not.toHaveBeenCalled();
  });

  it("replaces the whole pick for a package, and ignores an empty one", () => {
    const store = createBasketStore();
    store.setAll({ website: true, social: true, ads: true });
    expect(store.get()).toEqual({ website: true, social: true, ads: true });
    store.setAll({ website: false, social: false, ads: false });
    expect(store.get()).toEqual({ website: true, social: true, ads: true });
  });

  it("treats an equal pick as no change", () => {
    const store = createBasketStore();
    const listener = vi.fn();
    store.subscribe(listener);
    store.setAll({ website: true, social: false, ads: false });
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
    for (const raw of [null, "", "not json", "{}", "42", '"website"', "[]", '["nothing"]', "[1,2]"]) expect(parseSavedBasket(raw)).toBeNull();
  });

  it("keeps the known plans and drops the rest", () => {
    expect(parseSavedBasket('["social","unknown","social"]')).toEqual({ website: false, social: true, ads: false });
  });

  it("saves after every real change, and not after a refused or equal one", () => {
    const save = vi.fn();
    const store = createBasketStore(DEFAULT_BASKET, { save });
    store.set("social", true);
    store.set("social", true);
    store.setAll({ website: false, social: false, ads: false });
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenLastCalledWith({ website: true, social: true, ads: false });
  });
});

