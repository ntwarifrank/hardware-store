import express from 'express';
import {
  createDiscount,
  getAllDiscounts,
  getActiveDiscounts,
  validateDiscount,
  applyDiscount,
  updateDiscount,
  deleteDiscount,
  getDiscountStats,
} from '../controllers/discount.controller.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getActiveDiscounts);

// User routes
router.post('/validate', protect, validateDiscount);
router.post('/apply', protect, applyDiscount);

// Admin routes
router.post('/create', protect, isAdmin, createDiscount);
router.get('/admin', protect, isAdmin, getAllDiscounts);
router.get('/:id/stats', protect, isAdmin, getDiscountStats);
router.put('/:id', protect, isAdmin, updateDiscount);
router.delete('/:id', protect, isAdmin, deleteDiscount);

export default router;
