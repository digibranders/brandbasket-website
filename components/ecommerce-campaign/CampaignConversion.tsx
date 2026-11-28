"use client";

import dynamic from "next/dynamic";
import { createContext, type ReactElement, type ReactNode, useContext, useState } from "react";
import { Arrow, pillClasses } from "@/components/ui/ArrowButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { campaignWhatsAppMessage, ECOMMERCE_CAMPAIGN_PATH, type CampaignSource } from "@/content/ecommerce-campaign";
import { trackAttrs } from "@/lib/analytics";
import { type Currency, formatMoney } from "@/lib/currency";
import { ecommerceCampaignPrice, ECOMMERCE_TESTIMONIAL_DISCOUNT } from "@/lib/pricing";

const BookingCalendar = dynamic(() => import("./BookingCalendar"), { loading: () => <p role="status">Opening the calendar…</p> });

interface Choice {
  readonly optedIn: boolean;
  readonly select: (selected: boolean) => void;
}

const CampaignChoiceContext = createContext<Choice | null>(null);

export function CampaignChoice({ children }: { readonly children: ReactNode }): ReactElement {
  const [optedIn, select] = useState(false);
  return (
    <CampaignChoiceContext.Provider value={{ optedIn, select }}>
      <div className="store-campaign">{children}</div>
    </CampaignChoiceContext.Provider>
  );
}

function useCampaignChoice(): Choice {
  const choice = useContext(CampaignChoiceContext);
  if (choice === null) throw new Error("Campaign pricing must be inside CampaignChoice");
  return choice;
}

export function CampaignHeroPrices({ currency }: { readonly currency: Currency }): ReactElement {
  const { optedIn } = useCampaignChoice();
  const price = ecommerceCampaignPrice(currency, optedIn);
  return (
    <dl className="store-campaign-hero-prices">
      <div>
        <dt>One-time build</dt>
        <dd>{price.campaignDiscount > 0 && <del>{formatMoney(price.list, currency)}</del>} <strong>{formatMoney(price.build, currency)}</strong></dd>
      </div>
      <div><dt>Maintenance</dt><dd>{formatMoney(price.maintenance, currency)}<span>/month</span></dd></div>
    </dl>
  );
}

export function CampaignWhatsApp({ source, location }: { readonly source: CampaignSource | null; readonly location: string }): ReactElement {
  const { optedIn } = useCampaignChoice();
  return <WhatsAppButton location={location} message={campaignWhatsAppMessage(source, optedIn)} />;
}

interface Props {
  readonly currency: Currency;
  readonly source: CampaignSource | null;
  readonly hostedUrl: string | null;
  readonly calendarEnabled: boolean;
}

export function CampaignConversion({ currency, source, hostedUrl, calendarEnabled }: Props): ReactElement {
  const { optedIn, select } = useCampaignChoice();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const price = ecommerceCampaignPrice(currency, optedIn);
  const money = (value: number): string => formatMoney(value, currency);
  const indiaQuery = new URLSearchParams({ currency: "INR", ...(source === null ? {} : { source }) });
  const fallback = hostedUrl === null ? null : hostedBookingLink(hostedUrl, source);

  return (
    <section className="store-campaign-offer" id="store-campaign-pricing" aria-labelledby="store-campaign-price">
      <div className="in-wrap store-campaign-offer-wrap">
        <div className="store-campaign-offer-grid">
          <div className="store-campaign-offer-copy">
            <h2 id="store-campaign-price">Your store price.</h2>
            <p>A one-time price for the build. A separate monthly plan keeps the store hosted, maintained and supported.</p>
            {currency === "INR" ? (
              <label className="store-campaign-toggle">
                <input type="checkbox" checked={optedIn} onChange={(event) => select(event.target.checked)} />
                <span>
                  <strong>Save an extra {money(ECOMMERCE_TESTIMONIAL_DISCOUNT)} on the build</strong>
                  <span>I’m willing to share an honest video testimonial after I’ve used my live store.</span>
                </span>
              </label>
            ) : (
              <a className="store-campaign-link" href={`${ECOMMERCE_CAMPAIGN_PATH}?${indiaQuery}#store-campaign-pricing`}>See the India offer in rupees</a>
            )}
          </div>
          <div className="store-campaign-price-sheet">
            <dl aria-live="polite" aria-atomic="true">
              <div><dt>Store build price</dt><dd>{money(price.list)}</dd></div>
              {price.campaignDiscount > 0 && <div><dt>Campaign Discount</dt><dd>−{money(price.campaignDiscount)}</dd></div>}
              {price.testimonialDiscount > 0 && <div><dt>Testimonial Discount</dt><dd>−{money(price.testimonialDiscount)}</dd></div>}
              <div className="store-campaign-build-total"><dt>One-time build</dt><dd>{money(price.build)}</dd></div>
              <div className="store-campaign-maintenance">
                <dt>Monthly maintenance{currency === "INR" ? <small className="store-campaign-tax">GST included</small> : null}</dt>
                <dd>{money(price.maintenance)} <small>/ month</small></dd>
              </div>
            </dl>
            <div className="store-campaign-actions">
              {calendarEnabled ? (
                <a href="#store-campaign-booking" aria-controls="store-campaign-booking" aria-expanded={calendarOpen} onClick={() => setCalendarOpen(true)} className={pillClasses("md", "action")} {...trackAttrs("cta_click", "ecommerce_campaign_booking")}>
                  Book a store planning call <Arrow size="md" />
                </a>
              ) : fallback ? (
                <a href={fallback} target="_blank" rel="noopener noreferrer" className={pillClasses("md", "action")} {...trackAttrs("cta_click", "ecommerce_campaign_booking")}>
                  Book a store planning call <Arrow size="md" />
                </a>
              ) : null}
              <CampaignWhatsApp location="ecommerce_campaign_price" source={source} />
            </div>
            {!calendarEnabled && fallback === null && <p>Message us on WhatsApp to arrange a planning call.</p>}
          </div>
        </div>

        {calendarEnabled && (
          <div id="store-campaign-booking" className="store-campaign-calendar" hidden={!calendarOpen}>
            {calendarOpen && <BookingCalendar source={source} testimonialOptIn={optedIn} fallback={fallback} />}
          </div>
        )}
      </div>
    </section>
  );
}

function hostedBookingLink(href: string, source: CampaignSource | null): string {
  const url = new URL(href);
  url.searchParams.set("utm_campaign", "ecommerce-store");
  if (source !== null) url.searchParams.set("utm_source", source);
  return url.href;
}
