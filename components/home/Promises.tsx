import { User } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import type { ReactElement } from "react";
import { BasketCta } from "@/components/basket/BasketCta";
import { InView } from "@/components/motion/InView";
import { TwoTierHead } from "@/components/ui/TwoTierHead";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PROMISES } from "@/content/home";
import { HOME_ICONS } from "./icons";

const PHOTO = "/images/support-person.jpg";
const BUBBLE = "absolute z-[3] flex w-fit max-w-full gap-3 rounded-[22px] py-3.5 pl-3.5 pr-[18px] text-[14.5px] leading-[1.4] shadow-[0_24px_44px_-26px_rgba(40,28,14,0.55),0_0_0_1px_rgba(21,22,26,0.06)]";

/**
 * "Human Support. When It Matters Most": a blurred copy of the photo behind a sharp portrait with a live support chat,
 * two frosted promise cards and the button pair (mock: #s-promises, option 5). Photo and name are placeholders.
 */
export function Promises(): ReactElement {
  const { chat } = PROMISES;
  return (
    <section id="promises" aria-labelledby="h-promises" className="in-wrap pb-24 pt-[clamp(48px,6vw,80px)]">
      <div className="relative isolate overflow-clip rounded-[36px] bg-sunken shadow-[0_50px_80px_-56px_rgba(40,28,14,0.45),0_0_0_1px_rgba(21,22,26,0.05)]">
        <Image src={PHOTO} alt="" aria-hidden="true" fill sizes="100vw" className="-z-20 scale-[1.3] object-cover blur-[46px] saturate-[1.2]" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(246,245,242,0.78),rgba(244,230,211,0.74))]" />
        <div className="grid grid-cols-[minmax(0,1fr)] gap-[clamp(24px,4vw,56px)] p-[clamp(20px,3vw,40px)] min-[1000px]:grid-cols-[0.72fr_1.28fr] min-[1000px]:items-center">
          <InView>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-sunken shadow-[0_34px_60px_-38px_rgba(40,28,14,0.55)] max-[640px]:aspect-auto max-[640px]:min-h-[560px]">
              <Image src={PHOTO} alt={PROMISES.photoAlt} width={1024} height={768} sizes="(min-width: 1000px) 30vw, 100vw" className="absolute inset-0 size-full object-cover object-[56%_22%] max-[640px]:inset-x-0 max-[640px]:bottom-0 max-[640px]:top-[150px] max-[640px]:h-[calc(100%-150px)] max-[640px]:[mask-image:linear-gradient(to_bottom,transparent,#000_14%)]" />
              <div className={`px-bub cust ${BUBBLE} bottom-28 left-5 w-[230px] items-center bg-surface text-ink max-[640px]:bottom-auto max-[640px]:left-3.5 max-[640px]:top-3.5`}>
                <span aria-hidden="true" className="grid size-9 flex-none place-items-center rounded-full bg-sunken text-ink-2"><User className="size-5" /></span>
                <span>{chat.customer}</span>
              </div>
              <div aria-hidden="true" className="px-typing absolute bottom-5 left-5 z-[3] flex w-fit gap-[5px] rounded-[22px] bg-ink px-[18px] py-[15px] shadow-[0_24px_44px_-26px_rgba(40,28,14,0.55)] max-[640px]:bottom-auto max-[640px]:left-3.5 max-[640px]:top-[86px]">
                <span className="size-[7px] rounded-full bg-white/80" /><span className="size-[7px] rounded-full bg-white/80" /><span className="size-[7px] rounded-full bg-white/80" />
              </div>
              <div className={`px-bub rep ${BUBBLE} bottom-5 left-5 w-[290px] max-w-[calc(100%-40px)] items-start bg-ink text-white max-[640px]:bottom-auto max-[640px]:left-3.5 max-[640px]:top-[86px]`}>
                <Image src={PHOTO} alt="" width={40} height={30} className="size-10 flex-none rounded-full object-cover object-[56%_22%] shadow-[0_0_0_2px_rgba(255,255,255,0.3)]" />
                <div>
                  <b className="block font-display text-sm font-medium tracking-[-0.01em]">{chat.rep.name}<span className="ml-1.5 font-sans text-[12.5px] font-normal text-white/70">{chat.rep.role}</span></b>
                  <p className="mt-[3px] text-white/90">{chat.rep.text}</p>
                </div>
              </div>
            </div>
          </InView>
          <div>
            <TwoTierHead id="h-promises" small={PROMISES.small} large={PROMISES.large} />
            <p className="mt-[18px] max-w-[44ch] text-pretty text-[17px] leading-[1.6] text-ink-2">{PROMISES.body}</p>
            <div className="mt-7 grid grid-cols-[minmax(0,1fr)] gap-4 min-[700px]:grid-cols-2">
              {PROMISES.cards.map((card) => {
                const Glyph = HOME_ICONS[card.icon];
                return (
                  <article key={card.title} className="rounded-3xl bg-surface/60 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75),0_0_0_1px_rgba(255,255,255,0.55),0_26px_44px_-32px_rgba(40,28,14,0.45)] backdrop-blur-[18px] backdrop-saturate-[1.2]">
                    <span aria-hidden="true" className="mb-4 grid size-12 place-items-center rounded-full bg-surface text-rattan-text"><Glyph weight="duotone" className="size-[26px]" /></span>
                    <h3 className="font-display text-[clamp(20px,2vw,26px)] font-semibold leading-[1.15] tracking-[-0.03em]">{card.title}</h3>
                    <p className="mt-2.5 text-base leading-[1.6] text-ink-2">{card.text}</p>
                  </article>
                );
              })}
            </div>
            <div className="cta-pair mt-7">
              <BasketCta location="promises" />
              <WhatsAppButton location="promises" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
