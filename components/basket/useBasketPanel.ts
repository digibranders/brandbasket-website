"use client";
import { useSyncExternalStore } from "react";
import { basketPanel, PANEL_CLOSED, type PanelState } from "./basket-panel";

export function useBasketPanel(): PanelState {
  return useSyncExternalStore(basketPanel.subscribe, basketPanel.get, () => PANEL_CLOSED);
}
