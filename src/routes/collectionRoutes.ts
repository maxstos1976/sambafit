import express from 'express';
import { collectionController } from '../controllers/collectionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(collectionController.getAll)
  .post(protect, admin, collectionController.create);

router.route('/:id')
  .put(protect, admin, collectionController.update)
  .delete(protect, admin, collectionController.delete);

export default router;
