// components/basket/scene/canvas.ts
export function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const g = canvas.getContext("2d");
  if (!g) throw new Error("Basket scene: this browser gave no 2D canvas context for a texture.");
  return g;
}
