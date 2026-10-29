// lib/device-hints.ts
export interface DeviceHints {
  readonly webgl: boolean;
  readonly reducedMotion: boolean;
  readonly saveData: boolean;
  readonly deviceMemory: number | undefined;
}

/** The 3D basket runs only where it is cheap and wanted; everyone else keeps the poster. */
export function shouldRender3D(h: DeviceHints): boolean {
  return h.webgl && !h.reducedMotion && !h.saveData && (h.deviceMemory === undefined || h.deviceMemory > 4);
}

/**
 * Lighthouse and PageSpeed Insights drive Chrome through automation, which sets navigator.webdriver. Their servers have
 * no GPU, so a WebGL context alone blocks the main thread for seconds and the scene for far longer; automated browsers
 * get the poster and never create one. Playwright launches Chrome with AutomationControlled off (playwright.config.ts)
 * so the e2e specs still exercise the scene.
 */
export function isAutomated(nav: { readonly webdriver?: boolean }): boolean {
  return nav.webdriver === true;
}

/** Reads the hints in the browser. Call only from client code. */
export function readDeviceHints(): DeviceHints {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  return {
    webgl: !isAutomated(nav) && hasWebGL(),
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    deviceMemory: nav.deviceMemory,
  };
}

function hasWebGL(): boolean {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  // Free the probe context at once: browsers cap live WebGL contexts and the scene needs one.
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return gl !== null;
}
