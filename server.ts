import express from "express";
import path from "path";
import { createServer as createHttpServer } from "node:http";
import { createServer as createViteServer } from "vite";
import { initSocket } from "./src/lib/socket.js";
import { createApp } from "./src/server_app";
import { startKeepAlive } from "./src/lib/keepAlive";

const startServer = async () => {
  const app = await createApp();
  const httpServer = createHttpServer(app);
  const PORT = 3000;

  // Initialize Socket.io
  initSocket(httpServer);

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);

    // Start keep-alive if in production
    if (process.env.NODE_ENV === "production") {
      startKeepAlive(process.env.APP_URL);
    }
  });
};

startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});
