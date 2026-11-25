import { defineConfig, devices } from "@playwright/test";

const server = "http://127.0.0.1:" + (process.env.PORT || "4173");
const base = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  workers: process.env.CI ? 2 : 3,
  reporter: "list",
  use: {
    ...devices["Desktop Chrome"],
    baseURL: server + base + "/",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node scripts/serve.mjs",
    url: server + base + "/",
    reuseExistingServer: !process.env.CI,
  },
});
