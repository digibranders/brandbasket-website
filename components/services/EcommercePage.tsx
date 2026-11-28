import { ArrowDown, CheckCircle, CreditCard, Gauge, Package, RocketLaunch, ShieldCheck, Storefront, Truck } from "@phosphor-icons/react/dist/ssr";
import type { ReactElement } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { Faq } from "@/components/ui/Faq";
import { StepsList } from "@/components/ui/StepsList";
import { ECOMMERCE_FAQ, ECOMMERCE_HERO, ECOMMERCE_LABEL, ECOMMERCE_MODULES, ECOMMERCE_PATH, ECOMMERCE_SCOPE, ECOMMERCE_STEPS } from "@/content/ecommerce";
import { type Currency, formatMoney } from "@/lib/currency";
import { planPrice, siteBuildPrice } from "@/lib/pricing";
import { breadcrumbJsonLd, ecommerceServiceJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { signupHref } from "@/lib/signup";
import { EcommerceMerchantPreview } from "./EcommerceMerchantPreview";
import { EcommerceOrderJourney } from "./EcommerceOrderJourney";

const MODULE_ICONS = [Storefront, Package, CreditCard, Truck, Gauge, RocketLaunch] as const;

export function EcommercePage({ currency }: { readonly currency: Currency }): ReactElement {
  const build = formatMoney(siteBuildPrice("ecommerce", currency), currency);
  const maintenance = formatMoney(planPrice("website", currency, "ecommerce"), currency);
  const checkout = signupHref({ website: true, social: false, ads: false }, false, "ecommerce");

  return (
    <div className="ecommerce-page">
      <section className="ecommerce-hero" aria-labelledby="ecommerce-heading">
        <div className="in-wrap ecommerce-hero-grid">
          <div className="ecommerce-hero-copy">
            <span className="ecommerce-hero-label">{ECOMMERCE_HERO.label}</span>
            <h1 id="ecommerce-heading"><span>{ECOMMERCE_HERO.headline}</span>{" "}<em>{ECOMMERCE_HERO.accent}</em></h1>
            <p>{ECOMMERCE_HERO.body}</p>
            <div className="ecommerce-hero-pricing">
              <dl className="ecommerce-price">
                <div><dt>One-time build</dt><dd>{build}</dd></div>
                <div><dt>Monthly maintenance</dt><dd>{maintenance}</dd></div>
              </dl>
              {currency === "INR" ? <small>GST included</small> : null}
            </div>
            <div className="cta-pair">
              <ArrowButton href={checkout} location="ecommerce_hero">{ECOMMERCE_HERO.cta}</ArrowButton>
              <a className="ecommerce-jump" href="#store-dashboard">Explore the dashboard <ArrowDown size={16} aria-hidden="true" /></a>
            </div>
          </div>
          <EcommerceOrderJourney />
        </div>
      </section>

      <section id="store-dashboard" className="ecommerce-merchant" aria-labelledby="ecommerce-merchant-heading">
        <span id="follow-an-order" className="ecommerce-merchant-anchor" aria-hidden="true" />
        <div className="in-wrap ecommerce-merchant-layout">
          <Reveal className="ecommerce-merchant-intro">
            <h2 id="ecommerce-merchant-heading">Run your store from one dashboard.</h2>
            <p>See what needs packing, update your catalog and keep stock accurate. We’ll show your team how to use the dashboard at handover.</p>
          </Reveal>
          <Reveal><EcommerceMerchantPreview /></Reveal>
        </div>
      </section>

      <section id="store-includes" className="in-wrap ecommerce-section" aria-labelledby="ecommerce-includes">
        <Reveal><h2 id="ecommerce-includes">What’s included in the build.</h2></Reveal>
        <ul className="ecommerce-modules">
          {ECOMMERCE_MODULES.map(({ title, body }, index) => {
            const Icon = MODULE_ICONS[index];
            return <li key={title}><Reveal delay={(index % 3) * 45}><Icon size={28} weight="duotone" aria-hidden="true" /><h3>{title}</h3><p>{body}</p></Reveal></li>;
          })}
        </ul>
      </section>

      <section className="in-wrap ecommerce-section" aria-labelledby="ecommerce-launch">
        <Reveal>
          <h2 id="ecommerce-launch">From kickoff to launch.</h2>
          <p>Our target is 21 days once your catalog, brand assets and setup requirements are ready.</p>
        </Reveal>
        <StepsList steps={ECOMMERCE_STEPS} layout="columns" />
      </section>

      <section className="ecommerce-scope" aria-labelledby="ecommerce-scope-heading">
        <div className="in-wrap ecommerce-section">
          <Reveal><h2 id="ecommerce-scope-heading">What your price covers.</h2></Reveal>
          <div className="ecommerce-scope-grid">
            <div>
              <Storefront size={28} weight="duotone" aria-hidden="true" />
              <h3>{build} to build</h3>
              <ul>{ECOMMERCE_SCOPE.build.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <ShieldCheck size={28} weight="duotone" aria-hidden="true" />
              <h3>{maintenance} per month</h3>
              <ul>{ECOMMERCE_SCOPE.maintenance.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
          <p>{ECOMMERCE_SCOPE.note}</p>
        </div>
      </section>

      <section className="in-wrap ecommerce-section ecommerce-split" aria-labelledby="ecommerce-faq">
        <div>
          <h2 id="ecommerce-faq">Questions about your store?</h2>
          <p>Third-party services and larger jobs, such as migrations or custom integrations, are scoped before work starts.</p>
        </div>
        <Faq items={ECOMMERCE_FAQ} id="ecommerce-faq-items" />
      </section>

      <section className="ecommerce-closing" aria-labelledby="ecommerce-start">
        <div className="in-wrap ecommerce-split">
          <div><CheckCircle size={30} weight="duotone" aria-hidden="true" /><h2 id="ecommerce-start">Ready to open your store?</h2></div>
          <div className="ecommerce-closing-actions">
            <ArrowButton href={checkout} location="ecommerce_footer">{ECOMMERCE_HERO.cta}</ArrowButton>
            <ArrowLink href="/services/managed-website">Explore Business Website Management</ArrowLink>
          </div>
        </div>
      </section>
      <JsonLd data={ecommerceServiceJsonLd(currency)} />
      <JsonLd data={faqJsonLd(ECOMMERCE_FAQ)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: ECOMMERCE_LABEL, path: ECOMMERCE_PATH }])} />
    </div>
  );
}
