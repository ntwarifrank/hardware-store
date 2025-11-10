import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  getUser,
  updateUserRole,
  toggleBlockUser,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getDashboardStats,
  getRevenueStats,
  getAdminStats,
  getLowStockProducts,
} from '../controllers/admin.controller.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

// All routes require admin access
router.use(protect, isAdmin);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/block', toggleBlockUser);
router.delete('/users/:id', deleteUser);

// Order management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Statistics
router.get('/stats', getAdminStats);
router.get('/stats/overview', getDashboardStats);
router.get('/stats/revenue', getRevenueStats);

// Products
router.get('/products/low-stock', getLowStockProducts);

export default router;
