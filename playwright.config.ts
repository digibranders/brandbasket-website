// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";
import { CONSENT_KEY, encodeRecord, NO_CONSENT, TOOLS } from "./lib/consent";

// 3130 is the dev server; the production build runs on its own port so the two never collide. Override with PORT.
const PORT = Number(process.env.PORT ?? 3140);
const BASE_URL = `http://localhost:${PORT}`;

// With a GTM container configured, every spec but e2e/consent.spec.ts runs as a visitor who already said no, so the
// consent banner does not cover what the spec clicks.
const answeredConsent = TOOLS.length > 0
  ? { cookies: [], origins: [{ origin: BASE_URL, localStorage: [{ name: CONSENT_KEY, value: encodeRecord(NO_CONSENT, TOOLS, new Date()) }] }] }
  : undefined;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: BASE_URL, trace: "retain-on-failure", storageState: answeredConsent },
  webServer: { command: `npx next start -p ${PORT}`, url: BASE_URL, reuseExistingServer: !process.env.CI, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
