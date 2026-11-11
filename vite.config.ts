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
        { path: "/osteopathic" },
        { path: "/veterinary" },
        { path: "/social-work" },
        { path: "/radiology" },
        { path: "/physical-therapy" },
        { path: "/dental" },
        { path: "/psychology" },
        { path: "/chiropractic" },
        { path: "/respiratory" },
        { path: "/marriage-family-therapy" },
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
  experimental: {
    rolldownBuild: true,
  },
  server: {
    host: "127.0.0.1",
    port: 3334,
    strictPort: true,
  },
});
