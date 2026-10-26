// components/blog/Thumb.tsx: a post's cover at the card shape (1200 by 630), or an empty tile when it has none.
import type { ReactElement } from "react";
import type { Image } from "@/lib/cms/schema";

interface ThumbProps {
  readonly image: Image | null;
  /** The card's link text already says what the picture is, so cards pass "" . */
  readonly alt?: string;
  readonly sizes: string;
  readonly priority?: boolean;
  readonly className?: string;
}

export function Thumb({ image, alt = "", sizes, priority = false, className = "rounded-[22px]" }: ThumbProps): ReactElement {
  return (
    <div className={`aspect-[1200/630] overflow-hidden bg-sunken ${className}`}>
      {image === null ? null : (
        // eslint-disable-next-line @next/next/no-img-element -- the CMS already made the sizes and the srcset
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes={sizes}
          width={image.width}
          height={image.height}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          {...(priority ? { fetchPriority: "high" as const } : {})}
          className="size-full object-cover object-top transition-transform duration-[800ms] ease-[var(--ease)] group-hover:scale-[1.03]"
        />
      )}
    </div>
  );
}
