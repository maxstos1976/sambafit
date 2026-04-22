import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { createServer as createHttpServer } from "node:http";
import connectDB from "./src/config/db.js";
import productRoutes from "./src/routes/productRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import newsletterRoutes from "./src/routes/newsletterRoutes.js";
import collectionRoutes from "./src/routes/collectionRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";
import seedRoutes from "./src/routes/seedRoutes.js";
import analyticsRoutes from "./src/routes/analyticsRoutes.js";
import backupRoutes from "./src/routes/backupRoutes.js";
import giftCardRoutes from "./src/routes/giftCardRoutes.js";
import { createServer as createViteServer } from "vite";
import { initSocket } from "./src/lib/socket.js";
import sanitize from "mongo-sanitize";

dotenv.config();

const startServer = async () => {
  const app = express();
  const httpServer = createHttpServer(app);
  const PORT = 3000;

  // Trust proxy for rate limiting (needed for Nginx/Cloud Run)
  app.set("trust proxy", 1);

  // Connect to DB
  await connectDB();

  // Initialize Socket.io
  initSocket(httpServer);

  // Security & Middleware
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disable CSP for Vite dev server compatibility
      crossOriginEmbedderPolicy: false,
    }),
  );

  // NoSQL Injection protection
  app.use((req, res, next) => {
    req.body = sanitize(req.body);
    req.query = sanitize(req.query);
    req.params = sanitize(req.params);
    next();
  });

  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: ipKeyGenerator,
    message: "Too many requests from this IP, please try again later.",
  });
  app.use("/api/", limiter);

  app.use(express.json());
  app.use(cors());
  app.use(morgan("dev"));

  // API Routes
  app.use("/api/products", productRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/newsletter", newsletterRoutes);
  app.use("/api/collections", collectionRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/seed", seedRoutes);
  app.use("/api/analytics", analyticsRoutes);
  app.use("/api/backup", backupRoutes);
  app.use("/api/giftcards", giftCardRoutes);

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

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
  });
};

startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});
