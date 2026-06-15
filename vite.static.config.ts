import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  cacheDir: "node_modules/.vite-terra",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  server: {
    host: "0.0.0.0",
    port: 9765,
    strictPort: true,
    fs: {
      strict: true,
      allow: [process.cwd()],
    },
  },
  preview: {
    host: "0.0.0.0",
    port: 9765,
    strictPort: true,
  },
  optimizeDeps: {
    noDiscovery: true,
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});
