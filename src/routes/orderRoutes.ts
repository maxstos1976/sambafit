import express from 'express';
import { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  updateOrderStatus,
  getSalesStats,
  getDetailedSalesReport,
  getAllOrders,
  deleteOrder,
  deleteMultipleOrders,
  deleteAllOrders
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, getMyOrders);
router.route('/all').get(protect, admin, getAllOrders).delete(protect, admin, deleteAllOrders);
router.route('/bulk-delete').post(protect, admin, deleteMultipleOrders);
router.route('/stats').get(protect, admin, getSalesStats);
router.route('/report').get(protect, admin, getDetailedSalesReport);
router.route('/:id').get(protect, getOrderById).put(protect, admin, updateOrderStatus).delete(protect, admin, deleteOrder);

export default router;
