import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../utils/sendEmail.js';

/**
 * @desc    Create new order
 * @route   POST /api/orders
 * @access  Private
 */
export const createOrder = asyncHandler(async (req, res) => {
  const { 
    items, 
    shippingAddress, 
    shippingMethod,
    paymentMethod = 'cod',
    paymentDetails = {}
  } = req.body;

  if (!items || items.length === 0) {
    throw new AppError('No order items', 400);
  }

  // Validate shipping method
  if (!shippingMethod || !shippingMethod.method || !shippingMethod.cost) {
    throw new AppError('Valid shipping method is required', 400);
  }

  // Validate products and calculate prices
  let itemsPrice = 0;
  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.product);
    
    if (!product) {
      throw new AppError(`Product not found: ${item.product}`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.name}`, 400);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      quantity: item.quantity,
      price: product.price,
      image: product.images[0]?.url || '',
    });

    itemsPrice += product.price * item.quantity;
  }

  // Use provided shipping cost and calculate tax
  const shippingPrice = Number(shippingMethod.cost);
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2)); // 18% VAT
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingAddress,
    shippingMethod: {
      method: shippingMethod.method,
      name: shippingMethod.name,
      cost: shippingPrice,
      estimatedDays: shippingMethod.estimatedDays,
    },
    paymentInfo: {
      method: paymentMethod,
      provider: paymentDetails.provider,
      phoneNumber: paymentDetails.phoneNumber,
      transactionId: paymentDetails.transactionId,
      status: paymentMethod === 'cod' ? 'pending' : 'pending', // All start as pending
    },
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  });

  // Clear user's cart
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    await cart.clearCart();
  }

  // Send confirmation email
  sendOrderConfirmationEmail(req.user.email, {
    orderId: order.orderNumber,
    items: orderItems,
    total: totalPrice,
    shippingAddress,
  }).catch((err) => {
    // Log but don't fail
  });

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: {
      order,
    },
  });
});

/**
 * @desc    Get user orders
 * @route   GET /api/orders
 * @access  Private
 */
export const getMyOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const orders = await Order.find({ user: req.user._id })
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip);

  const total = await Order.countDocuments({ user: req.user._id });

  res.status(200).json({
    success: true,
    data: {
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const order = await Order.findById(id).populate('items.product');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new AppError('Not authorized to view this order', 403);
  }

  res.status(200).json({
    success: true,
    data: {
      order,
    },
  });
});

/**
 * @desc    Cancel order
 * @route   PUT /api/orders/:id/cancel
 * @access  Private
 */
export const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(id);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if user owns the order
  if (order.user.toString() !== req.user._id.toString()) {
    throw new AppError('Not authorized to cancel this order', 403);
  }

  // Check if order can be cancelled
  if (order.orderStatus === 'delivered' || order.orderStatus === 'cancelled') {
    throw new AppError('Order cannot be cancelled', 400);
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = reason;
  await order.save();

  // Restore stock
  for (const item of order.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity },
    });
  }

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    data: {
      order,
    },
  });
});
