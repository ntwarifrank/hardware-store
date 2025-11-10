import express from 'express';
import { body } from 'express-validator';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

const addToCartValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
  body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
];

const updateCartValidation = [
  body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a positive number'),
];

router.get('/', protect, getCart);
router.post('/items', protect, addToCartValidation, validate, addToCart);
router.put('/items/:productId', protect, updateCartValidation, validate, updateCartItem);
router.delete('/items/:productId', protect, removeFromCart);
router.delete('/', protect, clearCart);

export default router;
