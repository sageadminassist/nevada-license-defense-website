import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    tanstackStart({
      pages: [
        { path: "/" },
        { path: "/nursing" },
        { path: "/pharmacy" },
        { path: "/medical" },
        { path: "/contact" },
        { path: "/faq" },
      ],
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: true,
      },
      sitemap: {
        host: "https://nevadalicensedefense.com",
      },
      spa: {
        enabled: false,
      },
    }),
    viteReact(),
  ],
  build: {
    sourcemap: false,
    target: "es2020",
  },
  server: {
    host: "127.0.0.1",
    port: 3334,
    strictPort: true,
  },
});
