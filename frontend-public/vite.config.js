import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png"],
    }),
  ],

  server: {
    proxy: {
      "/api": {
        target: "https://amaraltws-backend.vercel.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
