import type { ReactElement } from "react";
import { websiteFactsFor } from "@/content/home";
import { FactsStrip } from "./FactsStrip";

export function WebsiteFacts(): ReactElement {
  return <FactsStrip facts={websiteFactsFor("b2b")} />;
}
