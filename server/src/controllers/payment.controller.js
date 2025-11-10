import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { getPaddleClient } from '../config/paddle.js';
import Order from '../models/Order.js';
import logger from '../utils/logger.js';

/**
 * @desc    Create Paddle checkout session
 * @route   POST /api/payments/create-checkout
 * @access  Private
 */
export const createCheckout = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  // Get order
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized', 403);
  }

  // Check if order is already paid
  if (order.paymentInfo.status === 'completed') {
    throw new AppError('Order already paid', 400);
  }

  try {
    const paddleClient = getPaddleClient();

    // Create checkout session
    const checkoutData = {
      customer_email: req.user.email,
      prices: [
        {
          description: `Order ${order.orderNumber}`,
          amount: Math.round(order.totalPrice * 100), // Convert to cents
          currency: 'USD',
        },
      ],
      custom_data: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/orders/${order._id}/success`,
      cancel_url: `${process.env.CLIENT_URL}/orders/${order._id}/cancel`,
    };

    // Note: Paddle SDK v2 usage - adjust based on actual SDK methods
    const checkout = await paddleClient.createCheckout(checkoutData);

    res.status(200).json({
      success: true,
      data: {
        checkoutUrl: checkout.url,
        checkoutId: checkout.id,
      },
    });
  } catch (error) {
    logger.error(`Paddle checkout error: ${error.message}`);
    throw new AppError('Failed to create checkout session', 500);
  }
});

/**
 * @desc    Handle Paddle webhook
 * @route   POST /api/payments/webhook
 * @access  Public (Paddle webhook)
 */
export const handleWebhook = asyncHandler(async (req, res) => {
  const event = req.body;

  logger.info(`Paddle webhook received: ${event.alert_name}`);

  try {
    // Verify webhook signature
    const paddleClient = getPaddleClient();
    const isValid = paddleClient.verifyWebhookSignature(
      req.body,
      req.headers['paddle-signature']
    );

    if (!isValid) {
      throw new AppError('Invalid webhook signature', 400);
    }

    // Handle different event types
    switch (event.alert_name) {
      case 'payment_succeeded':
        await handlePaymentSucceeded(event);
        break;

      case 'payment_failed':
        await handlePaymentFailed(event);
        break;

      case 'payment_refunded':
        await handlePaymentRefunded(event);
        break;

      default:
        logger.info(`Unhandled webhook event: ${event.alert_name}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    logger.error(`Webhook error: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

/**
 * Handle successful payment
 */
const handlePaymentSucceeded = async (event) => {
  const { orderId } = event.passthrough ? JSON.parse(event.passthrough) : {};

  if (!orderId) {
    logger.error('No orderId in webhook data');
    return;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    logger.error(`Order not found: ${orderId}`);
    return;
  }

  order.paymentInfo.status = 'completed';
  order.paymentInfo.transactionId = event.order_id;
  order.paymentInfo.paddleOrderId = event.order_id;
  order.paymentInfo.paidAt = new Date();
  order.orderStatus = 'processing';

  await order.save();

  logger.info(`Payment succeeded for order: ${order.orderNumber}`);
};

/**
 * Handle failed payment
 */
const handlePaymentFailed = async (event) => {
  const { orderId } = event.passthrough ? JSON.parse(event.passthrough) : {};

  if (!orderId) {
    logger.error('No orderId in webhook data');
    return;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    logger.error(`Order not found: ${orderId}`);
    return;
  }

  order.paymentInfo.status = 'failed';
  await order.save();

  logger.info(`Payment failed for order: ${order.orderNumber}`);
};

/**
 * Handle refunded payment
 */
const handlePaymentRefunded = async (event) => {
  const { orderId } = event.passthrough ? JSON.parse(event.passthrough) : {};

  if (!orderId) {
    logger.error('No orderId in webhook data');
    return;
  }

  const order = await Order.findById(orderId);

  if (!order) {
    logger.error(`Order not found: ${orderId}`);
    return;
  }

  order.paymentInfo.status = 'refunded';
  order.orderStatus = 'cancelled';
  await order.save();

  logger.info(`Payment refunded for order: ${order.orderNumber}`);
};

/**
 * @desc    Get payment status
 * @route   GET /api/payments/:orderId/status
 * @access  Private
 */
export const getPaymentStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized', 403);
  }

  res.status(200).json({
    success: true,
    data: {
      paymentStatus: order.paymentInfo.status,
      orderStatus: order.orderStatus,
      paidAt: order.paymentInfo.paidAt,
    },
  });
});
