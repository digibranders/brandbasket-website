// components/blog/PostMeta.tsx: "23 Oct 2026 · 7 min read".
import type { ReactElement } from "react";
import { formatDate, readingTime } from "@/lib/blog/format";

export function PostMeta({ publishedAt, minutes, className = "" }: { readonly publishedAt: string | null; readonly minutes: number; readonly className?: string }): ReactElement {
  return (
    <p className={`num text-[13.5px] text-ink-2 ${className}`}>
      {publishedAt === null ? null : <><time dateTime={publishedAt}>{formatDate(publishedAt)}</time> · </>}
      {readingTime(minutes)}
    </p>
  );
}
