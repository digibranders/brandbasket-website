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
  readonly rx: number;
  readonly ry: number;
}

/** The website tile: a screenshot face with a paper-coloured rim. */
export interface SiteTileDef extends TileBase {
  readonly side: string;
}

/** A service tile: a Material Symbols glyph (by code point) and a white label on a brand colour. */
export interface IconTileDef extends TileBase {
  readonly accent: string;
  readonly glyph: string;
  readonly label: string;
}

export type TileDef = SiteTileDef | IconTileDef;

export const DEFS: Readonly<Record<TileId, TileDef>> = {
  site: { w: 1.78, h: 1.56, rest: [-0.42, 1.22, 0.48], rx: -0.12, ry: -0.06, rz: -0.065, side: "#f1efea" },
  care: { w: 0.96, h: 1.92, rest: [0.84, 1.19, 0.28], rx: -0.08, ry: -0.14, rz: 0.1, accent: "#8a5a2b", glyph: "" /* shield_lock */, label: "Security" },
  report: { w: 0.92, h: 2.22, rest: [0.02, 1.42, -0.48], rx: 0.04, ry: 0.1, rz: -0.08, accent: "#a8743c", glyph: "" /* summarize */, label: "Report" },
  gbp: { w: 0.86, h: 1.78, rest: [-0.94, 1.46, -0.24], rx: -0.05, ry: 0.2, rz: 0.16, accent: "#2f7f7a", glyph: "" /* location_on */, label: "Google" },
  meta: { w: 0.86, h: 1.78, rest: [0.94, 1.54, -0.72], rx: 0.05, ry: -0.18, rz: -0.16, accent: "#1f6b66", glyph: "" /* campaign */, label: "Ads" },
  seo: { w: 0.86, h: 1.78, rest: [-0.56, 1.76, -1.08], rx: 0.08, ry: 0.12, rz: 0.06, accent: "#3d5a8a", glyph: "" /* travel_explore */, label: "SEO" },
  aeo: { w: 0.86, h: 1.78, rest: [0.48, 1.8, -1.16], rx: 0.08, ry: -0.1, rz: -0.08, accent: "#2d4a7a", glyph: "" /* auto_awesome */, label: "AI search" },
};

/** The Managed Website plan: always in the basket, dropped in this order on load. */
export const BASE_TILES: readonly TileId[] = ["site", "care", "report"];

export const GROUPS: Readonly<Record<AddonId, readonly TileId[]>> = { growth: ["gbp", "meta"], search: ["seo", "aeo"] };
