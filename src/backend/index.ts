import { serve } from "bun";
import index from "../frontend/index.html";
import { initDb } from "./db/index.ts";

initDb();

const server = serve({
  routes: {
    "/logo.png": new Response(Bun.file("public/logo.png"), {
      headers: { "Content-Type": "image/png" },
    }),

    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
