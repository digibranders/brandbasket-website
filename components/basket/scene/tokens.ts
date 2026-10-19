// components/basket/scene/tokens.ts
import type { AddonId } from "@/lib/pricing";

export type TileId = "site" | "care" | "report" | "gbp" | "meta" | "seo" | "aeo";

interface TileBase {
  readonly w: number;
  readonly h: number;
  /** Resting position inside the basket. */
  readonly rest: readonly [number, number, number];
  /** Resting tilt around z. */
  readonly rz: number;
}

/** The website tile: a screenshot face with a paper-coloured rim. */
export interface SiteTileDef extends TileBase {
  readonly side: string;
}

/** A service tile: a Material Symbols glyph (by code point) and a label on a brand colour. */
export interface IconTileDef extends TileBase {
  readonly bg: string;
  readonly glyph: string;
  readonly label: string;
}

export type TileDef = SiteTileDef | IconTileDef;

export const DEFS: Readonly<Record<TileId, TileDef>> = {
  site: { w: 1.7, h: 1.1, rest: [-0.42, 1.32, 0.42], rz: -0.07, side: "#f1efea" },
  care: { w: 0.94, h: 0.94, rest: [0.8, 1.48, 0.24], rz: 0.14, bg: "#8a5a2b", glyph: "" /* shield_lock */, label: "Security" },
  report: { w: 0.94, h: 0.94, rest: [0.12, 1.62, -0.36], rz: -0.05, bg: "#a8743c", glyph: "" /* summarize */, label: "Report" },
  gbp: { w: 0.94, h: 0.94, rest: [-1.06, 1.56, -0.22], rz: 0.2, bg: "#2f7f7a", glyph: "" /* location_on */, label: "Google" },
  meta: { w: 0.94, h: 0.94, rest: [1.1, 1.54, -0.5], rz: -0.22, bg: "#1f6b66", glyph: "" /* campaign */, label: "Ads" },
  seo: { w: 0.94, h: 0.94, rest: [-0.42, 1.82, -0.96], rz: 0.1, bg: "#3d5a8a", glyph: "" /* travel_explore */, label: "SEO" },
  aeo: { w: 0.94, h: 0.94, rest: [0.58, 1.86, -1.0], rz: -0.12, bg: "#2d4a7a", glyph: "" /* auto_awesome */, label: "AI search" },
};

/** The Managed Website plan: always in the basket, dropped in this order on load. */
export const BASE_TILES: readonly TileId[] = ["site", "care", "report"];

export const GROUPS: Readonly<Record<AddonId, readonly TileId[]>> = { growth: ["gbp", "meta"], search: ["seo", "aeo"] };
