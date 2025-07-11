import * as fs from "node:fs/promises";

import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const [key, cert] = await Promise.all([
  fs.readFile("local.woodpecker.ztrehagem.app-key.pem"),
  fs.readFile("local.woodpecker.ztrehagem.app.pem"),
]);

export default defineConfig({
  plugins: [react(), cloudflare()],

  server: {
    host: "local.woodpecker.ztrehagem.app",
    port: 443,
    https: {
      key,
      cert,
    },
  },
});
