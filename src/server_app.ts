import express from "express";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import collectionRoutes from "./routes/collectionRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import seedRoutes from "./routes/seedRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import backupRoutes from "./routes/backupRoutes.js";
import giftCardRoutes from "./routes/giftCardRoutes.js";
import sanitize from "mongo-sanitize";

dotenv.config();

export const createApp = async () => {
    const app = express();

    // Trust proxy for rate limiting (needed for Nginx/Cloud Run/Vercel)
    app.set("trust proxy", 1);

    // Connect to DB
    await connectDB();

    // Security & Middleware
    app.use(
        helmet({
            contentSecurityPolicy: false,
            crossOriginEmbedderPolicy: false,
        }),
    );

    app.use(express.json());
    app.use(cors());
    app.use(morgan("dev"));

    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 1000,
        standardHeaders: true,
        legacyHeaders: false,
        validate: { xForwardedForHeader: false }, // Disable strict IPv6 validation for proxies
        message: "Too many requests from this IP, please try again later.",
    });
    app.use("/api/", limiter);

    // NoSQL Injection protection
    app.use((req, res, next) => {
        if (req.body) req.body = sanitize(req.body);
        if (req.query) req.query = sanitize(req.query);
        if (req.params) req.params = sanitize(req.params);
        next();
    });

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

    return app;
};
