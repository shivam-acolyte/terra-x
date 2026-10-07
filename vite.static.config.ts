import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  cacheDir: "node_modules/.vite-terra",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 9765,
    strictPort: true,
    fs: {
      strict: true,
      allow: [process.cwd()],
    },
    proxy: {
      "/api": `http://localhost:${process.env.API_PORT || (process.env.PORT && process.env.PORT !== "9765" ? process.env.PORT : "3002")}`,
      "/uploads": `http://localhost:${process.env.API_PORT || (process.env.PORT && process.env.PORT !== "9765" ? process.env.PORT : "3002")}`,
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 9765,
    strictPort: true,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client"],
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
