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
import { EventType } from "./events/types.ts";
import { initServerEvents } from "./events/core.ts";

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
  fetch(req, server) {
    // upgrade the request to a WebSocket
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    open(ws) {
      ws.subscribe(EventType.IssueUpdated);
    },
    message() {},
  },

  development: process.env.NODE_ENV !== "production" && {
    hmr: true,
    console: true,
  },
});

initServerEvents(server);

console.log(`🚀 Server running at ${server.url}`);
