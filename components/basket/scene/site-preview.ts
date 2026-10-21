import { context2d } from "./canvas";

/** A fictional studio website, drawn at texture resolution so its type stays crisp in 3D. */
export function siteFace(image: HTMLImageElement | null, aspect: number, labelFamily: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 1536;
  canvas.height = Math.round(canvas.width * aspect);
  const g = context2d(canvas);
  g.scale(3, 3);
  g.fillStyle = "#f8f8f3";
  g.fillRect(0, 0, 512, canvas.height / 3);

  // Browser chrome distinguishes the website from the surrounding printed service cards.
  g.fillStyle = "#e9ebe5";
  g.fillRect(0, 0, 512, 32);
  ["#c88476", "#c9b17b", "#8aa28a"].forEach((color, index) => {
    g.fillStyle = color;
    g.beginPath();
    g.arc(18 + index * 13, 16, 3.5, 0, Math.PI * 2);
    g.fill();
  });
  g.fillStyle = "#f8f8f3";
  g.beginPath();
  g.roundRect(104, 6, 304, 20, 6);
  g.fill();
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#68756b";
  g.font = `500 11px ${labelFamily}, sans-serif`;
  g.fillText("yourbusiness.in", 256, 16);

  g.textAlign = "left";
  g.fillStyle = "#253b30";
  g.font = `700 22px ${labelFamily}, sans-serif`;
  g.fillText("FORMA", 28, 57);
  g.font = `500 12px ${labelFamily}, sans-serif`;
  g.fillText("Studio", 321, 57);
  g.fillText("Projects", 376, 57);
  g.fillText("Contact", 440, 57);
  g.fillStyle = "#dde2d9";
  g.fillRect(28, 78, 460, 1);

  g.fillStyle = "#253b30";
  g.font = `700 34px ${labelFamily}, sans-serif`;
  g.fillText("Spaces for", 28, 126);
  g.fillText("better living.", 28, 165);
  g.fillStyle = "#697367";
  g.font = `400 14px ${labelFamily}, sans-serif`;
  g.fillText("Thoughtful homes.", 28, 199);
  g.fillText("Designed around you.", 28, 220);
  g.fillStyle = "#304e3d";
  g.beginPath();
  g.roundRect(28, 245, 154, 36, 6);
  g.fill();
  g.fillStyle = "#ffffff";
  g.textAlign = "center";
  g.font = `600 14px ${labelFamily}, sans-serif`;
  g.fillText("Book a visit", 105, 263);

  g.save();
  g.beginPath();
  g.roundRect(264, 96, 224, 238, 8);
  g.clip();
  g.fillStyle = "#e1e6dc";
  g.fillRect(264, 96, 224, 238);
  if (image && image.naturalWidth > 0 && image.naturalHeight > 0) {
    const scale = Math.max(224 / image.naturalWidth, 238 / image.naturalHeight);
    const width = 224 / scale, height = 238 / scale;
    g.drawImage(image, (image.naturalWidth - width) / 2, (image.naturalHeight - height) / 2, width, height, 264, 96, 224, 238);
  } else {
    // Keep the complete website composition when its optional photograph cannot load.
    g.fillStyle = "#52634e";
    g.font = `600 22px ${labelFamily}, sans-serif`;
    g.fillText("Thoughtfully", 376, 201);
    g.fillText("designed.", 376, 230);
  }
  g.restore();
  return canvas;
}
