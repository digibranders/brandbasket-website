// components/basket/scene/weave.ts
import { context2d } from "./canvas";

/** The rattan weave texture, drawn once: alternating over and under strands on a dark base. */
export function weaveCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = context2d(c);
  g.fillStyle = "#33200e";
  g.fillRect(0, 0, 256, 256);
  const cell = 32;
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      const x = i * cell, y = j * cell, over = (i + j) % 2 === 0;
      const grad = over ? g.createLinearGradient(x, 0, x + cell, 0) : g.createLinearGradient(0, y, 0, y + cell);
      grad.addColorStop(0, over ? "#93612f" : "#74491f");
      grad.addColorStop(0.45, over ? "#d3a066" : "#aa7841");
      grad.addColorStop(1, over ? "#875628" : "#66401b");
      g.fillStyle = grad;
      if (over) g.fillRect(x + 3, y + 1, cell - 6, cell - 2);
      else g.fillRect(x + 1, y + 4, cell - 2, cell - 8);
    }
  }
  return c;
}
