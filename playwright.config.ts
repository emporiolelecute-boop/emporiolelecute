import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright config for Empório LeleCute carousels.
 * Run locally with:  npx playwright test
 *
 * BASE_URL env var lets you point at preview / staging / production.
 * Default = local dev server on port 8080 (Vite default for this project).
 */
const BASE_URL = process.env.BASE_URL ?? "http://localhost:8080";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "tablet",           use: { ...devices["iPad (gen 7)"] } },
    { name: "mobile",           use: { ...devices["iPhone 13"] } },
  ],
  webServer: process.env.PW_NO_SERVER
    ? undefined
    : {
        command: "npm run dev",
        url: BASE_URL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
});
