// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

// 3130 is the dev server; the production build runs on its own port so the two never collide. Override with PORT.
const PORT = Number(process.env.PORT ?? 3140);
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  use: { baseURL: BASE_URL, trace: "retain-on-failure" },
  webServer: { command: `npx next start -p ${PORT}`, url: BASE_URL, reuseExistingServer: !process.env.CI, timeout: 120_000 },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
  ],
});
