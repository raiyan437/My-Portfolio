import { defineConfig } from "@playwright/test";

const localURL = "http://127.0.0.1:4321";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: 2,
  use: { baseURL: localURL, browserName: "chromium" },
  webServer: {
    command: "npm run dev -- --host 127.0.0.1 --port 4321",
    url: localURL,
    env: { ASTRO_TELEMETRY_DISABLED: "1" },
    reuseExistingServer: true,
  },
});
