// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
import { CONSENT_KEY, encodeRecord, NO_CONSENT, TOOLS } from "./lib/consent";

// 3130 is the dev server; the production build runs on its own port so the two never collide. Override with PORT.
const PORT = Number(process.env.PORT ?? 3140);
const BASE_URL = `http://localhost:${PORT}`;
const CMS_PORT = Number(process.env.CMS_FIXTURE_PORT ?? 4010);
const CMS_SITE_TOKEN = "e2e-site-token-e2e-site-token-e2e-0000";

// With a GTM container configured, every spec but e2e/consent.spec.ts runs as a visitor who already said no, so the
// consent banner does not cover what the spec clicks.
// The site keeps its 3D basket off in automated browsers (lib/device-hints.ts); this makes Chrome report navigator.webdriver false.
const HUMAN_CHROME = { args: ["--disable-blink-features=AutomationControlled"] };

const answeredConsent = TOOLS.length > 0
  ? { cookies: [], origins: [{ origin: BASE_URL, localStorage: [{ name: CONSENT_KEY, value: encodeRecord(NO_CONSENT, TOOLS, new Date()) }] }] }
  : undefined;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: BASE_URL, trace: "retain-on-failure", storageState: answeredConsent },
  webServer: [
    // Stands in for the CMS, so the blog is tested without one (e2e/cms-fixture-server.mjs).
    { command: "node e2e/cms-fixture-server.mjs", url: `http://localhost:${CMS_PORT}/api/site/sitemap`, reuseExistingServer: !process.env.CI, timeout: 30_000, env: { CMS_SITE_TOKEN, CMS_FIXTURE_PORT: String(CMS_PORT) } },
    { command: `npx next start -p ${PORT}`, url: BASE_URL, reuseExistingServer: !process.env.CI, timeout: 120_000, env: { CMS_URL: `http://localhost:${CMS_PORT}`, CMS_SITE_TOKEN, REVALIDATE_SECRET: "e2e-revalidate-e2e-revalidate-e2e-00" } },
  ],
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], launchOptions: HUMAN_CHROME } },
    { name: "phone", use: { ...devices["Pixel 7"], launchOptions: HUMAN_CHROME } },
  ],
});
