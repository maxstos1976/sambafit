import express from 'express';
import { 
  registerUser, 
  authUser, 
  getUserProfile, 
  updateUserProfile,
  deleteUserAccount,
  addToCart, 
  removeFromCart, 
  updateCartQuantity,
  toggleFavorite,
  getUsers,
  deleteUser,
  updateUserRole
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);
router.post('/cart/add', protect, addToCart);
router.post('/cart/remove', protect, removeFromCart);
router.post('/cart/update', protect, updateCartQuantity);
router.post('/favorites/:productId', protect, toggleFavorite);

// Admin routes
router.route('/').get(protect, admin, getUsers);
router.route('/:id')
  .delete(protect, admin, deleteUser)
  .put(protect, admin, updateUserRole);

export default router;
