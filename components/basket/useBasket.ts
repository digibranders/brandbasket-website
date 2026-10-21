"use client";
import { useSyncExternalStore } from "react";
import { basket, DEFAULT_BASKET } from "@/lib/basket-store";
import type { BasketPick } from "@/lib/pricing";

export function useBasket(): BasketPick {
  return useSyncExternalStore(basket.subscribe, basket.get, () => DEFAULT_BASKET);
}
