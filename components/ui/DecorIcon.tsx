import type { Icon } from "@phosphor-icons/react";
import type { CSSProperties, ReactElement } from "react";

interface DecorIconProps {
  readonly icon: Icon;
  /** Rendered size in px. */
  readonly size: number;
  /** Degrees. */
  readonly rotate: number;
  /** Position inside the nearest Band, for example "right-[5%] top-0". Add max-[760px]:hidden to drop it on phones. */
  readonly className: string;
  /** Fainter, for sections with less going on. */
  readonly faint?: boolean;
}

/** A large, thin, faint rattan icon behind a section's content. Purely decorative. */
export function DecorIcon({ icon: Glyph, size, rotate, className, faint = false }: DecorIconProps): ReactElement {
  const style: CSSProperties = { transform: `rotate(${rotate}deg)` };
  return (
    <span aria-hidden="true" style={style} className={`pointer-events-none absolute -z-10 max-[760px]:scale-[0.62] ${className}`}>
      <Glyph weight="thin" size={size} className={faint ? "text-rattan-text/20" : "text-rattan-text/35"} />
    </span>
  );
}
