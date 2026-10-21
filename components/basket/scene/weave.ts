import { context2d } from "./canvas";

/** Seamless, tightly packed split cane with alternating crossings and fine longitudinal grain. */
export function weaveCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = context2d(c);
  g.fillStyle = "#8c633f";
  g.fillRect(0, 0, 512, 512);
  const cell = 64;
  for (let j = 0; j < 8; j++) {
    for (let i = 0; i < 8; i++) {
      const x = i * cell, y = j * cell, vertical = (i + j) % 2 === 0;
      const tone = Math.sin(i * 13 + j * 7) * 5;
      const grad = vertical ? g.createLinearGradient(x, 0, x + cell, 0) : g.createLinearGradient(0, y, 0, y + cell);
      grad.addColorStop(0, "#986e46");
      grad.addColorStop(0.15, `rgb(${180 + tone}, ${139 + tone}, ${91 + tone})`);
      grad.addColorStop(0.48, `rgb(${204 + tone}, ${166 + tone}, ${116 + tone})`);
      grad.addColorStop(0.82, "#b68a58");
      grad.addColorStop(1, "#91643e");
      g.fillStyle = grad;
      g.fillRect(x + (vertical ? 3 : 0), y + (vertical ? 0 : 3), cell - (vertical ? 6 : 0), cell - (vertical ? 0 : 6));
      for (let strand = 0; strand < 11; strand++) {
        const offset = 7 + strand * 5;
        g.strokeStyle = strand % 3 === 0 ? "rgba(255,237,196,0.14)" : "rgba(94,60,31,0.10)";
        g.lineWidth = 0.8;
        g.beginPath();
        if (vertical) { g.moveTo(x + offset, y); g.lineTo(x + offset + 0.8, y + cell); }
        else { g.moveTo(x, y + offset); g.lineTo(x + cell, y + offset + 0.8); }
        g.stroke();
      }
    }
  }
  return c;
}

/** Closely spaced bindings for the rim and handle, continuous at the texture seam. */
export function bindingCanvas(): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = context2d(c);
  const grad = g.createLinearGradient(0, 0, 128, 0);
  grad.addColorStop(0, "#997044");
  grad.addColorStop(0.12, "#bd945f");
  grad.addColorStop(0.4, "#d0ad78");
  grad.addColorStop(0.8, "#c29a65");
  grad.addColorStop(1, "#997044");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 24; i++) {
    g.fillStyle = i % 3 === 0 ? "rgba(255,240,208,0.12)" : "rgba(104,72,38,0.08)";
    g.fillRect(0, i * 5 + 2, 128, 1);
  }
  return c;
}
