// components/basket/scene/types.ts
import type { AddonPick } from "@/lib/pricing";

export interface BasketScene {
  /** Drops or lifts tiles to match the pick. Safe to call with the same pick repeatedly. */
  setPick(pick: AddonPick): void;
  /** Starts or pauses the render loop; pause when off screen. */
  setVisible(visible: boolean): void;
  /** Frees the WebGL context, listeners and observers. */
  destroy(): void;
}

export interface BasketSceneOptions {
  readonly reducedMotion: boolean;
  readonly initialPick: AddonPick;
  /** CSS font family list for the tile labels, from `loadFaceFonts()`. */
  readonly labelFamily: string;
}
