import type { Metadata } from "next";
import type { ReactElement } from "react";
import { GuidePage } from "@/components/guides/GuidePage";
import { COMPARE_PAGE } from "@/content/guides";
import { pageMetadata } from "@/lib/seo/metadata";
import { guideRoute } from "@/lib/seo/routes";

export const metadata: Metadata = pageMetadata(guideRoute(COMPARE_PAGE));

/** /compare/website-options: a free build with a monthly plan against a freelancer, an agency and a DIY builder. */
export default function CompareRoute(): ReactElement {
  return <GuidePage page={COMPARE_PAGE} />;
}
