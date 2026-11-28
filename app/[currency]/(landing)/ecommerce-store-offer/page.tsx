import { Check } from "@phosphor-icons/react/dist/ssr";
import type { Metadata } from "next";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { CampaignChoice, CampaignConversion, CampaignHeroPrices, CampaignWhatsApp } from "@/components/ecommerce-campaign/CampaignConversion";
import { EcommerceOrderJourney } from "@/components/services/EcommerceOrderJourney";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { Faq } from "@/components/ui/Faq";
import { StepsList } from "@/components/ui/StepsList";
import { CAMPAIGN_FAQ, CAMPAIGN_STEPS, campaignSource, ECOMMERCE_CAMPAIGN_PATH } from "@/content/ecommerce-campaign";
import { ECOMMERCE_SCOPE } from "@/content/ecommerce";
import { currencyParam } from "@/lib/currency";
import { faqJsonLd } from "@/lib/seo/jsonld";
import { pageMetadata } from "@/lib/seo/metadata";
import { campaignCalendarConfig } from "@/lib/server-ecommerce-calendar";
import "./campaign.css";

export const metadata: Metadata = pageMetadata({
  path: ECOMMERCE_CAMPAIGN_PATH,
  title: "Managed Ecommerce Store | BrandBasket",
  description: "Explore BrandBasket's managed ecommerce store, from storefront and checkout to launch and ongoing support.",
  noindex: true,
});

interface PageProps {
  readonly params: Promise<{ readonly currency: string }>;
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EcommerceCampaignPage({ params, searchParams }: PageProps): Promise<ReactElement> {
  const [currency, query] = await Promise.all([currencyParam(params), searchParams]);
  const source = campaignSource(query.source, query.utm_source);
  const { eventTypeId, hostedUrl } = campaignCalendarConfig();
  const [hosting, support, merchantResponsibilities] = ECOMMERCE_SCOPE.maintenance;
  const faq = currency === "INR" ? CAMPAIGN_FAQ : CAMPAIGN_FAQ.filter(({ q }) => q !== "When do I record the testimonial?");

  return (
    <CampaignChoice>
      <section className="store-campaign-hero in-wrap" aria-labelledby="store-campaign-title">
        <div className="store-campaign-hero-copy">
          <p className="store-campaign-kicker">Managed ecommerce</p>
          <h1 id="store-campaign-title">Open your own<br className="store-campaign-break" /> <em>online store.</em></h1>
          <p>BrandBasket builds your storefront, sets up checkout and delivery, and keeps your store running after launch.</p>
          <CampaignHeroPrices currency={currency} />
          <div className="store-campaign-actions">
            <ArrowButton href="#store-campaign-pricing" location="ecommerce_campaign_hero">See my price</ArrowButton>
            <CampaignWhatsApp location="ecommerce_campaign_hero" source={source} />
          </div>
        </div>
        <div className="store-campaign-visual">
          <EcommerceOrderJourney />
        </div>
      </section>

      <CampaignConversion currency={currency} source={source} hostedUrl={hostedUrl} calendarEnabled={eventTypeId !== null} />

      <div className="in-wrap store-campaign-block store-campaign-delivery">
        <section className="store-campaign-scope" aria-labelledby="store-campaign-scope">
          <h2 id="store-campaign-scope">What’s included.</h2>
          <div className="store-campaign-scope-grid">
            <div>
              <h3>Build and handover</h3>
              <ul>
                {ECOMMERCE_SCOPE.build.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}
              </ul>
            </div>
            <div>
              <h3>Monthly care</h3>
              <ul>
                {[hosting, support].map((item) => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}
              </ul>
              <p>{merchantResponsibilities}.</p>
            </div>
          </div>
        </section>
        <section className="store-campaign-launch" aria-labelledby="store-campaign-launch">
          <h2 id="store-campaign-launch">How your store goes live.</h2>
          <StepsList steps={CAMPAIGN_STEPS} />
        </section>
      </div>

      <section className="in-wrap store-campaign-block store-campaign-faq" aria-labelledby="store-campaign-questions">
        <h2 id="store-campaign-questions">Before you get started.</h2>
        <Faq items={faq} id="store-campaign-faq-items" />
      </section>

      <section className="in-wrap store-campaign-block store-campaign-closing" aria-labelledby="store-campaign-close">
        <h2 id="store-campaign-close">Let’s talk about your store.</h2>
        <div className="store-campaign-actions">
          <ArrowButton href="#store-campaign-pricing" location="ecommerce_campaign_footer">{eventTypeId !== null || hostedUrl !== null ? "View my offer and book" : "View my offer"}</ArrowButton>
          <CampaignWhatsApp location="ecommerce_campaign_footer" source={source} />
        </div>
      </section>
      <JsonLd data={faqJsonLd(faq)} />
    </CampaignChoice>
  );
}
