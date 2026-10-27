# Launch checklist

Kept current during the build (plan 02, Task 11.4). Nothing here is visible on the site as "TBD": every open item ships with the mock's wording until the owner confirms or replaces it.

Status key: **Open** (needs the owner), **Placeholder** (mock wording in use), **Done**.

## Open inputs from the plan

| # | Input | Status | Where it lives |
|---|---|---|---|
| D3 | Cancellation and refund terms for monthly billing | Answered from the published Fynix policy; owner to confirm in review. Cancel anytime with no notice period; the website stays online until the end of the month already paid for; no refund of a part-used month; a reminder before every renewal; a failed payment takes the website offline at once with no grace period, content kept and the site restored when the payment goes through; plan changes start from the next monthly bill; the domain is the customer's, the design and content are a hosted service while subscribed | `content/legal/cancellation.ts` (used by terms, refund, the Home and Pricing FAQs, pricing "Good to know" and About) |
| D4 | What does Social Media and Ads include? | Answered 2026-10-21: Instagram, Facebook and Google Business Profile posts, with the number each month agreed directly with each client (owner); review replies; Meta ads managed for up to ₹10,000 a month of the client's budget plus our ad credit; monthly report; reels at ₹500 an hour | `content/basket.ts`, `content/pricing.ts` |
| D5 | Real proof: client sites for the showcase, Google rating, quotes | Placeholder: Curry Cook, GKR Hospitality and PayWeek sample sites and screenshots; heading "Real websites, live today." | `content/home.ts` `WORK`, `public/work/` |
| D9 | Grievance Officer name and email | Answered 2026-10-22 (owner): Siddique Ahmed, "Grievance Officer", reached at support@brandbasket.in (a real mailbox; no separate grievance@) | `lib/site-config.ts` `grievanceOfficer` |
| D10 | Plan parameter format the platform reads from the sign-up link | `?plan=` lists any of `website`, `growth`, `search` (for example `growth,search` without the website). brandbasket-platform reads it from plan 16 Task P3.1, so the website and the platform release together. Main buttons go to `/contact#start` until `NEXT_PUBLIC_SIGNUP_URL` is set | `lib/signup.ts` |
| D11 | Phone, WhatsApp number and hours | +91 789 789 6607 confirmed 2026-10-22 (owner: answered for Brandbasket); hours Mon to Sat, 10 am to 7 pm IST still to confirm | `lib/site-config.ts` |

## Owner review of new copy

| Item | Status |
|---|---|
| Legal set: privacy, terms, refund, shipping, data notice | Open: review on the preview, ideally with a lawyer. Version label `LEGAL_TEXT_VERSION` must be bumped to the real publish date |
| About "Lock you in": "Cancel anytime, with no notice period. Your domain stays yours." (replaces the 30 days' notice placeholder) | Open |
| Legal text version 2026-10-19.3: the new cancellation, failed payment, renewal reminder and ownership sentences in terms sections 5, 6 and 9 and the refund policy | Open |
| Legal text versions 2026-10-21.1 and .2: `PACKAGE_TERMS` and `AD_CREDIT_TERMS` in terms section 5, every plan sold on its own, the drop rule, "Your package price and ad credit stay." after a failed payment | Decided by Claude 2026-10-21, owner delegated ("take your decisions"): kept as written. A lawyer's read of the legal set is still advised (row above) |
| Ad credit tax treatment: it is kept off the invoice and recorded on the subscription only | Confirmed by the owner 2026-10-21: ad credit stays out of invoices |
| Basket and pricing copy shown in the chosen mock (option B): the offer note, switch rows, comparison rows, plan details, the pricing FAQ "Do I need the website plan?" and "Can I add or drop a plan later?" (owner wording for the drop rule, 2026-10-21) | Decided by Claude 2026-10-21, owner delegated ("take your decisions"): kept as in the mock |
| Home meta description shortened to 155 characters ("Add social, ads and local search any time.") | Decided by Claude 2026-10-21, owner delegated ("take your decisions"): kept |
| Cancellation and failed payment wording for a client without the website plan | Decided by Claude 2026-10-21, owner delegated ("take your decisions"): stated for every plan ("Your plans keep running until the end of the month...", "Your plans pause... A website we host goes offline..."), legal text 2026-10-21.2, mock updated |
| Locked copy with a basket that has no website ("Get my free website" buttons, pricing headline "Simple monthly plans. Start with your website.") | Decided by Claude 2026-10-21, owner delegated ("take your decisions"): kept unchanged; locked copy changes only with the owner's own yes, and the free build is still the offer |
| Contact page meta description | Open |
| Error page lines ("Sorry, something went wrong." and the retry line) and 404 link labels | Open |
| Default share image: "Your Business Has a Name. Give It a Place on the Internet." over the offer line | Open |
| FAQ answers that do not open with a direct answer: Pricing "Do you guarantee rankings or leads?" opens with "No one honestly can." Suggested: start with "No." | Open |
| Unselected work showcase tab names are 45% ink (2.9:1 contrast, fails WCAG AA; matches the mock). 60% would pass | Open |

## Legal statements the owner must confirm

- Billing method: Razorpay autopay (e-mandate) or monthly invoices. The refund policy is worded to be true either way.
- Mailbox provider behind hello@, support@ and the contact inbox: not yet in the processor list.
- DNS on Cloudflare (Cloudflare is listed as a processor).
- DPDP Rules 2025 r.8(3) log retention of one year is cited; the site keeps no logs beyond Vercel's window. Add a log drain or drop the citation after legal advice.
- Retention: leads 12 months, client records 8 years, support email 3 years. Customer data deleted within 30 days of a plan ending.
- Grievances acknowledged within 48 hours and resolved within 30 days.
- Cancel anytime, no notice period; the website stays online until the end of the month already paid for, and a part-used month is not refunded.
- A reminder before every renewal (terms section 5 and the refund policy). Confirm who sends it: Brandbasket, Razorpay or both.
- A failed payment takes the website offline as soon as it is due and unpaid, with no grace period; content is kept and the website comes back when the payment goes through.
- Ownership: the domain is the customer's; the design and the content Brandbasket writes are a hosted service while subscribed. The customer's own name, logo and material stay theirs (terms section 6).
- Terms section 9 keeps the FirstFold clause ending an engagement for a material breach not put right within 30 days of written notice. It is separate from cancellation; confirm it stays.
- Liability capped at 12 months of fees; confidentiality for 3 years.
- Shipping: site live within about a week of receiving content; monthly report by email.
- Where client account and billing data live before the platform launches; the platform must show its own cookie notice.
- `requiredBy` citations were adapted, not checked by a lawyer.

## Claims on Home and Pricing to confirm

- "Live in about a week" (facts strip) and "Week 1: We set everything up" (steps).
- "A free 15-minute call" (steps and closing).
- Scope: up to 10 pages, 2 small edits a month of up to 15 minutes, Local SEO "5 pages improved every month", "AI visibility tracking where measurable", "A/B tests where budget allows".
- The example report (marked "Example report"): Pune dental clinic, KPIs and chart are sample data.
- "Do you guarantee rankings? No one honestly can." and the ad budget cap of ₹10,000 a month.
- Home FAQ "Send any change from your dashboard" assumes the platform dashboard is live at launch.
- Home FAQ "your website goes live within 7 working days" sits next to the facts strip's "Live in about a week". Both kept as written; confirm they agree.

## Pages and links held back

- The industry pages (`/industries` and the eight `/industries/[slug]` pages) were removed at the owner's request, 2026-10-22. The homepage keeps the eight trades as plain icon tiles with no links.

## Deferred engineering

- Analytics: `cta_click` now reports the plans in the link and `none` when the link has no plan (before, the website was always counted). Dashboards that filter on `website` change meaning from this release.
- `e2e/contact.spec.ts` still expects the phone field that commit eb9be07 replaced with email; 3 tests fail on both projects. Fix before running e2e in CI.

- Phase 9: Playwright end to end, axe accessibility and Lighthouse CI budgets.
- Phase 10: route registry, sitemap entries for every page, OG images, llms.txt route list, internal linking and AEO pass.
- First-load JavaScript on `/` is about 192 KB gzipped against the 120 KB budget. Investigate before launch.
- Phase 11 launch steps (Brevo sender, Vercel production env, domain, Search Console, Razorpay website approval).
- Turning indexing on is a launch step: set SITE_INDEXING=on in Vercel production only after the owner approves, then submit the sitemap in Search Console.

## Owner approvals received

| Item | Date |
|---|---|
| Managed Website price ₹2,999 a month and the matching offer line (₹3,000 from the 2026-10-21 pricing change, back to ₹2,999 later that day) | 2026-10-19 |
| GST shown to the paisa to match checkout | 2026-10-19 |
| 5% off add-ons chosen at sign-up; no Premium discount (superseded 2026-10-21) | 2026-10-19 |
| Prices ₹3,000 / ₹10,000 / ₹25,000 (superseded the same day by ₹2,999 / ₹9,999 / ₹24,999, row below), each plan on its own; packages 20% (Website + Social, Website + SEO) and 30% (Social + SEO, All three); monthly ad credit ₹2,000 / ₹2,000 / ₹5,000 when bought together at the first purchase; 5% offer and stay offers removed (plans 15 and 16) | 2026-10-21 |
| Design option B: the live basket with three switches and the offer note | 2026-10-21 |
| List prices now ₹2,999 / ₹9,999 / ₹24,999 a month (from ₹3,000 / ₹10,000 / ₹25,000); packages 20% and 30% off as before, so they now come out in paise (₹10,398.40, ₹22,398.40, ₹24,498.60, ₹26,597.90); ad credit, the ₹10,000 ad budget and USD prices unchanged | 2026-10-21 |
| Package prices round down to the whole rupee (₹10,398, ₹22,398, ₹24,498, ₹26,597; savings ₹2,600, ₹5,600, ₹10,500, ₹11,400); GST stays to the paisa. The pricing total shows the plans' own price with GST struck through beside the package price | 2026-10-21 |
| Legal review happens on the preview, not before building | 2026-10-19 |
| Industries copy: the eight industry pages (`content/industries.ts` `INDUSTRIES`; superseded 2026-10-22, pages removed) | 2026-10-19 |
| Industry pages removed; the homepage industries section is eight icon tiles with no links | 2026-10-22 |
| About copy (`content/about.ts`) | 2026-10-19 |
| Homepage FAQ: the 11 questions and answers (`content/home.ts` `HOME_FAQ`) | 2026-10-19 |
