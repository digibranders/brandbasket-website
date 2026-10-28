// components/basket/scene/types.ts
import type { BasketPick } from "@/lib/pricing";

export interface BasketScene {
  /** Begins the tile drops once the basket's entrance has finished. Idempotent. */
  startEntry(): void;
  /** Drops or lifts tiles to match the pick. Safe to call with the same pick repeatedly. */
  setPick(pick: BasketPick): void;
  /** Starts or pauses the render loop; pause when off screen. */
  setVisible(visible: boolean): void;
  /** Frees the WebGL context, listeners and observers. */
  destroy(): void;
}

export interface BasketSceneOptions {
  readonly reducedMotion: boolean;
  readonly initialPick: BasketPick;
  /** Context recovery restores the settled basket instead of replaying its entry. */
  readonly animateEntry?: boolean;
  /** CSS font family list for the tile labels, from `loadFaceFonts()`. */
  readonly labelFamily: string;
  /** The complete initial scene has drawn and can replace its poster. */
  readonly onReady?: () => void;
  /** The browser took the WebGL context away. The scene cannot draw again; destroy it and show the poster. */
  readonly onContextLost?: () => void;
}
