"use client";

import type { ReactElement } from "react";
import { useSiteKind } from "@/components/basket/useSiteKind";
import { websiteFactsFor } from "@/content/home";
import { FactsStrip } from "./FactsStrip";

/** The facts under the Website Management hero, following the kind of website chosen in the price card. */
export function WebsiteFacts(): ReactElement {
  return <FactsStrip facts={websiteFactsFor(useSiteKind())} />;
}
