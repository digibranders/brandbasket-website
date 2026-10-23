// components/basket/basket-panel.ts

/** Which control opened the basket pop-up, so it can sit under the nav button or above the dock. */
export type PanelAnchor = "nav" | "dock";

export interface PanelState {
  readonly open: boolean;
  readonly anchor: PanelAnchor;
}

export const PANEL_CLOSED: PanelState = Object.freeze({ open: false, anchor: "nav" });

let state: PanelState = PANEL_CLOSED;
let trigger: HTMLElement | null = null;
const listeners = new Set<() => void>();

function set(next: PanelState): void {
  state = Object.freeze(next);
  listeners.forEach((listener) => listener());
}

/** The one basket pop-up. A single module instance, so the nav button, the menu and the dock all open the same panel. */
export const basketPanel = {
  get: (): PanelState => state,
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  /** The control to give focus back to when the panel closes. */
  trigger: (): HTMLElement | null => trigger,
  open(anchor: PanelAnchor, from: HTMLElement | null): void {
    trigger = from;
    set({ open: true, anchor });
  },
  close(): void {
    if (state.open) set({ open: false, anchor: state.anchor });
  },
  toggle(anchor: PanelAnchor, from: HTMLElement | null): void {
    if (state.open && state.anchor === anchor) basketPanel.close();
    else basketPanel.open(anchor, from);
  },
};
