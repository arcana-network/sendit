import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  // alias for @/src
  resolve: {
    alias: {
      "@": "/src",
    },
  },

  plugins: [
    vue(),
    nodePolyfills({
      // To exclude specific polyfills, add them to this list.
      exclude: [
        "fs",
        "console",
        "constants",
        "domain",
        "http",
        "https",
        "os",
        "querystring",
        "timers",
        "timers/promises",
      ],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: false,
    }),
  ],

  build: {
    sourcemap: true,
  },
});
