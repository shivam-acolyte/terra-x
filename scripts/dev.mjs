import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const viteBin = path.join(rootDir, "node_modules", "vite", "bin", "vite.js");
const serverScript = path.join(rootDir, "server", "index.mjs");

console.log("\x1b[36m%s\x1b[0m", "[TERRA-X] Starting unified full-stack environment (Backend API + Frontend Vite)...");

const apiPort = process.env.API_PORT || (process.env.PORT && process.env.PORT !== "9765" ? process.env.PORT : "3002");

const api = spawn(process.execPath, [serverScript], {
  cwd: rootDir,
  stdio: "inherit",
  env: { ...process.env, PORT: String(apiPort) },
});

const vite = spawn(process.execPath, [viteBin, "--config", "vite.static.config.ts", "--configLoader", "runner"], {
  cwd: rootDir,
  stdio: "inherit",
});

function cleanup() {
  try {
    api.kill();
  } catch {}
  try {
    vite.kill();
  } catch {}
}

api.on("error", (err) => console.error("[API Error]:", err));
vite.on("error", (err) => console.error("[Vite Error]:", err));

process.on("SIGINT", () => {
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit(0);
});

process.on("exit", cleanup);
