// components/shell/SocialLinks.tsx
import type { Icon } from "@phosphor-icons/react";
import { FacebookLogo, InstagramLogo, LinkedinLogo, XLogo, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { type SocialLink, type SocialNetwork, socialLinks } from "@/lib/site-config";

const ICON: Readonly<Record<SocialNetwork, Icon>> = { instagram: InstagramLogo, facebook: FacebookLogo, linkedin: LinkedinLogo, youtube: YoutubeLogo, x: XLogo };

/** Icon links to Brandbasket's own profiles (lib/site-config.ts). Nothing renders while the list is empty. */
export function SocialLinks({ links = socialLinks }: { readonly links?: readonly SocialLink[] }): ReactElement | null {
  if (links.length === 0) return null;
  return (
    <ul aria-label="Follow us" className="site-footer-social">
      {links.map(({ network, label, href }) => {
        const NetworkIcon = ICON[network];
        return (
          <li key={network}>
            <a className="site-footer-social-link" href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
              <NetworkIcon aria-hidden="true" weight="regular" className="size-5" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
