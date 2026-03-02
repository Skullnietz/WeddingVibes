import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

// @ts-ignore
const _dirname = typeof __dirname !== 'undefined' ? __dirname : import.meta.dirname;

export default defineConfig(({ mode }) => {
  const isProduction = process.env.NODE_ENV === "production" || mode === "production";
  const plugins = [react(), vitePluginManusRuntime()];

  if (!isProduction) {
    try {
      const tailwindcss = require("@tailwindcss/vite").default || require("@tailwindcss/vite");
      plugins.push(tailwindcss());
    } catch (e) {
      console.warn("Could not load @tailwindcss/vite plugin in this environment.");
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(_dirname, "client", "src"),
        "@shared": path.resolve(_dirname, "shared"),
        "@assets": path.resolve(_dirname, "attached_assets"),
      },
    },
    envDir: path.resolve(_dirname),
    root: path.resolve(_dirname, "client"),
    publicDir: path.resolve(_dirname, "client", "public"),
    build: {
      outDir: path.resolve(_dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      host: true,
      allowedHosts: [
        ".manuspre.computer",
        ".manus.computer",
        ".manus-asia.computer",
        ".manuscomputer.ai",
        ".manusvm.computer",
        "localhost",
        "127.0.0.1",
      ],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    }
  };
});
