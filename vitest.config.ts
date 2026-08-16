import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss(), VitePWA()],

  test: {
    include: ["src/**/*.test.{ts,tsx}"],

    setupFiles: ["src/test/setup.ts"],

    coverage: {
      enabled: true,
      reporter: ["text", "json-summary", "json"],
      reportOnFailure: true,
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**/*", "src/shared/api/lexicons/**/*"],
    },

    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      instances: [
        {
          browser: "chromium",
          viewport: { width: 375, height: 667 },
        },
      ],
    },
  },
});
