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

/** Reads the hints in the browser. Call only from client code. */
export function readDeviceHints(): DeviceHints {
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  return {
    webgl: hasWebGL(),
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
