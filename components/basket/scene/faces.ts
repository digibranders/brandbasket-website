// components/basket/scene/faces.ts
import { context2d } from "./canvas";

const ICON_FAMILY = "Material Symbols Rounded";
/**
 * Six-glyph subset of Material Symbols Rounded 400, self-hosted because the CSP allows only 'self' fonts.
 * Apache License 2.0: public/basket/material-symbols-rounded.LICENSE.txt
 */
const ICON_FONT_URL = "/basket/material-symbols-rounded.woff2";
const FONT_WAIT_MS = 2500;

let fontsReady: Promise<string> | undefined;

/**
 * Loads the tile fonts once per page and resolves with the CSS family list for the tile labels (the site's Red Hat
 * Text from next/font). Like the mock, it gives up waiting after 2.5 s and draws with whatever has loaded.
 */
export function loadFaceFonts(): Promise<string> {
  fontsReady ??= (async (): Promise<string> => {
    const label = getComputedStyle(document.documentElement).getPropertyValue("--font-red-hat-text").trim() || '"Red Hat Text"';
    const icons = new FontFace(ICON_FAMILY, `url(${ICON_FONT_URL}) format("woff2")`);
    document.fonts.add(icons);
    const loaded = Promise.all([icons.load(), document.fonts.load(`700 40px ${label}`)]).then(
      () => undefined,
      () => undefined, // A missing font must not keep the basket from drawing; tiles fall back to system glyphs.
    );
    await Promise.race([loaded, new Promise<void>((resolve) => window.setTimeout(resolve, FONT_WAIT_MS))]);
    return label;
  })();
  return fontsReady;
}

/** A service tile face: brand colour, soft top light, white glyph and label. */
export function iconFace(bg: string, glyph: string, label: string, labelFamily: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = context2d(c);
  g.fillStyle = bg;
  g.fillRect(0, 0, 256, 256);
  const sh = g.createLinearGradient(0, 0, 0, 256);
  sh.addColorStop(0, "rgba(255,255,255,0.2)");
  sh.addColorStop(0.5, "rgba(255,255,255,0)");
  sh.addColorStop(1, "rgba(0,0,0,0.14)");
  g.fillStyle = sh;
  g.fillRect(0, 0, 256, 256);
  g.fillStyle = "#ffffff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `100px "${ICON_FAMILY}"`;
  g.fillText(glyph, 128, 100);
  g.font = `700 40px ${labelFamily}, sans-serif`;
  g.fillText(label, 128, 196);
  return c;
}

/** The website tile face: a browser frame around a client site screenshot. */
export function siteFace(img: HTMLImageElement | null): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 332;
  const g = context2d(c);
  g.fillStyle = "#eceae6";
  g.fillRect(0, 0, 512, 332);
  ["#e7776b", "#e9c46a", "#7cc38f"].forEach((col, i) => {
    g.fillStyle = col;
    g.beginPath();
    g.arc(22 + i * 18, 16, 5.5, 0, Math.PI * 2);
    g.fill();
  });
  g.fillStyle = "#ffffff";
  g.fillRect(84, 7, 400, 18);
  g.fillStyle = "#6b6e74";
  g.font = "13px sans-serif";
  g.textBaseline = "middle";
  g.fillText("yourbusiness.in", 94, 16);
  if (img) g.drawImage(img, 0, 32, 512, (512 * img.naturalHeight) / img.naturalWidth);
  return c;
}
