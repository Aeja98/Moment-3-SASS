import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        sass: resolve(__dirname, "sass.html"),
        animering: resolve(__dirname, "animering.html"),
        diagram: resolve(__dirname, "diagram.html"),
        karta: resolve(__dirname, "karta.html")      
      },
    },
  },
});