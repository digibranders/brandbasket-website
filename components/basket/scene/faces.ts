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

/** Original service-card treatment: rich brand colour, soft top light, white icon and label. */
export function iconFace(color: string, glyph: string, label: string, labelFamily: string, aspect = 1): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = 768;
  c.height = Math.round(768 * aspect);
  const g = context2d(c);
  g.scale(3, 3);
  const height = c.height / 3;
  g.fillStyle = color;
  g.fillRect(0, 0, 256, height);
  const light = g.createLinearGradient(0, 0, 0, height);
  light.addColorStop(0, "rgba(255,255,255,0.2)");
  light.addColorStop(0.5, "rgba(255,255,255,0)");
  light.addColorStop(1, "rgba(0,0,0,0.14)");
  g.fillStyle = light;
  g.fillRect(0, 0, 256, height);
  g.fillStyle = "#ffffff";
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.font = `100px "${ICON_FAMILY}"`;
  g.fillText(glyph, 128, 100);
  g.font = `700 40px ${labelFamily}, sans-serif`;
  g.fillText(label, 128, 196, 224);
  return c;
}
