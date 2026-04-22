import express from "express";
import {
  createGiftCardDraft,
  validateGiftCard,
  getAllGiftCards,
  updateGiftCard,
  deleteGiftCard,
  resendGiftCardEmail,
} from "../controllers/giftCardController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";

const router = express.Router();

// Specific rate limiter for validation to prevent brute force
const validateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 validation attempts per window
  keyGenerator: ipKeyGenerator,
  message:
    "Muitas tentativas de validação. Tente novamente mais tarde para sua segurança.",
});

router.post("/draft", protect, createGiftCardDraft);
router.get("/validate/:code", validateLimiter, validateGiftCard);

// Admin Routes
router.get("/admin/all", protect, admin, getAllGiftCards);
router.put("/admin/:id", protect, admin, updateGiftCard);
router.delete("/admin/:id", protect, admin, deleteGiftCard);
router.post("/admin/:id/resend", protect, admin, resendGiftCardEmail);

export default router;
