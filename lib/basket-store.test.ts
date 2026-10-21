import { describe, expect, it, vi } from "vitest";
import { createBasketStore, DEFAULT_BASKET } from "./basket-store";

describe("basket store", () => {
  it("starts with the website plan only", () => {
    expect(createBasketStore().get()).toEqual({ website: true, growth: false, search: false });
    expect(DEFAULT_BASKET).toEqual({ website: true, growth: false, search: false });
  });

  it("notifies once per real change and keeps snapshots immutable", () => {
    const store = createBasketStore();
    const listener = vi.fn();
    store.subscribe(listener);
    const before = store.get();
    store.set("growth", true);
    store.set("growth", true);
    expect(listener).toHaveBeenCalledTimes(1);
    expect(before).toEqual(DEFAULT_BASKET);
    expect(store.get()).toEqual({ website: true, growth: true, search: false });
  });

  it("lets the website go when another plan is in the basket", () => {
    const store = createBasketStore();
    store.set("search", true);
    store.set("website", false);
    expect(store.get()).toEqual({ website: false, growth: false, search: true });
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
    store.setAll({ website: true, growth: true, search: true });
    expect(store.get()).toEqual({ website: true, growth: true, search: true });
    store.setAll({ website: false, growth: false, search: false });
    expect(store.get()).toEqual({ website: true, growth: true, search: true });
  });

  it("stops notifying after unsubscribe", () => {
    const store = createBasketStore();
    const listener = vi.fn();
    const off = store.subscribe(listener);
    off();
    store.set("search", true);
    expect(listener).not.toHaveBeenCalled();
  });
});
