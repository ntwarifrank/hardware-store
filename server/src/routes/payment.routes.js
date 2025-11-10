import express from 'express';
import { body } from 'express-validator';
import {
  createCheckout,
  handleWebhook,
  getPaymentStatus,
} from '../controllers/payment.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

const checkoutValidation = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
];

router.post('/create-checkout', protect, checkoutValidation, validate, createCheckout);
router.post('/webhook', handleWebhook); // Public endpoint for Paddle
router.get('/:orderId/status', protect, getPaymentStatus);

export default router;
