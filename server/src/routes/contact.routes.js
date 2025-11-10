import express from 'express';
import { body } from 'express-validator';
import {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
  getContactStats,
  getMyMessages,
} from '../controllers/contact.controller.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';

const router = express.Router();

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

// Public routes
router.post('/', contactValidation, validate, createContact);

// User routes (authenticated)
router.get('/my-messages', protect, getMyMessages);

// Admin routes
router.get('/', protect, isAdmin, getContacts);
router.get('/stats', protect, isAdmin, getContactStats);
router.get('/:id', protect, isAdmin, getContact);
router.put('/:id', protect, isAdmin, updateContact);
router.delete('/:id', protect, isAdmin, deleteContact);

export default router;
