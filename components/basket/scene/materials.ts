// components/basket/scene/materials.ts
import { Program, type OGLRenderingContext, type Texture } from "ogl";
import { FRAG, VERT } from "./shaders";

export type Rgb = readonly [number, number, number];

interface Uniform<T> {
  readonly value: T;
}

/** Light-theme lighting, shared by every lit program. Never mutated. */
export const L: Readonly<Record<"uKeyDir" | "uKeyCol" | "uSky" | "uGround" | "uRimCol", Uniform<Rgb>> & { uExposure: Uniform<number> }> = {
  uKeyDir: { value: [-0.5, 0.85, 0.6] },
  uKeyCol: { value: [1.0, 0.94, 0.84] },
  uSky: { value: [0.86, 0.85, 0.83] },
  uGround: { value: [0.3, 0.25, 0.2] },
  uRimCol: { value: [0.9, 0.84, 0.72] },
  uExposure: { value: 1.0 },
};

/** Light-theme contact shadow. */
export const SHADOW = { strength: 0.56, tint: [0.18, 0.12, 0.06] as Rgb } as const;

export interface MaterialOptions {
  readonly map?: Texture | null;
  readonly color?: Rgb;
  readonly repeat?: readonly [number, number];
  readonly rough?: number;
  /** 0: solid object, 1: outer basket shell, 2: cavity lining. */
  readonly interior?: 0 | 1 | 2;
  readonly relief?: number;
}

/** A lit, double-sided program. `white` stands in for the map on untextured parts. */
export function material(
  gl: OGLRenderingContext,
  white: Texture,
  { map = null, color = [1, 1, 1], repeat = [1, 1], rough = 0.6, interior = 0, relief = 0 }: MaterialOptions = {},
): Program {
  return new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    cullFace: null,
    uniforms: {
      tMap: { value: map ?? white },
      uUseMap: { value: map ? 1 : 0 },
      uColor: { value: color },
      uRepeat: { value: repeat },
      uRough: { value: rough },
      uInterior: { value: interior },
      uRelief: { value: relief },
      ...L,
    },
  });
}

/** "#rrggbb" to 0..1 sRGB, as the shaders expect. */
export function hex(h: string): Rgb {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}
