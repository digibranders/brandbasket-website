// components/blog/Crumbs.tsx: the breadcrumb above a blog page's heading. The last item is the page itself.
import { CaretRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { Fragment, type ReactElement } from "react";

export interface Crumb {
  readonly label: string;
  readonly href?: string;
}

export function Crumbs({ items }: { readonly items: readonly Crumb[] }): ReactElement {
  return (
    <nav aria-label="Breadcrumb" className="mb-[18px] flex flex-wrap items-center gap-2 text-[14px] text-ink-2">
      {items.map((item, index) => (
        <Fragment key={item.label}>
          {index > 0 ? <CaretRight aria-hidden="true" className="size-3" /> : null}
          {item.href === undefined ? <span aria-current="page">{item.label}</span> : <Link href={item.href} className="underline-offset-[3px] hover:text-ink hover:underline">{item.label}</Link>}
        </Fragment>
      ))}
    </nav>
  );
}
