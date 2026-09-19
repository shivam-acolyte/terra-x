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
    proxy: {
      "/api": `http://localhost:${process.env.PORT || 3002}`,
      "/uploads": `http://localhost:${process.env.PORT || 3002}`,
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
