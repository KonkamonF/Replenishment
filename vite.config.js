import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.1.8:10332",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/replm/api/v1"),
      },
    },
  },
});