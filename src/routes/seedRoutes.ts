import express from 'express';
import { seedDatabase } from '../controllers/seedController.js';

const router = express.Router();

// In a real app, this should be protected by admin middleware
router.post('/', seedDatabase);

export default router;
