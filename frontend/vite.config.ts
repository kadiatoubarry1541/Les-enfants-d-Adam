import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/postcss";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path pour GitHub Pages (nom du dépôt)
  base: process.env.NODE_ENV === 'production' ? '/Les-enfants-d-Adam/' : '/',
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  define: {
    __DEV__: JSON.stringify(true),
  },
  optimizeDeps: {
    force: true,
  },
});
