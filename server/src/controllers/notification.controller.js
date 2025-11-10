import asyncHandler from '../utils/handleAsync.js';
import { AppError } from '../middleware/errorMiddleware.js';
import Notification from '../models/Notification.js';

/**
 * @desc    Create notification (Admin only)
 * @route   POST /api/notifications
 * @access  Private/Admin
 */
export const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, targetAudience, link, icon, expiresAt } = req.body;

  const notification = await Notification.create({
    title,
    message,
    type,
    targetAudience,
    link,
    icon,
    expiresAt,
    createdBy: req.user._id,
  });

  res.status(201).json({
    success: true,
    message: 'Notification created successfully',
    data: {
      notification,
    },
  });
});

/**
 * @desc    Get all notifications (Admin)
 * @route   GET /api/notifications/admin
 * @access  Private/Admin
 */
export const getAllNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, isActive } = req.query;

  const query = {};
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const skip = (Number(page) - 1) * Number(limit);

  const notifications = await Notification.find(query)
    .populate('createdBy', 'name email')
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip);

  const total = await Notification.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      notifications,
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
 * @desc    Get user notifications
 * @route   GET /api/notifications
 * @access  Private
 */
export const getUserNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const query = {
    isActive: true,
    $or: [
      { targetAudience: 'all' },
      { targetAudience: req.user.role === 'admin' ? 'admins' : 'users' },
    ],
  };

  const notifications = await Notification.find(query)
    .sort('-createdAt')
    .limit(Number(limit))
    .skip(skip);

  // Mark which notifications the user has read
  const notificationsWithReadStatus = notifications.map((notification) => {
    const isRead = notification.readBy.some(
      (read) => read.user.toString() === req.user._id.toString()
    );
    return {
      ...notification.toObject(),
      isRead,
    };
  });

  const total = await Notification.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      notifications: notificationsWithReadStatus,
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
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */
export const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  // Check if already read
  const alreadyRead = notification.readBy.some(
    (read) => read.user.toString() === req.user._id.toString()
  );

  if (!alreadyRead) {
    notification.readBy.push({
      user: req.user._id,
      readAt: new Date(),
    });
    await notification.save();
  }

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
  });
});

/**
 * @desc    Update notification (Admin)
 * @route   PUT /api/notifications/:id
 * @access  Private/Admin
 */
export const updateNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, message, type, targetAudience, link, icon, isActive, expiresAt } = req.body;

  const notification = await Notification.findByIdAndUpdate(
    id,
    { title, message, type, targetAudience, link, icon, isActive, expiresAt },
    { new: true, runValidators: true }
  );

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Notification updated successfully',
    data: {
      notification,
    },
  });
});

/**
 * @desc    Delete notification (Admin)
 * @route   DELETE /api/notifications/:id
 * @access  Private/Admin
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findByIdAndDelete(id);

  if (!notification) {
    throw new AppError('Notification not found', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Notification deleted successfully',
  });
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread/count
 * @access  Private
 */
export const getUnreadCount = asyncHandler(async (req, res) => {
  const query = {
    isActive: true,
    $or: [
      { targetAudience: 'all' },
      { targetAudience: req.user.role === 'admin' ? 'admins' : 'users' },
    ],
    'readBy.user': { $ne: req.user._id },
  };

  const count = await Notification.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      count,
    },
  });
});
