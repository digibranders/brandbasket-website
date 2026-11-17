import type { CSSProperties, ReactElement } from "react";
import { HOME_SERVICES, type HomeServiceId } from "@/content/platform-home";
import { SERVICE_META } from "./service-meta";

/** The deep end of each plan colour, so white type on a tile passes contrast. */
const DEEP: Readonly<Record<HomeServiceId, string>> = {
  website: "var(--rattan-ink)",
  social: "var(--c-growth-2)",
  ads: "var(--c-search-2)",
};

/**
 * Step 1's picture: one tile per service in its plan colour. Only a picture (owner, 2026-11-17): nothing here can be
 * picked, so the step's words, which already name the three services, carry the meaning and the tiles are hidden from
 * screen readers.
 */
export function ServiceTiles(): ReactElement {
  return (
    <div aria-hidden="true" className="pick-grid">
      {HOME_SERVICES.map((service) => {
        const { icon: Icon } = SERVICE_META[service.id];
        return (
          <span key={service.id} style={{ "--deep": DEEP[service.id] } as CSSProperties} className="pick-tile">
            <Icon weight="fill" className="pick-icon" />
            <span className="pick-name">{service.short}</span>
          </span>
        );
      })}
    </div>
  );
}
