import express from 'express';
import { trackEvent, getFunnelData, getHeatmapData } from '../controllers/analyticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/track', trackEvent);
router.get('/funnel', protect, admin, getFunnelData);
router.get('/heatmap', protect, admin, getHeatmapData);

export default router;
