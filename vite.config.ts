import path from "path";
import build from "@hono/vite-cloudflare-pages";
import devServer from "@hono/vite-dev-server";
import adapter from "@hono/vite-dev-server/cloudflare";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    build({
      entry: "src/index.ts",
      emptyOutDir: true,
    }),
    devServer({
      adapter,
      entry: "src/index.ts",
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
