import { ArrowUp, Check } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { CSSProperties, ReactElement } from "react";
import { HERO_STAGE } from "@/content/platform-home";
import { SERVICE_META } from "./service-meta";

/** Seconds into the hero's entrance at which each update card lands, after the request has been typed and sent. */
const FIRST_CARD_AT = 2.1;
const CARD_GAP = 0.55;

/**
 * The hero picture: a client's real website with one typed request, and the four updates it turns into, one per
 * service, waiting for approval. Pure CSS motion (components/platform-home/platform-home.css), so it paints with the
 * server HTML and ends on the full picture; reduced motion shows the full picture at once. It is an illustration, so
 * its parts are hidden from assistive tech and the figure carries one description.
 */
export function PresenceStage(): ReactElement {
  const reviewAt = FIRST_CARD_AT + HERO_STAGE.updates.length * CARD_GAP + 0.2;
  return (
    <figure className="presence relative m-0 min-w-0" aria-label={HERO_STAGE.label}>
      <div aria-hidden="true" className="presence-inner">
        <div className="presence-browser">
          <div className="presence-bar"><i /><i /><i /><span>{HERO_STAGE.site}</span></div>
          <div className="presence-shot">
            <div className="presence-banner" style={{ "--at": `${FIRST_CARD_AT}s` } as CSSProperties}>Weekend thali, Saturday and Sunday</div>
            <Image src="/home/curry-cook-home.jpg" alt="" width={1400} height={875} priority sizes="(min-width: 1280px) 640px, (min-width: 1000px) 50vw, 92vw" className="block h-auto w-full" />
          </div>
        </div>

        <div className="presence-ask">
          <Image src="/brand/brandbasket-mark.svg" alt="" width={26} height={26} className="size-[26px] flex-none" />
          <span className="presence-type">{HERO_STAGE.request}</span>
          <span className="presence-send"><ArrowUp weight="bold" className="size-4" /></span>
        </div>

        {HERO_STAGE.updates.map((update, i) => {
          const { icon: Icon, tone } = SERVICE_META[update.id];
          return (
            <div key={update.id} className={`presence-card presence-card-${update.id}`} style={{ "--tone": tone, "--at": `${FIRST_CARD_AT + i * CARD_GAP}s` } as CSSProperties}>
              <span className="presence-icon"><Icon weight="duotone" className="size-[19px]" /></span>
              <span className="grid min-w-0">
                <b>{update.title}</b>
                <small>{update.meta}</small>
              </span>
              <span className="presence-ok"><Check weight="bold" className="size-3" /></span>
            </div>
          );
        })}

        <div className="presence-review" style={{ "--at": `${reviewAt}s` } as CSSProperties}>
          <span>{HERO_STAGE.review}</span>
          <span className="presence-approve">{HERO_STAGE.approve}</span>
        </div>
      </div>
    </figure>
  );
}
