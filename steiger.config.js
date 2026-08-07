import fsd from "@feature-sliced/steiger-plugin";
// ./steiger.config.js
import { defineConfig } from "steiger";

export default defineConfig([...fsd.configs.recommended]);
