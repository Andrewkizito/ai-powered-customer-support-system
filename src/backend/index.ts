import { serve } from "bun";
import index from "../frontend/index.html";
import { initDb } from "./db/sql/index.ts";
import { initChroma } from "./db/chroma/index.ts";
import {
  handleCreateIssue,
  handleGetIssues,
} from "./controllers/issues/core.ts";
import { handleGetCustomers } from "./controllers/customers/core.ts";
import { handleDashboardStats } from "./controllers/dashboard/core.ts";
import "./ai/workflows/issues/core.ts";

await initDb();
await initChroma();

const server = serve({
  routes: {
    "/logo.png": new Response(Bun.file("public/logo.png"), {
      headers: { "Content-Type": "image/png" },
    }),

    "/api/issues": {
      GET: handleGetIssues,
      POST: handleCreateIssue,
    },

    "/api/customers": {
      GET: handleGetCustomers,
    },

    "/api/dashboard": {
      GET: handleDashboardStats,
    },

    "/*": index,
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
