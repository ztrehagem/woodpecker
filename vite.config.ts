import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    cloudflare(),
    tailwindcss(),
    VitePWA({
      devOptions: {
        enabled: true,
      },
      includeAssets: ["favicon.webp", "apple-touch-icon.png"],
      manifest: {
        name: "Woodpecker",
        short_name: "Woodpecker",
        description: "AT Protocol / Bluesky client application.",
        theme_color: "#262626",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "favicon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "monochrome",
          },
        ],
        screenshots: [
          {
            src: "/screenshot-540x720.png",
            type: "image/png",
            sizes: "540x720",
            form_factor: "narrow",
          },
          {
            src: "/screenshot-720x540.png",
            type: "image/jpg",
            sizes: "720x540",
            form_factor: "wide",
          },
        ],
      },
    }),
  ],

  server: {
    host: "127.0.0.1", // for atproto OAuth callback to work on local dev
  },
});
