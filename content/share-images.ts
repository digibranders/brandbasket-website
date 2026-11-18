// content/share-images.ts
// Words on the homepage and Social Media share cards (lib/og/share-image.tsx). No amounts: shared links carry none (CLAUDE.md).
import type { PlatformsCopy, ServicesCopy } from "@/lib/og/share-image";

/** The homepage card (served at /share/home): three tiles, one per service. */
export const HOME_SHARE_IMAGE: ServicesCopy = {
  lead: "Your entire digital presence.",
  tiles: ["Web", "Social", "Ads"],
  line: "Managed with AI.",
  lineAccent: "Website, social media and paid ads.",
};

/** The Social Media page card (served at /share/social): one tile per platform the plan posts to. */
export const SOCIAL_SHARE_IMAGE: PlatformsCopy = {
  lead: "One price. Four platforms.",
  platforms: [
    { letter: "I", name: "Instagram" },
    { letter: "F", name: "Facebook" },
    { letter: "L", name: "LinkedIn" },
    { letter: "G", name: "Google" },
  ],
};
