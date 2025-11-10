import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import Order from '../models/Order.js';
import mtnMomoService from '../services/mtnMomo.service.js';
import airtelMoneyService from '../services/airtelMoney.service.js';
import logger from '../utils/logger.js';

/**
 * @desc    Initiate real-time payment for an order
 * @route   POST /api/payments/initiate
 * @access  Private
 */
export const initiatePayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  // Get order
  const order = await Order.findById(orderId).populate('user');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if user owns the order
  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  // Check if order is already paid
  if (order.paymentInfo.status === 'completed') {
    throw new AppError('Order is already paid', 400);
  }

  const { method, provider, phoneNumber } = order.paymentInfo;

  // Only process mobile money payments in real-time
  if (method !== 'mobile_money') {
    throw new AppError('Real-time payment only available for mobile money', 400);
  }

  if (!phoneNumber) {
    throw new AppError('Phone number is required for mobile money payment', 400);
  }

  const paymentData = {
    amount: order.totalPrice,
    phoneNumber: phoneNumber,
    orderId: order._id.toString(),
    customerName: order.shippingAddress.fullName,
    customerEmail: order.shippingAddress.email,
  };

  let paymentResult;

  try {
    // Process payment based on provider
    if (provider === 'mtn_mobile_money') {
      logger.info(`Initiating MTN MoMo payment for order ${order._id}`);
      paymentResult = await mtnMomoService.requestPayment(paymentData);
    } else if (provider === 'airtel_money') {
      logger.info(`Initiating Airtel Money payment for order ${order._id}`);
      paymentResult = await airtelMoneyService.requestPayment(paymentData);
    } else {
      throw new AppError('Invalid payment provider', 400);
    }

    if (!paymentResult.success) {
      throw new AppError(paymentResult.error || 'Payment initiation failed', 400);
    }

    // Update order with payment reference
    order.paymentInfo.transactionId = paymentResult.transactionId || paymentResult.referenceId;
    order.paymentInfo.status = 'pending';
    await order.save();

    logger.info(`Payment initiated for order ${order._id}: ${paymentResult.transactionId || paymentResult.referenceId}`);

    res.status(200).json({
      success: true,
      message: 'Payment request sent to your phone. Please check your phone and authorize the payment.',
      data: {
        orderId: order._id,
        transactionId: paymentResult.transactionId || paymentResult.referenceId,
        status: 'PENDING',
        expiresIn: 180, // 3 minutes
      },
    });
  } catch (error) {
    logger.error(`Payment initiation failed for order ${order._id}:`, error);
    throw error;
  }
});

/**
 * @desc    Check payment status for an order
 * @route   GET /api/payments/status/:orderId
 * @access  Private
 */
export const checkPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  const { method, provider, transactionId, status } = order.paymentInfo;

  // If already completed or failed, return cached status
  if (status === 'completed' || status === 'failed') {
    return res.status(200).json({
      success: true,
      data: {
        status: status === 'completed' ? 'COMPLETED' : 'FAILED',
        transactionId,
        paidAt: order.paymentInfo.paidAt,
      },
    });
  }

  // Check real-time status for mobile money
  if (method === 'mobile_money' && transactionId) {
    let paymentStatus;

    try {
      if (provider === 'mtn_mobile_money') {
        paymentStatus = await mtnMomoService.checkPaymentStatus(transactionId);
      } else if (provider === 'airtel_money') {
        paymentStatus = await airtelMoneyService.checkPaymentStatus(transactionId);
      } else {
        throw new AppError('Invalid payment provider', 400);
      }

      // Update order if payment completed
      if (paymentStatus.status === 'SUCCESSFUL' || paymentStatus.status === 'COMPLETED') {
        order.paymentInfo.status = 'completed';
        order.paymentInfo.paidAt = new Date();
        order.orderStatus = 'processing';
        await order.save();

        logger.info(`Payment completed for order ${order._id}`);
      }

      // Update order if payment failed
      if (paymentStatus.status === 'FAILED') {
        order.paymentInfo.status = 'failed';
        await order.save();

        logger.info(`Payment failed for order ${order._id}`);
      }

      res.status(200).json({
        success: true,
        data: {
          status: paymentStatus.status,
          transactionId: paymentStatus.transactionId,
          paidAt: order.paymentInfo.paidAt,
        },
      });
    } catch (error) {
      logger.error(`Failed to check payment status for order ${order._id}:`, error);
      throw new AppError('Failed to check payment status', 500);
    }
  } else {
    // Return current status for other payment methods
    res.status(200).json({
      success: true,
      data: {
        status: status === 'pending' ? 'PENDING' : status.toUpperCase(),
        transactionId,
      },
    });
  }
});

/**
 * @desc    Process payment with polling (wait for completion)
 * @route   POST /api/payments/process
 * @access  Private
 */
export const processPaymentWithPolling = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate('user');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if user owns the order
  if (order.user._id.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  // Check if order is already paid
  if (order.paymentInfo.status === 'completed') {
    return res.status(200).json({
      success: true,
      message: 'Payment already completed',
      data: {
        status: 'COMPLETED',
        orderId: order._id,
      },
    });
  }

  const { method, provider, phoneNumber, transactionId } = order.paymentInfo;

  // Only process mobile money payments
  if (method !== 'mobile_money') {
    throw new AppError('This endpoint only supports mobile money payments', 400);
  }

  if (!phoneNumber) {
    throw new AppError('Phone number is required', 400);
  }

  let paymentResult;
  let referenceId = transactionId;

  try {
    // If no transaction ID, initiate payment first
    if (!transactionId) {
      const paymentData = {
        amount: order.totalPrice,
        phoneNumber: phoneNumber,
        orderId: order._id.toString(),
        customerName: order.shippingAddress.fullName,
        customerEmail: order.shippingAddress.email,
      };

      if (provider === 'mtn_mobile_money') {
        const initResult = await mtnMomoService.requestPayment(paymentData);
        if (!initResult.success) {
          throw new AppError(initResult.error || 'Payment initiation failed', 400);
        }
        referenceId = initResult.referenceId;
      } else if (provider === 'airtel_money') {
        const initResult = await airtelMoneyService.requestPayment(paymentData);
        if (!initResult.success) {
          throw new AppError(initResult.error || 'Payment initiation failed', 400);
        }
        referenceId = initResult.transactionId;
      }

      // Update order with reference
      order.paymentInfo.transactionId = referenceId;
      await order.save();
    }

    // Poll for payment status
    if (provider === 'mtn_mobile_money') {
      paymentResult = await mtnMomoService.pollPaymentStatus(referenceId);
    } else if (provider === 'airtel_money') {
      paymentResult = await airtelMoneyService.pollPaymentStatus(referenceId);
    } else {
      throw new AppError('Invalid payment provider', 400);
    }

    // Update order based on result
    if (paymentResult.success && paymentResult.status === 'COMPLETED') {
      order.paymentInfo.status = 'completed';
      order.paymentInfo.paidAt = new Date();
      order.orderStatus = 'processing';
      await order.save();

      logger.info(`Payment completed for order ${order._id}`);

      return res.status(200).json({
        success: true,
        message: 'Payment completed successfully',
        data: {
          status: 'COMPLETED',
          orderId: order._id,
          transactionId: paymentResult.transactionId,
        },
      });
    } else {
      // Payment failed or timed out
      order.paymentInfo.status = paymentResult.status === 'TIMEOUT' ? 'pending' : 'failed';
      await order.save();

      const message = paymentResult.status === 'TIMEOUT'
        ? 'Payment request timed out. Please try again.'
        : 'Payment failed. Please try again.';

      return res.status(400).json({
        success: false,
        message,
        data: {
          status: paymentResult.status,
          orderId: order._id,
        },
      });
    }
  } catch (error) {
    logger.error(`Payment processing failed for order ${order._id}:`, error);
    throw error;
  }
});

/**
 * @desc    MTN MoMo webhook callback
 * @route   POST /api/payments/mtn/callback
 * @access  Public (MTN webhook)
 */
export const mtnCallback = asyncHandler(async (req, res) => {
  const webhookData = req.body;

  logger.info('MTN MoMo webhook received:', webhookData);

  // Process webhook data and update order
  // Implementation depends on MTN's webhook structure

  res.status(200).json({ received: true });
});

/**
 * @desc    Airtel Money webhook callback
 * @route   POST /api/payments/airtel/callback
 * @access  Public (Airtel webhook)
 */
export const airtelCallback = asyncHandler(async (req, res) => {
  const webhookData = req.body;

  logger.info('Airtel Money webhook received:', webhookData);

  // Process webhook data and update order
  // Implementation depends on Airtel's webhook structure

  res.status(200).json({ received: true });
});

/**
 * @desc    Cancel pending payment
 * @route   POST /api/payments/cancel
 * @access  Private
 */
export const cancelPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  // Can only cancel pending payments
  if (order.paymentInfo.status !== 'pending') {
    throw new AppError('Can only cancel pending payments', 400);
  }

  order.paymentInfo.status = 'failed';
  order.orderStatus = 'cancelled';
  order.cancellationReason = 'Payment cancelled by user';
  await order.save();

  logger.info(`Payment cancelled for order ${order._id}`);

  res.status(200).json({
    success: true,
    message: 'Payment cancelled successfully',
  });
});
