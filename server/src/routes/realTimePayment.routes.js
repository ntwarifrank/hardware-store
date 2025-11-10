import express from 'express';
import { body } from 'express-validator';
import {
  initiatePayment,
  checkPaymentStatus,
  processPaymentWithPolling,
  mtnCallback,
  airtelCallback,
  cancelPayment,
} from '../controllers/realTimePayment.controller.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

// Validation rules
const initiatePaymentValidation = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
];

const cancelPaymentValidation = [
  body('orderId').notEmpty().withMessage('Order ID is required'),
];

// Protected routes
router.post('/initiate', protect, initiatePaymentValidation, validate, initiatePayment);
router.post('/process', protect, initiatePaymentValidation, validate, processPaymentWithPolling);
router.get('/status/:orderId', protect, checkPaymentStatus);
router.post('/cancel', protect, cancelPaymentValidation, validate, cancelPayment);

// Public webhook routes (no authentication needed)
router.post('/mtn/callback', mtnCallback);
router.post('/airtel/callback', airtelCallback);

export default router;
