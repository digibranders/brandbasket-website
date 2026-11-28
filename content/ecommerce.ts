import { HOSTED_SERVICE } from "./legal/cancellation";
import type { FaqItem } from "./types";

export const ECOMMERCE_PATH = "/services/ecommerce-website";
export const ECOMMERCE_LABEL = "Ecommerce Website";
export const ECOMMERCE_TITLE = "Ecommerce Website Design | BrandBasket";
export const ECOMMERCE_DESCRIPTION = "Get an ecommerce website built and managed by BrandBasket. Explore store design, product catalog setup, checkout, shipping and ongoing maintenance.";

export const ECOMMERCE_HERO = {
  label: "Managed ecommerce websites",
  headline: "Your products.",
  accent: "Your own store.",
  body: "We build your online store, set up checkout and shipping, and keep it running after launch.",
  cta: "Start my Ecommerce Store",
} as const;

export const ECOMMERCE_MODULES = [
  { title: "Branded storefront", body: "A mobile-friendly home, shop, collections and product pages, designed around your brand." },
  { title: "Product catalog", body: "Organize photos, descriptions, prices, variants and stock. We agree the initial upload scope with you." },
  { title: "Cart and checkout", body: "Customers review their order, enter delivery details and pay through the agreed payment gateway." },
  { title: "Shipping setup", body: "Set delivery zones and rates for the locations you serve. We agree the shipping setup before the build." },
  { title: "Store dashboard", body: "Manage products, prices and stock, and see the orders you need to fulfil." },
  { title: "Launch and handover", body: "Connect your domain, run a mobile test order and walk through how to manage the store." },
] as const;

export const ECOMMERCE_STEPS = [
  { when: "Kickoff", what: "Share your brand, catalog, payment and shipping requirements." },
  { when: "Preview", what: "Review the working store and test a complete order." },
  { when: "Go live", what: "Approve the store, connect your domain and learn how to run it." },
] as const;

export const ECOMMERCE_MERCHANT_PREVIEW = {
  store: "Parcel & Paper",
  views: [
    {
      id: "orders",
      label: "Orders",
      title: "Orders to fulfil",
      detail: "Find paid orders and see what your team needs to pack.",
      columns: ["Order", "Payment", "Fulfilment"],
      rows: [
        { name: "#1042", detail: "The Celebration Set · Mint", value: "Paid", status: "To pack", tone: "attention" },
        { name: "#1041", detail: "Weekend Gift Box · Peach", value: "Paid", status: "Packed", tone: "ready" },
        { name: "#1040", detail: "The Celebration Set · Sky", value: "Paid", status: "Dispatched", tone: "neutral" },
      ],
    },
    {
      id: "products",
      label: "Products",
      title: "Your product catalog",
      detail: "Manage product details, prices and variants from your dashboard.",
      columns: ["Product", "Variants", "Visibility"],
      rows: [
        { name: "The Celebration Set", detail: "GIFT-01", value: "3", status: "Published", tone: "ready" },
        { name: "Weekend Gift Box", detail: "GIFT-02", value: "2", status: "Published", tone: "ready" },
        { name: "Thank You Card", detail: "CARD-01", value: "1", status: "Draft", tone: "neutral" },
      ],
    },
    {
      id: "stock",
      label: "Stock",
      title: "Stock by variant",
      detail: "Check available quantities and update stock as it changes.",
      columns: ["Variant", "Available", "Status"],
      rows: [
        { name: "Mint", detail: "The Celebration Set", value: "24", status: "In stock", tone: "ready" },
        { name: "Peach", detail: "The Celebration Set", value: "3", status: "In stock", tone: "ready" },
        { name: "Sky", detail: "The Celebration Set", value: "0", status: "Out of stock", tone: "attention" },
      ],
    },
  ],
} as const;

export const ECOMMERCE_ORDER_STEPS = [
  { id: "catalog", label: "Catalog", duration: 2800, title: "Set up your products", detail: "Add photos, prices, colour options and stock for the Celebration Set.", signal: "Picking from stock" },
  { id: "storefront", label: "Storefront", duration: 2150, title: "A shopper adds a gift to cart", detail: "They browse the collection and pick the mint Celebration Set.", signal: "Browsing the storefront" },
  { id: "checkout", label: "Checkout", duration: 2650, title: "The shopper completes checkout", detail: "They see delivery options, enter an address and pay through your gateway.", signal: "Processing checkout" },
  { id: "orders", label: "Orders", duration: 2200, title: "A new order reaches your dashboard", detail: "Your team sees the purchased variant, delivery details and payment status.", signal: "Order #1042" },
  { id: "packing", label: "Packing", duration: 3350, title: "Your team picks and packs the order", detail: "Check the item and colour, pack the parcel and add its shipping label.", signal: "Packing and labelling" },
  { id: "delivery", label: "Delivery", duration: 4900, title: "The parcel reaches your customer", detail: "Hand it to your courier, share tracking when supported, and get the order to your customer’s door.", signal: "On the way to the customer" },
  { id: "care", label: "Store care", duration: 1850, title: "Keep selling after launch", detail: "You manage stock and customer requests. BrandBasket looks after hosting, backups and technical upkeep.", signal: "Store health checks" },
] as const;

export const ECOMMERCE_SCOPE = {
  build: [
    "Storefront design and setup",
    "Agreed catalog upload, payment and shipping setup",
    "Test order, domain connection and handover",
  ],
  maintenance: [
    "Hosting, backups and security updates",
    "Monitoring and technical support",
    "Your team manages products, dispatch and returns",
  ],
  note: "Before work starts, we agree your product and variant counts, payment provider, shipping options and any third-party fees. Ask us what store edits are covered if you expect regular updates.",
} as const;

export const ECOMMERCE_FAQ: readonly FaqItem[] = [
  { q: "Can I manage products myself?", a: "Yes. The store dashboard is where you update product details, prices and stock, and view incoming orders. We walk through it with you at handover." },
  { q: "How many products can you upload?", a: "We agree the initial product and variant count once we review your catalog. Larger uploads and migrations are quoted before work starts." },
  { q: "Can I accept UPI or cash on delivery?", a: "We confirm the payment methods and delivery rules for your store during kickoff. Online methods depend on your payment provider and merchant account." },
  { q: "Who takes care of shipping and returns?", a: "Your team packs and dispatches orders and handles customer returns. BrandBasket sets up the agreed store options and maintains the website." },
  { q: "What do I need to get started?", a: "Bring your brand assets, product photos and prices, and details on where you ship. We confirm the launch scope and timeline together at kickoff." },
  { q: "What happens if I move my store later?", a: `Your domain and the material you supply stay yours. ${HOSTED_SERVICE} If you already know you will need a particular data export, ask us about it before you start.` },
  { q: "Can you migrate my existing store?", a: "We can scope a migration after reviewing your catalog, store platform, data and existing URLs." },
];
