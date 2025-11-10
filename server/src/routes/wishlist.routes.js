import express from 'express';
import { body } from 'express-validator';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
} from '../controllers/wishlist.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

const addToWishlistValidation = [
  body('productId').notEmpty().withMessage('Product ID is required'),
];

router.get('/', protect, getWishlist);
router.post('/', protect, addToWishlistValidation, validate, addToWishlist);
router.delete('/:productId', protect, removeFromWishlist);
router.delete('/', protect, clearWishlist);

export default router;
