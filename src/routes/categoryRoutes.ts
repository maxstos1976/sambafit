import express from 'express';
import { categoryController } from '../controllers/categoryController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(categoryController.getAll)
  .post(protect, admin, categoryController.create);

router.route('/:id')
  .put(protect, admin, categoryController.update)
  .delete(protect, admin, categoryController.delete);

export default router;
