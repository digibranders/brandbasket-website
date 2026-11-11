// components/basket/dock-paths.ts

/** Pages where the floating basket dock can show: the ones that sell the plans, including the website page (the old homepage). */
const DOCK_PATHS: ReadonlySet<string> = new Set(["/", "/pricing", "/services/managed-website"]);

export function showsDock(pathname: string): boolean {
  return DOCK_PATHS.has(pathname);
}
