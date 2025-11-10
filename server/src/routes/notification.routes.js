import express from 'express';
import {
  createNotification,
  getAllNotifications,
  getUserNotifications,
  markAsRead,
  updateNotification,
  deleteNotification,
  getUnreadCount,
} from '../controllers/notification.controller.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// User routes
router.get('/', protect, getUserNotifications);
router.get('/unread/count', protect, getUnreadCount);
router.put('/:id/read', protect, markAsRead);

// Admin routes
router.post('/', protect, isAdmin, createNotification);
router.get('/admin', protect, isAdmin, getAllNotifications);
router.put('/:id', protect, isAdmin, updateNotification);
router.delete('/:id', protect, isAdmin, deleteNotification);

export default router;
