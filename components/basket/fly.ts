// components/basket/fly.ts

export const FLY_MS = 700;

interface Point {
  readonly x: number;
  readonly y: number;
}

const centre = (rect: DOMRect, size: number): Point => ({ x: rect.left + rect.width / 2 - size / 2, y: rect.top + rect.height / 2 - size / 2 });

/**
 * A small dot in the plan's colour flies from the control that was clicked to the basket in a curve, then disappears.
 * One-off element driven by the Web Animations API (transform and opacity only), removed when it lands. The curve is
 * sampled so it is a smooth arc rather than two straight lines.
 */
export function flyDot(from: DOMRect, to: DOMRect, colour: string, delayMs: number): void {
  const size = 16;
  const start = centre(from, size);
  const end = centre(to, size);
  const control: Point = { x: (start.x + end.x) / 2, y: Math.min(start.y, end.y) - 110 };
  const dot = document.createElement("span");
  dot.setAttribute("aria-hidden", "true");
  Object.assign(dot.style, {
    position: "fixed", left: "0", top: "0", width: `${size}px`, height: `${size}px`, borderRadius: "50%", background: colour,
    boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.95), 0 10px 18px -6px rgba(40, 28, 14, 0.55)", zIndex: "40", pointerEvents: "none", willChange: "transform, opacity",
  });
  document.body.append(dot);
  const steps = 14;
  const frames: Keyframe[] = Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const x = (1 - t) ** 2 * start.x + 2 * (1 - t) * t * control.x + t ** 2 * end.x;
    const y = (1 - t) ** 2 * start.y + 2 * (1 - t) * t * control.y + t ** 2 * end.y;
    return { transform: `translate(${x}px, ${y}px) scale(${1.1 - 0.65 * t})`, opacity: t < 0.08 ? t / 0.08 : 1, offset: t };
  });
  const run = dot.animate(frames, { duration: FLY_MS, delay: delayMs, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "both" });
  const done = (): void => dot.remove();
  run.finished.then(done, done);
}
