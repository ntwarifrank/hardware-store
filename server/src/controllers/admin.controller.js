import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderStatusEmail } from '../utils/sendEmail.js';

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  if (role) {
    query.role = role;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const users = await User.find(query)
    .select('-password -refreshToken')
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip);

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      users,
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
 * @desc    Get single user
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
export const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).select('-password -refreshToken');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

/**
 * @desc    Update user role
 * @route   PUT /api/admin/users/:id/role
 * @access  Private/Admin
 */
export const updateUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin'].includes(role)) {
    throw new AppError('Invalid role', 400);
  }

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.role = role;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'User role updated successfully',
    data: {
      user,
    },
  });
});

/**
 * @desc    Block/unblock user
 * @route   PUT /api/admin/users/:id/block
 * @access  Private/Admin
 */
export const toggleBlockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isBlocked = !user.isBlocked;
  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`,
    data: {
      user,
    },
  });
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  });
});

/**
 * @desc    Get all orders
 * @route   GET /api/admin/orders
 * @access  Private/Admin
 */
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, search } = req.query;

  const query = {};

  if (status) {
    query.orderStatus = status;
  }

  if (search) {
    query.orderNumber = { $regex: search, $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip);

  const total = await Order.countDocuments(query);

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
 * @desc    Update order status
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private/Admin
 */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    throw new AppError('Invalid order status', 400);
  }

  const order = await Order.findById(id).populate('user', 'email');

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  order.orderStatus = status;
  if (note) {
    order.notes = note;
  }
  await order.save();

  // Send status update email
  sendOrderStatusEmail(order.user.email, order.orderNumber, status).catch((err) => {
    // Log but don't fail
  });

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: {
      order,
    },
  });
});

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats/overview
 * @access  Private/Admin
 */
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Total users
  const totalUsers = await User.countDocuments();
  const newUsersToday = await User.countDocuments({
    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  });

  // Total orders
  const totalOrders = await Order.countDocuments();
  const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
  const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });

  // Total products
  const totalProducts = await Product.countDocuments();
  const lowStockProducts = await Product.countDocuments({ stock: { $lt: 10 } });
  const outOfStockProducts = await Product.countDocuments({ stock: 0 });

  // Revenue
  const revenueStats = await Order.aggregate([
    { $match: { 'paymentInfo.status': 'completed' } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
        averageOrderValue: { $avg: '$totalPrice' },
      },
    },
  ]);

  const totalRevenue = revenueStats[0]?.totalRevenue || 0;
  const averageOrderValue = revenueStats[0]?.averageOrderValue || 0;

  // Recent orders
  const recentOrders = await Order.find()
    .populate('user', 'name email')
    .sort('-createdAt')
    .limit(5);

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        newToday: newUsersToday,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        processing: processingOrders,
      },
      products: {
        total: totalProducts,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts,
      },
      revenue: {
        total: totalRevenue,
        averageOrderValue,
      },
      recentOrders,
    },
  });
});

/**
 * @desc    Get revenue statistics
 * @route   GET /api/admin/stats/revenue
 * @access  Private/Admin
 */
export const getRevenueStats = asyncHandler(async (req, res) => {
  const { period = 'month' } = req.query;

  let groupBy;
  let dateRange;

  switch (period) {
    case 'week':
      groupBy = { $dayOfWeek: '$createdAt' };
      dateRange = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      groupBy = { $dayOfMonth: '$createdAt' };
      dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      groupBy = { $month: '$createdAt' };
      dateRange = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      groupBy = { $dayOfMonth: '$createdAt' };
      dateRange = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  const stats = await Order.aggregate([
    {
      $match: {
        'paymentInfo.status': 'completed',
        createdAt: { $gte: dateRange },
      },
    },
    {
      $group: {
        _id: groupBy,
        revenue: { $sum: '$totalPrice' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: {
      stats,
    },
  });
});

/**
 * @desc    Get admin stats for dashboard
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
export const getAdminStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
  const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate());

  // Total revenue
  const revenueThisMonth = await Order.aggregate([
    {
      $match: {
        'paymentInfo.status': 'completed',
        createdAt: { $gte: lastMonth },
      },
    },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const revenueLastMonth = await Order.aggregate([
    {
      $match: {
        'paymentInfo.status': 'completed',
        createdAt: { $gte: twoMonthsAgo, $lt: lastMonth },
      },
    },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);

  const totalRevenue = revenueThisMonth[0]?.total || 0;
  const lastMonthRevenue = revenueLastMonth[0]?.total || 0;
  const revenueChange = lastMonthRevenue
    ? (((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100).toFixed(1)
    : 0;

  // Total orders
  const ordersThisMonth = await Order.countDocuments({ createdAt: { $gte: lastMonth } });
  const ordersLastMonth = await Order.countDocuments({
    createdAt: { $gte: twoMonthsAgo, $lt: lastMonth },
  });
  const totalOrders = await Order.countDocuments();
  const ordersChange = ordersLastMonth
    ? (((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100).toFixed(1)
    : 0;

  // Total products
  const productsThisMonth = await Product.countDocuments({ createdAt: { $gte: lastMonth } });
  const productsLastMonth = await Product.countDocuments({
    createdAt: { $gte: twoMonthsAgo, $lt: lastMonth },
  });
  const totalProducts = await Product.countDocuments();
  const productsChange = productsLastMonth
    ? (((productsThisMonth - productsLastMonth) / productsLastMonth) * 100).toFixed(1)
    : 0;

  // Total users
  const usersThisMonth = await User.countDocuments({ createdAt: { $gte: lastMonth } });
  const usersLastMonth = await User.countDocuments({
    createdAt: { $gte: twoMonthsAgo, $lt: lastMonth },
  });
  const totalUsers = await User.countDocuments();
  const usersChange = usersLastMonth
    ? (((usersThisMonth - usersLastMonth) / usersLastMonth) * 100).toFixed(1)
    : 0;

  res.status(200).json({
    success: true,
    data: {
      totalRevenue,
      revenueChange: Number(revenueChange),
      totalOrders,
      ordersChange: Number(ordersChange),
      totalProducts,
      productsChange: Number(productsChange),
      totalUsers,
      usersChange: Number(usersChange),
    },
  });
});

/**
 * @desc    Get low stock products
 * @route   GET /api/admin/products/low-stock
 * @access  Private/Admin
 */
export const getLowStockProducts = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;

  const products = await Product.find({ stock: { $lt: 10, $gt: 0 } })
    .populate('category', 'name')
    .sort('stock')
    .limit(Number(limit));

  res.status(200).json({
    success: true,
    data: {
      products,
    },
  });
});
